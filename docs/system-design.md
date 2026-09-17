# VeriQ — System Design & Technical Architecture Document

**System Name**: VeriQ — Secure Examination Paper Distribution & Chain of Custody  
**Problem Statement**: WB-03 (National Hackathon)  
**Classification**: Mission-Critical Examination Security Infrastructure  

---

## 1. Executive Summary & Problem Context

Traditional national examination workflows rely on physical paper transit, sealed envelopes, and trusting distributed human intermediaries. Vulnerabilities include:
- Pre-exam paper leaks at regional storage banks.
- Man-in-the-middle physical tampering during transport.
- Early unauthorized opening before scheduled examination hours.
- Lack of non-repudiable audit trails pinning who accessed or modified exam material.

**VeriQ** provides a zero-trust, cryptographically secured examination paper authoring, distribution, and verification pipeline. Every critical action—authoring, signing, centre assignment, time-locked decryption, proctor incident reporting—is backed by **AES-256-GCM envelope encryption**, **RSA-2048 digital signatures**, and a **tamper-evident cryptographic ledger**.

---

## 2. High-Level System Architecture

```
                                  +-------------------------------------------------------------+
                                  |                     VERIQ CLIENT TIERS                      |
                                  |   (React 19 + TypeScript + Vite + Tailwind CSS + Lucide)    |
                                  +-------------------------------------------------------------+
                                    |               |                      |               |
               SUPER_ADMIN          |  PAPER_SETTER |         CENTRE_ADMIN |   INVIGILATOR |
              (Exam Authority)      |  (Specialist) |       (Superintendent) |     (Proctor) |
                    |               |               |                      |               |
                    v               v               v                      v               v
    +-----------------------------------------------------------------------------------------------+
    |                                   REVERSE PROXY & GATEWAY                                    |
    |                                  (Vite Proxy -> FastAPI v1)                                   |
    +-----------------------------------------------------------------------------------------------+
                                                    |
                                                    v
    +-----------------------------------------------------------------------------------------------+
    |                                  VERIQ CORE BACKEND ENGINE                                   |
    |                                (Python 3.13 + FastAPI + asyncpg)                              |
    |                                                                                               |
    |   +-------------------+   +--------------------+   +-------------------+   +--------------+   |
    |   | RBAC Auth Service |   | Encryption Service |   | Hashing Service   |   | Time-Lock    |   |
    |   | (JWT + Roles)     |   | (AES-256-GCM)      |   | (SHA-256 + Merkle)|   | Policy Gate  |   |
    |   +-------------------+   +--------------------+   +-------------------+   +--------------+   |
    |                                                                                               |
    |   +---------------------------------------+   +-------------------------------------------+   |
    |   | Blockchain Cryptographic Ledger       |   | Anomaly & Incident Engine                 |   |
    |   | (Block Hashing, PoA, Custody Trail)   |   | (Early Access, Device Mismatch, Breach)   |   |
    |   +---------------------------------------+   +-------------------------------------------+   |
    +-----------------------------------------------------------------------------------------------+
                 |                                      |                                   |
                 v                                      v                                   v
    +---------------------------+       +-------------------------------+       +-------------------+
    |    RELATIONAL DATABASE    |       |     CRYPTOGRAPHIC LEDGER      |       | SECURE OFF-CHAIN  |
    |  (Supabase PostgreSQL 15  |       |     (Immutable Block Chain    |       |   FILE STORAGE    |
    |    via asyncpg engine)    |       |     + Transaction Records)    |       | (Ciphertext + IV) |
    +---------------------------+       +-------------------------------+       +-------------------+
```

---

## 3. Strict 4-Role RBAC Model

The system enforces strict principle-of-least-privilege across 4 discrete application roles:

| Role | Domain Identity | Permitted Operations | Restricted Operations |
| :--- | :--- | :--- | :--- |
| **`SUPER_ADMIN`** | Examination Authority / Controller of Exams | Full governance: Approve papers, sign digital certificates, register centres, whitelist hardware terminals, release papers, resolve incidents, audit users. | Cannot modify question contents once approved. |
| **`PAPER_SETTER`** | Academic Subject Specialist | Create questions, upload and encrypt draft papers (AES-256-GCM), submit papers for approval. Author isolation ensures setters only access their own authored papers. | Cannot approve papers, cannot assign centres, cannot view centres or users. |
| **`CENTRE_ADMIN`** | Regional Centre Superintendent | View scheduled examinations and assigned question bundles for their registered centre, verify hardware whitelist, monitor time-lock countdowns. | Cannot access raw decryption keys before release window; cannot upload or approve papers. |
| **`INVIGILATOR`** | Hall Proctor / Room Examiner | Check-in examination candidates, verify paper integrity on proctor terminal, immediately dispatch emergency security alerts/incidents into the blockchain log. | No administrative or scheduling capabilities. |

---

## 4. Cryptographic Security Architecture

```
 [ Authoring (Paper Setter) ]
      Plaintext PDF 
           │
           ├──► SHA-256 Digest (Canonical Fingerprint: P_hash)
           │
           └──► AES-256-GCM Encryption (Ephemeral Key + 96-bit IV)
                     │
                     ├──► Ciphertext (.enc) ──► Stored in Secure Off-Chain Storage
                     └──► 128-bit Authentication Tag ──► Saved in Database

 [ Approval (Super Admin) ]
      Paper Metadata + P_hash + Timestamp
           │
           └──► RSA-2048 Private Key Signature (Non-repudiable Proof)
                     │
                     └──► Anchored in Blockchain Block (PAPER_APPROVED)

 [ Verification (Proctor / Superintendent) ]
      Candidate Paper / Stored Ciphertext
           │
           ├──► Decrypted using Session Key & Verified against Tag
           ├──► Plaintext SHA-256 Calculated (C_hash)
           └──► Compare: (C_hash == P_hash)
                     │
                     ├── [Match]   ──► VERIFIED_VALID (Integrity Confirmed)
                     └── [Mismatch]──► INTEGRITY_FAILURE (Automatic CRITICAL Incident Created)
```

### Key Management & Off-Chain Storage
1. **Plaintext Papers Are Never Exposed**: Raw exam papers are immediately encrypted using AES-256-GCM before ever writing to disk.
2. **Storage Isolation**: Encrypted payloads are segregated under `storage/papers/{paper_id}.enc`.
3. **Decryption Key Quarantine**: Decryption keys are held in memory only during authorized release windows and destroyed upon exam termination.

---

## 5. Blockchain & Chain of Custody Engine

VeriQ uses a **Proof-of-Authority (PoA) Cryptographic Ledger** to maintain an unalterable history of every exam paper:

### Block Structure
Each block consists of:
- **`index`**: Monotonically increasing block sequence number.
- **`previous_hash`**: SHA-256 hash of the preceding block header (forming the immutable link).
- **`timestamp`**: ISO-8601 UTC timestamp.
- **`merkle_root`**: SHA-256 Merkle tree root of all transactions in this block.
- **`transactions`**: Array of canonical transaction records.
- **`hash`**: SHA-256 header hash: `SHA-256(index + ":" + previous_hash + ":" + timestamp + ":" + merkle_root)`.

### Canonical Event Types
1. `PAPER_CREATED`: Paper uploaded and encrypted by Author.
2. `PAPER_SUBMITTED`: Paper formally submitted for Authority review.
3. `PAPER_APPROVED`: Authority digitally signs paper and locks contents.
4. `PAPER_ASSIGNED`: Exam paper bound to a specific regional centre and release time window.
5. `PAPER_RELEASED`: Decryption key released upon reaching scheduled exam time.
6. `PAPER_VERIFIED`: Document integrity verified against original blockchain digest.
7. `INCIDENT_RECORDED`: Anti-tamper violation, early access breach, or hardware mismatch.
8. `PAPER_REVOKED`: Emergency cancellation of compromised question paper.

---

## 6. Time-Lock & Hardware Binding Gate

Before an exam paper can be decrypted at an examination facility:
1. **Time-Lock Window**:
   $$\text{release\_window\_start} \le \text{current\_time} \le \text{release\_window\_end}$$
   If an access attempt is made before $\text{release\_window\_start}$, it is immediately rejected with `RELEASE_WINDOW_NOT_STARTED`, logged to the audit trail, and flags an `EARLY_ACCESS` security incident.
2. **Hardware Fingerprint Binding**:
   The requesting terminal's hardware fingerprint (CPU, MAC, OS platform digest) must exist in `authorized_devices` and have status `ACTIVE` for that specific examination centre.

---

## 7. Database Entity Relationship (Supabase PostgreSQL)

```
  +------------------+       +------------------+       +-------------------------+
  |      users       |       |     centres      |       |   authorized_devices    |
  |------------------|       |------------------|       |-------------------------|
  | id (PK)          |       | id (PK)          |       | id (PK)                 |
  | email (UQ)       |◄──────| centre_id (UQ)   |◄──────| centre_id (FK)          |
  | role             |       | name             |       | device_id (UQ)          |
  | centre_id (FK)   |       | is_authorized    |       | device_fingerprint      |
  +------------------+       +------------------+       | status                  |
                                     ▲                  +-------------------------+
                                     │
                             +-------┴--------------------+
                             │                            │
  +------------------+       │  +-----------------------+ │     +-----------------------------+
  |   examinations   |       │  | paper_centre_assign   | │     |   blockchain_transactions   |
  |------------------|       │  |-----------------------| │     |-----------------------------|
  | id (PK)          |       │  | id (PK)               | │     | id (PK)                     |
  | exam_id (UQ)     |       │  | paper_id (FK)         | │     | tx_hash (UQ)                |
  | name             |       │  | centre_id (FK)        | │     | block_number                |
  +------------------+       │  | release_window_start  | │     | event_type                  |
          ▲                  │  | release_window_end    | │     | paper_id (FK)               |
          │                  │  +-----------------------+ │     | actor_id                    |
  +------------------+       │                            │     | payload_hash                |
  |      papers      |       │                            │     | signature                   |
  |------------------|       │                            │     | timestamp                   |
  | id (PK)          |───────┼────────────────────────────┼────►| status                      |
  | paper_id (UQ)    |       │                            │     +-----------------------------+
  | exam_id (FK)     |       │                            │
  | sha256_hash      |       │  +-----------------------+ │     +-----------------------------+
  | encrypted_path   |       │  |       incidents       | │     |        access_events        |
  | encryption_iv    |       │  |-----------------------| │     |-----------------------------|
  | encryption_tag   |       │  | id (PK)               | │     | id (PK)                     |
  | status           |       └─►| centre_id (FK)        | │     | paper_id (FK)               |
  | release_time     |          | paper_id (FK)         | └────►| centre_id (FK)              |
  | digital_sig      |          | severity              |       | user_id (FK)                |
  +------------------+          | type                  |       | action                      |
                                | tx_hash               |       | allowed (Boolean)           |
                                +-----------------------+       | denial_reason               |
                                                                +-----------------------------+
```

---

## 8. Threat Model & Countermeasures

| Threat Scenario | Attack Vector | VeriQ Countermeasure |
| :--- | :--- | :--- |
| **Pre-Exam Exfiltration** | Rogue database admin or paper setter attempts to leak questions before exam day. | AES-256-GCM off-chain encryption; paper files are stored only as ciphertext; decryption keys are released exclusively within time-lock window. |
| **Transit Manipulation** | Attacker intercepts digital transmission and modifies exam questions. | SHA-256 plaintext hash verified against immutable blockchain transaction signed by the Examination Authority's RSA-2048 private key. Any byte alteration triggers `INTEGRITY_FAILURE`. |
| **Early Opening** | Local centre superintendent attempts to open paper 2 hours early to distribute answers. | Time-lock evaluation gate strictly enforces release window. Early requests are blocked with HTTP 403, and an `EARLY_ACCESS` security incident is automatically broadcast to the authority threat feed. |
| **Rogue Decryption Terminal** | Unauthorized laptop on centre Wi-Fi attempts to connect to the decryption API. | Hardware fingerprinting and terminal whitelisting. Unregistered terminals are denied access with `DEVICE_MISMATCH` alerts logged to the immutable ledger. |
| **Post-Exam Dispute** | Centre claims they were provided the incorrect paper or corrupted file. | End-to-end cryptographic Chain of Custody proves exact paper version, author signature, timestamp of release, and recipient verification on-chain. |

---

## 9. Verification & Validation Summary

- **Frontend Build**: Vite + TypeScript 5 passed with zero errors (`tsc -b && vite build`).
- **Database Seed**: 10 Examination Centres, 15 Users across 4 roles, 5 Examinations, and 10 Pre-encrypted Papers loaded to Supabase PostgreSQL.
- **Automated Integration**: 8/8 comprehensive end-to-end integration tests passed, verifying all 4 role logins, author paper isolation, state machine transitions (`DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` ➔ `ASSIGNED`), chain of custody timeline, tamper detection, and real-time proctor incident logging.
