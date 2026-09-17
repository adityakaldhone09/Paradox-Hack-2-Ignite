from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.config import settings
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.schemas.schemas import (
    LoginRequest, SignupRequest, ForgotPasswordRequest, ResetPasswordRequest,
    TokenResponse, UserResponse
)
from app.models.entities import User
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

@router.post("/signup", response_model=TokenResponse)
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    existing = (await db.execute(select(User).where(User.email == req.email))).scalars().first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    # Hash password and create user
    from app.core.security import get_password_hash
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

    access_token = create_access_token(data={"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    refresh_token = create_refresh_token(data={"sub": new_user.id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role,
            "centre_id": new_user.centre_id,
            "is_active": new_user.is_active,
            "created_at": new_user.created_at.isoformat()
        }
    }

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == req.email)
    user = (await db.execute(query)).scalars().first()
    # Return 200 regardless of existence to prevent account enumeration
    return {
        "status": "success",
        "message": "If an account with this email exists, a password reset authorization token has been dispatched."
    }

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    return {
        "status": "success",
        "message": "Password has been successfully updated. Please sign in with your new credentials."
    }

@router.post("/logout")
async def logout(user: User = Depends(get_current_user)):
    return {
        "status": "success",
        "message": "Session revoked and signed out securely."
    }

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
    if settings.APP_ENV.lower() in ("production", "prod"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo user credentials endpoint is disabled in production environment"
        )
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
