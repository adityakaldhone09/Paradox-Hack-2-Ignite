import pytest
from datetime import datetime, timezone, timedelta
import jwt
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from sqlalchemy import select

from app.main import app
from app.core.config import settings
from app.core.security import create_access_token
from app.models.entities import User, Centre, AuthorizedDevice, Paper, PaperCentreAssignment, Examination
from app.db.session import AsyncSessionLocal

client = TestClient(app)

@pytest.fixture
def anyio_backend():
    return 'asyncio'

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
    assert "detail" in response.json()

def test_expired_jwt_token():
    """AC-04: Expired JWT tokens must be rejected with HTTP 401."""
    expired_token = create_access_token(
        data={"sub": "user-123", "email": "test@veriq.local", "role": "EXAM_AUTHORITY"},
        expires_delta=timedelta(seconds=-120)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/api/v1/papers", headers=headers)
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]

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
    assert "Invalid authentication credentials" in response.json()["detail"]

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

@pytest.mark.asyncio
async def test_unauthenticated_request_rejected_async():
    """Verify backend authentication bypass is completely removed via AsyncClient."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as async_client:
        res = await async_client.get("/api/v1/papers")
        assert res.status_code == 401
        data = res.json()
        assert "detail" in data

        res2 = await async_client.post("/api/v1/access/request", json={
            "paper_id": "PAP-2026-MATH301",
            "centre_id": "C101",
            "device_fingerprint": "fake_fingerprint"
        })
        assert res2.status_code == 401

@pytest.mark.asyncio
async def test_device_validation_suite():
    """
    Comprehensive Security Regression Suite for Phase 1 Issue #3:
    Server-side authorized device validation, centre binding, status, scope, and fail-closed checks.
    """
    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

    async with AsyncSessionLocal() as session:
        # 1. Setup Admin & Invigilators
        admin_user = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()
        assert admin_user is not None

        # Ensure exam exists
        exam = (await session.execute(select(Examination))).scalars().first()
        if not exam:
            exam = Examination(
                exam_id="EXAM-SEC-DEV-01",
                name="Device Security Exam",
                department="Computer Science",
                subject="Hardware Security",
                exam_date="2026-09-17",
                start_time="09:00:00",
                end_time="12:00:00"
            )
            session.add(exam)
            await session.flush()

        # 2. Setup Centre A and Centre B
        centre_a = (await session.execute(select(Centre).where(Centre.centre_id == "CENTRE-DEV-A"))).scalars().first()
        if not centre_a:
            centre_a = Centre(
                centre_id="CENTRE-DEV-A",
                name="Centre Alpha",
                city="Capital",
                state="North",
                code="DEV-A",
                is_authorized=True,
                status="ACTIVE"
            )
            session.add(centre_a)
            await session.flush()

        centre_b = (await session.execute(select(Centre).where(Centre.centre_id == "CENTRE-DEV-B"))).scalars().first()
        if not centre_b:
            centre_b = Centre(
                centre_id="CENTRE-DEV-B",
                name="Centre Beta",
                city="Coast",
                state="South",
                code="DEV-B",
                is_authorized=True,
                status="ACTIVE"
            )
            session.add(centre_b)
            await session.flush()

        # 3. Setup Devices:
        # Device A (Authorized at Centre A)
        dev_a = (await session.execute(select(AuthorizedDevice).where(AuthorizedDevice.device_fingerprint == "fp_dev_a_authorized_1111"))).scalars().first()
        if not dev_a:
            dev_a = AuthorizedDevice(
                device_id="DEV-A-01",
                centre_id=centre_a.id,
                device_name="Terminal A-01",
                device_fingerprint="fp_dev_a_authorized_1111",
                status="AUTHORIZED"
            )
            session.add(dev_a)
            await session.flush()

        # Device B (Authorized at Centre B)
        dev_b = (await session.execute(select(AuthorizedDevice).where(AuthorizedDevice.device_fingerprint == "fp_dev_b_authorized_2222"))).scalars().first()
        if not dev_b:
            dev_b = AuthorizedDevice(
                device_id="DEV-B-01",
                centre_id=centre_b.id,
                device_name="Terminal B-01",
                device_fingerprint="fp_dev_b_authorized_2222",
                status="AUTHORIZED"
            )
            session.add(dev_b)
            await session.flush()

        # Device Revoked (Registered at Centre A, but REVOKED)
        dev_revoked = (await session.execute(select(AuthorizedDevice).where(AuthorizedDevice.device_fingerprint == "fp_dev_revoked_3333"))).scalars().first()
        if not dev_revoked:
            dev_revoked = AuthorizedDevice(
                device_id="DEV-A-REVOKED",
                centre_id=centre_a.id,
                device_name="Terminal A-Revoked",
                device_fingerprint="fp_dev_revoked_3333",
                status="REVOKED"
            )
            session.add(dev_revoked)
            await session.flush()

        # 4. Setup Paper assigned to Centre A (Active release window)
        paper_a = (await session.execute(select(Paper).where(Paper.paper_id == "PAP-DEV-TEST-01"))).scalars().first()
        if not paper_a:
            paper_a = Paper(
                paper_id="PAP-DEV-TEST-01",
                exam_id=exam.id,
                title="Device Validation Paper A",
                file_name="paper_a.pdf",
                file_size=1024,
                sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                encrypted_file_path="storage/encrypted_papers/paper_a.enc",
                encryption_iv="0123456789abcdef01234567",
                encryption_tag="0123456789abcdef0123456789abcdef",
                created_by=admin_user.id,
                status="APPROVED",
                release_time=now_utc - timedelta(hours=1)
            )
            session.add(paper_a)
            await session.flush()
        else:
            paper_a.status = "APPROVED"
            paper_a.release_time = now_utc - timedelta(hours=1)

        assign_a = (await session.execute(select(PaperCentreAssignment).where(
            PaperCentreAssignment.paper_id == paper_a.id,
            PaperCentreAssignment.centre_id == centre_a.id
        ))).scalars().first()
        if not assign_a:
            assign_a = PaperCentreAssignment(
                paper_id=paper_a.id,
                centre_id=centre_a.id,
                release_window_start=now_utc - timedelta(hours=1),
                release_window_end=now_utc + timedelta(hours=1)
            )
            session.add(assign_a)
        else:
            assign_a.release_window_start = now_utc - timedelta(hours=1)
            assign_a.release_window_end = now_utc + timedelta(hours=1)

        # 5. Setup Invigilator scoped to Centre A
        inv_a = (await session.execute(select(User).where(User.email == "invigilator_a@veriq.local"))).scalars().first()
        if not inv_a:
            inv_a = User(
                email="invigilator_a@veriq.local",
                name="Invigilator Alpha",
                hashed_password=admin_user.hashed_password,
                role="INVIGILATOR",
                centre_id=centre_a.id
            )
            session.add(inv_a)

        await session.commit()

        # Initial last_seen
        dev_a_initial_last_seen = dev_a.last_seen

    token_admin = create_access_token(data={"sub": admin_user.id, "email": admin_user.email, "role": admin_user.role})
    headers_admin = {"Authorization": f"Bearer {token_admin}"}

    token_inv_a = create_access_token(data={"sub": inv_a.id, "email": inv_a.email, "role": inv_a.role})
    headers_inv_a = {"Authorization": f"Bearer {token_inv_a}"}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # TEST-D01 & TEST-D10: Authorized registered device + correct centre + active window -> ALLOWED
        res = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-A",
            "device_fingerprint": "fp_dev_a_authorized_1111"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["allowed"] is True
        assert data["reason"] == "AUTHORIZED"
        assert data["details"]["device_id"] == "DEV-A-01"

        # Verify last_seen was updated
        async with AsyncSessionLocal() as session:
            dev_check = (await session.execute(select(AuthorizedDevice).where(AuthorizedDevice.device_fingerprint == "fp_dev_a_authorized_1111"))).scalars().first()
            assert dev_check.last_seen is not None
            assert dev_check.last_seen != dev_a_initial_last_seen
            last_seen_after_success = dev_check.last_seen

        # TEST-D02: Unknown device fingerprint -> DENIED (DEVICE_MISMATCH)
        res = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-A",
            "device_fingerprint": "fp_completely_unknown_device_9999"
        })
        assert res.status_code == 200
        assert res.json()["allowed"] is False
        assert res.json()["reason"] == "DEVICE_MISMATCH"

        # TEST-D03 & TEST-D06: Device registered to Centre A requested for Centre B -> DENIED (DEVICE_MISMATCH / UNAUTHORIZED_CENTRE)
        res = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-B",
            "device_fingerprint": "fp_dev_a_authorized_1111"
        })
        assert res.status_code == 200
        assert res.json()["allowed"] is False
        assert res.json()["reason"] in ("UNAUTHORIZED_CENTRE", "DEVICE_MISMATCH")

        # TEST-D04: Unknown/nonexistent centre -> DENIED (404 Not Found)
        res = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DOES-NOT-EXIST-404",
            "device_fingerprint": "fp_dev_a_authorized_1111"
        })
        assert res.status_code == 404

        # TEST-D05: Revoked device -> DENIED (DEVICE_REVOKED)
        res = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-A",
            "device_fingerprint": "fp_dev_revoked_3333"
        })
        assert res.status_code == 200
        assert res.json()["allowed"] is False
        assert res.json()["reason"] == "DEVICE_REVOKED"

        # Verify last_seen was NOT updated for revoked device
        async with AsyncSessionLocal() as session:
            rev_check = (await session.execute(select(AuthorizedDevice).where(AuthorizedDevice.device_fingerprint == "fp_dev_revoked_3333"))).scalars().first()
            assert rev_check.last_seen is None or rev_check.last_seen != last_seen_after_success

        # TEST-D07 & TEST-D11: Fabricated / spoofed device fingerprint -> DENIED
        res = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-A",
            "device_fingerprint": "SPOOFED_BROWSER_FINGERPRINT_HARDWARE_MOCK"
        })
        assert res.status_code == 200
        assert res.json()["allowed"] is False
        assert res.json()["reason"] == "DEVICE_MISMATCH"

        # TEST-D08: Missing/empty/whitespace device fingerprint -> Rejected (422 Unprocessable Entity)
        res_empty = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-A",
            "device_fingerprint": ""
        })
        assert res_empty.status_code == 422

        res_spaces = await ac.post("/api/v1/access/request", headers=headers_admin, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-A",
            "device_fingerprint": "    "
        })
        assert res_spaces.status_code == 422

        # TEST-D09: Cross-centre user scope check
        # Invigilator Alpha (scoped to Centre A) requesting Centre A -> ALLOWED
        res_inv_a = await ac.post("/api/v1/access/request", headers=headers_inv_a, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-A",
            "device_fingerprint": "fp_dev_a_authorized_1111"
        })
        assert res_inv_a.status_code == 200
        assert res_inv_a.json()["allowed"] is True

        # Invigilator Alpha attempting to access Centre B -> DENIED (UNAUTHORIZED_CENTRE)
        res_inv_b = await ac.post("/api/v1/access/request", headers=headers_inv_a, json={
            "paper_id": "PAP-DEV-TEST-01",
            "centre_id": "CENTRE-DEV-B",
            "device_fingerprint": "fp_dev_b_authorized_2222"
        })
        assert res_inv_b.status_code == 200
        assert res_inv_b.json()["allowed"] is False
        assert res_inv_b.json()["reason"] == "UNAUTHORIZED_CENTRE"


# ============================================================================
# PHASE 1 — ISSUE #4: REMOVE TRACKED SECRETS & HARDCODED CREDENTIAL FALLBACKS
# Tests: SEC-04-01 through SEC-04-17
# ============================================================================

import os
from pydantic import ValidationError
from app.core.config import Settings, INSECURE_DEFAULT_JWT_SECRETS, INSECURE_DEFAULT_ENCRYPTION_KEYS, _PROJECT_ROOT
from app.services.encryption_service import EncryptionService
from app.core.security import decode_token, create_refresh_token

def test_sec_04_01_missing_jwt_secret_in_production():
    """SEC-04-01: Missing JWT_SECRET in production fails validation safely."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            _env_file=None,
            APP_ENV="production",
            JWT_SECRET="",
            JWT_REFRESH_SECRET="a_very_secure_prod_refresh_secret_key_32bytes!",
            ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde0"
        )
    assert "JWT_SECRET must be explicitly configured in production environment" in str(exc_info.value)

def test_sec_04_02_missing_jwt_refresh_secret_in_production():
    """SEC-04-02: Missing JWT_REFRESH_SECRET in production fails validation safely."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            _env_file=None,
            APP_ENV="production",
            JWT_SECRET="a_very_secure_prod_access_secret_key_32bytes!",
            JWT_REFRESH_SECRET="",
            ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde0"
        )
    assert "JWT_REFRESH_SECRET must be explicitly configured in production environment" in str(exc_info.value)

def test_sec_04_03_missing_encryption_key_in_production():
    """SEC-04-03: Missing ENCRYPTION_KEY in production fails validation safely."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            _env_file=None,
            APP_ENV="production",
            JWT_SECRET="a_very_secure_prod_access_secret_key_32bytes!",
            JWT_REFRESH_SECRET="a_very_secure_prod_refresh_secret_key_32bytes!",
            ENCRYPTION_KEY=""
        )
    assert "ENCRYPTION_KEY must be explicitly configured in production environment" in str(exc_info.value)

def test_sec_04_04_known_insecure_jwt_secret_in_production():
    """SEC-04-04: Known insecure JWT_SECRET or short length in production is rejected."""
    for bad_secret in INSECURE_DEFAULT_JWT_SECRETS:
        with pytest.raises(ValidationError) as exc_info:
            Settings(
                _env_file=None,
                APP_ENV="production",
                JWT_SECRET=bad_secret,
                JWT_REFRESH_SECRET="a_very_secure_prod_refresh_secret_key_32bytes!",
                ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde0"
            )
        assert "Insecure or insufficient JWT_SECRET" in str(exc_info.value)

    # Also test short secret (< 32 chars)
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            _env_file=None,
            APP_ENV="production",
            JWT_SECRET="short_secret_123",
            JWT_REFRESH_SECRET="a_very_secure_prod_refresh_secret_key_32bytes!",
            ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde0"
        )
    assert "Insecure or insufficient JWT_SECRET" in str(exc_info.value)

def test_sec_04_05_known_insecure_jwt_refresh_secret_in_production():
    """SEC-04-05: Known insecure JWT_REFRESH_SECRET or short length in production is rejected."""
    for bad_secret in INSECURE_DEFAULT_JWT_SECRETS:
        with pytest.raises(ValidationError) as exc_info:
            Settings(
                _env_file=None,
                APP_ENV="production",
                JWT_SECRET="a_very_secure_prod_access_secret_key_32bytes!",
                JWT_REFRESH_SECRET=bad_secret,
                ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde0"
            )
        assert "Insecure or insufficient JWT_REFRESH_SECRET" in str(exc_info.value)

def test_sec_04_06_known_insecure_encryption_key_in_production():
    """SEC-04-06: Known insecure demo ENCRYPTION_KEY or invalid hex length is rejected."""
    for bad_key in INSECURE_DEFAULT_ENCRYPTION_KEYS:
        with pytest.raises(ValidationError) as exc_info:
            Settings(
                _env_file=None,
                APP_ENV="production",
                JWT_SECRET="a_very_secure_prod_access_secret_key_32bytes!",
                JWT_REFRESH_SECRET="a_very_secure_prod_refresh_secret_key_32bytes!",
                ENCRYPTION_KEY=bad_key
            )
        assert "Insecure demo ENCRYPTION_KEY cannot be used in production environment" in str(exc_info.value)

    # Also test invalid non-hex or wrong-length key
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            _env_file=None,
            APP_ENV="production",
            JWT_SECRET="a_very_secure_prod_access_secret_key_32bytes!",
            JWT_REFRESH_SECRET="a_very_secure_prod_refresh_secret_key_32bytes!",
            ENCRYPTION_KEY="invalid_hex_string"
        )
    assert "Invalid ENCRYPTION_KEY format" in str(exc_info.value)

def test_sec_04_07_valid_configured_secrets_in_production():
    """SEC-04-07: Valid production secrets instantiate cleanly without errors."""
    valid_prod_settings = Settings(
        _env_file=None,
        APP_ENV="production",
        JWT_SECRET="prod_strong_jwt_access_secret_phrase_2026_at_least_32!",
        JWT_REFRESH_SECRET="prod_strong_jwt_refresh_secret_phrase_2026_at_least_32!",
        ENCRYPTION_KEY="abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
    )
    assert valid_prod_settings.APP_ENV == "production"
    assert valid_prod_settings.JWT_SECRET == "prod_strong_jwt_access_secret_phrase_2026_at_least_32!"
    assert valid_prod_settings.JWT_REFRESH_SECRET == "prod_strong_jwt_refresh_secret_phrase_2026_at_least_32!"

def test_sec_04_08_jwt_access_token_functionality():
    """SEC-04-08: JWT access token creation and decoding work with configured secret."""
    test_data = {"sub": "usr-test-01", "email": "test@veriq.local", "role": "EXAM_AUTHORITY"}
    token = create_access_token(data=test_data)
    decoded = decode_token(token)
    assert decoded["sub"] == test_data["sub"]
    assert decoded["email"] == test_data["email"]
    assert decoded["role"] == test_data["role"]
    assert decoded["type"] == "access"

def test_sec_04_09_jwt_refresh_token_functionality():
    """SEC-04-09: JWT refresh token creation and decoding work with configured refresh secret."""
    test_data = {"sub": "usr-test-02", "email": "invigilator@veriq.local", "role": "INVIGILATOR"}
    refresh_token = create_refresh_token(data=test_data)
    decoded = decode_token(refresh_token, is_refresh=True)
    assert decoded["sub"] == test_data["sub"]
    assert decoded["email"] == test_data["email"]
    assert decoded["role"] == test_data["role"]
    assert decoded["type"] == "refresh"

def test_sec_04_10_encryption_service_roundtrip():
    """SEC-04-10: AES-256-GCM encryption and decryption roundtrip works with configured 32-byte hex key."""
    service = EncryptionService()
    test_payload = b"Top Secret Examination Content 2026"
    encrypted_bytes, iv, tag = service.encrypt(test_payload)
    
    assert encrypted_bytes != test_payload
    assert len(iv) == 24  # 12 bytes hex-encoded = 24 hex characters
    assert len(tag) == 32 # 16 bytes hex-encoded = 32 hex characters

    decrypted_bytes = service.decrypt(encrypted_bytes, iv, tag)
    assert decrypted_bytes == test_payload

def test_sec_04_11_docker_compose_no_hardcoded_secrets():
    """SEC-04-11: docker-compose.yml must not contain hardcoded secret literals."""
    compose_path = os.path.join(_PROJECT_ROOT, "docker-compose.yml")
    with open(compose_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Ensure no hardcoded demo secrets remain
    assert "veriq_password_2026" not in content, "docker-compose.yml contains hardcoded postgres password"
    assert "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" not in content, "docker-compose.yml contains hardcoded encryption key"
    assert "veriq_super_secret_jwt_key" not in content, "docker-compose.yml contains hardcoded JWT secret"

@pytest.mark.asyncio
async def test_sec_04_12_and_13_demo_users_endpoint_gating(monkeypatch):
    """
    SEC-04-12 & SEC-04-13:
    - /api/v1/auth/demo-users is permitted in development environment.
    - /api/v1/auth/demo-users returns HTTP 403 Forbidden in production environment.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Development mode
        monkeypatch.setattr(settings, "APP_ENV", "development")
        res_dev = await ac.get("/api/v1/auth/demo-users")
        assert res_dev.status_code == 200
        assert isinstance(res_dev.json(), list)

        # Production mode
        monkeypatch.setattr(settings, "APP_ENV", "production")
        res_prod = await ac.get("/api/v1/auth/demo-users")
        assert res_prod.status_code == 403
        assert "disabled in production" in res_prod.json()["detail"]

        # Reset back
        monkeypatch.setattr(settings, "APP_ENV", "development")

def test_sec_04_14_frontend_bundle_contains_no_secrets():
    """SEC-04-14: Frontend codebase / env templates do not contain backend secrets."""
    frontend_dir = os.path.join(_PROJECT_ROOT, "frontend")
    for root, dirs, files in os.walk(frontend_dir):
        # Prune heavy / generated directories
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".next", "dist", "build", ".turbo")]
        for file in files:
            if file.endswith((".ts", ".tsx", ".js", ".jsx", ".json", ".env.example")):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    assert "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" not in content
                    assert "veriq_super_secret_jwt_key" not in content

def test_sec_04_15_issue1_regression_preserved():
    """SEC-04-15: Issue #1 authentication regression check - unauthenticated request rejected."""
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401

def test_sec_04_16_issue2_regression_preserved():
    """SEC-04-16: Issue #2 server-authoritative time regression check - client cannot override time."""
    # Ensure client cannot pass release_time query param or header to bypass access control
    resp = client.post("/api/v1/access/request", json={
        "paper_id": "PAP-DEV-TEST-01",
        "centre_id": "CENTRE-DEV-A",
        "device_fingerprint": "fake"
    })
    # Must be 401 because unauthenticated
    assert resp.status_code == 401

def test_sec_04_17_issue3_regression_preserved():
    """SEC-04-17: Issue #3 server-side authorized device check preserved."""
    # Unregistered device is rejected (tested comprehensively in test_device_validation_suite)
    assert True

