import pytest
import os
from fastapi import HTTPException
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.entities import Paper, User, Examination, PaperCentreAssignment, Centre
from app.services.verification_service import verification_service
from app.core.security import sign_data, verify_signature
from app.core.config import settings

@pytest.mark.asyncio
async def test_verification_happy_path():
    """Verify authentic paper with genuine AES-GCM decryption and SHA-256 matching blockchain."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()
        assert admin is not None

        res = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-DBMS-01",
            actor=admin,
            db=session,
            simulate_tamper=False
        )

        assert res["verified"] is True
        assert res["is_authentic"] is True
        assert res["status"] == "VERIFIED"
        assert res["paper_id"] == "PAP-DBMS-01"
        assert res["signature_verified"] is True
        assert res["blockchain_anchored_hash"] == res["current_document_hash"]
        assert res["tx_hash"] is not None

@pytest.mark.asyncio
async def test_tamper_simulation_controlled():
    """Verify 1-byte tamper simulation detects mismatch without mutating storage or chain."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()

        # Check storage before
        paper = (await session.execute(select(Paper).where(Paper.paper_id == "PAP-DBMS-01"))).scalars().first()
        orig_mtime = os.path.getmtime(paper.encrypted_file_path)

        # Run simulated tamper
        tamper_res = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-DBMS-01",
            actor=admin,
            db=session,
            simulate_tamper=True
        )

        assert tamper_res["verified"] is False
        assert tamper_res["status"] == "TAMPER_DETECTED"
        assert tamper_res["simulate_tamper"] is True
        assert "1-byte tamper detected" in tamper_res["message"]

        # Ensure file on disk was NOT touched
        assert os.path.getmtime(paper.encrypted_file_path) == orig_mtime

        # Ensure real verification still passes immediately after simulation
        real_res = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-DBMS-01",
            actor=admin,
            db=session,
            simulate_tamper=False
        )
        assert real_res["verified"] is True

@pytest.mark.asyncio
async def test_missing_storage_artifact():
    """Verify missing storage artifact raises appropriate 404/422 exception."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()

        # Temporary paper with missing file
        missing_paper = Paper(
            id="test-missing-uuid",
            paper_id="PAP-TEST-MISSING",
            exam_id=(await session.execute(select(Examination))).scalars().first().id,
            title="Missing Paper Test",
            file_name="missing.pdf",
            sha256_hash="0" * 64,
            storage_bucket="encrypted_papers",
            storage_object_path="encrypted_papers/non_existent.enc",
            encrypted_file_path="/tmp/definitely_non_existent_artifact_file.enc",
            encryption_iv="0" * 24,
            encryption_tag="0" * 32,
            created_by=admin.email
        )
        session.add(missing_paper)
        await session.flush()

        with pytest.raises(HTTPException) as exc_info:
            await verification_service.verify_paper_integrity(
                paper_identifier="PAP-TEST-MISSING",
                actor=admin,
                db=session,
                simulate_tamper=False
            )
        assert exc_info.value.status_code in [404, 422]
        assert "storage" in exc_info.value.detail.lower()

@pytest.mark.asyncio
async def test_decryption_failed_on_invalid_tag():
    """Verify invalid AEAD authentication tag triggers DECRYPTION_FAILED status."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()

        # Create paper pointing to valid ciphertext but with corrupted encryption_tag
        valid_paper = (await session.execute(select(Paper).where(Paper.paper_id == "PAP-DBMS-01"))).scalars().first()

        bad_tag_paper = Paper(
            id="test-bad-tag-uuid",
            paper_id="PAP-TEST-BAD-TAG",
            exam_id=valid_paper.exam_id,
            title="Bad Tag Test",
            file_name="bad_tag.pdf",
            sha256_hash=valid_paper.sha256_hash,
            storage_bucket="encrypted_papers",
            storage_object_path=valid_paper.storage_object_path,
            encrypted_file_path=valid_paper.encrypted_file_path,
            encryption_iv=valid_paper.encryption_iv,
            encryption_tag="f" * 32, # Invalid GCM Tag
            created_by=admin.email
        )
        session.add(bad_tag_paper)
        await session.flush()

        res = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-TEST-BAD-TAG",
            actor=admin,
            db=session,
            simulate_tamper=False
        )
        assert res["verified"] is False
        assert res["status"] == "DECRYPTION_FAILED"
        assert "AES-GCM authentication failed" in res["message"]

@pytest.mark.asyncio
async def test_hash_mismatch_detection():
    """Verify altered candidate hash triggers HASH_MISMATCH status."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()

        res = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-DBMS-01",
            actor=admin,
            db=session,
            simulate_tamper=False,
            candidate_hash="0" * 64
        )
        assert res["verified"] is False
        assert res["status"] == "HASH_MISMATCH"

@pytest.mark.asyncio
async def test_digital_signature_verification():
    """Verify digital signature helper and verification pipeline."""
    payload = "PAP-DBMS-01:e4879af65605f0364c55119d4a93c804b231334cfd69dd4949501ddba00d26f0"
    valid_sig = sign_data(payload)
    assert verify_signature(payload, valid_sig) is True
    assert verify_signature(payload, "invalid_sig_hex_123") is False

@pytest.mark.asyncio
async def test_role_based_authorization_matrix():
    """Verify cross-role authorization: Super Admin, Paper Setter, Centre Admin, Invigilator."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()
        setter = (await session.execute(select(User).where(User.email == "setter@veriq.local"))).scalars().first()
        centre_admin = (await session.execute(select(User).where(User.email == "centre@veriq.local"))).scalars().first()
        invigilator = (await session.execute(select(User).where(User.email == "invigilator@veriq.local"))).scalars().first()
        pune_admin = (await session.execute(select(User).where(User.email == "pune.admin@veriq.local"))).scalars().first()

        # 1. Super Admin can verify any paper
        res_admin = await verification_service.verify_paper_integrity("PAP-DBMS-01", admin, session)
        assert res_admin["verified"] is True

        # 2. Paper Setter can verify paper they created (PAP-DBMS-01 created by setter@veriq.local)
        res_setter = await verification_service.verify_paper_integrity("PAP-DBMS-01", setter, session)
        assert res_setter["verified"] is True

        # 3. Centre Admin (C101) can verify paper assigned to C101
        res_centre = await verification_service.verify_paper_integrity("PAP-DBMS-01", centre_admin, session)
        assert res_centre["verified"] is True

        # 4. Invigilator (C101) can verify paper assigned to C101
        res_invig = await verification_service.verify_paper_integrity("PAP-DBMS-01", invigilator, session)
        assert res_invig["verified"] is True

        # 5. Unauthorized role / wrong centre:
        # Create a mock paper only assigned to C101, test with user without assignment
        unauthorized_user = User(
            email="visitor@other.local",
            name="Visitor",
            hashed_password="...",
            role="STUDENT",
            is_active=True
        )
        with pytest.raises(HTTPException) as exc_info:
            await verification_service.verify_paper_integrity("PAP-DBMS-01", unauthorized_user, session)
        assert exc_info.value.status_code == 403

@pytest.mark.asyncio
async def test_verification_diagnostics():
    """Verify diagnostics endpoint returns complete inspection report without leaking secrets."""
    async with AsyncSessionLocal() as session:
        diag = await verification_service.get_diagnostics("PAP-DBMS-01", session)
        assert diag["paper_id"] == "PAP-DBMS-01"
        assert diag["storage"]["artifact_exists_on_disk"] is True
        assert diag["storage"]["artifact_size_bytes"] > 0
        assert diag["cryptography"]["signature_valid"] is True
        assert diag["cryptography"]["algorithm"] == "AES-256-GCM"
        assert "key" not in str(diag).lower() or "configured" in str(diag).lower()
