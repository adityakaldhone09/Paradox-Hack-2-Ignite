from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.db.session import get_db
from app.models.entities import User
from app.api.deps import get_current_user, require_roles
from app.core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["User Management"])

class UserCreate(BaseModel):
    email: str
    name: str
    password: str
    role: str
    centre_id: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    centre_id: Optional[str] = None
    is_active: Optional[bool] = None

VALID_ROLES = {"SUPER_ADMIN", "PAPER_SETTER", "CENTRE_ADMIN", "INVIGILATOR"}

@router.get("")
async def list_users(
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    user: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    """SUPER_ADMIN only: List all system users."""
    query = select(User).order_by(User.created_at.desc())
    if role:
        query = query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    users = (await db.execute(query)).scalars().all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "role": u.role,
            "centre_id": u.centre_id,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat()
        }
        for u in users
    ]

@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_user(
    req: UserCreate,
    caller: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    """SUPER_ADMIN only: Create a new system user."""
    if req.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(VALID_ROLES)}")

    existing = (await db.execute(select(User).where(User.email == req.email))).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_user = User(
        email=req.email,
        name=req.name,
        hashed_password=get_password_hash(req.password),
        role=req.role,
        centre_id=req.centre_id,
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {
        "id": new_user.id,
        "email": new_user.email,
        "name": new_user.name,
        "role": new_user.role,
        "centre_id": new_user.centre_id,
        "is_active": new_user.is_active,
        "created_at": new_user.created_at.isoformat()
    }

@router.patch("/{id}")
async def update_user(
    id: str,
    req: UserUpdate,
    caller: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    """SUPER_ADMIN only: Update a user's profile, role, or activation status."""
    user = (await db.execute(select(User).where(User.id == id))).scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if req.role and req.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(VALID_ROLES)}")

    if req.name is not None:
        user.name = req.name
    if req.role is not None:
        user.role = req.role
    if req.centre_id is not None:
        user.centre_id = req.centre_id
    if req.is_active is not None:
        user.is_active = req.is_active

    await db.commit()
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "centre_id": user.centre_id,
        "is_active": user.is_active,
        "message": "User updated successfully"
    }

@router.delete("/{id}")
async def deactivate_user(
    id: str,
    caller: User = Depends(require_roles(["SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    """SUPER_ADMIN only: Deactivate a user account (soft delete)."""
    user = (await db.execute(select(User).where(User.id == id))).scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == caller.id:
        raise HTTPException(status_code=400, detail="You cannot deactivate your own account")
    user.is_active = False
    await db.commit()
    return {"message": f"User {user.email} has been deactivated", "is_active": False}
