from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.db.session import get_db
from app.models.entities import AuthorizedDevice, Centre, User
from app.schemas.schemas import DeviceCreate, DeviceResponse
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/devices", tags=["Device Authorization"])

@router.get("", response_model=List[DeviceResponse])
async def list_devices(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AuthorizedDevice).order_by(AuthorizedDevice.registered_at.desc()))
    devs = res.scalars().all()
    return [
        DeviceResponse(
            id=d.id,
            device_id=d.device_id,
            device_fingerprint=d.device_fingerprint,
            centre_id=d.centre_id,
            device_name=d.device_name,
            os=d.os,
            ip_address=d.ip_address,
            status=d.status,
            registered_at=d.registered_at,
            last_seen=d.last_seen
        )
        for d in devs
    ]

@router.post("", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
async def register_device(
    req: DeviceCreate,
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY", "CENTRE_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    centre = (await db.execute(select(Centre).where(or_(Centre.id == req.centre_id, Centre.centre_id == req.centre_id)))).scalars().first()
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found")

    existing = (await db.execute(select(AuthorizedDevice).where(AuthorizedDevice.device_id == req.device_id))).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Device ID already registered")

    dev = AuthorizedDevice(
        device_id=req.device_id,
        device_fingerprint=req.device_fingerprint,
        centre_id=centre.id,
        device_name=req.device_name,
        os=req.os,
        ip_address=req.ip_address,
        status="AUTHORIZED",
        registered_at=datetime.now(timezone.utc),
        last_seen=datetime.now(timezone.utc)
    )
    db.add(dev)
    await db.commit()
    await db.refresh(dev)

    return DeviceResponse(
        id=dev.id,
        device_id=dev.device_id,
        device_fingerprint=dev.device_fingerprint,
        centre_id=dev.centre_id,
        device_name=dev.device_name,
        os=dev.os,
        ip_address=dev.ip_address,
        status=dev.status,
        registered_at=dev.registered_at,
        last_seen=dev.last_seen
    )

@router.post("/{id}/authorize")
async def authorize_device(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY", "CENTRE_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    dev = (await db.execute(select(AuthorizedDevice).where(or_(AuthorizedDevice.id == id, AuthorizedDevice.device_id == id)))).scalars().first()
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    dev.status = "AUTHORIZED"
    await db.commit()
    return {"message": f"Device {dev.device_name} authorized", "status": dev.status}

@router.post("/{id}/revoke")
async def revoke_device(
    id: str,
    user: User = Depends(require_roles(["SUPER_ADMIN", "EXAM_AUTHORITY", "CENTRE_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    dev = (await db.execute(select(AuthorizedDevice).where(or_(AuthorizedDevice.id == id, AuthorizedDevice.device_id == id)))).scalars().first()
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    dev.status = "REVOKED"
    await db.commit()
    return {"message": f"Device {dev.device_name} revoked", "status": dev.status}
