from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.db.session import get_db
from app.models.entities import Incident, Paper, Centre, User
from app.schemas.schemas import IncidentResponse
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/incidents", tags=["Incident Management"])

class ResolveIncidentRequest(BaseModel):
    resolution_notes: str

@router.get("", response_model=List[IncidentResponse])
async def list_incidents(
    type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
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
async def get_incident(id: str, db: AsyncSession = Depends(get_db)):
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
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY"])),
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
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY"])),
    db: AsyncSession = Depends(get_db)
):
    inc = (await db.execute(select(Incident).where(or_(Incident.id == id, Incident.incident_id == id)))).scalars().first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    inc.status = "RESOLVED"
    inc.resolution_notes = req.resolution_notes
    await db.commit()
    return {"message": f"Incident {inc.incident_id} resolved", "status": inc.status}
