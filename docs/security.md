# VeriQ Security Architecture & Cryptographic Specification

**Secure Every Question Paper. Verify Every Action.**
Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

---

## 1. Threat Model & Mitigations

| Threat Vector | Attack Scenario | VeriQ Defense Mechanism |
|---|---|---|
| **Premature Leakage** | Corrupt administrator or hacker intercepts question paper hours/days ahead of exam. | **Time-Lock Encryption & Policy Gate**: Papers are encrypted with AES-256-GCM. The decryption key is never exposed. Decryption endpoints strictly block requests until `exam_date - early_access_window`. |
| **Document Tampering** | An attacker alters questions or answer keys in storage or transit. | **SHA-256 Digest Anchoring on Blockchain**: The SHA-256 hash of the original document is committed to the blockchain at registration. Any modification produces a mismatched hash, instantly triggering an on-chain incident and blocking access. |
| **Unauthorized Distribution** | A rogue staff member downloads the file from an unapproved terminal or remote location. | **Multi-Factor Centre & Device Whitelisting**: Access requests require valid Superintendent JWT, verified Center IP subnet, and registered Hardware Fingerprint (Device ID). |
| **Repudiation of Actions** | Center denies downloading early or leaking a question paper. | **Immutable Blockchain Audit Trail**: Every access attempt (successful or rejected), unlock request, and approval emits a signed blockchain transaction with timestamp, user ID, center ID, and IP address. |
| **Compromised Center Device** | A malware-infected workstation attempts to request exam papers. | **Device Hardware Fingerprinting & Remote Revocation**: Device keys and authorization status can be revoked on-chain in real-time by the Security Operations Center. |

---

## 2. Cryptographic Primitives

### A. Document Encryption (AES-256-GCM)
- **Algorithm**: Advanced Encryption Standard in Galois/Counter Mode (`AES-256-GCM`).
- **Key Length**: 256 bits (32 bytes).
- **Initialization Vector (IV)**: 96 bits (12 bytes) cryptographically secure random bytes generated uniquely per encryption via `os.urandom(12)`.
- **Authentication Tag**: 128 bits (16 bytes) produced by GCM to guarantee ciphertext authenticity and prevent ciphertext tampering.
- **Storage Structure**:
  ```
  [ 12-byte IV ] + [ 16-byte GCM Tag ] + [ Variable-length Ciphertext ]
  ```

### B. Cryptographic Integrity Hashing (SHA-256)
- Plaintext Hash: `SHA256(Raw PDF / Binary)`
- Ciphertext Hash: `SHA256(Encrypted Payload)`
- Both hashes are stored in the database and anchored into the `VeriQLedger` smart contract upon registration.

### C. Digital Signatures & HMAC Authentication
- Digital signatures use HMAC-SHA256 tokens and ECDSA Ethereum-compatible signature verification schemes (`0x...` 65-byte signatures) to verify authority approvals.

---

## 3. Multi-Factor Access Policy Evaluation Engine

When an access request is initiated at `/api/v1/access/evaluate` or `/api/v1/access/decrypt-and-release`, the request must pass all 6 evaluation gates:

```
                  ┌───────────────────────────────┐
                  │      Incoming Access Request   │
                  └──────────────┬────────────────┘
                                 │
                 [ Gate 1: Role Verification ]
                 Is User Superintendent or Proctor?
                                 │ Yes
                 [ Gate 2: Paper Status ]
                 Is Paper Status 'APPROVED' or 'SCHEDULED'? (Not Revoked/Draft)
                                 │ Yes
                 [ Gate 3: Center Assignment ]
                 Is Paper explicitly assigned to the requester's center?
                                 │ Yes
                 [ Gate 4: Hardware Device Authorization ]
                 Is the device fingerprint registered and ACTIVE?
                                 │ Yes
                 [ Gate 5: Network Perimeter Check ]
                 Does client IP match the whitelisted Center IP / subnet?
                                 │ Yes
                 [ Gate 6: Time-Lock Window ]
                 (Exam Start - 30m) <= Current Time <= (Exam End + 15m)?
                                 │ Yes
                  ┌──────────────┴────────────────┐
                  │    ALLOW: Ephemeral Release   │
                  │   Log 'ACCESS_GRANTED' Block  │
                  └───────────────────────────────┘
```

If ANY gate evaluates to false, access is rejected immediately, a structured failure code is returned (e.g. `TIME_LOCK_ACTIVE`, `UNAUTHORIZED_DEVICE`, `IP_MISMATCH`), and an incident is logged on the blockchain.
