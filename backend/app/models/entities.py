import uuid
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, DateTime, Integer, Text, ForeignKey, Table, Enum
)
from sqlalchemy.orm import relationship, validates
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

def normalize_utc_datetime(val):
    if val is None:
        return None
    if isinstance(val, str):
        try:
            val = datetime.fromisoformat(val.replace("Z", "+00:00"))
        except Exception:
            return utc_now()
    if isinstance(val, datetime):
        return val.astimezone(timezone.utc).replace(tzinfo=None) if val.tzinfo else val
    return val

def to_naive_utc(dt: Optional[datetime]) -> Optional[datetime]:
    if dt is None:
        return None
    return dt.replace(tzinfo=None) if dt.tzinfo else dt

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # SUPER_ADMIN, EXAM_AUTHORITY, etc.
    centre_id = Column(String(36), ForeignKey("centres.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    centre = relationship("Centre", back_populates="users")
    access_events = relationship("AccessEvent", back_populates="user")
    incidents = relationship("Incident", back_populates="user")

class Examination(Base):
    __tablename__ = "examinations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    exam_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. EXAM-2026-CS301
    name = Column(String(255), nullable=False)
    department = Column(String(100), nullable=False)
    subject = Column(String(100), nullable=False)
    exam_type = Column(String(50), default="FINAL")
    exam_date = Column(String(50), nullable=False) # YYYY-MM-DD
    start_time = Column(String(50), nullable=False) # HH:MM:SS
    end_time = Column(String(50), nullable=False)
    security_level = Column(String(50), default="HIGH")
    status = Column(String(50), default="SCHEDULED") # SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=utc_now)

    papers = relationship("Paper", back_populates="examination", cascade="all, delete-orphan")

class Paper(Base):
    __tablename__ = "papers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    paper_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. PAP-DBMS-2026
    exam_id = Column(String(36), ForeignKey("examinations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, default=0)
    sha256_hash = Column(String(64), nullable=False, index=True)
    storage_bucket = Column(String(100), default="encrypted_papers", nullable=True)
    storage_object_path = Column(String(500), nullable=True)
    encrypted_file_path = Column(String(500), nullable=False)
    encryption_iv = Column(String(64), nullable=False)
    encryption_tag = Column(String(64), nullable=False)
    version = Column(String(20), default="1.0")
    status = Column(String(50), default="DRAFT", index=True) # DRAFT, APPROVED, ASSIGNED, RELEASED, REVOKED
    release_time = Column(DateTime, nullable=True, index=True) # Time-locked release timestamp
    created_by = Column(String(255), nullable=False, index=True)
    created_at = Column(DateTime, default=utc_now)
    approved_by = Column(String(255), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    digital_signature = Column(String(255), nullable=True)
    revocation_reason = Column(Text, nullable=True)

    examination = relationship("Examination", back_populates="papers")
    assignments = relationship("PaperCentreAssignment", back_populates="paper", cascade="all, delete-orphan")
    access_events = relationship("AccessEvent", back_populates="paper", cascade="all, delete-orphan")
    blockchain_transactions = relationship("BlockchainTransaction", back_populates="paper", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="paper")

    @validates("release_time", "created_at", "approved_at")
    def validate_paper_datetimes(self, key, value):
        return normalize_utc_datetime(value)

class Centre(Base):
    __tablename__ = "centres"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    centre_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. C101
    name = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, nullable=False) # Internal registration code
    is_authorized = Column(Boolean, default=True)
    status = Column(String(50), default="ACTIVE") # ACTIVE, FLAGGED, SUSPENDED
    created_at = Column(DateTime, default=utc_now)

    users = relationship("User", back_populates="centre")
    devices = relationship("AuthorizedDevice", back_populates="centre", cascade="all, delete-orphan")
    assignments = relationship("PaperCentreAssignment", back_populates="centre", cascade="all, delete-orphan")
    access_events = relationship("AccessEvent", back_populates="centre")
    incidents = relationship("Incident", back_populates="centre")

class AuthorizedDevice(Base):
    __tablename__ = "authorized_devices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    device_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. DEV-C101-01
    device_fingerprint = Column(String(128), unique=True, nullable=False) # SHA-256 of hardware traits
    centre_id = Column(String(36), ForeignKey("centres.id", ondelete="CASCADE"), nullable=False)
    device_name = Column(String(100), default="Exam Terminal")
    os = Column(String(50), default="Ubuntu 22.04 LTS")
    ip_address = Column(String(50), default="127.0.0.1")
    status = Column(String(50), default="ACTIVE") # ACTIVE, SUSPENDED, DECOMMISSIONED
    registered_at = Column(DateTime, default=utc_now)
    last_seen = Column(DateTime, default=utc_now)

    centre = relationship("Centre", back_populates="devices")

    @validates("registered_at", "last_seen")
    def validate_device_datetimes(self, key, value):
        return normalize_utc_datetime(value)

class PaperCentreAssignment(Base):
    __tablename__ = "paper_centre_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    centre_id = Column(String(36), ForeignKey("centres.id", ondelete="CASCADE"), nullable=False)
    release_window_start = Column(DateTime, nullable=False)
    release_window_end = Column(DateTime, nullable=False)
    status = Column(String(50), default="ASSIGNED") # ASSIGNED, READY, ACCESSED, CANCELLED
    created_at = Column(DateTime, default=utc_now)

    paper = relationship("Paper", back_populates="assignments")
    centre = relationship("Centre", back_populates="assignments")

    @validates("release_window_start", "release_window_end", "created_at")
    def validate_assignment_datetimes(self, key, value):
        return normalize_utc_datetime(value)

class AccessEvent(Base):
    __tablename__ = "access_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    centre_id = Column(String(36), ForeignKey("centres.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    device_id = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=utc_now)
    action = Column(String(50), default="REQUEST_ACCESS") # REQUEST_ACCESS, DECRYPT, VERIFY
    allowed = Column(Boolean, nullable=False)
    denial_reason = Column(String(100), nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    tx_hash = Column(String(66), nullable=True)

    paper = relationship("Paper", back_populates="access_events")
    centre = relationship("Centre", back_populates="access_events")
    user = relationship("User", back_populates="access_events")

    @validates("timestamp")
    def validate_timestamp(self, key, value):
        return normalize_utc_datetime(value)

class BlockchainTransaction(Base):
    __tablename__ = "blockchain_transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tx_hash = Column(String(66), unique=True, index=True, nullable=False)
    block_number = Column(Integer, nullable=False, index=True)
    event_type = Column(String(50), nullable=False)
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    actor_id = Column(String(255), nullable=False)
    centre_id = Column(String(36), nullable=True)
    device_id = Column(String(100), nullable=True)
    payload_hash = Column(String(128), nullable=False)
    previous_hash = Column(String(128), nullable=False)
    signature = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=utc_now)
    status = Column(String(50), default="CONFIRMED")
    raw_event_data = Column(Text, nullable=True)

    paper = relationship("Paper", back_populates="blockchain_transactions")

    @validates("timestamp")
    def validate_timestamp(self, key, value):
        return normalize_utc_datetime(value)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. INC-2026-8912
    type = Column(String(50), nullable=False) # EARLY_ACCESS, DEVICE_MISMATCH, HASH_MISMATCH, etc.
    severity = Column(String(50), default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="SET NULL"), nullable=True)
    centre_id = Column(String(36), ForeignKey("centres.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    device_id = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=utc_now)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="OPEN") # OPEN, INVESTIGATING, ACKNOWLEDGED, RESOLVED
    tx_hash = Column(String(66), nullable=True)
    resolution_notes = Column(Text, nullable=True)

    paper = relationship("Paper", back_populates="incidents")
    centre = relationship("Centre", back_populates="incidents")
    user = relationship("User", back_populates="incidents")

    @validates("timestamp")
    def validate_timestamp(self, key, value):
        return normalize_utc_datetime(value)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    timestamp = Column(DateTime, default=utc_now)
    service = Column(String(100), nullable=False)
    actor_id = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(255), nullable=False)
    result = Column(String(50), nullable=False) # SUCCESS, FAILURE, BLOCKED
    request_id = Column(String(50), nullable=True)

    @validates("timestamp")
    def validate_timestamp(self, key, value):
        return normalize_utc_datetime(value)
    details = Column(Text, nullable=True)
