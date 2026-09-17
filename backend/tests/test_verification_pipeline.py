import uuid
import pytest
from fastapi import HTTPException
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.entities import Paper, User
from app.services.verification_service import verification_service
from app.services.encryption_service import encryption_service
from app.core.security import sign_data, verify_signature

@pytest.mark.asyncio
async def test_verification_happy_path():
    """Verify standard authentic paper verifies successfully with genuine AES-GCM and SHA-256."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()
        assert admin is not None

        result = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-DBMS-01",
            actor=admin,
            db=session,
            simulate_tamper=False
        )

        assert result["verified"] is True
        assert result["status"] == "VERIFIED"
        assert result["paper_id"] == "PAP-DBMS-01"
        assert result["algorithm"] == "AES-256-GCM"
        assert len(result["sha256_digest"]) == 64
        assert len(result["blockchain_anchor"]) == 64
        assert result["sha256_digest"] == result["blockchain_anchor"]
        assert result["signature_verified"] is True
        assert "verified successfully" in result["message"].lower()

@pytest.mark.asyncio
async def test_tamper_simulation_controlled():
    """Verify controlled 1-byte tamper simulation correctly flags TAMPER_DETECTED."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()

        result = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-DBMS-01",
            actor=admin,
            db=session,
            simulate_tamper=True
        )

        assert result["verified"] is False
        assert result["status"] == "TAMPER_DETECTED"
        assert result["tamper_simulated"] is True
        assert result["sha256_digest"] != result["blockchain_anchor"]
        assert "tamper" in result["message"].lower()

@pytest.mark.asyncio
async def test_missing_storage_artifact():
    """Verify missing storage artifact raises appropriate error."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()
        valid_paper = (await session.execute(select(Paper).where(Paper.paper_id == "PAP-DBMS-01"))).scalars().first()

        unique_id = f"test-missing-{uuid.uuid4().hex[:8]}"
        missing_paper = Paper(
            id=unique_id,
            paper_id=f"PAP-MISSING-{uuid.uuid4().hex[:6]}",
            exam_id=valid_paper.exam_id,
            title="Missing Test",
            file_name="missing.pdf",
            sha256_hash="0" * 64,
            storage_bucket="encrypted_papers",
            storage_object_path="encrypted_papers/non_existent.enc",
            encrypted_file_path="/tmp/definitely_non_existent_artifact_file.enc",
            encryption_iv="0" * 24,
            encryption_tag="0" * 32,
            created_by=admin.email
        )
        try:
            session.add(missing_paper)
            await session.flush()

            with pytest.raises(HTTPException) as exc_info:
                await verification_service.verify_paper_integrity(
                    paper_identifier=missing_paper.paper_id,
                    actor=admin,
                    db=session,
                    simulate_tamper=False
                )
            assert exc_info.value.status_code in [404, 422]
            assert "storage" in exc_info.value.detail.lower()
        finally:
            await session.rollback()

@pytest.mark.asyncio
async def test_decryption_failed_on_invalid_tag():
    """Verify invalid AEAD authentication tag triggers DECRYPTION_FAILED status."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()
        valid_paper = (await session.execute(select(Paper).where(Paper.paper_id == "PAP-DBMS-01"))).scalars().first()

        unique_id = f"test-badtag-{uuid.uuid4().hex[:8]}"
        bad_tag_paper = Paper(
            id=unique_id,
            paper_id=f"PAP-BADTAG-{uuid.uuid4().hex[:6]}",
            exam_id=valid_paper.exam_id,
            title="Bad Tag Test",
            file_name="bad_tag.pdf",
            sha256_hash=valid_paper.sha256_hash,
            storage_bucket="encrypted_papers",
            storage_object_path=valid_paper.storage_object_path,
            encrypted_file_path=valid_paper.encrypted_file_path,
            encryption_iv=valid_paper.encryption_iv,
            encryption_tag="f" * 32,
            created_by=admin.email
        )
        try:
            session.add(bad_tag_paper)
            await session.flush()

            res = await verification_service.verify_paper_integrity(
                paper_identifier=bad_tag_paper.paper_id,
                actor=admin,
                db=session,
                simulate_tamper=False
            )
            assert res["verified"] is False
            assert res["status"] == "DECRYPTION_FAILED"
            assert "AES-GCM authentication failed" in res["message"]
        finally:
            await session.rollback()

@pytest.mark.asyncio
async def test_hash_mismatch_detection():
    """Verify altered candidate hash triggers HASH_MISMATCH status."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()

        res = await verification_service.verify_paper_integrity(
            paper_identifier="PAP-DBMS-01",
            actor=admin,
            db=session,
            simulate_tamper=False,
            candidate_hash="0" * 64
        )
        assert res["verified"] is False
        assert res["status"] == "HASH_MISMATCH"

@pytest.mark.asyncio
async def test_digital_signature_verification():
    """Verify digital signature helper and verification pipeline."""
    payload = "PAP-DBMS-01:e4879af65605f0364c55119d4a93c804b231334cfd69dd4949501ddba00d26f0"
    valid_sig = sign_data(payload)
    assert verify_signature(payload, valid_sig) is True
    assert verify_signature(payload, "invalid_sig_hex_123") is False

@pytest.mark.asyncio
async def test_role_based_authorization_matrix():
    """Verify cross-role authorization: Super Admin, Paper Setter, Centre Admin, Invigilator."""
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == "admin@veriq.local"))).scalars().first()
        setter = (await session.execute(select(User).where(User.email == "setter@veriq.local"))).scalars().first()
        centre_admin = (await session.execute(select(User).where(User.email == "centre@veriq.local"))).scalars().first()
        invigilator = (await session.execute(select(User).where(User.email == "invigilator@veriq.local"))).scalars().first()

        # 1. Super Admin can verify any paper
        res_admin = await verification_service.verify_paper_integrity("PAP-DBMS-01", admin, session)
        assert res_admin["verified"] is True

        # 2. Paper Setter can verify paper they created
        res_setter = await verification_service.verify_paper_integrity("PAP-DBMS-01", setter, session)
        assert res_setter["verified"] is True

        # 3. Centre Admin (C101) can verify paper assigned to C101
        res_centre = await verification_service.verify_paper_integrity("PAP-DBMS-01", centre_admin, session)
        assert res_centre["verified"] is True

        # 4. Invigilator (C101) can verify paper assigned to C101
        res_invig = await verification_service.verify_paper_integrity("PAP-DBMS-01", invigilator, session)
        assert res_invig["verified"] is True

        # 5. Unauthorized role
        unauthorized_user = User(
            email=f"visitor-{uuid.uuid4().hex[:6]}@other.local",
            name="Visitor",
            hashed_password="...",
            role="STUDENT",
            is_active=True
        )
        with pytest.raises(HTTPException) as exc_info:
            await verification_service.verify_paper_integrity("PAP-DBMS-01", unauthorized_user, session)
        assert exc_info.value.status_code == 403

@pytest.mark.asyncio
async def test_verification_diagnostics():
    """Verify diagnostics endpoint returns complete inspection report without leaking secrets."""
    async with AsyncSessionLocal() as session:
        diag = await verification_service.get_diagnostics("PAP-DBMS-01", session)
        assert diag["paper_id"] == "PAP-DBMS-01"
        assert diag["storage"]["artifact_exists_on_disk"] is True
