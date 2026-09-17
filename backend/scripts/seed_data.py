import asyncio
import os
import sys
from datetime import datetime, timedelta, timezone

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import get_password_hash, sign_data
from app.db.session import engine, AsyncSessionLocal, Base
from app.models.entities import (
    User, Examination, Paper, Centre, AuthorizedDevice,
    PaperCentreAssignment, AccessEvent, BlockchainTransaction, Incident
)
from app.services.hashing_service import hashing_service
from app.services.encryption_service import encryption_service
from app.services.blockchain_service import blockchain_service

async def seed():
    print("🌱 Initializing VeriQ Database Schema & Seeding Data...")

    # Ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        default_pwd = get_password_hash("password123")
        now = datetime.now(timezone.utc).replace(tzinfo=None)

        # -------------------------------------------------------------
        # 1. Seed Centres (10 Centres)
        # -------------------------------------------------------------
        centres_data = [
            ("C101", "Apex Institute of Technology", "Mumbai", "Maharashtra", "MH-AIT-01"),
            ("C102", "National Engineering Academy", "Pune", "Maharashtra", "MH-NEA-02"),
            ("C103", "CyberTech Regional Centre", "Bengaluru", "Karnataka", "KA-CTR-03"),
            ("C104", "Horizon Polytechnic Centre", "Delhi", "Delhi NCR", "DL-HPC-04"),
            ("C105", "Metro Certification Hub", "Hyderabad", "Telangana", "TG-MCH-05"),
            ("C106", "Royal Science Examination Hall", "Chennai", "Tamil Nadu", "TN-RSE-06"),
            ("C107", "Frontier Testing Agency", "Kolkata", "West Bengal", "WB-FTA-07"),
            ("C108", "Central Testing Facility", "Ahmedabad", "Gujarat", "GJ-CTF-08"),
            ("C109", "Silver Oak Institute", "Chandigarh", "Punjab", "PB-SOI-09"),
            ("C110", "Quantum Polytechnic", "Jaipur", "Rajasthan", "RJ-QP-10"),
        ]
        
        centre_objs = {}
        for c_id, name, city, state, code in centres_data:
            c = Centre(centre_id=c_id, name=name, city=city, state=state, code=code, is_authorized=True, status="ACTIVE")
            session.add(c)
            centre_objs[c_id] = c

        await session.flush()

        # -------------------------------------------------------------
        # 2. Seed Authorized Devices for Centres
        # -------------------------------------------------------------
        device_objs = {}
        for c_id, c in centre_objs.items():
            for d_idx in range(1, 3):
                dev_id = f"DEV-{c_id}-0{d_idx}"
                fingerprint = hashing_service.calculate_sha256(f"HARDWARE_SERIAL_{dev_id}_SECURE_TPM")
                dev = AuthorizedDevice(
                    device_id=dev_id,
                    device_fingerprint=fingerprint,
                    centre_id=c.id,
                    device_name=f"{c.name} Secure Terminal {d_idx}",
                    os="Windows 11 Enterprise (Hardened)",
                    ip_address=f"192.168.{c_id[1:]}.{10 + d_idx}",
                    status="AUTHORIZED",
                    registered_at=now - timedelta(days=30),
                    last_seen=now - timedelta(minutes=5 * d_idx)
                )
                session.add(dev)
                device_objs[dev_id] = dev

        # -------------------------------------------------------------
        # 3. Seed Users (Strictly 4 Application Roles: SUPER_ADMIN, PAPER_SETTER, CENTRE_ADMIN, INVIGILATOR)
        # -------------------------------------------------------------
        users_data = [
            ("admin@veriq.local", "Dr. Rajesh Sharma", "SUPER_ADMIN", None),
            ("setter@veriq.local", "Prof. Ananya Sen", "PAPER_SETTER", None),
            ("centre@veriq.local", "Suresh Kulkarni", "CENTRE_ADMIN", centre_objs["C101"].id),
            ("invigilator@veriq.local", "Rohit Verma", "INVIGILATOR", centre_objs["C101"].id),
            # Additional users
            ("setter2@veriq.local", "Dr. Meenakshi Sundaram", "PAPER_SETTER", None),
            ("pune.admin@veriq.local", "Manish Patil", "CENTRE_ADMIN", centre_objs["C102"].id),
            ("pune.invig@veriq.local", "Deepak Joshi", "INVIGILATOR", centre_objs["C102"].id),
            ("blr.admin@veriq.local", "Arjun Reddy", "CENTRE_ADMIN", centre_objs["C103"].id),
            ("delhi.admin@veriq.local", "Neha Kapoor", "CENTRE_ADMIN", centre_objs["C104"].id),
            ("delhi.invig@veriq.local", "Vikram Malhotra", "INVIGILATOR", centre_objs["C104"].id),
            ("hyd.admin@veriq.local", "Kalyan Chakravarthy", "CENTRE_ADMIN", centre_objs["C105"].id),
            ("hyd.invig@veriq.local", "Priya Nair", "INVIGILATOR", centre_objs["C105"].id),
        ]

        user_objs = {}
        for email, name, role, c_id in users_data:
            u = User(email=email, name=name, hashed_password=default_pwd, role=role, centre_id=c_id, is_active=True)
            session.add(u)
            user_objs[email] = u

        await session.flush()

        # -------------------------------------------------------------
        # 4. Seed Examinations (5 Examinations)
        # -------------------------------------------------------------
        exams_data = [
            ("EXAM-CS301", "CSE Semester Examination", "Computer Science", "Database Management Systems", "FINAL", "2026-09-20", "10:00:00", "13:00:00", "HIGH"),
            ("EXAM-MATH301", "Engineering Mathematics III", "Mathematics", "Discrete Mathematical Structures", "MID_TERM", "2026-09-22", "09:30:00", "12:30:00", "STANDARD"),
            ("EXAM-PHY201", "Applied Physics & Quantum Optics", "Applied Sciences", "Quantum Mechanics & Semiconductor Physics", "FINAL", "2026-09-24", "14:00:00", "17:00:00", "HIGH"),
            ("EXAM-SEC401", "Cyber Security & Cryptographic Systems", "Information Security", "Applied Cryptography & Network Defense", "FINAL", "2026-09-26", "10:00:00", "13:00:00", "MAXIMUM_TOP_SECRET"),
            ("EXAM-AI501", "Artificial Intelligence & Distributed Systems", "AI & Robotics", "Reinforcement Learning & Neural Networks", "FINAL", "2026-09-28", "10:00:00", "13:00:00", "HIGH"),
        ]

        exam_objs = {}
        for code, name, dept, subj, e_type, e_date, s_time, e_time, sec_lvl in exams_data:
            ex = Examination(
                exam_id=code, name=name, department=dept, subject=subj,
                exam_type=e_type, exam_date=e_date, start_time=s_time, end_time=e_time,
                security_level=sec_lvl, status="SCHEDULED"
            )
            session.add(ex)
            exam_objs[code] = ex

        await session.flush()

        # -------------------------------------------------------------
        # 5. Seed Papers (10 Papers with real AES-256-GCM off-chain encryption)
        # -------------------------------------------------------------
        papers_config = [
            ("PAP-DBMS-01", "EXAM-CS301", "DBMS Question Paper Set A", "dbms_set_a.pdf", "APPROVED", -2, "setter@veriq.local"),
            ("PAP-DBMS-02", "EXAM-CS301", "DBMS Question Paper Set B", "dbms_set_b.pdf", "APPROVED", -2, "setter@veriq.local"),
            ("PAP-MATH-01", "EXAM-MATH301", "Engineering Mathematics III Regular", "math_paper_main.pdf", "RELEASE_SCHEDULED", -1, "admin@veriq.local"),
            ("PAP-MATH-02", "EXAM-MATH301", "Engineering Mathematics III Backlog", "math_paper_backlog.pdf", "DRAFT", 0, "setter@veriq.local"),
            ("PAP-PHY-01", "EXAM-PHY201", "Applied Physics Main Exam", "physics_main_2026.pdf", "APPROVED", -3, "setter2@veriq.local"),
            ("PAP-PHY-02", "EXAM-PHY201", "Applied Physics Alternate Set", "physics_alternate.pdf", "DRAFT", 0, "setter2@veriq.local"),
            ("PAP-SEC-01", "EXAM-SEC401", "Cyber Security Top Secret Standard Exam", "cybersec_topsecret.pdf", "RELEASE_SCHEDULED", 2, "admin@veriq.local"),
            ("PAP-SEC-02", "EXAM-SEC401", "Cyber Security Defense Lab Component", "cybersec_lab_questions.pdf", "APPROVED", -1, "admin@veriq.local"),
            ("PAP-AI-01", "EXAM-AI501", "AI & Deep Learning Final Theory", "ai_final_theory.pdf", "APPROVED", -1, "setter@veriq.local"),
            ("PAP-AI-02", "EXAM-AI501", "AI Legacy Paper Version 0.9", "ai_legacy_paper.pdf", "REVOKED", -10, "admin@veriq.local"),
        ]

        paper_objs = {}
        for p_code, ex_code, title, fname, status, rel_hour_offset, creator in papers_config:
            # Create synthetic PDF content
            raw_content = f"%PDF-1.4\n%VeriQ Secure Paper: {p_code}\nTitle: {title}\nExam: {ex_code}\nSecurity Watermark: CONFIDENTIAL QUESTION PAPER\nTimestamp: {now.isoformat()}\n%%EOF".encode()
            
            sha256 = hashing_service.calculate_file_hash(raw_content)
            ciphertext, iv, tag = encryption_service.encrypt(raw_content)
            
            storage_path = os.path.join(settings.STORAGE_DIR, f"{p_code}.enc")
            with open(storage_path, "wb") as f:
                f.write(ciphertext)

            rel_time = now + timedelta(hours=rel_hour_offset) if rel_hour_offset != 0 else now + timedelta(days=2)
            
            p = Paper(
                paper_id=p_code,
                exam_id=exam_objs[ex_code].id,
                title=title,
                file_name=fname,
                file_size=len(raw_content),
                sha256_hash=sha256,
                encrypted_file_path=storage_path,
                encryption_iv=iv,
                encryption_tag=tag,
                version="1.0" if status != "REVOKED" else "0.9",
                status=status,
                release_time=rel_time,
                created_by=creator,
                created_at=now - timedelta(days=5),
                approved_by="admin@veriq.local" if status in ["APPROVED", "RELEASE_SCHEDULED", "RELEASED", "REVOKED"] else None,
                approved_at=now - timedelta(days=4) if status in ["APPROVED", "RELEASE_SCHEDULED", "RELEASED", "REVOKED"] else None,
                digital_signature=sign_data(f"{p_code}:{sha256}") if status in ["APPROVED", "RELEASE_SCHEDULED", "RELEASED", "REVOKED"] else None,
                revocation_reason="Version superseded due to curriculum update" if status == "REVOKED" else None
            )
            session.add(p)
            paper_objs[p_code] = p

        await session.flush()

        # -------------------------------------------------------------
        # 6. Seed Paper Centre Assignments
        # -------------------------------------------------------------
        # Assign PAP-DBMS-01 to C101 and C102
        c101 = centre_objs["C101"]
        c102 = centre_objs["C102"]
        c103 = centre_objs["C103"]

        dbms_p1 = paper_objs["PAP-DBMS-01"]
        # Time window: 10 mins ago to 3 hours later
        a1 = PaperCentreAssignment(
            paper_id=dbms_p1.id,
            centre_id=c101.id,
            release_window_start=now - timedelta(minutes=15),
            release_window_end=now + timedelta(hours=3),
            status="ASSIGNED"
        )
        session.add(a1)

        # PAP-SEC-01 (Cyber Security): Scheduled for 2 hours in the future! (Ideal for Early Access testing)
        sec_p1 = paper_objs["PAP-SEC-01"]
        a2 = PaperCentreAssignment(
            paper_id=sec_p1.id,
            centre_id=c101.id,
            release_window_start=now + timedelta(hours=2),
            release_window_end=now + timedelta(hours=5),
            status="ASSIGNED"
        )
        session.add(a2)

        # Assign remaining papers across centres
        for idx, (p_code, p_obj) in enumerate(paper_objs.items()):
            c_target = list(centre_objs.values())[idx % len(centre_objs)]
            if p_obj.id not in [dbms_p1.id, sec_p1.id]:
                assign = PaperCentreAssignment(
                    paper_id=p_obj.id,
                    centre_id=c_target.id,
                    release_window_start=now + timedelta(hours=1 + idx),
                    release_window_end=now + timedelta(hours=4 + idx),
                    status="ASSIGNED"
                )
                session.add(assign)

        await session.flush()

        # -------------------------------------------------------------
        # 7. Seed Blockchain Transactions & Chain of Custody
        # -------------------------------------------------------------
        for p_code, p_obj in paper_objs.items():
            # 1. PAPER_CREATED
            tx_create = await blockchain_service.record_transaction(
                event_type="PAPER_CREATED",
                paper_id=p_obj.id,
                actor_id=p_obj.created_by,
                payload_data={
                    "paper_id": p_code,
                    "title": p_obj.title,
                    "sha256_hash": p_obj.sha256_hash,
                    "algorithm": "AES-256-GCM"
                }
            )
            db_tx1 = BlockchainTransaction(
                tx_hash=tx_create["tx_hash"],
                block_number=tx_create["block_number"],
                event_type="PAPER_CREATED",
                paper_id=p_obj.id,
                actor_id=p_obj.created_by,
                payload_hash=tx_create["payload_hash"],
                previous_hash=tx_create["previous_hash"],
                signature=tx_create["signature"],
                timestamp=p_obj.created_at,
                status="CONFIRMED"
            )
            session.add(db_tx1)

            # 2. PAPER_APPROVED (if approved)
            if p_obj.approved_by:
                tx_app = await blockchain_service.record_transaction(
                    event_type="PAPER_APPROVED",
                    paper_id=p_obj.id,
                    actor_id=p_obj.approved_by,
                    payload_data={
                        "paper_id": p_code,
                        "approved_by": p_obj.approved_by,
                        "signature": p_obj.digital_signature
                    }
                )
                db_tx2 = BlockchainTransaction(
                    tx_hash=tx_app["tx_hash"],
                    block_number=tx_app["block_number"],
                    event_type="PAPER_APPROVED",
                    paper_id=p_obj.id,
                    actor_id=p_obj.approved_by,
                    payload_hash=tx_app["payload_hash"],
                    previous_hash=tx_app["previous_hash"],
                    signature=tx_app["signature"],
                    timestamp=p_obj.approved_at or now,
                    status="CONFIRMED"
                )
                session.add(db_tx2)

        await session.flush()

        # -------------------------------------------------------------
        # 8. Seed Realistic Incidents & Access Events
        # -------------------------------------------------------------
        # Incident 1: Early Access Attempt
        inc1 = Incident(
            incident_id="INC-2026-0811",
            type="EARLY_ACCESS",
            severity="HIGH",
            paper_id=sec_p1.id,
            centre_id=c101.id,
            user_id=user_objs["invigilator@veriq.local"].id,
            device_id="DEV-C101-01",
            timestamp=now - timedelta(minutes=45),
            description=f"Early access attempt blocked: Terminal DEV-C101-01 attempted access to {sec_p1.paper_id} before release window.",
            status="ACKNOWLEDGED",
            tx_hash="0x" + hashing_service.calculate_sha256("INCIDENT_EARLY_ACCESS_BLOCK_01")
        )
        session.add(inc1)

        # Incident 2: Hardware Device Mismatch
        inc2 = Incident(
            incident_id="INC-2026-0924",
            type="DEVICE_MISMATCH",
            severity="CRITICAL",
            paper_id=dbms_p1.id,
            centre_id=c102.id,
            user_id=user_objs["pune.invig@veriq.local"].id,
            device_id="DEV-ROGUE-TERMINAL",
            timestamp=now - timedelta(hours=2),
            description="Hardware fingerprint mismatch: Unregistered device DEV-ROGUE-TERMINAL attempted decryption of CSE Semester paper.",
            status="INVESTIGATING",
            tx_hash="0x" + hashing_service.calculate_sha256("INCIDENT_DEVICE_MISMATCH_02")
        )
        session.add(inc2)

        # Access events
        acc1 = AccessEvent(
            paper_id=dbms_p1.id,
            centre_id=c101.id,
            user_id=user_objs["centre@veriq.local"].id,
            device_id="DEV-C101-01",
            timestamp=now - timedelta(minutes=10),
            action="REQUEST_ACCESS",
            allowed=True,
            tx_hash="0x" + hashing_service.calculate_sha256("ACCESS_EVENT_SUCCESS_01")
        )
        session.add(acc1)

        acc2 = AccessEvent(
            paper_id=sec_p1.id,
            centre_id=c101.id,
            user_id=user_objs["invigilator@veriq.local"].id,
            device_id="DEV-C101-01",
            timestamp=now - timedelta(minutes=45),
            action="REQUEST_ACCESS",
            allowed=False,
            denial_reason="RELEASE_WINDOW_NOT_STARTED",
            tx_hash=inc1.tx_hash
        )
        session.add(acc2)

        await session.commit()
        print("✅ VeriQ Database successfully seeded with 5 Exams, 10 Centres, 15 Users, 10 Papers, and Blockchain Proofs!")

if __name__ == "__main__":
    asyncio.run(seed())
