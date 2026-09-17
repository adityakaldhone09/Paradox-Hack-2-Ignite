import pytest
from datetime import timedelta
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import create_access_token

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.mark.asyncio
async def test_unauthenticated_request_rejected():
    """Verify backend authentication bypass is completely removed: unauthenticated calls return 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Protected papers endpoint
        res = await client.get("/api/v1/papers")
        assert res.status_code == 401
        data = res.json()
        assert "detail" in data
        assert "credentials were not provided" in data["detail"]

        # 2. Protected access request endpoint
        res = await client.post("/api/v1/access/request", json={
            "paper_id": "PAP-2026-MATH301",
            "centre_id": "C101",
            "device_fingerprint": "fake_fingerprint"
        })
        assert res.status_code == 401

        # 3. Protected exams endpoint
        res = await client.get("/api/v1/exams")
        assert res.status_code == 401

@pytest.mark.asyncio
async def test_invalid_and_expired_tokens_rejected():
    """Verify invalid or expired tokens are rejected with 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Corrupt token
        headers = {"Authorization": "Bearer totally_invalid_bogus_token"}
        res = await client.get("/api/v1/papers", headers=headers)
        assert res.status_code == 401
        assert "Invalid or expired token" in res.json()["detail"]

        # Expired token
        expired_token = create_access_token(
            {"sub": "user_expired", "email": "admin@veriq.local", "role": "SUPER_ADMIN"},
            expires_delta=timedelta(seconds=-300)
        )
        headers = {"Authorization": f"Bearer {expired_token}"}
        res = await client.get("/api/v1/papers", headers=headers)
        assert res.status_code == 401
        assert "Invalid or expired token" in res.json()["detail"]

@pytest.mark.asyncio
async def test_client_time_override_forbidden():
    """Verify client cannot supply override_time parameter to bypass time-lock release."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Login as super admin to get valid token
        login_res = await client.post("/api/v1/auth/login", json={
            "email": "admin@veriq.local",
            "password": "password123"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Attempt to pass override_time (which was previously accepted)
        payload = {
            "paper_id": "PAP-2026-MATH301",
            "centre_id": "C101",
            "device_fingerprint": "0123456789abcdef",
            "override_time": "2026-09-20T10:05:00"
        }
        res = await client.post("/api/v1/access/request", json=payload, headers=headers)
        # Extra fields are strictly forbidden
        assert res.status_code == 422
        errors = res.json()
        assert any(
            "override_time" in str(err) or "extra_forbidden" in str(err)
            for err in errors.get("details", [])
        )

@pytest.mark.asyncio
async def test_unregistered_device_fingerprint_blocked():
    """Verify unauthorized device fingerprints are denied and trigger security incident logging."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Login as super admin
        login_res = await client.post("/api/v1/auth/login", json={
            "email": "admin@veriq.local",
            "password": "password123"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Query papers to find one with an assigned centre
        papers_res = await client.get("/api/v1/papers", headers=headers)
        assert papers_res.status_code == 200
        papers = papers_res.json()
        assert len(papers) > 0

        paper = next((p for p in papers if p.get("assigned_centres")), None)
        assert paper is not None, "At least one paper should have assigned centres"
        target_centre_id = paper["assigned_centres"][0]

        # Send access request with rogue device fingerprint
        rogue_fingerprint = "ROGUE_UNREGISTERED_HARDWARE_TERMINAL_FINGERPRINT_X99"
        access_res = await client.post("/api/v1/access/request", json={
            "paper_id": paper["id"],
            "centre_id": target_centre_id,
            "device_fingerprint": rogue_fingerprint
        }, headers=headers)

        assert access_res.status_code == 200
        body = access_res.json()
        assert body["allowed"] is False
        assert body["reason"] == "DEVICE_MISMATCH"
        assert "not registered or authorized" in body["message"]

        # Check incidents endpoint to verify SOC incident was generated
        incidents_res = await client.get("/api/v1/incidents", headers=headers)
        assert incidents_res.status_code == 200
        incidents = incidents_res.json()
        device_incidents = [i for i in incidents if i.get("type") == "DEVICE_MISMATCH"]
        assert len(device_incidents) > 0
        assert device_incidents[0]["severity"] == "CRITICAL"

@pytest.mark.asyncio
async def test_role_based_access_control():
    """Verify strict role-based boundary enforcement (invigilators cannot approve papers or create exams)."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Login as invigilator
        login_res = await client.post("/api/v1/auth/login", json={
            "email": "invigilator@veriq.local",
            "password": "password123"
        })
        assert login_res.status_code == 200
        invigilator_token = login_res.json()["access_token"]
        invig_headers = {"Authorization": f"Bearer {invigilator_token}"}

        # Attempt to approve a paper (requires EXAM_AUTHORITY or SUPER_ADMIN)
        approve_res = await client.post("/api/v1/papers/dummy-paper-id/approve", headers=invig_headers)
        assert approve_res.status_code == 403
        assert "does not have sufficient permissions" in approve_res.json()["detail"]

        # Attempt to create an exam (requires EXAM_AUTHORITY or SUPER_ADMIN)
        exam_res = await client.post("/api/v1/exams", json={
            "name": "Unauthorized Exam",
            "exam_id": "EXAM-UNAUTH-01",
            "department": "Security",
            "subject": "Penetration Testing",
            "exam_type": "FINAL",
            "exam_date": "2026-09-30",
            "start_time": "10:00:00",
            "end_time": "13:00:00",
            "security_level": "HIGH"
        }, headers=invig_headers)
        assert exam_res.status_code == 403
        assert "does not have sufficient permissions" in exam_res.json()["detail"]

        # Verify Super Admin can access endpoints
        admin_login = await client.post("/api/v1/auth/login", json={
            "email": "admin@veriq.local",
            "password": "password123"
        })
        admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}
        papers_res = await client.get("/api/v1/papers", headers=admin_headers)
        assert papers_res.status_code == 200
