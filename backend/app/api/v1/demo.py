import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.entities import Paper, Centre, Incident, BlockchainTransaction, AccessEvent, User
from app.schemas.schemas import SimulateEventRequest
from app.services.blockchain_service import blockchain_service
from app.services.anomaly_service import anomaly_service

router = APIRouter(prefix="/demo", tags=["Hackathon Demo Simulation"])

@router.post("/simulate")
async def simulate_security_event(req: SimulateEventRequest, db: AsyncSession = Depends(get_db)):
    # Fetch demo paper and centre
    paper = (await db.execute(select(Paper).order_by(Paper.created_at.asc()))).scalars().first()
    centre = (await db.execute(select(Centre).order_by(Centre.created_at.asc()))).scalars().first()
    demo_user = (await db.execute(select(User).where(User.email == "centre@veriq.local"))).scalars().first()

    if not paper or not centre:
        raise HTTPException(status_code=400, detail="Seed demo data must be loaded before running simulations")

    evt_type = req.event_type.upper()
    now = datetime.now(timezone.utc)
    incident_id = f"INC-{uuid.uuid4().hex[:8].upper()}"

    if evt_type == "EARLY_ACCESS":
        description = f"Early access attempt blocked: Examination paper {paper.paper_id} accessed 24 minutes prior to scheduled release window."
        inc_type = "EARLY_ACCESS"
        severity = "HIGH"
        reason = "RELEASE_WINDOW_NOT_STARTED"
    elif evt_type == "UNAUTHORIZED_CENTRE":
        description = f"Unauthorized centre access attempt: Centre C104 attempted access to paper {paper.paper_id} without administrative assignment."
        inc_type = "UNAUTHORIZED_ACCESS"
        severity = "HIGH"
        reason = "UNAUTHORIZED_CENTRE"
    elif evt_type == "DEVICE_MISMATCH":
        description = f"Hardware fingerprint mismatch: Unknown terminal device 'DEV-ROGUE-992' requested decrypt key for {paper.paper_id}."
        inc_type = "DEVICE_MISMATCH"
        severity = "CRITICAL"
        reason = "DEVICE_MISMATCH"
    elif evt_type == "DOCUMENT_TAMPERING":
        description = f"CRITICAL: Integrity proof failure! Document bytes do not match blockchain SHA-256 anchor {paper.sha256_hash[:16]}... Possible paper leak or modification."
        inc_type = "HASH_MISMATCH"
        severity = "CRITICAL"
        reason = "DOCUMENT_TAMPERED"
    elif evt_type == "SUSPICIOUS_ACTIVITY":
        risk = anomaly_service.assess_risk(
            denial_reason="HIGH_FREQUENCY_ACCESS",
            attempt_count_last_5min=7,
            is_off_hours=True
        )
        description = f"AI Anomaly Alert: Rapid access burst (7 attempts in 60s) detected from abnormal IP 198.51.100.44 during non-exam hours."
        inc_type = "SUSPICIOUS_ACTIVITY"
        severity = risk["risk_level"]
        reason = "ANOMALY_BURST_DETECTED"
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported event simulation type: {evt_type}")

    # 1. Record Blockchain Event
    bc_tx = await blockchain_service.record_transaction(
        event_type="INCIDENT_CREATED",
        paper_id=paper.id,
        actor_id="demo-simulator@veriq.local",
        centre_id=centre.id,
        device_id="SIMULATED-DEV",
        payload_data={
            "incident_id": incident_id,
            "type": inc_type,
            "severity": severity,
            "reason": reason,
            "description": description
        }
    )

    # 2. Record Blockchain Transaction in DB
    db_tx = BlockchainTransaction(
        tx_hash=bc_tx["tx_hash"],
        block_number=bc_tx["block_number"],
        event_type="INCIDENT_CREATED",
        paper_id=paper.id,
        actor_id="demo-simulator@veriq.local",
        centre_id=centre.id,
        device_id="SIMULATED-DEV",
        payload_hash=bc_tx["payload_hash"],
        previous_hash=bc_tx["previous_hash"],
        signature=bc_tx["signature"],
        timestamp=datetime.fromisoformat(bc_tx["timestamp"]),
        status="CONFIRMED"
    )
    db.add(db_tx)

    # 3. Create Incident Record in DB
    incident = Incident(
        incident_id=incident_id,
        type=inc_type,
        severity=severity,
        paper_id=paper.id,
        centre_id=centre.id,
        user_id=demo_user.id if demo_user else None,
        device_id="SIMULATED-DEV",
        timestamp=now,
        description=description,
        status="OPEN",
        tx_hash=bc_tx["tx_hash"]
    )
    db.add(incident)

    # 4. Create AccessEvent record if applicable
    access_evt = AccessEvent(
        paper_id=paper.id,
        centre_id=centre.id,
        user_id=demo_user.id if demo_user else None,
        device_id="SIMULATED-DEV",
        timestamp=now,
        action="REQUEST_ACCESS",
        allowed=False,
        denial_reason=reason,
        tx_hash=bc_tx["tx_hash"]
    )
    db.add(access_evt)

    await db.commit()

    return {
        "simulation_event": evt_type,
        "incident_id": incident_id,
        "type": inc_type,
        "severity": severity,
        "description": description,
        "reason": reason,
        "blockchain_tx_hash": bc_tx["tx_hash"],
        "block_number": bc_tx["block_number"],
        "timestamp": now.isoformat(),
        "toast_message": f"🚨 Security Event Triggered: {inc_type} recorded on blockchain ledger!"
    }
