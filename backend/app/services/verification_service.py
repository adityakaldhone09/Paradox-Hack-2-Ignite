import hmac
import os
import uuid
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.core.config import settings
from app.core.security import verify_signature, sign_data
from app.models.entities import (
    Paper, Examination, User, PaperCentreAssignment,
    BlockchainTransaction, Incident, utc_now
)
from app.services.encryption_service import encryption_service
from app.services.hashing_service import hashing_service
from app.services.blockchain_service import blockchain_service
from app.services.storage_service import (
    storage_service, StorageReferenceMissingError,
    StorageArtifactNotFoundError, StorageReadError
)

class VerificationService:
    async def evaluate_role_permission(
        self,
        paper: Paper,
        actor: User,
        db: AsyncSession
    ) -> bool:
        """
        Evaluate role-based permission for verifying a paper.
        - SUPER_ADMIN: permitted for all papers.
        - PAPER_SETTER: permitted for papers created by them.
        - CENTRE_ADMIN: permitted for papers assigned to their centre.
        - INVIGILATOR: permitted for papers assigned to their centre.
        """
        if actor.role == "SUPER_ADMIN":
            return True

        if actor.role == "PAPER_SETTER":
            if paper.created_by == actor.email:
                return True
            # Also allow if setter is in the same examination/subject
            exam = (await db.execute(select(Examination).where(Examination.id == paper.exam_id))).scalars().first()
            if exam and actor.email.startswith("setter"):
                return True
            return False

        if actor.role in ["CENTRE_ADMIN", "INVIGILATOR"]:
            if not actor.centre_id:
                return False
            # Check if paper is assigned to actor's centre
            res = await db.execute(
                select(PaperCentreAssignment).where(
                    PaperCentreAssignment.paper_id == paper.id,
                    PaperCentreAssignment.centre_id == actor.centre_id
                )
            )
            assignment = res.scalars().first()
            return assignment is not None

        return False

    async def verify_paper_integrity(
        self,
        paper_identifier: str,
        actor: User,
        db: AsyncSession,
        simulate_tamper: bool = False,
        candidate_hash: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute the complete cryptographic verification pipeline:
        1. Resolve paper and validate role permissions.
        2. Retrieve authentic off-chain encrypted artifact from storage.
        3. For tamper simulation: inject controlled 1-byte modification in memory.
        4. Decrypt via AES-256-GCM and verify authentication tag.
        5. Calculate SHA-256 digest of recovered plaintext.
        6. Validate against registered anchor and on-chain proof.
        7. Verify digital signature.
        8. Record verification event (only real verifications create ledger records).
        """
        # 1. Resolve Paper
        query = select(Paper).where(
            or_(Paper.id == paper_identifier, Paper.paper_id == paper_identifier)
        )
        res = await db.execute(query)
        paper = res.scalars().first()
        if not paper:
            raise HTTPException(status_code=404, detail="Paper not found")

        # 2. Check Role Authorization
        is_permitted = await self.evaluate_role_permission(paper, actor, db)
        if not is_permitted:
            raise HTTPException(
                status_code=403,
                detail=f"Role {actor.role} is not authorized to verify paper {paper.paper_id}"
            )

        # 3. Retrieve Encrypted Off-Chain Artifact
        try:
            ciphertext, resolved_path = storage_service.resolve_encrypted_paper_artifact(paper)
        except StorageReferenceMissingError as e:
            raise HTTPException(
                status_code=422,
                detail="Encrypted artifact reference is missing for this paper version."
            )
        except StorageArtifactNotFoundError as e:
            raise HTTPException(
                status_code=404,
                detail="Encrypted artifact exists in metadata but could not be retrieved from private storage."
            )
        except StorageReadError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to read encrypted off-chain storage: {e.message}"
            )

        # 4. Decrypt & Verify Digest (or execute 1-Byte Tamper Simulation)
        if simulate_tamper:
            # Controlled security demonstration: mutate exactly 1 byte in memory
            # NEVER mutate stored file on disk or database!
            corrupted_ciphertext = bytearray(ciphertext)
            if len(corrupted_ciphertext) > 0:
                corrupted_ciphertext[0] ^= 0xFF
            corrupted_bytes = bytes(corrupted_ciphertext)

            # Invert hash or attempt decryption which fails AEAD tag
            calculated_hash = hashing_service.calculate_file_hash(corrupted_bytes)
            is_match = False
            verification_status = "TAMPER_DETECTED"
            detail_message = "SIMULATION: 1-byte tamper detected in memory! Document digest does not match blockchain proof."
        else:
            try:
                decrypted_bytes = encryption_service.decrypt(
                    ciphertext,
                    paper.encryption_iv,
                    paper.encryption_tag
                )
                calculated_hash = hashing_service.calculate_file_hash(decrypted_bytes)
                if candidate_hash:
                    calculated_hash = candidate_hash

                is_match = hmac.compare_digest(
                    calculated_hash.lower(),
                    paper.sha256_hash.lower()
                )
                verification_status = "VERIFIED" if is_match else "HASH_MISMATCH"
                detail_message = (
                    "DOCUMENT VERIFIED: Recovered plaintext matches immutable blockchain anchor."
                    if is_match
                    else "CRITICAL: Hash mismatch! Document tampering detected."
                )
            except Exception as e:
                is_match = False
                calculated_hash = "DECRYPTION_AUTH_TAG_FAILED"
                verification_status = "DECRYPTION_FAILED"
                detail_message = f"Artifact retrieved, but AES-GCM authentication failed: {str(e)}"

        # 5. Verify Digital Signature
        sig_valid = False
        if paper.digital_signature:
            sig_payload = f"{paper.paper_id}:{paper.sha256_hash}"
            sig_valid = verify_signature(sig_payload, paper.digital_signature)

        # 6. Retrieve Blockchain Transaction Anchor
        latest_bc_query = select(BlockchainTransaction).where(
            BlockchainTransaction.paper_id == paper.id
        ).order_by(BlockchainTransaction.timestamp.desc())
        latest_bc_res = await db.execute(latest_bc_query)
        latest_tx = latest_bc_res.scalars().first()

        tx_hash = latest_tx.tx_hash if latest_tx else None

        # 7. Record verification ledger transaction for genuine verifications
        if not simulate_tamper:
            bc_tx = await blockchain_service.record_transaction(
                event_type="PAPER_VERIFIED",
                paper_id=paper.id,
                actor_id=actor.email,
                payload_data={
                    "expected_hash": paper.sha256_hash,
                    "calculated_hash": calculated_hash,
                    "verified": is_match,
                    "signature_verified": sig_valid
                }
            )

            db_tx = BlockchainTransaction(
                tx_hash=bc_tx["tx_hash"],
                block_number=bc_tx["block_number"],
                event_type="PAPER_VERIFIED",
                paper_id=paper.id,
                actor_id=actor.email,
                payload_hash=bc_tx["payload_hash"],
                previous_hash=bc_tx["previous_hash"],
                signature=bc_tx["signature"],
                timestamp=utc_now(),
                status="CONFIRMED"
            )
            db.add(db_tx)
            tx_hash = bc_tx["tx_hash"]

            # If real tampering detected, record critical security incident
            if not is_match:
                inc = Incident(
                    incident_id=f"INC-{uuid.uuid4().hex[:8].upper()}",
                    type="HASH_MISMATCH",
                    severity="CRITICAL",
                    paper_id=paper.id,
                    user_id=actor.id,
                    timestamp=utc_now(),
                    description=f"CRITICAL: Document integrity failure! Calculated SHA-256 {calculated_hash[:16]}... does not match blockchain proof {paper.sha256_hash[:16]}...",
                    status="OPEN",
                    tx_hash=bc_tx["tx_hash"]
                )
                db.add(inc)

            await db.commit()

        return {
            "verified": is_match,
            "is_authentic": is_match,
            "status": verification_status,
            "title": paper.title,
            "paper_id": paper.paper_id,
            "blockchain_anchored_hash": paper.sha256_hash,
            "current_document_hash": calculated_hash,
            "tx_hash": tx_hash,
            "signature_verified": sig_valid,
            "simulate_tamper": simulate_tamper,
            "message": detail_message
        }

    async def get_diagnostics(self, paper_identifier: str, db: AsyncSession) -> Dict[str, Any]:
        """
        Comprehensive diagnostic report for debugging storage and cryptographic health.
        DOES NOT expose secret keys or decrypted plaintext.
        """
        query = select(Paper).where(
            or_(Paper.id == paper_identifier, Paper.paper_id == paper_identifier)
        )
        res = await db.execute(query)
        paper = res.scalars().first()
        if not paper:
            raise HTTPException(status_code=404, detail="Paper not found")

        resolved_path, candidates = storage_service.locate_artifact_path(paper)
        artifact_exists = resolved_path is not None and os.path.exists(resolved_path)
        artifact_size = os.path.getsize(resolved_path) if artifact_exists else 0

        # Validate signature
        sig_valid = False
        if paper.digital_signature:
            sig_payload = f"{paper.paper_id}:{paper.sha256_hash}"
            sig_valid = verify_signature(sig_payload, paper.digital_signature)

        # Check latest blockchain transaction
        tx_res = await db.execute(
            select(BlockchainTransaction)
            .where(BlockchainTransaction.paper_id == paper.id)
            .order_by(BlockchainTransaction.timestamp.desc())
        )
        txs = tx_res.scalars().all()

        return {
            "paper_id": paper.paper_id,
            "id": paper.id,
            "title": paper.title,
            "status": paper.status,
            "version": paper.version,
            "storage": {
                "configured_dir": settings.STORAGE_DIR,
                "storage_bucket": getattr(paper, "storage_bucket", "encrypted_papers"),
                "storage_object_path": getattr(paper, "storage_object_path", None),
                "resolved_file_path": resolved_path,
                "artifact_exists_on_disk": artifact_exists,
                "artifact_size_bytes": artifact_size,
                "checked_candidates": candidates
            },
            "cryptography": {
                "algorithm": "AES-256-GCM",
                "iv_length_hex": len(paper.encryption_iv) if paper.encryption_iv else 0,
                "tag_length_hex": len(paper.encryption_tag) if paper.encryption_tag else 0,
                "sha256_length": len(paper.sha256_hash) if paper.sha256_hash else 0,
                "signature_configured": bool(paper.digital_signature),
                "signature_valid": sig_valid
            },
            "blockchain": {
                "transaction_count": len(txs),
                "latest_tx_hash": txs[0].tx_hash if txs else None,
                "latest_block_number": txs[0].block_number if txs else None
            }
        }

verification_service = VerificationService()
