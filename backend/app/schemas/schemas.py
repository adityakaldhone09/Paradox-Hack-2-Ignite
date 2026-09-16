from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# Auth
class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: bool = False

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    centre_id: Optional[str] = None
    is_active: bool
    created_at: datetime

# Examination
class ExamCreate(BaseModel):
    name: str
    exam_id: str
    department: str
    subject: str
    exam_type: str = "FINAL"
    exam_date: str
    start_time: str
    end_time: str
    security_level: str = "HIGH"

class ExamResponse(BaseModel):
    id: str
    exam_id: str
    name: str
    department: str
    subject: str
    exam_type: str
    exam_date: str
    start_time: str
    end_time: str
    security_level: str
    status: str
    total_papers: int = 0
    assigned_centres_count: int = 0
    created_at: datetime

# Paper
class PaperCreate(BaseModel):
    exam_id: str
    title: str
    version: str = "1.0"

class PaperResponse(BaseModel):
    id: str
    paper_id: str
    exam_id: str
    exam_name: Optional[str] = None
    title: str
    file_name: str
    file_size: int
    sha256_hash: str
    encryption_status: str
    version: str
    status: str
    release_time: Optional[datetime] = None
    created_by: str
    created_at: datetime
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    blockchain_tx_hash: Optional[str] = None
    blockchain_block_number: Optional[int] = None
    assigned_centres: List[str] = []
    revocation_reason: Optional[str] = None

class PaperAssignCentreRequest(BaseModel):
    centre_id: str
    release_window_start: datetime
    release_window_end: datetime

class PaperVerifyRequest(BaseModel):
    file_bytes_base64: Optional[str] = None # Or verify currently stored file
    simulate_tamper: bool = False

class PaperRevokeRequest(BaseModel):
    reason: str

# Centre & Device
class CentreCreate(BaseModel):
    name: str
    centre_id: str
    city: str
    state: str
    code: str

class CentreResponse(BaseModel):
    id: str
    centre_id: str
    name: str
    city: str
    state: str
    code: str
    is_authorized: bool
    status: str
    authorized_devices_count: int = 0
    assigned_exams_count: int = 0
    created_at: datetime

class DeviceCreate(BaseModel):
    device_id: str
    device_fingerprint: str
    centre_id: str
    device_name: str
    os: str = "Windows 11"
    ip_address: str = "127.0.0.1"

class DeviceResponse(BaseModel):
    id: str
    device_id: str
    device_fingerprint: str
    centre_id: str
    device_name: str
    os: str
    ip_address: str
    status: str
    registered_at: datetime
    last_seen: datetime

# Access Control
class AccessRequest(BaseModel):
    paper_id: str
    centre_id: str
    device_fingerprint: str
    override_time: Optional[datetime] = None # For demo early access testing

class AccessResponse(BaseModel):
    allowed: bool
    reason: str
    message: str
    timestamp: datetime
    tx_hash: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

# Blockchain
class TransactionResponse(BaseModel):
    tx_hash: str
    block_number: int
    event_type: str
    paper_id: str
    actor_id: str
    centre_id: Optional[str] = None
    device_id: Optional[str] = None
    payload_hash: str
    previous_hash: str
    signature: str
    timestamp: str
    status: str

# Incident
class IncidentCreate(BaseModel):
    type: str
    severity: str = "HIGH"
    paper_id: Optional[str] = None
    centre_id: Optional[str] = None
    description: str

class IncidentResponse(BaseModel):
    id: str
    incident_id: str
    type: str
    severity: str
    paper_id: Optional[str] = None
    paper_title: Optional[str] = None
    centre_id: Optional[str] = None
    centre_name: Optional[str] = None
    user_id: Optional[str] = None
    device_id: Optional[str] = None
    timestamp: datetime
    description: str
    status: str
    tx_hash: Optional[str] = None
    resolution_notes: Optional[str] = None

# Demo Event Simulation
class SimulateEventRequest(BaseModel):
    event_type: str # EARLY_ACCESS, UNAUTHORIZED_CENTRE, DEVICE_MISMATCH, DOCUMENT_TAMPERING, SUSPICIOUS_ACTIVITY
    paper_id: Optional[str] = None
    centre_id: Optional[str] = None
