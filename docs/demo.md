# VeriQ Hackathon Demonstration Guide

**Secure Every Question Paper. Verify Every Action.**
Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

---

## 1. Demo Credentials & Personas

The database is pre-seeded with specialized persona accounts representing every stage of the examination lifecycle:

| Persona / Role | Email | Password | Primary Mission in Demo |
|---|---|---|---|
| **Central Authority** | `authority@veriq.local` | `password123` | Create & upload exam papers, initialize AES-256 encryption, assign centres |
| **Exam Controller** | `controller@veriq.local` | `password123` | Multi-sig digital signature review & blockchain approval |
| **Centre Superintendent** | `superintendent.delhi@veriq.local` | `password123` | Monitor time-locks, request authorized decrypt-and-release at exam time |
| **Auditor / Inspector** | `auditor@veriq.local` | `password123` | Verify independent SHA-256 hashes against immutable blockchain blocks |
| **Security Operations** | `secops@veriq.local` | `password123` | Monitor live threat feed, review security incidents, trigger remote revocation |

---

## 2. Interactive Hackathon Scenarios

In the top navigation header of the frontend application, a permanent **"Simulate Security Event"** action bar allows judges and evaluators to trigger real cryptographic stress tests with one click:

### Scenario 1: Premature Access Attempt Blocked by Time-Lock
1. Navigate to **Time-Lock Release** (`/timelock`).
2. Select an upcoming examination (e.g. *National Engineering Entrance Exam*).
3. Observe the live countdown timer showing that the release window has not opened yet.
4. Click **"Request Decrypt & Release"** or click **"Early Access"** in the top simulation bar.
5. **Result**: The policy engine evaluates all 6 gates, identifies that `(Exam Start - 30m) > Now`, denies decryption with code `RELEASE_WINDOW_NOT_STARTED`, and writes an unauthorized early access attempt to the blockchain ledger.

### Scenario 2: Document Tampering Detection
1. Navigate to **Verify Integrity** (`/verify`).
2. Upload a sample document or click **"Tamper"** in the top simulation bar.
3. The system computes the browser-side SHA-256 digest of the tampered document and queries the blockchain contract.
4. **Result**: Instant **INTEGRITY COMPROMISED** warning banner displayed. The calculated hash does not match the block hash. An automated `CRITICAL` severity incident is logged in `/incidents` and anchored into a new mined block.

### Scenario 3: Rogue Device & IP Spoofing Prevention
1. In the top simulation bar, click **"Rogue Device"**.
2. An access request is sent with an unregistered hardware fingerprint from an external IP.
3. **Result**: Access is immediately denied with `UNAUTHORIZED_DEVICE`. The event is captured on the Security Operations Map (`/security-ops`).

### Scenario 4: Chain-of-Custody & Merkle Ledger Verification
1. Navigate to **Blockchain Explorer** (`/blockchain`).
2. View real mined blocks with their index, cryptographic hash, previous block hash pointer, and Merkle root.
3. Click into any paper's **Chain of Custody** (`/custody`) to trace its full immutable timeline from initial upload, digital signature, centre assignment, and access events.
