# VeriQ Blockchain Architecture & Smart Contract Reference

**Secure Every Question Paper. Verify Every Action.**
Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

---

## 1. On-Chain vs. Off-Chain Separation

VeriQ uses the blockchain as a tamper-evident audit ledger and state anchor rather than a heavy object store:
- **What is Stored On-Chain**:
  - `bytes32` SHA-256 digests of question papers.
  - Lifecycle state machine transitions (`DRAFT`, `APPROVED`, `SCHEDULED`, `RELEASED`, `REVOKED`).
  - Centre and Device whitelisting authorizations.
  - Access attempts with cryptographic timestamp and result code.
  - Security incident logs.
- **What is NEVER Stored On-Chain**:
  - Raw question paper contents.
  - Examination question text.
  - Decryption keys or passwords.

---

## 2. Smart Contract Reference (`blockchain/contracts/VeriQLedger.sol`)

The `VeriQLedger` contract is written in Solidity `^0.8.20` and implements role-gated access control (`AccessControl` pattern).

### Key Functions
- `registerPaper(string paperId, bytes32 fileHash, string title, string subject, uint256 examTimestamp)`:
  Registers a new question paper on the blockchain. Anchors the SHA-256 hash.
- `approvePaper(string paperId, bytes signature)`:
  Approves a registered paper, transitioning status to `APPROVED`. Requires `EXAM_CONTROLLER_ROLE`.
- `assignPaper(string paperId, string centreId)`:
  Records on-chain authorization of a specific examination center for this paper.
- `authorizeCentre(string centreId, string centreCode, address adminWallet)`:
  Whitelists an examination center and maps its administrator wallet address.
- `authorizeDevice(string deviceId, string centreId, bytes32 fingerprintHash)`:
  Whitelists a physical workstation hardware device at a designated centre.
- `recordAccess(string paperId, string centreId, string deviceId, uint8 accessType, bool isAuthorized, string reason)`:
  Emits an immutable record of every access attempt.
- `releasePaper(string paperId, string centreId, string deviceId)`:
  Marks paper as unlocked/released for the designated center during the official exam window.
- `verifyPaper(string paperId, bytes32 fileHash) returns (bool isValid)`:
  Public verification view function confirming whether a submitted file hash matches the ledger.
- `revokePaper(string paperId, string reason)`:
  Emergency kill-switch function. Instantly revokes a paper across all centres worldwide.
- `recordIncident(string incidentType, string paperId, string centreId, string description)`:
  Logs critical security events (tampering, premature breach attempts) permanently to the ledger.

---

## 3. Mock Blockchain Engine (`MockBlockchainService`)

For local development, unit testing, and offline hackathon demonstrations, VeriQ includes an enterprise-grade Python blockchain engine (`backend/app/services/blockchain_service.py`):
- **Real Cryptographic Blocks**: Each block includes `index`, `timestamp`, `transactions`, `previous_hash`, `merkle_root`, `nonce`, and `hash`.
- **SHA-256 Chaining**: Every block hash satisfies `SHA256(index + timestamp + previous_hash + merkle_root + nonce)`.
- **Merkle Tree Computation**: Transactions within a block are paired and hashed recursively into an authentic Merkle Root digest.
- **Persistence**: Blocks and transaction receipts are stored in the SQLite/PostgreSQL `blockchain_transactions` table for fast querying by the frontend Blockchain Explorer.
