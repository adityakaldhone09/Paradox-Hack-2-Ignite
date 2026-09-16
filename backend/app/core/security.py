import hmac
import hashlib
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict
import jwt
from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8')[:72],
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8')[:72], salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.JWT_REFRESH_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_token(token: str, is_refresh: bool = False) -> Optional[Dict[str, Any]]:
    secret = settings.JWT_REFRESH_SECRET if is_refresh else settings.JWT_SECRET
    try:
        payload = jwt.decode(token, secret, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def sign_data(data: str, secret_key: Optional[str] = None) -> str:
    """Generate cryptographic digital signature for sensitive operations (HMAC-SHA256)"""
    key = (secret_key or settings.ENCRYPTION_KEY).encode()
    return hmac.new(key, data.encode(), hashlib.sha256).hexdigest()

def verify_signature(data: str, signature: str, secret_key: Optional[str] = None) -> bool:
    """Verify cryptographic digital signature"""
    expected = sign_data(data, secret_key)
    return hmac.compare_digest(expected, signature)
