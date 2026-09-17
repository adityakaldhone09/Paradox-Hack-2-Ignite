<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="frontend/public/assets/veriq-logo-full-dark.png">
  <img src="frontend/public/assets/veriq-logo-full.png" alt="VeriQ Logo" width="220" />
</picture>

# VeriQ — Secure Examination Paper Distribution Using Blockchain

**Secure Every Question Paper. Verify Every Action.**

*National Examination Lifecycle, Envelope Encryption, Time-Locked Decryption & Tamper-Evident Blockchain Proof Architecture*

---

[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-WB--03-ff6b6b.svg?style=for-the-badge&logo=target)](https://github.com)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Plane%20Zero--Plaintext-4ecdc4.svg?style=for-the-badge&logo=diagram-next)](docs/07_SYSTEM_ARCHITECTURE.md)
[![Security Grade](https://img.shields.io/badge/Security-10--Gate%20Release%20Engine-1a535c.svg?style=for-the-badge&logo=shield)](docs/11_SECURITY_ARCHITECTURE.md)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11+-009688.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Solidity](https://img.shields.io/badge/Smart%20Contract-Solidity%200.8.20+-363636.svg?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](LICENSE)

[Architecture](#-system-architecture) • [10-Gate Engine](#-10-gate-deterministic-release-engine) • [Live Demos](#-demo-personas--role-based-access) • [Threat Simulations](#-attack-simulation--security-testing) • [Docs Suite](#-enterprise-documentation-suite) • [Quickstart](#-quickstart--local-setup)

---

</div>

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [Key Security Invariants & Value Pillars](#-key-security-invariants--value-pillars)
- [System Architecture](#-system-architecture)
  - [High-Level Dual-Plane Topology](#1-high-level-dual-plane-topology)
  - [End-to-End Examination Lifecycle Flow](#2-end-to-end-examination-lifecycle-flow)
  - [Cryptographic Envelope Encryption Model](#3-cryptographic-envelope-encryption-model)
- [10-Gate Deterministic Release Engine](#-10-gate-deterministic-release-engine)
- [Demo Personas & Role-Based Access (RBAC)](#-demo-personas--role-based-access-rbac)
- [Attack Simulation & Security Testing](#-attack-simulation--security-testing)
- [Enterprise Documentation Suite](#-enterprise-documentation-suite)
- [Repository Structure](#-repository-structure)
- [Quickstart & Local Setup](#-quickstart--local-setup)
  - [Prerequisites](#prerequisites)
  - [Installation & Seeding](#1-installation--seeding)
  - [Running the Application](#2-running-the-application)
  - [Running Automated Tests](#3-running-automated-tests)
- [API & Swagger Documentation](#-api--swagger-documentation)
- [Delivery Roadmap](#-delivery-roadmap)
- [License](#-license)

---

## 📖 Executive Summary

High-stakes national and state-level examinations (e.g., recruitment, university entrances, professional certifications) face continuous security threats: physical transit leaks, corrupt custodial intermediaries, premature unauthorized digital decryption, unvetted release devices, and audit tampering.

**VeriQ** (*Problem Statement WB-03*) is an enterprise-grade, cryptographically verifiable examination lifecycle and distribution platform. It decouples high-performance off-chain content delivery from immutable on-chain integrity proofs, enforcing strict multi-factor time-locks and cryptographic non-repudiation across the entire lifecycle of an examination paper.

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 TRADITIONAL EXAM SYSTEMS                │
                  │  ❌ Plaintext database storage                           │
                  │  ❌ Centralized mutable logs (easy insider tampering)   │
                  │  ❌ Loose manual time/approval coordination             │
                  │  ❌ Zero device or center biometric binding             │
                  └─────────────────────────────────────────────────────────┘
                                               │
                                       TRANSFORMED INTO
                                               ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │                   VERIQ SECURE FABRIC                   │
                  │  ✅ Off-Chain AES-256-GCM Envelope Encryption           │
                  │  ✅ On-Chain Merkle Hash Registry (Ethereum / EVM)      │
                  │  ✅ Hardware Fingerprinted + IP-Whitelisted Release     │
                  │  ✅ 10-Gate Deterministic Verification Engine           │
                  │  ✅ Advisory AI Threat Telemetry & Incident Triage      │
                  └─────────────────────────────────────────────────────────┘
```

---

## 🛡️ Key Security Invariants & Value Pillars

1. **Zero Plaintext Persistence Guarantee**: Unencrypted examination question papers and raw Data Encryption Keys (DEKs) are never written to disk, PostgreSQL databases, S3 buckets, log streams, or blockchain calldata.
2. **Dual-Plane Architecture**: Decouples the **Off-Chain Secure Data Plane** (FastAPI, Redis, PostgreSQL/Object Storage) from the **On-Chain Control Plane** (EVM Smart Contracts, Merkle Anchors, Immutable Access Ledger).
3. **Deterministic 10-Gate Release Engine**: Decryption keys can only be retrieved if all 10 independent verification gates pass in strict order. Any single failure triggers immediate fail-closed denial and emits security telemetry.
4. **Decoupled Blockchain Anchoring**: Exam release execution is asynchronous and decoupled from public/consortium blockchain block confirmation latency, ensuring deterministic center releases under any network conditions.
5. **Advisory-Only Threat Telemetry**: Built-in AI anomaly detection evaluates access behavioral telemetry to assist SecOps teams, while maintaining strict zero-authority boundaries over core authorization or cryptographic key release.

---

## 🏛️ System Architecture

### 1. High-Level Dual-Plane Topology

```mermaid
flowchart TD
    subgraph ClientLayer["🖥️ Client Presentation Plane (React 19 + TypeScript)"]
        UI_Admin["Central Authority Portal"]
        UI_Center["Center Superintendent Terminal\n(Hardware Bound + IP Scoped)"]
        UI_Auditor["Independent Auditor & Explorer"]
        UI_SecOps["Live Threat & Anomaly Console"]
    end

    subgraph SecurityBoundary["🛡️ Core Application & Security Gateway"]
        APIGW["FastAPI API Gateway\n(OAuth2 / JWT + CORS + Rate Limiting)"]
        RBAC["Fine-Grained RBAC & Center Scoping"]
        TenGates["10-Gate Deterministic Release Engine"]
        ThreatEngine["Advisory Threat Engine\n(Behavioral & Telemetry Analytics)"]
    end

    subgraph DataPlane["🔒 Off-Chain Data Plane (Confidential Storage)"]
        Vault["KMS / Envelope Key Vault\n(Encrypted DEKs / KEK Wrapped)"]
        CipherStorage["Ciphertext Object Store\n(/storage/encrypted AES-256-GCM)"]
        RelationalDB["Relational Persistence\n(PostgreSQL / SQLAlchemy Async)"]
        Cache["Redis State Cache & NTP Time Sync"]
    end

    subgraph BlockchainPlane["⛓️ On-Chain Control Plane (Immutable Ledger)"]
        Contract["VeriQLedger.sol (Solidity 0.8.20+)"]
        HashRegistry["Document SHA-256 Digest Registry"]
        MultiSigApproval["Authority Approval Signatures"]
        ImmutableAudit["Append-Only Audit & Access Trail"]
    end

    UI_Admin -->|Upload & Sign Paper| APIGW
    UI_Center -->|Time-Locked Release Request| APIGW
    UI_Auditor -->|Verify Integrity & Proofs| APIGW
    UI_SecOps -->|Stream Incident Telemetry| APIGW

    APIGW --> RBAC
    RBAC --> TenGates
    TenGates --> ThreatEngine
    
    TenGates -->|1. Validate Scope & Time| Cache
    TenGates -->|2. Verify Digest & State| RelationalDB
    TenGates -->|3. Fetch Wrapped DEK| Vault
    TenGates -->|4. Retrieve Ciphertext| CipherStorage
    
    APIGW -->|Async Batch Anchoring / Query| Contract
    Contract --> HashRegistry
    Contract --> MultiSigApproval
    Contract --> ImmutableAudit
```

---

### 2. End-to-End Examination Lifecycle Flow

```mermaid
sequenceDiagram
    autonumber
    actor Authority as Central Authority
    actor Controller as Exam Controller
    participant API as VeriQ Core API
    participant KMS as Key Vault (KMS)
    participant Storage as Off-Chain Storage
    participant Ledger as Blockchain Ledger
    actor Center as Center Superintendent

    %% Phase 1: Creation & Encryption
    Note over Authority, Storage: Phase 1: Creation, Envelope Encryption & Anchoring
    Authority->>API: 1. Upload Question Paper (PDF / QTI)
    API->>KMS: 2. Generate Random 256-bit DEK
    API->>API: 3. AES-256-GCM Encrypt (Payload + Nonce + Tag)
    API->>KMS: 4. Wrap DEK with Master KEK
    API->>Storage: 5. Store Ciphertext & Wrapped DEK
    API->>API: 6. Compute SHA-256 Hash of Plaintext & Ciphertext
    API->>Ledger: 7. Anchor Document Hash & Metadata on Blockchain (PENDING_ANCHOR)
    
    %% Phase 2: Multi-Sig Approval
    Note over Controller, Ledger: Phase 2: Multi-Signature Approval
    Controller->>API: 8. Verify Digest & Approve Distribution
    API->>Ledger: 9. Record Controller Approval Signature

    %% Phase 3: Time-Locked Center Release
    Note over Center, Ledger: Phase 3: 10-Gate Evaluation & Time-Locked Release
    Center->>API: 10. Request Decryption (Center ID, Device MAC, TOTP, Time)
    API->>API: 11. Execute Deterministic 10-Gate Verification
    alt Any Gate Fails
        API->>Ledger: 12a. Log Security Violation / Unauthorized Attempt
        API-->>Center: 12b. 403 Forbidden (Detailed Reason Redacted)
    else All 10 Gates Pass
        API->>KMS: 13. Unwrap DEK into Ephemeral Memory
        API->>Storage: 14. Read Ciphertext Envelope
        API->>API: 15. Ephemeral In-Memory Decrypt (Zero Disk Write)
        API->>Ledger: 16. Queue Release Audit Event (Async Anchor)
        API-->>Center: 17. Stream Decrypted Document Stream (Watermarked)
    end
```

---

### 3. Cryptographic Envelope Encryption Model

```mermaid
flowchart LR
    subgraph Ingestion["1. Document Ingestion"]
        Plaintext["Plaintext Paper (PDF)"]
        DEK["Ephemeral DEK\n(AES-256 Key)"]
        IV["Unique IV / Nonce\n(12-byte)"]
    end

    subgraph CryptoEngine["2. Authenticated Encryption"]
        GCM["AES-256-GCM Engine"]
        KEK["Master KEK / KMS"]
    end

    subgraph PersistedArtifacts["3. Cryptographic Artifacts"]
        Ciphertext["Ciphertext Payload\n(.enc file)"]
        AuthTag["Auth Tag (16-byte)"]
        WrappedDEK["Wrapped DEK\n(Encrypted with KEK)"]
        DocDigest["Plaintext SHA-256 Digest"]
    end

    subgraph Targets["4. Target Destinations"]
        OffChainDest["Off-Chain Storage\n(/storage/encrypted)"]
        OnChainDest["Blockchain State\n(VeriQLedger.sol)"]
    end

    Plaintext --> GCM
    DEK --> GCM
    IV --> GCM
    GCM --> Ciphertext
    GCM --> AuthTag
    
    DEK --> KEK
    KEK --> WrappedDEK
    Plaintext --> DocDigest

    Ciphertext --> OffChainDest
    AuthTag --> OffChainDest
    WrappedDEK --> OffChainDest
    DocDigest --> OnChainDest
```

---

## 🔒 10-Gate Deterministic Release Engine

To prevent premature access, insider leaks, or unauthorized downloads, the **10-Gate Release Engine** evaluates release requests strictly in sequential order. A failure at any gate immediately halts execution and enters a secure fail-closed state:

| Gate | Gate Name | Enforcement Check | Failure Outcome |
|:---:|:---|:---|:---|
| **G1** | **Authentication Gate** | Validates signed JWT token, signature validity, and active session state. | `401 Unauthorized` |
| **G2** | **Role Authorization Gate** | Asserts caller possesses `CENTER_SUPERINTENDENT` or `EXAM_CONTROLLER` role. | `403 Forbidden` |
| **G3** | **Center Scope Gate** | Validates caller is explicitly assigned to the specific exam center ID requested. | `403 Forbidden` |
| **G4** | **Device Hardware Gate** | Compares client hardware MAC/UUID & IP against whitelisted center perimeter list. | `403 Forbidden (Device Mismatch)` |
| **G5** | **Server UTC Time-Lock** | Authoritative NTP-synchronized server clock is within `[T - Δt, T + exam_duration]`. | `425 Too Early / 410 Expired` |
| **G6** | **Version Lock Gate** | Asserts requested paper version matches latest approved & published version. | `409 Conflict` |
| **G7** | **Emergency Revocation Gate** | Confirms examination status is not `REVOKED`, `SUSPENDED`, or `FLAGGED`. | `423 Locked` |
| **G8** | **Ciphertext Hash Integrity** | Compares on-disk ciphertext SHA-256 with stored cryptographic manifest. | `500 Integrity Corrupted` |
| **G9** | **KMS Key Unwrap Gate** | Ephemeral unwrap of DEK using hardware-backed Master Key Encryption Key (KEK). | `500 Key Unwrap Error` |
| **G10** | **Audit & Blockchain Queue** | Dispatches access audit transaction to persistent DB & asynchronous blockchain queue. | `500 Audit Queue Failure` |

---

## 👥 Demo Personas & Role-Based Access (RBAC)

The pre-seeded database includes 4 distinct operational personas to demonstrate end-to-end segregation of duties:

| Persona / Role | Demo Email | Demo Password | Core Responsibilities |
|:---|:---|:---|:---|
| **Super Admin** (`SUPER_ADMIN`) | `admin@veriq.local` | `password123` | Full governance, examination scheduling, paper approvals, security monitoring, and cryptographic audit oversight. |
| **Paper Setter** (`PAPER_SETTER`) | `setter@veriq.local` | `password123` | Examination question paper authoring, AES-256-GCM encryption, SHA-256 hashing, and custody submission. |
| **Centre Admin** (`CENTRE_ADMIN`) | `centre@veriq.local` | `password123` | Assigned examination oversight, terminal device authorizations, local release scheduling, and incident triage. |
| **Invigilator** (`INVIGILATOR`) | `invigilator@veriq.local` | `password123` | Proctoring hall operations, terminal hardware validation, time-locked paper verification, and integrity checks. |


---

## 🛡️ Attack Simulation & Security Testing

VeriQ includes built-in interactive attack simulations to validate security controls in real time:

```
[ LIVE THREAT SIMULATION CONSOLE ]
  ├── 🚨 Scenario 1: Premature Access Attempt (Evaluates Gate 5 Time-Lock Engine)
  ├── 🚨 Scenario 2: Bit-Level Document Tampering (Evaluates Gate 8 SHA-256 Integrity)
  ├── 🚨 Scenario 3: Rogue Hardware Device / IP Spoof (Evaluates Gate 4 Hardware Binding)
  ├── 🚨 Scenario 4: Cross-Center Scope Escalation (Evaluates Gate 3 Center Scope)
  └── 🚨 Scenario 5: Emergency Revocation Lockdown (Evaluates Gate 7 Emergency Circuit Breaker)
```

Each simulation triggers instantaneous UI alerts, logs defensive telemetry to the SecOps dashboard, and emits an immutable audit event.

---

## 📚 Enterprise Documentation Suite

The complete engineering and architecture specification for VeriQ is frozen under the [`docs/`](docs/) directory:

| ID | Document | Purpose & Scope | Status |
|:---:|:---|:---|:---:|
| **01** | [Repository Baseline Audit](docs/01_REPOSITORY_AUDIT.md) | Comprehensive audit of codebase, test inventory, and current gaps. | `v1.0.0 Frozen` |
| **02** | [Product Blueprint](docs/02_PRODUCT_BLUEPRINT.md) | Vision, problem framing, multi-persona architecture, and system pillars. | `v1.0.0 Frozen` |
| **03** | [Problem Statement](docs/03_PROBLEM_STATEMENT.md) | Formal problem analysis for WB-03 national examination distribution. | `v1.0.0 Frozen` |
| **04** | [Market & Competitive Research](docs/04_MARKET_RESEARCH.md) | Regulatory landscape (NTA, CBSE, UPSC), competitor analysis & compliance. | `v1.0.0 Frozen` |
| **05** | [Product Requirements (PRD)](docs/05_PRODUCT_REQUIREMENTS.md) | Functional requirements, user stories, acceptance criteria, and edge cases. | `v1.0.0 Frozen` |
| **06** | [Technical Requirements (TRD)](docs/06_TECHNICAL_REQUIREMENTS.md) | Non-functional requirements, cryptographic specs, latency SLAs, and scales. | `v1.0.0 Frozen` |
| **07** | [System Architecture](docs/07_SYSTEM_ARCHITECTURE.md) | Deep dual-plane design, module specifications, and component boundaries. | `v1.0.1 Frozen` |
| **08** | [AI Architecture](docs/08_AI_ARCHITECTURE.md) | Advisory threat intelligence, telemetry modeling, and human-in-the-loop limits. | `v1.0.2 Frozen` |
| **09** | [Database Design](docs/09_DATABASE_DESIGN.md) | Relational schema, indexes, state machine constraints, and ER diagrams. | `v1.0.1 Frozen` |
| **10** | [API Specification](docs/10_API_SPECIFICATION.md) | OpenAPI REST contracts, request/response models, and error structures. | `v1.0.0 Frozen` |
| **11** | [Security Architecture](docs/11_SECURITY_ARCHITECTURE.md) | Threat modeling (STRIDE), KMS key hierarchy, and 10-Gate security engine. | `v1.0.0 Frozen` |
| **12** | [UI/UX Design](docs/12_UI_UX_DESIGN.md) | Design system, persona workflows, responsive wireframes, and design tokens. | `v1.0.0 Frozen` |
| **13** | [Deployment Architecture](docs/13_DEPLOYMENT.md) | Container orchestration, Docker Compose, environment configs, and CI/CD. | `v1.0.0 Frozen` |
| **14** | [Testing Strategy](docs/14_TESTING_STRATEGY.md) | Verification matrix, unit/integration test suites, and cryptographic tests. | `v1.0.0 Frozen` |
| **15** | [Implementation Roadmap](docs/15_ROADMAP.md) | Dependency-aware execution roadmap, delivery phases, and milestones. | `v1.0.0 Frozen` |

---

## 📂 Repository Structure

```text
Paradox-Hack-2-Ignite/
├── backend/                       # Python FastAPI Core Application
│   ├── app/
│   │   ├── api/v1/                # Versioned REST API endpoints (auth, papers, audit, etc.)
│   │   ├── core/                  # Security, JWT, hashing, config settings
│   │   ├── db/                    # SQLAlchemy async engine, session, and models
│   │   ├── models/                # Database ORM entities (User, Paper, Center, Block)
│   │   ├── schemas/               # Pydantic v2 validation & serialization schemas
│   │   └── services/              # 10-Gate Engine, AES-GCM Crypto, Blockchain Anchor
│   ├── scripts/                   # Database seeding and migration utilities
│   ├── storage/                   # Encrypted off-chain paper repository (backend/storage/encrypted_papers)
│   └── tests/                     # Automated pytest test suite
│
├── frontend/                      # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/            # UI Kit, Layout (Modular Sidebar, Topbar), Modals, HashViewer
│   │   ├── config/                # Centralized role and navigation configurations
│   │   ├── types/                 # Strongly typed domain models (auth, papers, exams, etc.)
│   │   ├── pages/                 # Role Dashboards, Papers, Release, Verify, SecOps, Blockchain
│   │   ├── services/              # Axios API client with token interceptors & domain services
│   │   └── store/                 # State management & authentication context
│   └── index.html
│
├── blockchain/                    # Web3 & Smart Contracts Layer
│   └── contracts/
│       └── VeriQLedger.sol        # Solidity smart contract for hash registry & audit proofs
│
├── shared/                        # Shared TypeScript types & cross-workspace constants
├── docs/                          # Complete 15-document frozen enterprise architecture suite
├── docker-compose.yml             # Local containerized infrastructure orchestration
├── package.json                   # Monorepo scripts (concurrently dev runner)
└── pnpm-workspace.yaml            # PNPM workspace configuration
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **pnpm**: `v9.x` or `v10.x`
- **Python**: `3.11+` (Python 3.12 / 3.13 supported)
- **Git**

---

### 1. Installation & Seeding

```bash
# Clone the repository
git clone https://github.com/shlok926/Paradox-Hack-2-Ignite.git
cd Paradox-Hack-2-Ignite

# Install root & frontend dependencies
pnpm install

# Setup Python Virtual Environment for Backend
cd backend
python -m venv venv

# Activate Virtual Environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# OR Linux / macOS:
# source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Seed pre-configured examination personas, centers, and papers
python scripts/seed_data.py
cd ..
```

---

### 2. Running the Application

You can start both backend and frontend concurrently with a single command from the root directory:

```bash
# Start both Backend (FastAPI :8000) and Frontend (Vite :3000)
pnpm run dev
```

Or run them individually in separate terminals:

```bash
# Terminal 1: Backend API Server
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Frontend Client
cd frontend
pnpm run dev
```

- 🌐 **Web Application Portal**: [http://localhost:3000](http://localhost:3000)
- 📚 **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🩺 **API Health Check**: [http://localhost:8000/api/v1/healthz](http://localhost:8000/api/v1/healthz)

---

### 3. Running Automated Tests

```bash
# Run Backend Pytest Suite
pnpm run test:backend

# Run Frontend Vitest Suite
pnpm run test:frontend
```

---

## 📡 API & Swagger Documentation

VeriQ provides interactive API documentation generated directly from Pydantic schemas:

| Endpoint Group | Route Prefix | Description |
|:---|:---|:---|
| **Authentication** | `/api/v1/auth` | JWT token issuance, session refresh, and credential validation. |
| **Examinations** | `/api/v1/exams` | Examination creation, scheduling, center binding, and state query. |
| **Question Papers** | `/api/v1/papers` | Paper upload, AES-256-GCM encryption, approval multi-sig, and metadata. |
| **10-Gate Release** | `/api/v1/release` | Time-locked evaluation, key unwrapping, and stream decryption. |
| **Blockchain** | `/api/v1/blockchain` | On-chain ledger blocks, Merkle proof verification, and transaction feed. |
| **Audit & SecOps** | `/api/v1/audit` | Immutable audit trail querying, threat telemetry, and emergency locks. |

Access full interactive Swagger UI at `http://localhost:8000/docs` or ReDoc at `http://localhost:8000/redoc`.

## Deployment Readiness

Deployment follows a validate, stage, smoke test, promote, and monitor workflow.
Use [docs/deployment.md](docs/deployment.md) for supported commands and
[docs/production-checklist.md](docs/production-checklist.md) for release gates.
The environment contract, runtime topology, and recovery procedure are in
[docs/environment.md](docs/environment.md),
[docs/deployment-architecture.md](docs/deployment-architecture.md), and
[docs/disaster-recovery.md](docs/disaster-recovery.md).

---

## 🗺️ Delivery Roadmap

The VeriQ engineering execution strategy is structured into 5 phased milestones (see [15_ROADMAP.md](docs/15_ROADMAP.md) for detailed delivery tracking):

- **Phase 0: Baseline Stabilization & DevSecOps Foundation** *(Dockerfiles, Secrets, CI Pipeline)*
- **Phase 1: Deterministic 10-Gate Release Engine & Cryptographic Subsystem** *(AES-GCM, Multi-Sig)*
- **Phase 2: Asynchronous Blockchain Worker & Identity Hardening** *(Task Queue, Device Binding)*
- **Phase 3: Advisory AI Threat Telemetry & SecOps Incident Response** *(Anomaly Scoring, Alerts)*
- **Phase 4: Multi-Center Simulation, Performance Optimization & Pilot Readiness** *(Load Testing, Audit)*

---

## 📜 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for complete details.

---

<div align="center">
  <sub>Built for <strong>Paradox Hack 2.0 (Problem Statement WB-03)</strong> • Developed with ❤️ by Team VeriQ</sub>
</div>