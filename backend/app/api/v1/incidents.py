from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.db.session import get_db
from app.models.entities import Incident, Paper, Centre, User, BlockchainTransaction
from app.schemas.schemas import IncidentResponse
from app.api.deps import get_current_user, require_roles
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/incidents", tags=["Incident Management"])

class CreateIncidentRequest(BaseModel):
    type: str
    severity: Optional[str] = "HIGH"
    paper_id: Optional[str] = None
    centre_id: Optional[str] = None
    device_id: Optional[str] = None
    description: str

class ResolveIncidentRequest(BaseModel):
    resolution_notes: str

@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    req: CreateIncidentRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    import random
    inc_code = f"INC-{datetime.now().year}-{random.randint(1000, 9999)}"

    paper = None
    if req.paper_id:
        paper = (await db.execute(select(Paper).where(or_(Paper.id == req.paper_id, Paper.paper_id == req.paper_id)))).scalars().first()

    centre_id = req.centre_id or user.centre_id
    device_id = req.device_id or "TERMINAL-PORTAL"

    bc_tx = await blockchain_service.record_transaction(
        event_type="INCIDENT_RECORDED",
        paper_id=paper.id if paper else "SYSTEM",
        actor_id=user.email,
        centre_id=centre_id,
        device_id=device_id,
        payload_data={
            "incident_id": inc_code,
            "type": req.type,
            "severity": req.severity,
            "description": req.description
        }
    )

    if paper:
        db_tx = BlockchainTransaction(
            tx_hash=bc_tx["tx_hash"],
            block_number=bc_tx["block_number"],
            event_type="INCIDENT_RECORDED",
            paper_id=paper.id,
            actor_id=user.email,
            centre_id=centre_id,
            device_id=device_id,
            payload_hash=bc_tx["payload_hash"],
            previous_hash=bc_tx["previous_hash"],
            signature=bc_tx["signature"],
            timestamp=datetime.fromisoformat(bc_tx["timestamp"]),
            status="CONFIRMED"
        )
        db.add(db_tx)

    incident = Incident(
        incident_id=inc_code,
        type=req.type,
        severity=req.severity or "HIGH",
        paper_id=paper.id if paper else None,
        centre_id=centre_id,
        user_id=user.id,
        device_id=device_id,
        description=req.description,
        status="OPEN",
        tx_hash=bc_tx["tx_hash"]
    )
    db.add(incident)
    await db.commit()
    await db.refresh(incident)

    centre = None
    if centre_id:
        centre = (await db.execute(select(Centre).where(Centre.id == centre_id))).scalars().first()

    return IncidentResponse(
        id=incident.id,
        incident_id=incident.incident_id,
        type=incident.type,
        severity=incident.severity,
        paper_id=incident.paper_id,
        paper_title=paper.title if paper else None,
        centre_id=incident.centre_id,
        centre_name=centre.name if centre else None,
        user_id=incident.user_id,
        device_id=incident.device_id,
        timestamp=incident.timestamp,
        description=incident.description,
        status=incident.status,
        tx_hash=incident.tx_hash,
        resolution_notes=incident.resolution_notes
    )

@router.get("", response_model=List[IncidentResponse])
async def list_incidents(
    type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Incident, Paper, Centre)\
        .outerjoin(Paper, Incident.paper_id == Paper.id)\
        .outerjoin(Centre, Incident.centre_id == Centre.id)\
        .order_by(Incident.timestamp.desc())

    if type:
        query = query.where(Incident.type == type)
    if severity:
        query = query.where(Incident.severity == severity)
    if status:
        query = query.where(Incident.status == status)

    res = await db.execute(query)
    rows = res.all()

    return [
        IncidentResponse(
            id=r.Incident.id,
            incident_id=r.Incident.incident_id,
            type=r.Incident.type,
            severity=r.Incident.severity,
            paper_id=r.Incident.paper_id,
            paper_title=r.Paper.title if r.Paper else None,
            centre_id=r.Incident.centre_id,
            centre_name=r.Centre.name if r.Centre else None,
            user_id=r.Incident.user_id,
            device_id=r.Incident.device_id,
            timestamp=r.Incident.timestamp,
            description=r.Incident.description,
            status=r.Incident.status,
            tx_hash=r.Incident.tx_hash,
            resolution_notes=r.Incident.resolution_notes
        )
        for r in rows
    ]

@router.get("/{id}")
async def get_incident(id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = (await db.execute(
        select(Incident, Paper, Centre, User)
        .outerjoin(Paper, Incident.paper_id == Paper.id)
        .outerjoin(Centre, Incident.centre_id == Centre.id)
        .outerjoin(User, Incident.user_id == User.id)
        .where(or_(Incident.id == id, Incident.incident_id == id))
    )).first()

    if not row:
        raise HTTPException(status_code=404, detail="Incident not found")

    inc = row.Incident
    return {
        "id": inc.id,
        "incident_id": inc.incident_id,
        "type": inc.type,
        "severity": inc.severity,
        "paper": {"id": row.Paper.id, "paper_id": row.Paper.paper_id, "title": row.Paper.title} if row.Paper else None,
        "centre": {"id": row.Centre.id, "centre_id": row.Centre.centre_id, "name": row.Centre.name} if row.Centre else None,
        "user": {"id": row.User.id, "email": row.User.email, "name": row.User.name} if row.User else None,
        "device_id": inc.device_id,
        "timestamp": inc.timestamp.isoformat(),
        "description": inc.description,
        "status": inc.status,
        "tx_hash": inc.tx_hash,
        "resolution_notes": inc.resolution_notes
    }

@router.post("/{id}/acknowledge")
async def acknowledge_incident(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    inc = (await db.execute(select(Incident).where(or_(Incident.id == id, Incident.incident_id == id)))).scalars().first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    inc.status = "ACKNOWLEDGED"
    await db.commit()
    return {"message": f"Incident {inc.incident_id} marked as acknowledged", "status": inc.status}

@router.post("/{id}/resolve")
async def resolve_incident(
    id: str,
    req: ResolveIncidentRequest,
    user: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    inc = (await db.execute(select(Incident).where(or_(Incident.id == id, Incident.incident_id == id)))).scalars().first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    inc.status = "RESOLVED"
    inc.resolution_notes = req.resolution_notes
    await db.commit()
    return {"message": f"Incident {inc.incident_id} resolved", "status": inc.status}
