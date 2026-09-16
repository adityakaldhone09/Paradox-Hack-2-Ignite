from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.db.session import get_db
from app.models.entities import Paper, Examination, PaperCentreAssignment, Centre, BlockchainTransaction, AccessEvent, Incident, User
from app.services.hashing_service import hashing_service

router = APIRouter(prefix="/audit", tags=["Auditor Portal"])

@router.get("/report/{paper_id}")
async def generate_audit_report(paper_id: str, db: AsyncSession = Depends(get_db)):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == paper_id, Paper.paper_id == paper_id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    exam = (await db.execute(select(Examination).where(Examination.id == paper.exam_id))).scalars().first()

    # Blockchain Transactions
    txs = (await db.execute(
        select(BlockchainTransaction)
        .where(BlockchainTransaction.paper_id == paper.id)
        .order_by(BlockchainTransaction.timestamp.asc())
    )).scalars().all()

    # Centre assignments
    assignments = (await db.execute(
        select(PaperCentreAssignment, Centre)
        .join(Centre, PaperCentreAssignment.centre_id == Centre.id)
        .where(PaperCentreAssignment.paper_id == paper.id)
    )).all()

    # Access attempts
    access_events = (await db.execute(
        select(AccessEvent, Centre, User)
        .outerjoin(Centre, AccessEvent.centre_id == Centre.id)
        .outerjoin(User, AccessEvent.user_id == User.id)
        .where(AccessEvent.paper_id == paper.id)
        .order_by(AccessEvent.timestamp.desc())
    )).all()

    # Incidents
    incidents = (await db.execute(
        select(Incident)
        .where(Incident.paper_id == paper.id)
        .order_by(Incident.timestamp.desc())
    )).scalars().all()

    return {
        "report_id": f"AUD-REP-{paper.paper_id}",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "auditor_status": "COMPLIANT" if len(incidents) == 0 else "SECURITY_NOTICES_FLAGGED",
        "examination": {
            "name": exam.name if exam else "Unknown",
            "code": exam.exam_id if exam else "Unknown",
            "department": exam.department if exam else "Unknown",
            "subject": exam.subject if exam else "Unknown",
            "date": exam.exam_date if exam else "Unknown",
            "security_level": exam.security_level if exam else "Unknown"
        },
        "paper": {
            "paper_id": paper.paper_id,
            "title": paper.title,
            "version": paper.version,
            "sha256_hash": paper.sha256_hash,
            "encryption_algorithm": "AES-256-GCM",
            "status": paper.status,
            "created_by": paper.created_by,
            "created_at": paper.created_at.isoformat(),
            "approved_by": paper.approved_by,
            "approved_at": paper.approved_at.isoformat() if paper.approved_at else None,
            "digital_signature": paper.digital_signature
        },
        "distribution": [
            {
                "centre_id": a.Centre.centre_id,
                "centre_name": a.Centre.name,
                "city": a.Centre.city,
                "release_window_start": a.PaperCentreAssignment.release_window_start.isoformat(),
                "release_window_end": a.PaperCentreAssignment.release_window_end.isoformat(),
                "status": a.PaperCentreAssignment.status
            }
            for a in assignments
        ],
        "blockchain_chain_of_custody": [
            {
                "block_number": t.block_number,
                "tx_hash": t.tx_hash,
                "event_type": t.event_type,
                "actor": t.actor_id,
                "timestamp": t.timestamp.isoformat(),
                "payload_hash": t.payload_hash,
                "signature": t.signature
            }
            for t in txs
        ],
        "access_audit_log": [
            {
                "timestamp": a.AccessEvent.timestamp.isoformat(),
                "centre": a.Centre.name if a.Centre else "Unknown",
                "user": a.User.email if a.User else "Unknown",
                "device": a.AccessEvent.device_id,
                "allowed": a.AccessEvent.allowed,
                "denial_reason": a.AccessEvent.denial_reason,
                "tx_hash": a.AccessEvent.tx_hash
            }
            for a in access_events
        ],
        "security_incidents": [
            {
                "incident_id": i.incident_id,
                "type": i.type,
                "severity": i.severity,
                "description": i.description,
                "status": i.status,
                "timestamp": i.timestamp.isoformat()
            }
            for i in incidents
        ]
    }
