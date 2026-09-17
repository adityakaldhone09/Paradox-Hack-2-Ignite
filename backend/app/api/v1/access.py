import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.db.session import get_db
from app.models.entities import Paper, User, Centre, AccessEvent, BlockchainTransaction, Incident, AuthorizedDevice
from app.schemas.schemas import AccessRequest, AccessResponse
from app.services.access_control_service import access_control_service
from app.services.blockchain_service import blockchain_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/access", tags=["Access Control Engine"])

@router.post("/request", response_model=AccessResponse)
@router.post("/evaluate", response_model=AccessResponse)
async def request_paper_access(
    req: AccessRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    paper = (await db.execute(select(Paper).where(or_(Paper.id == req.paper_id, Paper.paper_id == req.paper_id)))).scalars().first()
    if not paper:
        raise HTTPException(status_code=404, detail="Requested paper not found")

    centre = (await db.execute(select(Centre).where(or_(Centre.id == req.centre_id, Centre.centre_id == req.centre_id)))).scalars().first()
    if not centre:
        raise HTTPException(status_code=404, detail="Examination Centre not found")

    # Enforce server-authoritative time (no client-controlled time override)
    evaluation_time = datetime.now(timezone.utc).replace(tzinfo=None)
    allowed, reason, details = await access_control_service.evaluate_access(
        db=db,
        paper=paper,
        user=user,
        centre_id=centre.id,
        device_fingerprint=req.device_fingerprint,
        current_time=evaluation_time
    )

    event_type = "ACCESS_GRANTED" if allowed else "ACCESS_DENIED"
    resolved_device_id = details.get("device_id") if details else None
    if not resolved_device_id:
        resolved_device_id = req.device_fingerprint[:16] if req.device_fingerprint else "UNKNOWN_DEVICE"

    # Record blockchain transaction
    bc_tx = await blockchain_service.record_transaction(
        event_type=event_type,
        paper_id=paper.id,
        actor_id=user.email,
        centre_id=centre.id,
        device_id=resolved_device_id,
        payload_data={
            "paper_id": paper.paper_id,
            "centre_id": centre.centre_id,
            "allowed": allowed,
            "reason": reason,
            "timestamp": evaluation_time.isoformat()
        }
    )

    # Save AccessEvent log with naive UTC timestamp
    access_evt = AccessEvent(
        paper_id=paper.id,
        centre_id=centre.id,
        user_id=user.id,
        device_id=resolved_device_id,
        timestamp=evaluation_time,
        action="REQUEST_ACCESS",
        allowed=allowed,
        denial_reason=reason if not allowed else None,
        tx_hash=bc_tx["tx_hash"]
    )
    db.add(access_evt)

    # Save BlockchainTransaction record
    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type=event_type,
        paper_id=paper.id,
        actor_id=user.email,
        centre_id=centre.id,
        device_id=resolved_device_id,
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=evaluation_time,
        status="CONFIRMED"
    )
    db.add(db_tx)

    # If access blocked, automatically log incident for Security Operations Center
    if not allowed:
        inc_type = "EARLY_ACCESS" if reason == "RELEASE_WINDOW_NOT_STARTED" else (
            "DEVICE_MISMATCH" if reason in ("DEVICE_MISMATCH", "DEVICE_REVOKED") else "UNAUTHORIZED_ACCESS"
        )
        severity = "CRITICAL" if reason in ("DEVICE_MISMATCH", "DEVICE_REVOKED") else "HIGH"
        
        inc = Incident(
            incident_id=f"INC-{uuid.uuid4().hex[:8].upper()}",
            type=inc_type,
            severity=severity,
            paper_id=paper.id,
            centre_id=centre.id,
            user_id=user.id,
            device_id=resolved_device_id,
            timestamp=evaluation_time,
            description=f"Blocked paper access attempt for {paper.paper_id} at {centre.name}: {details.get('message', reason)}",
            status="OPEN",
            tx_hash=bc_tx["tx_hash"]
        )
        db.add(inc)

    await db.commit()

    return AccessResponse(
        allowed=allowed,
        reason=reason,
        message=details.get("message", "Access evaluated"),
        timestamp=evaluation_time,
        tx_hash=bc_tx["tx_hash"],
        details=details
    )

@router.get("/logs")
async def get_access_logs(
    paper_id: Optional[str] = Query(None),
    limit: int = Query(50),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(AccessEvent, Paper, Centre, User)\
        .join(Paper, AccessEvent.paper_id == Paper.id)\
        .outerjoin(Centre, AccessEvent.centre_id == Centre.id)\
        .outerjoin(User, AccessEvent.user_id == User.id)\
        .order_by(AccessEvent.timestamp.desc())\
        .limit(limit)

    if paper_id:
        query = query.where(or_(Paper.id == paper_id, Paper.paper_id == paper_id))

    res = await db.execute(query)
    rows = res.all()

    return [
        {
            "id": r.AccessEvent.id,
            "timestamp": r.AccessEvent.timestamp.isoformat(),
            "paper_id": r.Paper.paper_id,
            "paper_title": r.Paper.title,
            "centre_name": r.Centre.name if r.Centre else "Unknown Centre",
            "user_email": r.User.email if r.User else "Unknown User",
            "device_id": r.AccessEvent.device_id,
            "allowed": r.AccessEvent.allowed,
            "reason": r.AccessEvent.denial_reason,
            "tx_hash": r.AccessEvent.tx_hash
        }
        for r in rows
    ]
