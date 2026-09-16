# VeriQ System Architecture

**Secure Every Question Paper. Verify Every Action.**
Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

---

## 1. High-Level Architectural Philosophy

VeriQ addresses the core vulnerabilities of traditional question paper distribution: premature leaks, unauthorized interception, undetectable document tampering, compromised local machines, and repudiation of actions.

### The Fundamental Rule: Off-Chain Data, On-Chain Proofs
- **Question Paper Blobs**: Sensitive paper contents are **NEVER** stored directly on a public or shared blockchain ledger. Storing large binaries on-chain is cost-prohibitive, leaks encrypted payload structures permanently into block storage, and creates cryptographic liability if cipher primitives weaken over time.
- **Storage Tier**: All question papers are encrypted at rest using authenticated **AES-256-GCM** with distinct per-paper initialization vectors (IV) and authentication tags, saved into isolated file storage or S3/MinIO.
- **Blockchain Tier**: The blockchain ledger stores immutable state commitments:
  - Cryptographic Paper Digests (`SHA-256`)
  - Authority and Creator Signatures
  - Approval state transitions (`DRAFT` -> `APPROVED` -> `SCHEDULED` -> `RELEASED` -> `ARCHIVED` / `REVOKED`)
  - Center and hardware device authorizations
  - Multi-signature access attempts and decrypted release events
  - Security incident proofs (e.g. tampering, unauthorized attempts)

```
                       ┌──────────────────────────────────────────────┐
                       │          VeriQ Examination Authority         │
                       │           (Upload & Digital Sign)            │
                       └──────────────────────┬───────────────────────┘
                                              │
                         Off-chain Encrypted  │  On-chain Anchor
                         Payload (AES-256-GCM)│  (SHA-256 Hash + Signature)
                                              ▼
                ┌────────────────────────────────────────────────────────┐
                │                      VeriQ Core API                    │
                │        (FastAPI + Async SQLAlchemy + Policy Engine)    │
                └──────────────┬───────────────────────────┬─────────────┘
                               │                           │
                   Off-Chain Storage                       │  Transaction Broadcast
                               ▼                           ▼
                ┌─────────────────────────────┐    ┌─────────────────────────────┐
                │   Encrypted File Storage    │    │      VeriQ Ledger           │
                │     (/storage/encrypted)    │    │  (VeriQLedger.sol / Ledger) │
                │   - AES-256-GCM Ciphertext  │    │  - Immutable Hash Registry  │
                │   - 12-byte Nonce / IV      │    │  - Merkle Tree Proofs       │
                │   - 16-byte Auth Tag        │    │  - Audit Trail & Custody    │
                └─────────────────────────────┘    └─────────────────────────────┘
                               ▲                                   ▲
                               │                                   │
                               │ Time-Locked Multi-Factor          │ State & Proof
                               │ Decryption Request                │ Verification
                               │                                   │
                       ┌───────┴───────────────────────────────────┴─────────┐
                       │          Authorized Center & Test Device             │
                       │          (Time-Window + IP + Device Fingerprint)     │
                       └──────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### A. Frontend Application (`frontend/`)
- **Technology**: React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide React + Recharts + Sonner.
- **Responsibility**:
  - Role-based operational interfaces (Central Authority, Controller of Exams, Centre Superintendent, Auditor, Security Ops).
  - Real-time time-lock countdown monitors.
  - Interactive file integrity verification tool (browser-side SHA-256 calculation vs. ledger proof comparison).
  - Blockchain explorer with Merkle block visualizer, chain-of-custody event timeline, and one-click Hackathon attack simulation banner.

### B. Backend REST API (`backend/`)
- **Technology**: Python 3.13 + FastAPI + SQLAlchemy 2.0 (Asyncio) + Pydantic v2 + Cryptography.
- **Core Modules**:
  - `hashing_service.py`: Computes standardized SHA-256 and Merkle tree root hashes.
  - `encryption_service.py`: Handles AES-256-GCM envelope encryption, key derivation, and ephemeral decryption.
  - `access_control_service.py`: Enforces multi-factor authorization logic:
    1. Role validation (Centre Superintendent / Authorized Proctor).
    2. Center assignment validation (Is this paper assigned to this center?).
    3. Hardware device validation (Is device fingerprint whitelisted & approved?).
    4. Network perimeter validation (Is center IP or subnet authorized?).
    5. Time-lock window enforcement (Exam Start - Early Access Window <= Now <= Exam End).
  - `blockchain_service.py`: Interacts with smart contracts / python ledger engine, mines blocks with cryptographic proofs, and stores transaction receipts.
  - `anomaly_service.py`: Detects anomalous activity (rapid access attempts, unauthorized IPs, mismatched hashes) and triggers automated blockchain incident records.

### C. Smart Contract / Ledger Engine (`blockchain/`)
- **Solidity Smart Contract (`VeriQLedger.sol`)**:
  - Manages paper registry, lifecycle transitions, center/device authorizations, and access records.
  - Emits events (`PaperRegistered`, `PaperApproved`, `PaperAssigned`, `PaperAccessed`, `PaperReleased`, `PaperRevoked`, `IncidentLogged`).
- **Python Blockchain Engine (`MockBlockchainService`)**:
  - Full-featured in-process blockchain engine executing block mining, difficulty hashing, cryptographic chaining (previous block hash -> current block hash), and Merkle tree leaf computation.
  - Guarantees seamless offline hackathon evaluations without requiring external testnet faucets or node latency.

---

## 3. End-to-End Lifecycle Sequence

1. **Creation & Encryption**: Central Authority drafts an exam paper. The system generates a cryptographic salt & AES-256 key, encrypts the document, generates the SHA-256 digest of both the plaintext and ciphertext, and registers the hash on the blockchain.
2. **Multi-Party Approval**: Examination Controller reviews the metadata and digital signature. The approval transaction is signed and broadcast to the ledger.
3. **Centre & Device Authorization**: Participating examination centres and specific physical workstation devices (identified by MAC/Hardware Fingerprint) are registered and anchored.
4. **Time-Lock Distribution**: Encrypted payloads are pre-staged to designated centres prior to the examination date.
5. **Decryption Window Opening**: Only when the configured early release window arrives (e.g. 15 minutes before the exam schedule), the authorized superintendent on an authorized device sends a signed access request.
6. **Integrity & Identity Verification**: The system verifies center IP, device fingerprint, supervisor digital signature, and queries the ledger for active revocation.
7. **Release & Audit**: The AES-256 key decrypts the ephemeral stream into memory. An immutable access event is appended to the ledger.
