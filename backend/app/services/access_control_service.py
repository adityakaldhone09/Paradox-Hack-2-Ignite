from datetime import datetime, timezone
from typing import Optional, Tuple, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.entities import Paper, Centre, AuthorizedDevice, PaperCentreAssignment, User

class AccessControlService:
    @staticmethod
    async def evaluate_access(
        db: AsyncSession,
        paper: Paper,
        user: User,
        centre_id: str,
        device_fingerprint: str,
        current_time: Optional[datetime] = None
    ) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """
        Evaluates multi-factor access rules:
        User Role + Assigned Centre + Authorized Device + Time Window + Paper Active Status
        """
        now = current_time or datetime.now(timezone.utc)

        # 1. Check Paper Status
        if paper.status == "REVOKED":
            return False, "PAPER_REVOKED", {"message": f"Examination paper {paper.paper_id} has been revoked: {paper.revocation_reason}"}

        # 2. Check User Role authorization
        allowed_roles = ["SUPER_ADMIN", "EXAM_AUTHORITY", "CENTRE_ADMIN", "INVIGILATOR"]
        if user.role not in allowed_roles:
            return False, "ROLE_INSUFFICIENT", {"message": f"User role {user.role} is not permitted to access active question papers"}

        # 3. Check Centre Assignment
        query = select(PaperCentreAssignment).where(
            PaperCentreAssignment.paper_id == paper.id,
            PaperCentreAssignment.centre_id == centre_id
        )
        res = await db.execute(query)
        assignment = res.scalars().first()
        if not assignment:
            return False, "UNAUTHORIZED_CENTRE", {"message": f"Centre {centre_id} is not authorized for paper {paper.paper_id}"}

        # 4. Check Authorized Device
        dev_query = select(AuthorizedDevice).where(
            AuthorizedDevice.centre_id == centre_id,
            AuthorizedDevice.device_fingerprint == device_fingerprint,
            AuthorizedDevice.status == "AUTHORIZED"
        )
        dev_res = await db.execute(dev_query)
        device = dev_res.scalars().first()
        if not device:
            return False, "DEVICE_MISMATCH", {"message": f"Device with fingerprint {device_fingerprint[:12]}... is not registered or authorized at centre {centre_id}"}

        # 5. Check Time Window (Time-Locked Release)
        # Standardize all datetimes to naive UTC to prevent timezone comparison issues
        window_start = assignment.release_window_start.replace(tzinfo=None) if assignment.release_window_start else None
        window_end = assignment.release_window_end.replace(tzinfo=None) if assignment.release_window_end else None
        now_naive = now.replace(tzinfo=None) if now else datetime.now(timezone.utc).replace(tzinfo=None)

        if window_start and now_naive < window_start:
            time_diff = int((window_start - now_naive).total_seconds())
            return False, "RELEASE_WINDOW_NOT_STARTED", {
                "message": "Access blocked: release window has not started.",
                "scheduled_release": window_start.isoformat(),
                "current_server_time": now_naive.isoformat(),
                "seconds_remaining": time_diff,
                "device_id": device.device_id
            }

        if window_end and now_naive > window_end:
            return False, "RELEASE_WINDOW_EXPIRED", {
                "message": "Access blocked: examination release window has expired.",
                "window_end": window_end.isoformat(),
                "current_server_time": now_naive.isoformat(),
                "device_id": device.device_id
            }

        # Update last seen timestamp on device
        device.last_seen = now_naive

        # All checks passed!
        return True, "AUTHORIZED", {
            "message": "Access authorized: credentials, device, centre, and time-lock verified.",
            "device_id": device.device_id,
            "device_name": device.device_name,
            "centre_id": centre_id
        }

access_control_service = AccessControlService()
