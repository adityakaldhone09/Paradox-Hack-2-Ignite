# VeriQ REST API Specification

**Secure Every Question Paper. Verify Every Action.**
Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

Base URL: `/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user and issues a JWT bearer token.
- **Request Body**:
  ```json
  {
    "email": "authority@veriq.local",
    "password": "password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "user": {
      "id": "u-01",
      "email": "authority@veriq.local",
      "full_name": "Dr. Sarah Jenkins",
      "role": "CENTRAL_AUTHORITY",
      "centre_id": null
    }
  }
  ```

### `GET /auth/me`
Returns current authenticated user details.

---

## 2. Examination & Paper Lifecycle Endpoints

### `GET /exams/`
Lists all examinations with optional query filtering (`status`, `search`).

### `POST /exams/`
Creates a new scheduled examination.

### `GET /papers/`
Lists examination question papers with status, hash, and exam linkage.

### `POST /papers/`
Uploads and registers a new question paper.
- **Payload (`multipart/form-data`)**:
  - `file`: PDF or raw document bytes
  - `title`: String
  - `code`: String
  - `subject`: String
  - `examination_id`: String (UUID)
- **Processing**:
  1. Computes `SHA256(file)`.
  2. Generates 256-bit AES key & 12-byte IV.
  3. Encrypts with AES-256-GCM, produces 16-byte authentication tag.
  4. Stores encrypted payload in `/storage/encrypted_papers/`.
  5. Anchors hash & metadata to blockchain ledger.
  6. Returns paper record with `blockchain_tx_hash`.

### `POST /papers/{paper_id}/approve`
Signs and approves a paper (Requires `EXAM_CONTROLLER` role).

### `POST /papers/{paper_id}/assign`
Assigns a paper to specified examination centers.

### `POST /papers/{paper_id}/revoke`
Emergency revocation of a paper across all centers.

---

## 3. Access Control & Time-Lock Release Endpoints

### `POST /access/evaluate`
Pre-flight evaluation of access permission without releasing decrypted content.
- **Request Body**:
  ```json
  {
    "paper_id": "paper-123",
    "centre_id": "centre-delhi",
    "device_fingerprint": "a8fbc...79e"
  }
  ```
- **Response**:
  ```json
  {
    "allowed": true,
    "code": "ACCESS_PERMITTED",
    "message": "All 6 security gates passed.",
    "time_remaining_seconds": 0
  }
  ```

### `POST /access/decrypt-and-release`
Decrypts and streams the paper to the requesting terminal if and only if all security gates pass.
- Returns ephemeral decrypted binary stream with security headers and logs `ACCESS_GRANTED` to blockchain.

### `POST /access/verify`
Integrity verification endpoint.
- **Request**: Computes or receives SHA-256 hash of a paper file.
- **Response**: Compares against both the database record and the immutable blockchain transaction. Returns `VERIFIED_MATCH` or `INTEGRITY_COMPROMISED`.

---

## 4. Blockchain & Audit Endpoints

### `GET /blockchain/stats`
Returns total blocks, total transactions, latest block hash, and ledger health.

### `GET /blockchain/blocks`
Returns paginated list of mined blocks, transactions, and Merkle root proofs.

### `GET /blockchain/paper/{paper_id}/history`
Returns chronological chain-of-custody audit trail for a specific question paper.

---

## 5. Hackathon Attack Simulation Endpoints (`/demo/*`)

### `POST /demo/simulate-early-access`
Simulates a center attempting to access an exam paper before the time-lock release window. Proves early access block.

### `POST /demo/simulate-tamper`
Simulates an attacker tampering with an encrypted paper payload. Proves integrity verification failure and instant on-chain incident logging.

### `POST /demo/simulate-rogue-device`
Simulates an access attempt from an unregistered device fingerprint. Proves device whitelisting enforcement.
