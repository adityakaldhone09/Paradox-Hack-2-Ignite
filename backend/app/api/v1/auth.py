from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.models.entities import User
from app.schemas.schemas import LoginRequest, TokenResponse, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == req.email)
    res = await db.execute(query)
    user = res.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been suspended"
        )

    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "centre_id": user.centre_id,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        }
    }

@router.post("/refresh")
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    payload = decode_token(refresh_token, is_refresh=True)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_id = payload.get("sub")
    query = select(User).where(User.id == user_id)
    res = await db.execute(query)
    user = res.scalars().first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User unavailable")

    new_access = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    return {"access_token": new_access, "token_type": "bearer"}

@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "centre_id": user.centre_id,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat()
    }

@router.get("/demo-users")
async def get_demo_users(db: AsyncSession = Depends(get_db)):
    """Returns safe demo credentials for 1-click login during the hackathon demonstration."""
    query = select(User).order_by(User.role)
    res = await db.execute(query)
    users = res.scalars().all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "role": u.role,
            "centre_id": u.centre_id,
            "demo_password": "password123"
        }
        for u in users
    ]
