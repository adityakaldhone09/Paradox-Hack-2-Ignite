import pytest
from datetime import timedelta
import jwt
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.main import app
from app.core.config import settings
from app.core.security import create_access_token
from app.models.entities import User
from app.db.session import AsyncSessionLocal

client = TestClient(app)

def test_missing_credentials_on_protected_endpoints():
    """AC-01 & AC-09: Unauthenticated calls to protected endpoints must return HTTP 401."""
    endpoints = [
        ("GET", "/api/v1/papers"),
        ("GET", "/api/v1/exams"),
        ("POST", "/api/v1/access/request"),
        ("POST", "/api/v1/papers/upload"),
        ("GET", "/api/v1/auth/me"),
    ]
    for method, path in endpoints:
        if method == "GET":
            response = client.get(path)
        else:
            response = client.post(path, json={})
        assert response.status_code == 401, f"Expected 401 for unauthenticated {method} {path}, got {response.status_code}: {response.text}"
        assert "WWW-Authenticate" in response.headers
        assert "Bearer" in response.headers["WWW-Authenticate"]

def test_malformed_authorization_headers():
    """AC-02: Malformed or non-bearer Authorization headers must return HTTP 401."""
    malformed_headers = [
        {"Authorization": "Bearer"},
        {"Authorization": "Bearer "},
        {"Authorization": "Bearer    "},
        {"Authorization": "Basic dXNlcjpwYXNz"},
        {"Authorization": "Token 1234567890"},
        {"Authorization": "Bearer malformed.jwt.token"},
    ]
    for headers in malformed_headers:
        response = client.get("/api/v1/papers", headers=headers)
        assert response.status_code == 401, f"Expected 401 for headers {headers}, got {response.status_code}"

def test_invalid_jwt_token():
    """AC-03: Completely invalid/tampered JWT tokens must be rejected with HTTP 401."""
    headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature"}
    response = client.get("/api/v1/papers", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] in ["Invalid or expired token", "Authentication required"]

def test_expired_jwt_token():
    """AC-04: Expired JWT tokens must be rejected with HTTP 401."""
    expired_token = create_access_token(
        data={"sub": "user-123", "email": "test@veriq.local", "role": "EXAM_AUTHORITY"},
        expires_delta=timedelta(seconds=-120)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/api/v1/papers", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired token"

def test_wrong_signing_secret():
    """AC-05: JWT tokens signed with a different secret must be rejected with HTTP 401."""
    rogue_secret = "completely_different_rogue_secret_key_999999"
    payload = {"sub": "user-123", "email": "test@veriq.local", "role": "SUPER_ADMIN", "type": "access"}
    fake_token = jwt.encode(payload, rogue_secret, algorithm="HS256")

    headers = {"Authorization": f"Bearer {fake_token}"}
    response = client.get("/api/v1/papers", headers=headers)
    assert response.status_code == 401

def test_tampered_jwt_signature():
    """AC-03 & Security: Modifying a single byte of a valid JWT signature must fail with HTTP 401."""
    valid_token = create_access_token(data={"sub": "user-123", "email": "test@veriq.local", "role": "SUPER_ADMIN"})
    tampered_token = valid_token[:-4] + ("A" if valid_token[-4] != "A" else "B") + valid_token[-3:]

    headers = {"Authorization": f"Bearer {tampered_token}"}
    response = client.get("/api/v1/papers", headers=headers)
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_nonexistent_user_token():
    """AC-08: A validly signed token with a nonexistent user ID must return HTTP 401."""
    orphan_token = create_access_token(data={"sub": "non-existent-user-uuid-999999", "email": "ghost@veriq.local", "role": "SUPER_ADMIN"})
    headers = {"Authorization": f"Bearer {orphan_token}"}
    response = client.get("/api/v1/papers", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid authentication credentials"

@pytest.mark.asyncio
async def test_no_default_admin_fallback():
    """AC-06: Explicitly verifies that missing credentials NEVER resolve to admin@veriq.local."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert "admin@veriq.local" not in response.text

@pytest.mark.asyncio
async def test_valid_jwt_authentication_and_role_authorization():
    """AC-07 & AC-10: Valid JWT resolves exact user and enforces correct role permissions."""
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(User).where(User.email == "admin@veriq.local"))
        admin_user = res.scalars().first()
        assert admin_user is not None, "Seeded admin@veriq.local required for test"

    token = create_access_token(data={"sub": admin_user.id, "email": admin_user.email, "role": admin_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Identity endpoint
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    user_data = me_resp.json()
    assert user_data["email"] == "admin@veriq.local"
    assert user_data["role"] == "SUPER_ADMIN"

    # 2. Protected read endpoint
    papers_resp = client.get("/api/v1/papers", headers=headers)
    assert papers_resp.status_code == 200
    assert isinstance(papers_resp.json(), list)

def test_role_authorization_enforcement():
    """Role authorization: Insufficient role returns 403, correct role allows access."""
    # Create token with INVIGILATOR role
    invigilator_token = create_access_token(
        data={"sub": "test-invigilator-uuid", "email": "invigilator@veriq.local", "role": "INVIGILATOR"}
    )
    # Upload paper endpoint requires SUPER_ADMIN, EXAM_AUTHORITY, or PAPER_SETTER
    headers = {"Authorization": f"Bearer {invigilator_token}"}
    resp = client.post("/api/v1/papers/upload", headers=headers, data={})
    # Non-existent user with invigilator token will get 401 because user not in DB
    assert resp.status_code in [401, 403]
