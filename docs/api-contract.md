# VeriQ — API Contract & Endpoint Reference

**Product**: VeriQ — Secure Examination Paper Distribution & Chain of Custody  
**Problem Statement**: WB-03 (National Hackathon)  
**Base URL**: `/api/v1`  
**Authentication**: Bearer JWT (Header: `Authorization: Bearer <token>`)

---

## 1. Authentication & Identity (`/auth`)

### `POST /auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "setter@veriq.local",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "3bda4ac6-e732-448e-8539-828f6eaf11d4",
      "email": "setter@veriq.local",
      "name": "Prof. Ananya Sen",
      "role": "PAPER_SETTER",
      "centre_id": null,
      "is_active": true
    }
  }
  ```

### `POST /auth/signup`
- **Access**: Public
- **Request Body**: `email`, `password`, `name`, `role` (one of `SUPER_ADMIN`, `PAPER_SETTER`, `CENTRE_ADMIN`, `INVIGILATOR`), `centre_id` (optional).
- **Response** (`201 Created`): Returns created user details.

### `GET /auth/me`
- **Access**: Authenticated (All roles)
- **Response** (`200 OK`): Current user profile, role, and centre affiliation.

### `GET /auth/demo-users`
- **Access**: Public (Convenience for evaluation/demo)
- **Response** (`200 OK`): Pre-configured credentials for all 4 roles.

---

## 2. User Management (`/users`)

### `GET /users`
- **Access**: `SUPER_ADMIN` only (Enforces RBAC: returns `403 Forbidden` for non-superadmins)
- **Response** (`200 OK`): List of all users in the system with roles, active status, and centre mappings.

---

## 3. Examination Management (`/exams`)

### `GET /exams`
- **Access**: Authenticated
- **Query Params**: `search`, `status`
- **Response** (`200 OK`): List of registered examinations.

### `POST /exams`
- **Access**: `SUPER_ADMIN`
- **Request Body**: `name`, `exam_id`, `department`, `subject`, `exam_type`, `exam_date`, `start_time`, `end_time`, `security_level`.
- **Response** (`201 Created`): Returns created examination.

### `GET /exams/{id}`
- **Access**: Authenticated
- **Response** (`200 OK`): Full exam details and associated papers.

---

## 4. Question Paper Lifecycle & Cryptography (`/papers`)

State Machine:
`DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` ➔ `ASSIGNED` ➔ `RELEASED` (or `REVOKED` at any time)

### `GET /papers`
- **Access**: Authenticated
- **Query Params**: `search`, `status`, `exam_id`, `created_by`
- **Response** (`200 OK`): List of papers with plaintext SHA-256 digests and latest blockchain transaction references.

### `POST /papers/upload`
- **Access**: `SUPER_ADMIN`, `PAPER_SETTER`
- **Request**: `multipart/form-data` with `file`, `title`, `exam_id`.
- **Behavior**:
  1. Computes SHA-256 checksum on original file bytes.
  2. Encrypts file payload using **AES-256-GCM** (ephemeral IV and 128-bit authentication tag).
  3. Writes ciphertext to secure off-chain storage (`storage/papers/`).
  4. Records genesis `PAPER_CREATED` event on blockchain ledger.
- **Response** (`201 Created`): Initial `DRAFT` paper record with encryption tag, IV, and transaction hash.

### `POST /papers/{id}/submit`
- **Access**: `PAPER_SETTER`, `SUPER_ADMIN`
- **Behavior**: Transitions status from `DRAFT` ➔ `SUBMITTED`. Records `PAPER_SUBMITTED` transaction on the blockchain ledger. Enforces creator isolation.
- **Response** (`200 OK`): `{ "message": "Paper submitted for approval", "status": "SUBMITTED", "tx_hash": "0x..." }`

### `POST /papers/{id}/approve`
- **Access**: `SUPER_ADMIN` only
- **Behavior**:
  1. Validates paper is in `DRAFT` or `SUBMITTED` state.
  2. Signs the paper using RSA-2048 private key.
  3. Transitions status to `APPROVED`.
  4. Records `PAPER_APPROVED` event on blockchain with cryptographic signature.
- **Response** (`200 OK`): `{ "message": "Paper approved and signed successfully", "status": "APPROVED", "tx_hash": "0x..." }`

### `POST /papers/{id}/assign-centre`
- **Access**: `SUPER_ADMIN`
- **Request Body**:
  ```json
  {
    "centre_id": "c101-uuid",
    "release_window_start": "2026-09-20T09:00:00Z",
    "release_window_end": "2026-09-20T12:00:00Z"
  }
  ```
- **Behavior**: Creates `PaperCentreAssignment` time-lock gate and broadcasts `PAPER_ASSIGNED` event.
- **Response** (`200 OK`): Assignment confirmation with time-lock bounds.

### `POST /papers/{id}/verify`
- **Access**: Authenticated
- **Request Body**:
  ```json
  {
    "candidate_hash": "0073ee5e72...",
    "simulate_tamper": false
  }
  ```
- **Behavior**:
  - Compares candidate hash (or decrypts storage payload and recomputes plaintext SHA-256) against blockchain proof ledger.
  - If tampered: Automatically generates a `CRITICAL` incident of type `HASH_MISMATCH` and records `PAPER_VERIFIED` on chain.
- **Response** (`200 OK`):
  ```json
  {
    "verified": true,
    "is_authentic": true,
    "status": "VERIFIED_VALID",
    "tx_hash": "0x..."
  }
  ```

### `GET /papers/{id}/chain-of-custody`
- **Access**: Authenticated
- **Response** (`200 OK`): Full chronological audit trail of all blockchain transactions tied to this paper.

### `POST /papers/{id}/revoke`
- **Access**: `SUPER_ADMIN`
- **Request Body**: `{ "reason": "Compromised seal reported at Exam Centre" }`
- **Behavior**: Immediately marks paper `REVOKED`, invalidates decryption keys, logs blockchain `PAPER_REVOKED` event.

---

## 5. Time-Lock & Access Evaluation Gate (`/access`)

### `POST /access/request`
- **Access**: `CENTRE_ADMIN`, `INVIGILATOR`
- **Request Body**:
  ```json
  {
    "paper_id": "paper-uuid",
    "centre_id": "centre-uuid",
    "device_fingerprint": "a4f8b9...",
    "override_time": "2026-09-20T10:00:00Z"
  }
  ```
- **Policy Enforcement Pipeline**:
  1. Paper must be in `ASSIGNED` or `RELEASED` status.
  2. Centre must have an active assignment for this paper.
  3. `release_window_start <= current_time <= release_window_end`.
  4. Device fingerprint must match an approved active device for this centre.
- **Response** (`200 OK` if allowed, `403 Forbidden` if denied):
  - If allowed: Emits ephemeral AES-256 decryption key and marks `AccessEvent(allowed=True)`.
  - If denied: Records denial reason (`EARLY_ACCESS`, `DEVICE_MISMATCH`, etc.), logs blockchain event, and automatically triggers an incident if suspicious.

---

## 6. Incident Management (`/incidents`)

### `GET /incidents`
- **Access**: Authenticated
- **Query Params**: `type`, `severity`, `status`
- **Response** (`200 OK`): List of security alerts with centre names, affected papers, and blockchain audit links.

### `POST /incidents`
- **Access**: Authenticated (`INVIGILATOR`, `CENTRE_ADMIN`, `SUPER_ADMIN`)
- **Request Body**:
  ```json
  {
    "type": "SEAL_COMPROMISE",
    "severity": "CRITICAL",
    "paper_id": "paper-uuid",
    "description": "Anti-tamper seal violated"
  }
  ```
- **Response** (`201 Created`): Creates incident and commits `INCIDENT_RECORDED` block to the blockchain ledger.

### `POST /incidents/{id}/acknowledge`
- **Access**: `SUPER_ADMIN`
- **Response** (`200 OK`): Moves status to `ACKNOWLEDGED`.

### `POST /incidents/{id}/resolve`
- **Access**: `SUPER_ADMIN`
- **Request Body**: `{ "resolution_notes": "Enclosure inspected and resealed." }`
- **Response** (`200 OK`): Moves status to `RESOLVED`.

---

## 7. Blockchain Explorer (`/blockchain`)

### `GET /blockchain/status`
- **Access**: Public / Authenticated
- **Response** (`200 OK`): Total confirmed transactions (synced to database), block height, consensus type (Proof-of-Authority), peer count, and latest block hash.

### `GET /blockchain/blocks`
- **Access**: Public / Authenticated
- **Response** (`200 OK`): List of blocks with Merkle roots, previous block hashes, and transaction lists.

### `GET /blockchain/transactions`
- **Access**: Public / Authenticated
- **Query Params**: `event_type`, `paper_id`, `skip`, `limit`
- **Response** (`200 OK`): Paginated immutable transactions.

---

## 8. Centres & Devices (`/centres`, `/devices`)

### `GET /centres`
- **Access**: Authenticated
- **Response** (`200 OK`): List of centres, registered codes, device counts, and assigned exam counts.

### `GET /devices`
- **Access**: Authenticated
- **Query Params**: `centre_id`
- **Response** (`200 OK`): List of authorized hardware terminals and fingerprints.

### `POST /devices`
- **Access**: `SUPER_ADMIN`, `CENTRE_ADMIN`
- **Request Body**: `device_id`, `device_fingerprint`, `centre_id`, `device_name`, `os`, `ip_address`.
- **Response** (`201 Created`): Whitelists physical machine for confidential paper access.

---

## 9. Health & System Diagnostics (`/health`)

### `GET /health`
- **Response** (`200 OK`): `{ "status": "ok", "service": "veriQ-backend", "version": "1.0.0" }`

### `GET /health/database`
- **Response** (`200 OK`): Confirms PostgreSQL/Supabase connectivity with latency metrics.

### `GET /health/blockchain`
- **Response** (`200 OK`): Confirms ledger integrity and block height.

### `GET /health/storage`
- **Response** (`200 OK`): Confirms encrypted off-chain file directory accessibility.
