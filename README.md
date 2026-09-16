# VeriQ — Secure Examination Paper Distribution Using Blockchain

> **Secure Every Question Paper. Verify Every Action.**  
> Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Python 3.13](https://img.shields.io/badge/Python-3.13-3776AB.svg?logo=python)](https://python.org)
[![Solidity](https://img.shields.io/badge/Smart%20Contract-Solidity%200.8.20-363636.svg?logo=solidity)](https://soliditylang.org)

---

## 📖 Executive Summary

**VeriQ** is an enterprise-grade examination paper lifecycle and distribution platform built for national examination authorities, educational boards, and certification bodies. 

Traditional examination workflows suffer from catastrophic single points of failure: premature leaks through corrupt intermediaries, physical tampering in transit, unauthorized downloads from unvetted devices, and complete lack of non-repudiable audit logs.

VeriQ solves this by combining:
1. **Off-Chain Authenticated AES-256-GCM Envelope Encryption**: Sensitive paper contents are never exposed on a public ledger.
2. **On-Chain Cryptographic Proof Anchoring**: Document SHA-256 digests, multi-signature authority approvals, and center authorizations are anchored onto an immutable blockchain ledger.
3. **Multi-Factor Time-Lock Policy Engine**: Decryption keys and ephemeral release endpoints enforce strict time-windows (e.g. 30 minutes before exam start), verified center IP subnets, and whitelisted hardware device fingerprints.
4. **Instant Tamper Detection & Non-Repudiation**: Any bit-level modification of an exam paper is flagged instantly via cryptographic hash comparison against the blockchain block.

---

## 🏛️ Architecture Overview

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

## ⚡ Quickstart

### Prerequisites
- Node.js `v20+` or `v22+`
- pnpm `v10+` or `v11+`
- Python `3.11+` (Python 3.13 supported)

### 1. Clone & Install Dependencies
```bash
# In repository root:
pnpm install
```

### 2. Launch Backend API Server
```bash
cd backend
source venv/bin/activate
# Pre-seed realistic examinations, centres, papers, and blockchain blocks:
python scripts/seed_data.py
# Start FastAPI server on port 8000:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Interactive Swagger API Documentation: `http://localhost:8000/docs`
* API Health Check: `http://localhost:8000/api/v1/healthz`

### 3. Launch Frontend Web App
```bash
# In a second terminal (root directory):
pnpm --filter @veriq/frontend run dev
```
* Web Dashboard: `http://localhost:3000`

---

## 👥 Demo Personas (Pre-seeded Accounts)

| Role | Email | Password | Capability |
|---|---|---|---|
| **Central Authority** | `authority@veriq.local` | `password123` | Full administrative control, create papers, assign centres |
| **Exam Controller** | `controller@veriq.local` | `password123` | Sign & approve papers to advance blockchain state |
| **Centre Superintendent** | `superintendent.delhi@veriq.local` | `password123` | Time-locked decrypt-and-release at assigned centre |
| **Auditor / Inspector** | `auditor@veriq.local` | `password123` | Independent hash integrity verification & chain of custody |
| **Security Operations** | `secops@veriq.local` | `password123` | Live threat monitor, incident triage, remote emergency revocation |

---

## 🛡️ Hackathon Stress Tests (1-Click Simulations)

A live attack simulation banner is built directly into the top navigation bar of the application:
1. **Premature Access Attempt**: Evaluates time-lock policy, blocks early release, and records an access denial transaction on the blockchain.
2. **Document Tamper Detection**: Compares tampered file SHA-256 against on-chain block digest, raises critical alert, and flags an incident.
3. **Rogue Hardware Device**: Simulates access attempt from unregistered MAC/Device ID, automatically rejected by perimeter policy.

---

## 📂 Repository Structure

```
├── backend/                   # Python FastAPI Backend
│   ├── app/
│   │   ├── api/v1/            # Modular REST API routes
│   │   ├── core/              # Config, Security, JWT & Bcrypt
│   │   ├── db/                # Async SQLAlchemy Session & Base
│   │   ├── models/            # Database Entities
│   │   ├── schemas/           # Pydantic v2 Request/Response Schemas
│   │   └── services/          # Encryption, Hashing, Blockchain & Access Control
│   ├── scripts/               # Database seeding scripts
│   ├── tests/                 # Automated pytest test suite
│   └── storage/               # Encrypted question paper storage
├── frontend/                  # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/        # UI Kit, Layout, Badges, Modals, HashViewer
│   │   ├── pages/             # Dashboard, Papers, Verify, TimeLock, Blockchain, etc.
│   │   ├── services/          # Axios API Client & Endpoints
│   │   └── store/             # AuthContext & Session Store
├── blockchain/                # Smart Contract & Web3
│   └── contracts/
│       └── VeriQLedger.sol    # Solidity Smart Contract
├── shared/                    # Shared TypeScript Types & Constants
├── docs/                      # Architectural, Security & API Documentation
│   ├── architecture.md
│   ├── security.md
│   ├── blockchain.md
│   ├── database.md
│   ├── api.md
│   ├── deployment.md
│   └── demo.md
├── docker-compose.yml         # Containerized production stack
└── package.json               # Monorepo configuration
```

---

## 📜 License
This project is licensed under the MIT License.