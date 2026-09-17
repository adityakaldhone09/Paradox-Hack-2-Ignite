from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.db.session import get_db
from app.models.entities import Centre, AuthorizedDevice, PaperCentreAssignment, User
from app.schemas.schemas import CentreCreate, CentreResponse, DeviceCreate, DeviceResponse
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/centres", tags=["Centre Management"])

@router.get("", response_model=List[CentreResponse])
async def list_centres(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Centre)
    if search:
        query = query.where(
            or_(
                Centre.name.ilike(f"%{search}%"),
                Centre.centre_id.ilike(f"%{search}%"),
                Centre.city.ilike(f"%{search}%")
            )
        )
    if status:
        query = query.where(Centre.status == status)

    query = query.order_by(Centre.created_at.asc())
    res = await db.execute(query)
    centres = res.scalars().all()

    output = []
    for c in centres:
        d_res = await db.execute(select(func.count(AuthorizedDevice.id)).where(AuthorizedDevice.centre_id == c.id, AuthorizedDevice.status == "AUTHORIZED"))
        dev_count = d_res.scalar_one() or 0

        e_res = await db.execute(select(func.count(PaperCentreAssignment.id)).where(PaperCentreAssignment.centre_id == c.id))
        exam_count = e_res.scalar_one() or 0

        output.append(CentreResponse(
            id=c.id,
            centre_id=c.centre_id,
            name=c.name,
            city=c.city,
            state=c.state,
            code=c.code,
            is_authorized=c.is_authorized,
            status=c.status,
            authorized_devices_count=dev_count,
            assigned_exams_count=exam_count,
            created_at=c.created_at
        ))
    return output

@router.post("", response_model=CentreResponse, status_code=status.HTTP_201_CREATED)
async def create_centre(
    req: CentreCreate,
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY"])),
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(Centre).where(or_(Centre.centre_id == req.centre_id, Centre.code == req.code)))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Centre ID or Code already exists")

    centre = Centre(
        name=req.name,
        centre_id=req.centre_id,
        city=req.city,
        state=req.state,
        code=req.code,
        is_authorized=True,
        status="ACTIVE"
    )
    db.add(centre)
    await db.commit()
    await db.refresh(centre)

    return CentreResponse(
        id=centre.id,
        centre_id=centre.centre_id,
        name=centre.name,
        city=centre.city,
        state=centre.state,
        code=centre.code,
        is_authorized=centre.is_authorized,
        status=centre.status,
        authorized_devices_count=0,
        assigned_exams_count=0,
        created_at=centre.created_at
    )

@router.get("/{id}")
async def get_centre(id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    centre = (await db.execute(select(Centre).where(or_(Centre.id == id, Centre.centre_id == id)))).scalars().first()
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")

    devs = (await db.execute(select(AuthorizedDevice).where(AuthorizedDevice.centre_id == centre.id))).scalars().all()

    return {
        "id": centre.id,
        "centre_id": centre.centre_id,
        "name": centre.name,
        "city": centre.city,
        "state": centre.state,
        "code": centre.code,
        "is_authorized": centre.is_authorized,
        "status": centre.status,
        "created_at": centre.created_at.isoformat(),
        "devices": [
            {
                "id": d.id,
                "device_id": d.device_id,
                "device_fingerprint": d.device_fingerprint,
                "device_name": d.device_name,
                "os": d.os,
                "ip_address": d.ip_address,
                "status": d.status,
                "last_seen": d.last_seen.isoformat()
            }
            for d in devs
        ]
    }

@router.post("/{id}/authorize")
async def authorize_centre(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY"])),
    db: AsyncSession = Depends(get_db)
):
    centre = (await db.execute(select(Centre).where(or_(Centre.id == id, Centre.centre_id == id)))).scalars().first()
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")
    centre.is_authorized = True
    centre.status = "ACTIVE"
    await db.commit()
    return {"message": f"Centre {centre.name} authorized", "status": centre.status}

@router.post("/{id}/revoke")
async def revoke_centre(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY"])),
    db: AsyncSession = Depends(get_db)
):
    centre = (await db.execute(select(Centre).where(or_(Centre.id == id, Centre.centre_id == id)))).scalars().first()
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")
    centre.is_authorized = False
    centre.status = "SUSPENDED"
    await db.commit()
    return {"message": f"Centre {centre.name} authorization revoked", "status": centre.status}
