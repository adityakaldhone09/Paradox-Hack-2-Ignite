import os
import uuid
import base64
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.core.config import settings
from app.db.session import get_db
from app.models.entities import Paper, Examination, PaperCentreAssignment, Centre, BlockchainTransaction, User, Incident, to_naive_utc, utc_now
from app.schemas.schemas import PaperResponse, PaperAssignCentreRequest, PaperVerifyRequest, PaperRevokeRequest
from app.services.hashing_service import hashing_service
from app.services.encryption_service import encryption_service
from app.services.blockchain_service import blockchain_service
from app.services.storage_service import storage_service
from app.services.verification_service import verification_service
from app.core.security import sign_data, verify_signature
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/papers", tags=["Paper Management"])

@router.get("", response_model=List[PaperResponse])
async def list_papers(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    exam_id: Optional[str] = Query(None),
    created_by: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Paper)
    if search:
        query = query.where(
            or_(
                Paper.title.ilike(f"%{search}%"),
                Paper.paper_id.ilike(f"%{search}%"),
                Paper.file_name.ilike(f"%{search}%")
            )
        )
    if status:
        query = query.where(Paper.status == status)
    if exam_id:
        query = query.where(or_(Paper.exam_id == exam_id, Paper.exam_id == select(Examination.id).where(Examination.exam_id == exam_id).scalar_subquery()))
    if created_by:
        query = query.where(Paper.created_by == created_by)

    query = query.order_by(Paper.created_at.desc())
    res = await db.execute(query)
    papers = res.scalars().all()

    if not papers:
        return []

    paper_ids = [p.id for p in papers]
    exam_ids = list({p.exam_id for p in papers if p.exam_id})

    # Batch get exam names
    exam_names = {}
    if exam_ids:
        e_res = await db.execute(select(Examination.id, Examination.name).where(Examination.id.in_(exam_ids)))
        exam_names = {row[0]: row[1] for row in e_res.all()}

    # Batch get assigned centre IDs
    a_res = await db.execute(
        select(PaperCentreAssignment.paper_id, PaperCentreAssignment.centre_id)
        .where(PaperCentreAssignment.paper_id.in_(paper_ids))
    )
    assigned_by_paper = {}
    for pid, cid in a_res.all():
        assigned_by_paper.setdefault(pid, []).append(cid)

    # Batch get latest blockchain transactions
    tx_res = await db.execute(
        select(BlockchainTransaction)
        .where(BlockchainTransaction.paper_id.in_(paper_ids))
        .order_by(BlockchainTransaction.block_number.desc())
    )
    latest_tx_by_paper = {}
    for tx in tx_res.scalars().all():
        if tx.paper_id and tx.paper_id not in latest_tx_by_paper:
            latest_tx_by_paper[tx.paper_id] = tx

    output = []
    for p in papers:
        latest_tx = latest_tx_by_paper.get(p.id)
        output.append(PaperResponse(
            id=p.id,
            paper_id=p.paper_id,
            exam_id=p.exam_id,
            exam_name=exam_names.get(p.exam_id),
            title=p.title,
            file_name=p.file_name,
            file_size=p.file_size,
            sha256_hash=p.sha256_hash,
            encryption_status="ENCRYPTED_AES_256_GCM",
            version=p.version,
            status=p.status,
            release_time=p.release_time,
            created_by=p.created_by,
            created_at=p.created_at,
            approved_by=p.approved_by,
            approved_at=p.approved_at,
            blockchain_tx_hash=latest_tx.tx_hash if latest_tx else None,
            blockchain_block_number=latest_tx.block_number if latest_tx else None,
            assigned_centres=assigned_by_paper.get(p.id, []),
            revocation_reason=p.revocation_reason
        ))
    return output

@router.post("/upload", response_model=PaperResponse, status_code=status.HTTP_201_CREATED)
async def upload_paper(
    file: UploadFile = File(...),
    exam_id: str = Form(...),
    title: str = Form(...),
    version: str = Form("1.0"),
    user: User = Depends(require_roles(["SUPER_ADMIN", "PAPER_SETTER"])),
    db: AsyncSession = Depends(get_db)
):
    # 1. Validate Exam
    exam_res = await db.execute(select(Examination).where(or_(Examination.id == exam_id, Examination.exam_id == exam_id)))
    exam = exam_res.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Target Examination not found")

    # 2. Read File Bytes & Validate
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file cannot be processed")
    if len(file_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 25MB maximum limit")

    # 3. Generate SHA-256 Document Hash (Plaintext Integrity Anchor)
    sha256_hash = hashing_service.calculate_file_hash(file_bytes)

    # 4. Perform AES-256-GCM Encryption
    ciphertext, iv_hex, tag_hex = encryption_service.encrypt(file_bytes)

    # 5. Store Encrypted File to Off-Chain Storage atomically
    paper_uuid = str(uuid.uuid4())
    paper_code = f"PAP-{exam.subject[:4].upper()}-{paper_uuid[:6].upper()}"
    canonical_obj, absolute_storage_path = storage_service.store_encrypted_artifact(paper_uuid, ciphertext)
    authority_sig = sign_data(f"{paper_code}:{sha256_hash}")

    # 6. Save Paper Record
    paper = Paper(
        id=paper_uuid,
        paper_id=paper_code,
        exam_id=exam.id,
        title=title,
        file_name=file.filename or "question_paper.pdf",
        file_size=len(file_bytes),
        sha256_hash=sha256_hash,
        storage_bucket="encrypted_papers",
        storage_object_path=canonical_obj,
        encrypted_file_path=absolute_storage_path,
        encryption_iv=iv_hex,
        encryption_tag=tag_hex,
        version=version,
        status="DRAFT",
        created_by=user.email,
        created_at=utc_now(),
        digital_signature=authority_sig
    )
    db.add(paper)
    await db.flush()

    # 7. Register Blockchain Transactions (PAPER_CREATED & PAPER_HASHED)
    tx_meta = {
        "paper_id": paper.paper_id,
        "title": paper.title,
        "sha256_hash": sha256_hash,
        "file_size_bytes": len(file_bytes),
        "encryption_algorithm": "AES-256-GCM",
        "iv": iv_hex,
        "version": version
    }
    bc_tx = await blockchain_service.record_transaction(
        event_type="PAPER_CREATED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_data=tx_meta
    )

    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type=bc_tx["event_type"],
        paper_id=paper.id,
        actor_id=user.email,
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=utc_now(),
        status="CONFIRMED"
    )
    db.add(db_tx)
    await db.commit()
    await db.refresh(paper)

    return PaperResponse(
        id=paper.id,
        paper_id=paper.paper_id,
        exam_id=paper.exam_id,
        exam_name=exam.name,
        title=paper.title,
        file_name=paper.file_name,
        file_size=paper.file_size,
        sha256_hash=paper.sha256_hash,
        encryption_status="ENCRYPTED_AES_256_GCM",
        version=paper.version,
        status=paper.status,
        created_by=paper.created_by,
        created_at=paper.created_at,
        blockchain_tx_hash=bc_tx["tx_hash"],
        blockchain_block_number=bc_tx["block_number"],
        assigned_centres=[]
    )

@router.get("/{id}")
async def get_paper(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Paper).where(or_(Paper.id == id, Paper.paper_id == id))
    res = await db.execute(query)
    paper = res.scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    exam_res = await db.execute(select(Examination).where(Examination.id == paper.exam_id))
    exam = exam_res.scalars().first()

    assign_res = await db.execute(
        select(PaperCentreAssignment, Centre)
        .join(Centre, PaperCentreAssignment.centre_id == Centre.id)
        .where(PaperCentreAssignment.paper_id == paper.id)
    )
    assignments = assign_res.all()

    tx_res = await db.execute(
        select(BlockchainTransaction)
        .where(BlockchainTransaction.paper_id == paper.id)
        .order_by(BlockchainTransaction.timestamp.desc())
    )
    txs = tx_res.scalars().all()

    sig_valid = False
    if paper.digital_signature:
        sig_valid = verify_signature(f"{paper.paper_id}:{paper.sha256_hash}", paper.digital_signature)

    return {
        "id": paper.id,
        "paper_id": paper.paper_id,
        "exam_id": paper.exam_id,
        "exam_name": exam.name if exam else None,
        "exam_code": exam.exam_id if exam else None,
        "title": paper.title,
        "file_name": paper.file_name,
        "file_size": paper.file_size,
        "sha256_hash": paper.sha256_hash,
        "encryption_algorithm": "AES-256-GCM",
        "iv": paper.encryption_iv,
        "tag": paper.encryption_tag,
        "version": paper.version,
        "status": paper.status,
        "release_time": paper.release_time.isoformat() if paper.release_time else None,
        "created_by": paper.created_by,
        "created_at": paper.created_at.isoformat(),
        "approved_by": paper.approved_by,
        "approved_at": paper.approved_at.isoformat() if paper.approved_at else None,
        "digital_signature": paper.digital_signature,
        "signature_verified": sig_valid,
        "revocation_reason": paper.revocation_reason,
        "assigned_centres": [
            {
                "assignment_id": a.PaperCentreAssignment.id,
                "centre_id": a.Centre.id,
                "centre_code": a.Centre.centre_id,
                "centre_name": a.Centre.name,
                "city": a.Centre.city,
                "release_window_start": a.PaperCentreAssignment.release_window_start.isoformat(),
                "release_window_end": a.PaperCentreAssignment.release_window_end.isoformat(),
                "status": a.PaperCentreAssignment.status
            }
            for a in assignments
        ],
        "blockchain_transactions": [
            {
                "tx_hash": tx.tx_hash,
                "block_number": tx.block_number,
                "event_type": tx.event_type,
                "timestamp": tx.timestamp.isoformat(),
                "payload_hash": tx.payload_hash,
                "signature": tx.signature,
                "status": tx.status
            }
            for tx in txs
        ]
    }

@router.post("/{id}/submit")
async def submit_paper_for_approval(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN", "PAPER_SETTER"])),
    db: AsyncSession = Depends(get_db)
):
    """Paper Setter submits a DRAFT paper for approval (DRAFT → SUBMITTED)"""
    paper = (await db.execute(select(Paper).where(or_(Paper.id == id, Paper.paper_id == id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    if paper.status != "DRAFT":
        raise HTTPException(status_code=400, detail=f"Only DRAFT papers can be submitted. Current status: {paper.status}")
    if paper.created_by != user.email and user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="You can only submit papers you created")

    paper.status = "SUBMITTED"

    bc_tx = await blockchain_service.record_transaction(
        event_type="PAPER_SUBMITTED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_data={"paper_id": paper.paper_id, "submitted_by": user.email}
    )
    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type="PAPER_SUBMITTED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=datetime.fromisoformat(bc_tx["timestamp"]),
        status="CONFIRMED"
    )
    db.add(db_tx)
    await db.commit()
    return {"message": "Paper submitted for approval", "status": paper.status, "tx_hash": bc_tx["tx_hash"]}


@router.post("/{id}/approve")
async def approve_paper(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == id, Paper.paper_id == id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    if paper.status == "REVOKED":
        raise HTTPException(status_code=400, detail="Cannot approve revoked paper")
    if paper.status not in ("DRAFT", "SUBMITTED"):
        raise HTTPException(status_code=400, detail=f"Paper is already {paper.status}")

    paper.status = "APPROVED"
    paper.approved_by = user.email
    paper.approved_at = utc_now()
    
    # Generate cryptographic signature of approval
    approval_payload = f"{paper.id}:{paper.sha256_hash}:{user.email}:{paper.approved_at.isoformat()}"
    paper.digital_signature = sign_data(approval_payload)

    # Blockchain event
    bc_tx = await blockchain_service.record_transaction(
        event_type="PAPER_APPROVED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_data={
            "paper_id": paper.paper_id,
            "sha256_hash": paper.sha256_hash,
            "approved_by": user.email,
            "digital_signature": paper.digital_signature
        }
    )

    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type="PAPER_APPROVED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=utc_now(),
        status="CONFIRMED"
    )
    db.add(db_tx)
    await db.commit()

    return {"message": "Paper approved and signed successfully", "status": paper.status, "tx_hash": bc_tx["tx_hash"]}

@router.post("/{id}/assign-centre")
async def assign_centre_to_paper(
    id: str,
    req: PaperAssignCentreRequest,
    user: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == id, Paper.paper_id == id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    centre = (await db.execute(select(Centre).where(or_(Centre.id == req.centre_id, Centre.centre_id == req.centre_id)))).scalars().first()
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")

    start_time_naive = to_naive_utc(req.release_window_start)
    end_time_naive = to_naive_utc(req.release_window_end)

    # Check existing assignment
    existing = (await db.execute(
        select(PaperCentreAssignment)
        .where(PaperCentreAssignment.paper_id == paper.id, PaperCentreAssignment.centre_id == centre.id)
    )).scalars().first()

    if existing:
        existing.release_window_start = start_time_naive
        existing.release_window_end = end_time_naive
        assignment = existing
    else:
        assignment = PaperCentreAssignment(
            paper_id=paper.id,
            centre_id=centre.id,
            release_window_start=start_time_naive,
            release_window_end=end_time_naive,
            status="ASSIGNED"
        )
        db.add(assignment)

    paper.release_time = start_time_naive
    if paper.status == "APPROVED":
        paper.status = "ASSIGNED"

    # Record blockchain assignment event
    bc_tx = await blockchain_service.record_transaction(
        event_type="PAPER_ASSIGNED",
        paper_id=paper.id,
        actor_id=user.email,
        centre_id=centre.id,
        payload_data={
            "paper_id": paper.paper_id,
            "centre_id": centre.centre_id,
            "release_window_start": start_time_naive.isoformat(),
            "release_window_end": end_time_naive.isoformat()
        }
    )

    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type="PAPER_ASSIGNED",
        paper_id=paper.id,
        actor_id=user.email,
        centre_id=centre.id,
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=utc_now(),
        status="CONFIRMED"
    )
    db.add(db_tx)
    await db.commit()

    return {
        "message": f"Paper successfully assigned to Centre {centre.name}",
        "paper_id": paper.paper_id,
        "centre_id": centre.centre_id,
        "status": paper.status,
        "tx_hash": bc_tx["tx_hash"]
    }

@router.post("/{id}/release")
async def release_paper(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == id, Paper.paper_id == id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    if paper.status == "REVOKED":
        raise HTTPException(status_code=400, detail="Cannot release a revoked paper")

    paper.status = "RELEASED"

    bc_tx = await blockchain_service.record_transaction(
        event_type="PAPER_RELEASED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_data={"paper_id": paper.paper_id, "action": "CRYPTOGRAPHIC_KEY_RELEASE"}
    )

    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type="PAPER_RELEASED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=utc_now(),
        status="CONFIRMED"
    )
    db.add(db_tx)
    await db.commit()

    return {"message": "Paper released for authorized examination centres", "status": paper.status, "tx_hash": bc_tx["tx_hash"]}

@router.get("/{id}/verification-diagnostics")
async def get_paper_verification_diagnostics(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await verification_service.get_diagnostics(id, db)

@router.post("/{id}/verify")
async def verify_paper_integrity(
    id: str,
    req: PaperVerifyRequest = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    simulate_tamper = req.simulate_tamper if req else False
    candidate_hash = req.candidate_hash if req else None
    return await verification_service.verify_paper_integrity(
        paper_identifier=id,
        actor=user,
        db=db,
        simulate_tamper=simulate_tamper,
        candidate_hash=candidate_hash
    )

@router.post("/{id}/revoke")
async def revoke_paper(
    id: str,
    req: PaperRevokeRequest,
    user: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == id, Paper.paper_id == id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    paper.status = "REVOKED"
    paper.revocation_reason = req.reason

    bc_tx = await blockchain_service.record_transaction(
        event_type="PAPER_REVOKED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_data={
            "paper_id": paper.paper_id,
            "revocation_reason": req.reason
        }
    )

    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type="PAPER_REVOKED",
        paper_id=paper.id,
        actor_id=user.email,
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=utc_now(),
        status="CONFIRMED"
    )
    db.add(db_tx)
    await db.commit()

    return {"message": "Paper revoked. All subsequent access requests will be blocked.", "status": "REVOKED", "tx_hash": bc_tx["tx_hash"]}

@router.get("/{id}/chain-of-custody")
async def get_chain_of_custody(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == id, Paper.paper_id == id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # Retrieve all blockchain transactions for this paper ordered chronologically
    tx_res = await db.execute(
        select(BlockchainTransaction)
        .where(BlockchainTransaction.paper_id == paper.id)
        .order_by(BlockchainTransaction.timestamp.asc())
    )
    txs = tx_res.scalars().all()

    timeline = []
    for tx in txs:
        centre_name = None
        if tx.centre_id:
            c = (await db.execute(select(Centre.name).where(Centre.id == tx.centre_id))).scalar_one_or_none()
            centre_name = c

        timeline.append({
            "event_id": tx.id,
            "event_type": tx.event_type,
            "timestamp": tx.timestamp.isoformat(),
            "block_number": tx.block_number,
            "tx_hash": tx.tx_hash,
            "actor": tx.actor_id,
            "centre": centre_name or tx.centre_id or "Central Authority",
            "device": tx.device_id or "Authorized Authority Node",
            "payload_hash": tx.payload_hash,
            "signature": tx.signature,
            "status": tx.status
        })

    return {
        "paper_id": paper.paper_id,
        "title": paper.title,
        "current_status": paper.status,
        "sha256_hash": paper.sha256_hash,
        "total_custody_events": len(timeline),
        "events": timeline
    }
