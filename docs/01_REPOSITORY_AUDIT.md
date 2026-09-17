# 01 — Repository Audit: VeriQ Platform (WB-03)

**Document ID**: `VERIQ-AUD-01`  
**Evaluation Target**: `Paradox-Hack-2-Ignite`  
**Problem Statement**: WB-03 — Secure Examination Paper Distribution Using Blockchain  
**Product**: VeriQ — *Secure Every Question Paper. Verify Every Action.*  
**Audit Execution Date**: 2026-09-16  
**Status**: FROZEN BASELINE 🔒  
**Auditor Roles**: Senior Staff Software Architect, Cybersecurity Engineer, Blockchain Engineer, Technical Documentation Architect  
**Audit Mode**: Evidence-Based Codebase Audit (Non-Destructive, Zero Implementation Changes)

---

## 1. Executive Summary

This repository audit provides a rigorous, evidence-based assessment of the `Paradox-Hack-2-Ignite` repository, representing the current state of **VeriQ**—a secure chain-of-custody and controlled-release platform for examination question papers developed for problem statement **WB-03**.

### 1.1 Key Verdict
The codebase possesses an **operational core prototype** featuring a Python FastAPI asynchronous backend, a styled React 19 (Vite + Tailwind CSS) command center, off-chain AES-256-GCM envelope encryption, SHA-256 document hashing, and an in-process cryptographic transaction ledger with binary Merkle root trees.

However, a strict comparison between the **source implementation** and the **claims made in `README.md` and `docs/`** reveals substantial architectural divergences, mock subsystems, prototype shortcuts, and critical security bypasses:

1. **Dual Architecture / Orphaned Codebase**: The repository originated as a Replit workspace called `ExamChain` (Express 5, Node.js, Drizzle ORM, Orval codegen in `lib/` and `artifacts/`). It was subsequently superseded by a Python FastAPI + React Vite stack (`backend/`, `frontend/`, `blockchain/`). The legacy packages remain committed but are completely disconnected from the active application.
2. **Blockchain Subsystem Reality (Current vs. Target)**:
   - **Current State**: The active application relies exclusively on an in-memory, in-process Python simulated ledger ([MockBlockchainService](../backend/app/services/blockchain_service.py)). This simulated ledger mines synthetic blocks in RAM and resets to genesis whenever the backend restarts.
   - **Target State**: A Solidity smart contract ([VeriQLedger.sol](../blockchain/contracts/VeriQLedger.sol)) exists in source code, but there is **no Web3 integration, no compilation tooling (Hardhat/Foundry), no contract test suite, and no live network deployment**.
   - **Terminology Rule**: The current Python ledger is strictly an *in-process simulated ledger* and must **never** be described as "on-chain."
3. **Centralized Runtime Architecture**: The application currently runs as a centralized web service:
   $$\text{React SPA} \longrightarrow \text{FastAPI} \longrightarrow \text{SQLite} \longrightarrow \text{MockBlockchainService (RAM)}$$
   It does not operate as a decentralized system today.
4. **Critical Authentication Bypass (P0 Security Finding)**: In [backend/app/api/deps.py](../backend/app/api/deps.py#L16-L22), if an HTTP request omits the `Authorization` header, the dependency automatically falls back to impersonating `authority@veriq.local` (`SUPER_ADMIN` / `EXAM_AUTHORITY`). As a result, **every protected backend route is accessible without credentials**.
5. **Time-Lock Policy Bypass**: The time-lock policy engine in [backend/app/api/v1/access.py](../backend/app/api/v1/access.py#L32-L34) accepts an unauthenticated client payload parameter `override_time`, allowing any caller to bypass the release window check by declaring arbitrary evaluation timestamps.
6. **No Decrypted Payload Delivery**: While the system successfully evaluates permissions, approves papers, and logs incidents, `/api/v1/access/request` returns only an authorization status JSON. It never returns decryption keys or streams decrypted file contents to the examination centre. The documented endpoint `/api/v1/access/decrypt-and-release` does not exist in code.
7. **Containerization Broken**: [docker-compose.yml](../docker-compose.yml) specifies Dockerfile builds for `./backend` and `./frontend`, but **neither Dockerfile exists in the repository**. Running `docker compose up` fails immediately.
8. **Tracked Secrets and Binary Blobs**: The repository tracks `.env`, two separate binary SQLite databases (`veriq.db` and `backend/veriq.db`), 20 encrypted binary files, and 18 compiled Python `.pyc` files directly in Git history due to an incomplete `.gitignore`.

### 1.2 Component Implementation vs. End-to-End Workflow Status

To avoid confusing code existence with operational reality, this audit strictly separates *component implementation* from *end-to-end workflow viability*:

| Subsystem / Capability | Component Implementation State | End-to-End Operational Status | Notes / Blockers |
|---|---|---|---|
| **Document Encryption (AES-256-GCM)** | `[IMPLEMENTED + TESTED]` | **Working** | Encrypts & decrypts properly; static master key in configuration. |
| **Document Integrity Hashing (SHA-256)** | `[IMPLEMENTED + TESTED]` | **Working** | Hashes generated, verified, and anchored to in-process ledger. |
| **Cryptographic Tamper Detection** | `[IMPLEMENTED]` | **Working** | Recovers ciphertext, detects bit modification, logs `CRITICAL` incident. |
| **Chain-of-Custody Timeline** | `[IMPLEMENTED]` | **Working** | Records tx rows in SQLite; visualizes chronological history in UI. |
| **Time-Lock Evaluation Engine** | `[IMPLEMENTED]` | **Partial / Insecure** | Window logic works, but client can bypass via `override_time` payload. |
| **Workstation Device Verification** | `[IMPLEMENTED]` | **Partial / Buggy** | Database logic works, but UI sends mismatched hardcoded fingerprint string. |
| **Decrypted Paper Delivery** | `[NOT FOUND]` | **Non-Operational** | Evaluates access permissions, but never streams decrypted file bytes. |
| **Blockchain Transaction Ledger** | `[MOCKED]` | **Simulated (In-Memory)** | In-process Python blocks in RAM; not a real on-chain smart contract. |
| **Smart Contract (Solidity)** | `[DOCUMENTED ONLY]` | **Non-Operational** | Undeployed, uncompiled, unconnected to backend. |
| **Docker Container Deployment** | `[MOCKED / BROKEN]` | **Blocked** | Missing Dockerfiles in `backend/` and `frontend/`. |

---

## 2. Audit Scope

The audit covered the repository structure, tracked files, application source, configuration, tests, deployment files, documentation, and identified generated/legacy artifacts across:
- **Repository Root**: Build files, monorepo manifests, Docker configs, environment files.
- **Backend (`backend/`)**: Python FastAPI application, REST routers, SQLAlchemy ORM models, Pydantic schemas, cryptographic services, database seeds, and test suites.
- **Frontend (`frontend/`)**: React 19 SPA, Tailwind styling, Vite bundling, routing, state management, UI components, and API client integrations.
- **Blockchain (`blockchain/`)**: Solidity smart contract source code, mappings, events, and lifecycle methods.
- **Shared (`shared/`)**: Shared TypeScript types, enums, and constants.
- **Documentation (`docs/`, `README.md`, `replit.md`)**: Architectural, security, database, API, deployment, and demonstration guides.
- **Legacy Packages (`lib/`, `artifacts/`, `scripts/`)**: Leftover packages from earlier iterations.

---

## 3. Audit Methodology

The evaluation strictly followed an evidence-based hierarchy:
```
LEVEL 1 — Actual executable/source implementation
LEVEL 2 — Automated tests proving behavior
LEVEL 3 — Configuration/deployment implementation
LEVEL 4 — Seed/demo/mock implementation
LEVEL 5 — Documentation (docs/*.md)
LEVEL 6 — README claims
```

### Classification States:
- `[IMPLEMENTED]`: Actually implemented in source code and connected to application flow.
- `[IMPLEMENTED + TESTED]`: Implemented in source and verified by automated tests.
- `[PARTIAL]`: Source code exists, but complete workflow is incomplete, insecure, or severed.
- `[SIMULATED]`: Behavior simulated for demonstration; does not execute real-world flow.
- `[MOCKED]`: Replaced by static mock, fake, or synthetic data.
- `[SEEDED]`: Functionality depends purely on predefined seed/demo data.
- `[DOCUMENTED ONLY]`: Documented in markdown but absent in code.
- `[UNVERIFIED]`: Code appears to exist but cannot be validated in current setup.
- `[NOT FOUND]`: No trace found in the repository.

---

## 4. Repository Baseline

| Parameter | Value / State | Evidence |
|---|---|---|
| **Repository Name** | `Paradox-Hack-2-Ignite` | Git remote configuration |
| **Product Name** | `VeriQ` | [backend/app/core/config.py](../backend/app/core/config.py#L9) |
| **Problem Statement** | `WB-03 — Secure Examination Paper Distribution Using Blockchain` | [README.md](../README.md#L4) |
| **Audit Date** | 2026-09-16 | System timestamp |
| **Active Git Branch** | `main` | `git branch -v` (`092ff75`) |
| **Remote URL** | `https://github.com/shlok926/Paradox-Hack-2-Ignite.git` | `git remote -v` |
| **Latest Commit Hash** | `092ff75` | `git log -1` |
| **Latest Commit Message**| `Folder Management` | Commit log |
| **Working Tree Status**| Clean (no uncommitted edits) | `git status` |
| **Recent Git History** | `092ff75` (Folder Management)<br>`da603ec` (Final Setup)<br>`38d4fd7` (Restore workspace configuration...)<br>`b4cf28f` (Revert PR #1: Restore ExamChain codebase...) | `git log -n 5 --oneline` |
| **Package Managers** | `pnpm` (v10/v11 catalog workspace) & `pip` (Python 3.11–3.14) | [package.json](../package.json), [backend/requirements.txt](../backend/requirements.txt) |
| **Environment File** | `.env` tracked in Git (Matches `.env.example`) | `git ls-files .env` |

> [!CAUTION]
> **Secrets in Tracked Files**: `.env` is currently tracked in Git history and contains sensitive fallback values: `ENCRYPTION_KEY`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and database connection strings.

---

## 5. Repository Structure & Directory Inventory

```
Paradox-Hack-2-Ignite/
├── .env                              # [LEVEL 3] Tracked environment file (SECURITY RISK)
├── .env.example                      # [LEVEL 3] Sample environment file
├── .gitignore                        # [LEVEL 3] Insufficient ignore rules (lacks python, db, env)
├── README.md                         # [LEVEL 6] Marketing & feature overview
├── replit.md                         # [LEVEL 5] Original ExamChain Replit documentation
├── docker-compose.yml                # [LEVEL 3] Docker deployment config (Broken: missing Dockerfiles)
├── package.json                      # [LEVEL 3] Root monorepo orchestration scripts
├── pnpm-lock.yaml                    # [LEVEL 3] Lockfile for pnpm workspace
├── pnpm-workspace.yaml               # [LEVEL 3] Workspace definition
├── tsconfig.base.json                # [LEVEL 3] Base TypeScript config
├── tsconfig.json                     # [LEVEL 3] Root TypeScript config
├── veriq.db                          # [LEVEL 4] Tracked SQLite binary (Duplicate of backend/veriq.db)
├── artifacts/                        # [ORPHANED] Replit artifacts
│   └── mockup-sandbox/               # React mockup sandbox from earlier Replit template
├── backend/                          # [ACTIVE] Python FastAPI core
│   ├── app/
│   │   ├── main.py                   # App entrypoint, CORS, exception handlers
│   │   ├── api/
│   │   │   ├── deps.py               # Auth dependencies (Contains auth bypass)
│   │   │   └── v1/                   # 11 REST API routers
│   │   ├── core/                     # Configuration and JWT/Bcrypt helpers
│   │   ├── db/                       # Async SQLAlchemy engine & session factory
│   │   ├── models/                   # 10 SQLAlchemy entity definitions
│   │   ├── schemas/                  # Pydantic v2 validation models
│   │   └── services/                 # Crypto, hashing, access control, blockchain, anomaly
│   ├── scripts/
│   │   └── seed_data.py              # Database seeding script (Centres, users, papers, logs)
│   ├── storage/
│   │   └── encrypted_papers/         # Tracked encrypted binary files (*.enc)
│   ├── tests/                        # Pytest suite (3 files, 9 tests)
│   ├── pytest.ini                    # Pytest configuration
│   ├── requirements.txt              # Python dependency manifest
│   └── veriq.db                      # Tracked SQLite database
├── blockchain/                       # [PARTIAL] Smart contracts
│   └── contracts/
│       └── VeriQLedger.sol           # Solidity contract (Uncompiled, undeployed)
├── docs/                             # [LEVEL 5] Markdown documentation suite (7 documents)
├── frontend/                         # [ACTIVE] React 19 Vite application
│   ├── index.html                    # Single-page app HTML host
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.ts                # Vite server & reverse proxy configuration
│   ├── tailwind.config.ts            # Styling tokens and color schemes
│   └── src/
│       ├── App.tsx                   # Route definitions
│       ├── main.tsx                  # Client bootstrapping
│       ├── components/               # Shell, UI widgets, countdown timers, badges
│       ├── pages/                    # 12 operational views
│       ├── services/                 # Axios API client
│       └── store/                    # Auth context & automatic login
├── lib/                              # [ORPHANED] Legacy ExamChain packages
│   ├── api-client-react/             # Generated React Query hooks for OpenAPI
│   ├── api-spec/                     # OpenAPI 3.1 YAML for ExamChain Express
│   ├── api-zod/                      # Generated Zod validation schemas
│   └── db/                           # Drizzle ORM schema for PostgreSQL
├── screenshots/                      # UI preview screenshots
├── scripts/                          # Root developer shell scripts
├── shared/                           # [ACTIVE] Shared TypeScript constants and enums
└── storage/                          # [ORPHANED/DUPLICATE] Root-level encrypted files
```

---

## 6. Technology Stack — Actual vs. Documented

| Layer | Documented Technology | Actual Active Technology | Status | Evidence |
|---|---|---|---|---|
| **Backend Framework** | FastAPI (Python 3.13) | FastAPI 0.115.x + Uvicorn 0.30.x on Python 3.14.2 | `[IMPLEMENTED]` | [backend/app/main.py](../backend/app/main.py#L29) |
| **Backend ORM** | SQLAlchemy 2.0 Asyncio | SQLAlchemy 2.0.30 + aiosqlite 0.20.0 | `[IMPLEMENTED]` | [backend/app/db/session.py](../backend/app/db/session.py#L9) |
| **Database Engine** | SQLite (Dev) / PostgreSQL (Prod) | SQLite (`sqlite+aiosqlite:///./veriq.db`) only | `[PARTIAL]` | [backend/app/core/config.py](../backend/app/core/config.py#L33) (asyncpg missing in requirements) |
| **Frontend Core** | React 19 + TypeScript + Vite | React 19.1.0 + TypeScript 5.6.3 + Vite 6.0.3 | `[IMPLEMENTED]` | [frontend/package.json](../frontend/package.json#L11-L38) |
| **Frontend Styling** | Tailwind CSS + Framer Motion | Tailwind CSS 3.4.17 + Framer Motion 11.15.0 | `[IMPLEMENTED]` | [frontend/tailwind.config.ts](../frontend/tailwind.config.ts) |
| **HTTP Client** | Axios with JWT interceptors | Axios 1.7.9 configured with `/api/v1` base | `[IMPLEMENTED]` | [frontend/src/services/apiClient.ts](../frontend/src/services/apiClient.ts#L3-L17) |
| **Document Encryption** | AES-256-GCM | `cryptography.hazmat.primitives.ciphers.aead.AESGCM` | `[IMPLEMENTED + TESTED]` | [backend/app/services/encryption_service.py](../backend/app/services/encryption_service.py#L3-L30) |
| **Document Hashing** | SHA-256 (Plaintext & Ciphertext) | Standard library `hashlib.sha256` | `[IMPLEMENTED + TESTED]` | [backend/app/services/hashing_service.py](../backend/app/services/hashing_service.py#L6-L16) |
| **Digital Signatures** | Asymmetric ECDSA Ethereum Signatures | Symmetric `hmac.new(key, msg, sha256)` | `[SIMULATED]` | [backend/app/core/security.py](../backend/app/core/security.py#L46-L54) |
| **Blockchain** | Solidity Smart Contract / PoA Network | In-process Python Class (`MockBlockchainService`) | `[MOCKED]` | [backend/app/services/blockchain_service.py](../backend/app/services/blockchain_service.py#L55-L157) |
| **Smart Contract** | `VeriQLedger.sol` (Solidity ^0.8.20) | Source file present; uncompiled, undeployed | `[DOCUMENTED ONLY]` | [blockchain/contracts/VeriQLedger.sol](../blockchain/contracts/VeriQLedger.sol) |
| **Deployment** | Docker Compose with Nginx & Postgres | Docker Compose file present; Dockerfiles missing | `[MOCKED / BROKEN]` | [docker-compose.yml](../docker-compose.yml#L34-L58) |

---

## 7. Architecture — Reverse Engineered

The diagram below reflects the actual runtime architecture verified by inspecting source code:

```
                          ┌──────────────────────────────────────────────┐
                          │         React 19 Frontend (Vite SPA)         │
                          │   (Command Center, Explorer, Verify Views)   │
                          └──────────────────────┬───────────────────────┘
                                                 │
                                                 │ HTTP / Axios Client
                                                 │ (Proxy: :3000 -> :8000)
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │            FastAPI Backend Engine            │
                          │            (Port 8000, 11 Routers)           │
                          └──────┬───────────────┬───────────────┬───────┘
                                 │               │               │
            ┌────────────────────┴──┐            │        ┌──────┴────────────────────┐
            ▼                       ▼            │        ▼                           ▼
┌───────────────────────┐ ┌───────────────────┐  │  ┌───────────────────────┐ ┌───────────────────────┐
│  EncryptionService    │ │  HashingService   │  │  │ AccessControlService  │ │ AnomalyDetectionSvc   │
│  (AES-256-GCM AEAD)   │ │  (SHA-256/Merkle) │  │  │ (Time, Device, Centre)│ │ (Heuristic Risk Clf)  │
└───────────┬───────────┘ └─────────┬─────────┘  │  └───────────────────────┘ └───────────────────────┘
            │                       │            │
            ▼                       ▼            ▼
┌───────────────────────┐ ┌──────────────────────────────────────────┐
│ Off-Chain Storage     │ │ MockBlockchainService (In-Memory RAM)    │
│ (./storage/*.enc)     │ │ - Genesis + Mined Blocks                 │
│ - Ciphertext Binaries │ │ - Binary Merkle Tree Computation         │
└───────────────────────┘ └──────────────────────┬───────────────────┘
                                                 │ Mined Transaction Rows
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │     SQLite Database (backend/veriq.db)       │
                          │   (10 Relational Tables via Async SQLAlchemy)│
                          └──────────────────────────────────────────────┘
```

### Verified Runtime Flow:
1. **Paper Upload (`POST /api/v1/papers/upload`)**:
   - Accepts multipart file upload (PDF/binary up to 25MB).
   - `HashingService` generates raw plaintext SHA-256 digest.
   - `EncryptionService` generates a 12-byte random IV (`os.urandom(12)`), encrypts via AES-256-GCM, and produces a 16-byte authentication tag.
   - Ciphertext bytes are saved to `./storage/encrypted_papers/{uuid}.enc`.
   - `MockBlockchainService` mines a `PAPER_CREATED` block into Python RAM and returns a synthetic transaction hash `0x...`.
   - Database record is committed to `papers` and `blockchain_transactions`.
2. **Integrity Verification (`POST /api/v1/papers/{id}/verify`)**:
   - Reads the off-chain `.enc` file from disk.
   - Decrypts via `EncryptionService.decrypt` using stored IV and auth tag.
   - Computes SHA-256 of the recovered plaintext.
   - Compares recovered hash with the stored hash.
   - If `simulate_tamper=True` is provided, hash is deliberately corrupted to `"f"*64`.
   - On mismatch, automatically generates an `Incident` entity of type `HASH_MISMATCH` with `CRITICAL` severity and commits a `PAPER_VERIFIED` transaction.
3. **Time-Lock Evaluation (`POST /api/v1/access/request`)**:
   - Evaluates paper revocation status, user role, centre assignment, authorized device fingerprint, and time window.
   - Logs an `AccessEvent` and a `BlockchainTransaction`.
   - If access is denied, automatically logs an `Incident` (`EARLY_ACCESS` or `DEVICE_MISMATCH`).

---

## 8. Backend Audit

### 8.1 Backend Capability Matrix

| Capability | Implementation Method | Source Location | Connected? | Tested? | State | Evidence & Notes |
|---|---|---|---|---|---|---|
| **App Initialization** | FastAPI lifespan handler | [backend/app/main.py](../backend/app/main.py#L21-L34) | Yes | Yes | `[IMPLEMENTED]` | Initializes SQLite tables via `Base.metadata.create_all`. |
| **CORS Middleware** | Wildcard origins (`allow_origins=["*"]`) | [backend/app/main.py](../backend/app/main.py#L37-L43) | Yes | No | `[IMPLEMENTED]` | Permissive CORS configuration for development. |
| **User Authentication** | Bcrypt hash checking + JWT creation | [backend/app/api/v1/auth.py](../backend/app/api/v1/auth.py#L13-L47) | Yes | Yes | `[IMPLEMENTED + TESTED]` | Verified by `test_password_hashing` and `test_jwt_tokens`. |
| **Auth Dependency Bypass** | Default user fallback | [backend/app/api/deps.py](../backend/app/api/deps.py#L16-L22) | Yes | No | `[PARTIAL]` | Bypasses auth if Authorization header is missing. |
| **Paper Upload & Encryption**| AES-256-GCM + SHA-256 | [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py#L88-L194) | Yes | Partial | `[IMPLEMENTED]` | Uploads, encrypts, writes to disk, logs to simulated ledger. |
| **Paper Approval** | Sets APPROVED + HMAC signature | [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py#L270-L319) | Yes | Partial | `[IMPLEMENTED]` | Role-gated (`SUPER_ADMIN`, `EXAM_AUTHORITY`). |
| **Centre Assignment** | Links paper to centre with time window | [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py#L320-L395) | Yes | No | `[IMPLEMENTED]` | Populates `PaperCentreAssignment`. |
| **Emergency Revocation** | Status -> REVOKED + logs incident | [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py#L519-L559) | Yes | No | `[IMPLEMENTED]` | Revokes paper across all centres. |
| **Time-Lock Evaluation** | 5-point policy check | [backend/app/services/access_control_service.py](../backend/app/services/access_control_service.py#L8-L85) | Yes | No | `[IMPLEMENTED]` | Validates status, role, centre, device, window. |
| **Override Time Parameter**| Request payload time override | [backend/app/api/v1/access.py](../backend/app/api/v1/access.py#L32-L34) | Yes | No | `[SIMULATED]` | Enables clients to falsify server evaluation time. |
| **Decrypted File Streaming**| Stream decrypted PDF to client | `None` | No | No | `[NOT FOUND]` | `/access/request` returns JSON only; no file streaming endpoint exists. |
| **Integrity Verification** | Decrypt + SHA-256 recalculation | [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py#L435-L518) | Yes | Partial | `[IMPLEMENTED]` | Compares calculated vs anchored hash. |
| **Tamper Simulation** | Force hash corruption | [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py#L460-L463) | Yes | No | `[SIMULATED]` | Sets calculated hash to `"f"*64`. |
| **Chain-of-Custody Query** | Chronological tx ordering | [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py#L560-L602) | Yes | No | `[IMPLEMENTED]` | Queries `BlockchainTransaction` table. |
| **Blockchain Status API** | Network health metadata | [backend/app/api/v1/blockchain.py](../backend/app/api/v1/blockchain.py#L12-L15) | Yes | Yes | `[MOCKED]` | Returns hardcoded 14 peers and 0 Gwei gas. |
| **Blockchain Blocks API** | Returns block list | [backend/app/api/v1/blockchain.py](../backend/app/api/v1/blockchain.py#L16-L19) | Yes | No | `[PARTIAL]` | Blocks reside in volatile memory only. |
| **Security Heatmap API** | Centre risk scoring | [backend/app/api/v1/security.py](../backend/app/api/v1/security.py#L60-L81) | Yes | No | `[IMPLEMENTED]` | Calculates risk score: `(incidents*25) + (denials*15)`. |
| **Security Summary API** | System-wide threat level | [backend/app/api/v1/security.py](../backend/app/api/v1/security.py#L11-L59) | Yes | No | `[PARTIAL]` | Uses real counts, but hourly series is hardcoded. |
| **Incident Management** | List, acknowledge, resolve | [backend/app/api/v1/incidents.py](../backend/app/api/v1/incidents.py#L17-L117) | Yes | No | `[IMPLEMENTED]` | Full lifecycle for security incidents. |
| **Auditor Report API** | Aggregated compliance report | [backend/app/api/v1/audit.py](../backend/app/api/v1/audit.py#L11-L121) | Yes | No | `[IMPLEMENTED]` | Collates paper, custody, accesses, incidents. |
| **Attack Simulation API** | Trigger mock attacks | [backend/app/api/v1/demo.py](../backend/app/api/v1/demo.py#L14-L137) | Yes | No | `[SIMULATED]` | Injects incidents and access denials. |

---

## 9. Frontend Audit

### 9.1 Operational Views & Component Classification

| Page / Route | File Location | Backend Endpoint Dependencies | Classification | Evidence & Findings |
|---|---|---|---|---|
| **Landing Page** (`/`) | [frontend/src/pages/landing/LandingPage.tsx](../frontend/src/pages/landing/LandingPage.tsx) | None (Static routing) | `[IMPLEMENTED]` | Architectural overview, feature cards, login navigation. |
| **Login Page** (`/login`) | [frontend/src/pages/auth/LoginPage.tsx](../frontend/src/pages/auth/LoginPage.tsx) | `POST /auth/login`, `GET /auth/demo-users` | `[IMPLEMENTED]` | Working form + 1-click persona buttons. |
| **Command Center** (`/dashboard`) | [frontend/src/pages/dashboard/DashboardPage.tsx](../frontend/src/pages/dashboard/DashboardPage.tsx) | `GET /security/summary`, `GET /papers`, `GET /incidents` | `[IMPLEMENTED]` | Live metrics, Recharts hourly access graph, recent activity. |
| **Examinations** (`/examinations`) | [frontend/src/pages/examinations/ExaminationsPage.tsx](../frontend/src/pages/examinations/ExaminationsPage.tsx) | `GET /exams`, `POST /exams` | `[IMPLEMENTED]` | List exams, search/filter, create modal. |
| **Question Papers** (`/papers`) | [frontend/src/pages/papers/PapersPage.tsx](../frontend/src/pages/papers/PapersPage.tsx) | `GET /papers`, `POST /papers/upload` | `[IMPLEMENTED]` | Paper catalogue, status badges, upload modal with file input. |
| **Paper Detail** (`/papers/:id`) | [frontend/src/pages/papers/PaperDetailPage.tsx](../frontend/src/pages/papers/PaperDetailPage.tsx) | `GET /papers/{id}`, `POST .../approve`, `POST .../assign-centre`, `POST .../revoke` | `[IMPLEMENTED]` | Full paper inspection, approval button, centre assignment. |
| **Integrity Verification** (`/verify`) | [frontend/src/pages/papers/VerifyIntegrityPage.tsx](../frontend/src/pages/papers/VerifyIntegrityPage.tsx) | `GET /papers`, `POST /papers/{id}/verify` | `[IMPLEMENTED]` | Verification runner with legitimate hash matching and tamper simulation. |
| **Time-Lock Release** (`/release`) | [frontend/src/pages/papers/TimeLockReleasePage.tsx](../frontend/src/pages/papers/TimeLockReleasePage.tsx) | `GET /papers`, `GET /centres`, `POST /access/request` | `[PARTIAL]` | Live countdown timer works, but sends hardcoded fingerprint `DEV_FINGERPRINT_C101_HARDWARE_TPM_SECURE`. |
| **Chain of Custody** (`/custody`) | [frontend/src/pages/papers/ChainOfCustodyPage.tsx](../frontend/src/pages/papers/ChainOfCustodyPage.tsx) | `GET /papers`, `GET /papers/{id}/chain-of-custody` | `[IMPLEMENTED]` | Visual chronological timeline of simulated ledger transactions. |
| **Blockchain Explorer** (`/blockchain`) | [frontend/src/pages/blockchain/BlockchainExplorerPage.tsx](../frontend/src/pages/blockchain/BlockchainExplorerPage.tsx) | `GET /blockchain/status`, `GET /blockchain/blocks`, `GET /blockchain/transactions` | `[SIMULATED]` | Visualizes in-memory Python blocks, Merkle roots, and transactions. |
| **Centres & Devices** (`/centres`) | [frontend/src/pages/centres/CentresPage.tsx](../frontend/src/pages/centres/CentresPage.tsx) | `GET /centres`, `POST /centres`, `POST /devices` | `[IMPLEMENTED]` | Centre directory, device registration, authorization toggles. |
| **Security Operations** (`/security`) | [frontend/src/pages/security/SecurityOpsPage.tsx](../frontend/src/pages/security/SecurityOpsPage.tsx) | `GET /security/summary`, `GET /security/heatmap`, `GET /security/threat-feed` | `[IMPLEMENTED]` | Threat radar, centre risk heatmap, active threat feed. |
| **Incident Alerts** (`/incidents`) | [frontend/src/pages/incidents/IncidentsPage.tsx](../frontend/src/pages/incidents/IncidentsPage.tsx) | `GET /incidents`, `POST .../acknowledge`, `POST .../resolve` | `[IMPLEMENTED]` | Incident queue with acknowledge and resolve dialogs. |
| **Auditor Portal** (`/audit`) | [frontend/src/pages/audit/AuditorPortalPage.tsx](../frontend/src/pages/audit/AuditorPortalPage.tsx) | `GET /papers`, `GET /audit/report/{paperId}` | `[IMPLEMENTED]` | Formal compliance auditor report generation. |

---

## 10. Blockchain Audit

### 10.1 Smart Contract Assessment (`VeriQLedger.sol`)
The contract [blockchain/contracts/VeriQLedger.sol](../blockchain/contracts/VeriQLedger.sol) was written for Solidity `^0.8.20`.

```solidity
contract VeriQLedger {
    address public immutable owner;
    // ...
    struct PaperRecord {
        string paperId;
        string examId;
        bytes32 documentHash;
        string version;
        address registeredBy;
        uint256 registeredAt;
        bool isApproved;
        bool isReleased;
        bool isRevoked;
        string revocationReason;
    }
}
```

#### Smart Contract Discrepancies & Limitations:
1. **Unprotected State Methods**: In `VeriQLedger.sol`, `approvePaper`, `assignPaper`, `authorizeDevice`, `recordAccess`, `releasePaper`, `verifyPaper`, `revokePaper`, and `recordIncident` **lack access modifiers**. Anyone can invoke them directly if deployed. Only `authorizeCentre` is guarded by `onlyOwner`.
2. **Missing Multi-Signature Logic**: Despite documentation claims in `architecture.md` and `README.md` alleging "Multi-Signature Approvals", `VeriQLedger.sol` contains **zero multi-sig primitives, threshold signature schemes, or approval counters**.
3. **Missing On-Chain Time Verification**: The `releasePaper` function (lines 205–225) does not check `block.timestamp >= releaseTime`.
4. **No Deployment Infrastructure**: There are no deployment scripts (`hardhat.config.js`, `foundry.toml`, `truffle-config.js`), no ABIs generated, and no contract address deployed to any public or local network.

### 10.2 Blockchain Capability Matrix

| Feature | Solidity Contract | Backend Integration | Frontend Integration | Persistence | Tested? | State | Evidence |
|---|---|---|---|---|---|---|---|
| **Document Hash Anchoring** | Yes (`registerPaper`) | Simulated (`MockBlockchainService`) | Explorer (`/blockchain`) | SQLite (Transactions only) | Yes | `[MOCKED]` | Hashes mined into Python in-memory chain. |
| **Authority Approval Event**| Yes (`approvePaper`) | Simulated (`record_transaction`) | Chain of Custody (`/custody`)| SQLite (Transactions only) | Partial | `[MOCKED]` | Mined via `event_type="PAPER_APPROVED"`. |
| **Centre Authorization** | Yes (`authorizeCentre`)| Simulated (`record_transaction`) | Centres Page (`/centres`) | SQLite (Transactions only) | No | `[MOCKED]` | Emits simulated transaction. |
| **Device Authorization** | Yes (`authorizeDevice`)| Simulated (`record_transaction`) | Centres Page (`/centres`) | SQLite (Transactions only) | No | `[MOCKED]` | Emits simulated transaction. |
| **Access Attempt Logging** | Yes (`recordAccess`) | Simulated (`record_transaction`) | Access Logs & Explorer | SQLite (Transactions only) | No | `[MOCKED]` | Emits `ACCESS_GRANTED` / `ACCESS_DENIED`. |
| **Paper Revocation Anchor** | Yes (`revokePaper`) | Simulated (`record_transaction`) | Detail Page & Incidents | SQLite (Transactions only) | No | `[MOCKED]` | Emits `PAPER_REVOKED` transaction. |
| **Binary Merkle Root Tree** | No (Not in Solidity) | Implemented in Python | Explorer Block View | Volatile Memory | Yes | `[IMPLEMENTED + TESTED]`| Verified by `test_merkle_root`. |
| **Multi-Signature Approvals**| No | No | No | None | No | `[NOT FOUND]` | Claimed in docs; absent in code. |
| **Live Network Deployment** | No | No (`web3` missing) | No (No Web3 provider) | None | No | `[DOCUMENTED ONLY]`| No live blockchain connection exists. |

---

## 11. Cryptography & Document Security Audit

| Cryptographic Primitive | Implementation Location | Algorithm & Parameters | Security Posture | Audit Evaluation & Observations |
|---|---|---|---|---|
| **Document Encryption** | [encryption_service.py](../backend/app/services/encryption_service.py#L15-L30) | AES-256-GCM (256-bit key, 12-byte IV, 16-byte Tag) | `[IMPLEMENTED + TESTED]` | Generates cryptographically secure 12-byte IV via `os.urandom(12)`, enforces 16-byte authentication tag verification on decryption. |
| **Master Encryption Key** | [config.py](../backend/app/core/config.py#L22) | Static 64-char Hex String | `[HIGH RISK]` | Fallback key is hardcoded in source (`0123456789abcdef...`) and present in the tracked `.env` file. Single master key used across all papers. |
| **Plaintext Integrity Hash** | [hashing_service.py](../backend/app/services/hashing_service.py#L6-L15) | SHA-256 (Hex Digest) | `[IMPLEMENTED + TESTED]` | Standard Python `hashlib.sha256`. Verified by `test_sha256_hashing`. |
| **Merkle Tree Computation** | [hashing_service.py](../backend/app/services/hashing_service.py#L24-L37) | Iterative pairwise SHA-256 | `[IMPLEMENTED + TESTED]` | Correctly handles odd-leaf duplication and returns 64-hex root. |
| **Digital Signatures** | [security.py](../backend/app/core/security.py#L46-L54) | HMAC-SHA256 | `[SIMULATED]` | Uses symmetric HMAC-SHA256 with the master encryption key. Any service with the key can forge any actor's signature. No asymmetric public/private keys exist. |
| **Password Hashing** | [security.py](../backend/app/core/security.py#L9-L20) | Bcrypt (`bcrypt.hashpw` with salt) | `[IMPLEMENTED + TESTED]` | Implements 72-byte truncation safety. |
| **Authentication Tokens** | [security.py](../backend/app/core/security.py#L22-L44) | PyJWT (HS256) | `[IMPLEMENTED + TESTED]` | Implements access (60 min) and refresh (7 day) tokens. |

---

## 12. Database Audit

The active database is SQLite accessed asynchronously via `aiosqlite` and `SQLAlchemy 2.0`.

### 12.1 Database Entities Inventory

| Entity / Model | Table Name | Key Fields | Relationships | Security Sensitivity | Implementation State |
|---|---|---|---|---|---|
| **User** | `users` | `id`, `email`, `hashed_password`, `role`, `centre_id`, `is_active` | FK -> `centres`, access_events, incidents | High | `[IMPLEMENTED + SEEDED]` |
| **Examination** | `examinations` | `id`, `exam_id`, `name`, `subject`, `exam_date`, `start_time`, `end_time` | Has many `papers` | Medium | `[IMPLEMENTED + SEEDED]` |
| **Paper** | `papers` | `id`, `paper_id`, `exam_id`, `sha256_hash`, `encrypted_file_path`, `encryption_iv`, `encryption_tag`, `status`, `release_time` | Belongs to `exam`, assignments, events, txs | Critical | `[IMPLEMENTED + SEEDED]` |
| **Centre** | `centres` | `id`, `centre_id`, `name`, `city`, `state`, `code`, `is_authorized`, `status` | Users, devices, assignments, events | High | `[IMPLEMENTED + SEEDED]` |
| **AuthorizedDevice** | `authorized_devices` | `id`, `device_id`, `device_fingerprint`, `centre_id`, `status` | Belongs to `centre` | High | `[IMPLEMENTED + SEEDED]` |
| **PaperCentreAssignment** | `paper_centre_assignments`| `id`, `paper_id`, `centre_id`, `release_window_start`, `release_window_end`, `status`| Paper, Centre | Critical | `[IMPLEMENTED + SEEDED]` |
| **AccessEvent** | `access_events` | `id`, `paper_id`, `centre_id`, `user_id`, `device_id`, `allowed`, `denial_reason`, `tx_hash` | Paper, Centre, User | High | `[IMPLEMENTED + SEEDED]` |
| **BlockchainTransaction** | `blockchain_transactions`| `id`, `tx_hash`, `block_number`, `event_type`, `paper_id`, `actor_id`, `payload_hash`, `previous_hash`, `signature` | Paper | High | `[IMPLEMENTED + SEEDED]` |
| **Incident** | `incidents` | `id`, `incident_id`, `type`, `severity`, `paper_id`, `centre_id`, `description`, `status`, `tx_hash` | Paper, Centre, User | High | `[IMPLEMENTED + SEEDED]` |
| **AuditLog** | `audit_logs` | `id`, `service`, `actor_id`, `action`, `resource_type`, `result` | None | High | `[PARTIAL]` |

> [!NOTE]
> **Orphaned Entity**: The `AuditLog` model is declared in [backend/app/models/entities.py](../backend/app/models/entities.py#L187-L200), but is **never written to or queried anywhere in the backend services or API routes**.

---

## 13. API Audit

### 13.1 Endpoint Inventory & Status

| Method | Route Path | Purpose | Authentication Required? | Server Authorization Enforced? | Backend Implementation | Frontend Consumer | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | User login & token issue | Public | None | [auth.py:13](../backend/app/api/v1/auth.py#L13) | `LoginPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/auth/refresh` | Refresh JWT access token | Bearer (Refresh) | None | [auth.py:49](../backend/app/api/v1/auth.py#L49) | `apiClient.ts` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/auth/me` | Fetch active user profile | Bearer (Access) | None | [auth.py:65](../backend/app/api/v1/auth.py#L65) | `AuthContext.tsx`| `[IMPLEMENTED]` |
| `GET` | `/api/v1/auth/demo-users` | Demo persona credentials | Public | None | [auth.py:77](../backend/app/api/v1/auth.py#L77) | `LoginPage.tsx` | `[SEEDED]` |
| `GET` | `/api/v1/exams` | List all examinations | Public | None | [exams.py:12](../backend/app/api/v1/exams.py#L12) | `ExaminationsPage`| `[IMPLEMENTED]` |
| `POST` | `/api/v1/exams` | Create scheduled exam | Bearer | Role Check | [exams.py:69](../backend/app/api/v1/exams.py#L69) | `ExaminationsPage`| `[IMPLEMENTED]` |
| `GET` | `/api/v1/exams/{id}` | Get examination details | Public | None | [exams.py:112](../backend/app/api/v1/exams.py#L112) | Optional drilldown | `[IMPLEMENTED]` |
| `GET` | `/api/v1/papers` | List question papers | Public | None | [papers.py:21](../backend/app/api/v1/papers.py#L21) | `PapersPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/papers/upload` | Encrypt & upload paper | Bearer | Role Check | [papers.py:88](../backend/app/api/v1/papers.py#L88) | `PapersPage.tsx` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/papers/{id}` | Get paper metadata & txs| Public | None | [papers.py:196](../backend/app/api/v1/papers.py#L196) | `PaperDetailPage` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/papers/{id}/approve` | Sign & approve paper | Bearer | Role Check | [papers.py:270](../backend/app/api/v1/papers.py#L270) | `PaperDetailPage` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/papers/{id}/assign-centre`| Assign to centre | Bearer | Role Check | [papers.py:320](../backend/app/api/v1/papers.py#L320) | `PaperDetailPage` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/papers/{id}/release`| Activate release status | Bearer | Role Check | [papers.py:396](../backend/app/api/v1/papers.py#L396) | Optional admin | `[IMPLEMENTED]` |
| `POST` | `/api/v1/papers/{id}/verify` | Verify document hash | Bearer | None | [papers.py:434](../backend/app/api/v1/papers.py#L434) | `VerifyIntegrity` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/papers/{id}/revoke` | Emergency revocation | Bearer | Role Check | [papers.py:519](../backend/app/api/v1/papers.py#L519) | `PaperDetailPage` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/papers/{id}/chain-of-custody`| Full custody timeline | Public | None | [papers.py:560](../backend/app/api/v1/papers.py#L560) | `ChainOfCustody` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/access/request`| Request access window | Bearer | Policy Check | [access.py:16](../backend/app/api/v1/access.py#L16) | `TimeLockRelease` | `[PARTIAL]` |
| `POST` | `/api/v1/access/evaluate`| Alias for `/access/request`| Bearer | Policy Check | [access.py:17](../backend/app/api/v1/access.py#L17) | Unused alias | `[PARTIAL]` |
| `GET` | `/api/v1/access/logs` | Query access log rows | Public | None | [access.py:125](../backend/app/api/v1/access.py#L125) | `AuditorPortalPage`| `[IMPLEMENTED]` |
| `GET` | `/api/v1/centres` | List examination centres| Public | None | [centres.py:12](../backend/app/api/v1/centres.py#L12) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/centres` | Register new centre | Bearer | Role Check | [centres.py:57](../backend/app/api/v1/centres.py#L57) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/centres/{id}` | Centre device list | Public | None | [centres.py:94](../backend/app/api/v1/centres.py#L94) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/centres/{id}/authorize`| Whitelist centre | Bearer | Role Check | [centres.py:127](../backend/app/api/v1/centres.py#L127) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/centres/{id}/revoke`| Revoke centre | Bearer | Role Check | [centres.py:141](../backend/app/api/v1/centres.py#L141) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/devices` | List registered devices | Public | None | [devices.py:13](../backend/app/api/v1/devices.py#L13) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/devices` | Register device terminal| Bearer | Role Check | [devices.py:33](../backend/app/api/v1/devices.py#L33) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/devices/{id}/authorize`| Whitelist device | Bearer | Role Check | [devices.py:75](../backend/app/api/v1/devices.py#L75) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/devices/{id}/revoke`| Revoke device | Bearer | Role Check | [devices.py:88](../backend/app/api/v1/devices.py#L88) | `CentresPage.tsx` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/blockchain/status` | Network telemetry | Public | None | [blockchain.py:12](../backend/app/api/v1/blockchain.py#L12)| `BlockchainExplorer`| `[MOCKED]` |
| `GET` | `/api/v1/blockchain/blocks` | Mined block list | Public | None | [blockchain.py:16](../backend/app/api/v1/blockchain.py#L16)| `BlockchainExplorer`| `[PARTIAL]` |
| `GET` | `/api/v1/blockchain/transactions`| Paginated transactions | Public | None | [blockchain.py:20](../backend/app/api/v1/blockchain.py#L20)| `BlockchainExplorer`| `[IMPLEMENTED]` |
| `GET` | `/api/v1/blockchain/transactions/{tx_hash}`| Tx inspection | Public | None | [blockchain.py:56](../backend/app/api/v1/blockchain.py#L56)| Direct lookup | `[IMPLEMENTED]` |
| `GET` | `/api/v1/blockchain/papers/{paper_id}`| Paper tx history | Public | None | [blockchain.py:80](../backend/app/api/v1/blockchain.py#L80)| Custody lookup | `[IMPLEMENTED]` |
| `GET` | `/api/v1/security/summary` | Security metrics & series| Public | None | [security.py:11](../backend/app/api/v1/security.py#L11)| `DashboardPage` | `[PARTIAL]` |
| `GET` | `/api/v1/security/heatmap` | Centre risk heatmap | Public | None | [security.py:60](../backend/app/api/v1/security.py#L60)| `SecurityOpsPage`| `[IMPLEMENTED]` |
| `GET` | `/api/v1/security/threat-feed` | Incident alert feed | Public | None | [security.py:82](../backend/app/api/v1/security.py#L82)| `SecurityOpsPage`| `[IMPLEMENTED]` |
| `GET` | `/api/v1/incidents` | List security alerts | Public | None | [incidents.py:17](../backend/app/api/v1/incidents.py#L17)| `IncidentsPage` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/incidents/{id}` | Incident detail view | Public | None | [incidents.py:60](../backend/app/api/v1/incidents.py#L60)| Drilldown modal | `[IMPLEMENTED]` |
| `POST` | `/api/v1/incidents/{id}/acknowledge`| Mark acknowledged | Bearer | Role Check | [incidents.py:90](../backend/app/api/v1/incidents.py#L90)| `IncidentsPage` | `[IMPLEMENTED]` |
| `POST` | `/api/v1/incidents/{id}/resolve`| Resolve incident | Bearer | Role Check | [incidents.py:103](../backend/app/api/v1/incidents.py#L103)| `IncidentsPage` | `[IMPLEMENTED]` |
| `GET` | `/api/v1/audit/report/{paper_id}`| Audit compliance report| Public | None | [audit.py:11](../backend/app/api/v1/audit.py#L11)| `AuditorPortalPage`| `[IMPLEMENTED]` |
| `POST` | `/api/v1/demo/simulate` | Trigger attack test | Public | None | [demo.py:14](../backend/app/api/v1/demo.py#L14)| `AppShell` bar | `[SIMULATED]` |
| `GET` | `/api/v1/healthz` | Health check endpoint | Public | None | [main.py:73](../backend/app/main.py#L73) | Monitoring | `[IMPLEMENTED]` |

---

## 14. Authentication & Authorization Audit

### 14.1 Role-Based Access Control (RBAC) Matrix

| Persona / Role | System Permission Defined | Endpoints Enforced Server-Side | Frontend Menu Access | Notes |
|---|---|---|---|---|
| **SUPER_ADMIN** | Full system administration | All endpoints (`require_roles` checks include `SUPER_ADMIN`) | All Pages | Default administrative user. |
| **EXAM_AUTHORITY** | Create papers, approve papers, assign centres, revoke | `/papers/upload`, `/approve`, `/assign-centre`, `/revoke`, `/centres`, `/devices` | All Pages | Primary examination authority. |
| **PAPER_SETTER** | Draft & upload papers | `/papers/upload` | Papers, Dashboard | Cannot approve or release. |
| **REGIONAL_COORDINATOR**| Monitor assigned centres | None directly restricted | Dashboard, Centres, Custody | Advisory/oversight role. |
| **CENTRE_ADMIN** | Manage local centre & devices | `/devices`, `/devices/{id}/authorize`, `/devices/{id}/revoke` | Centres, Release, Dashboard | Can register workstations. |
| **INVIGILATOR** | Request time-locked paper decryption | `/access/request` (allowed by policy engine) | Release, Dashboard | Centre staff at exam time. |
| **AUDITOR** | Independent verification & audit | `/audit/report/{paperId}`, `/verify` | Auditor Portal, Custody, Verify | Read-only compliance auditor. |

### 14.2 Critical Authentication Vulnerability: Default User Impersonation
In [backend/app/api/deps.py](../backend/app/api/deps.py#L16-L22):
```python
async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not credentials:
        # Fallback to demo default user if authorization header is absent (facilitates smooth testing)
        query = select(User).where(User.email == "authority@veriq.local")
        res = await db.execute(query)
        user = res.scalars().first()
        if user:
            return user
        raise HTTPException(...)
```
- **Consequence**: Any unauthenticated HTTP client can send requests to sensitive endpoints such as `POST /api/v1/papers/{id}/approve`, `POST /api/v1/papers/upload`, or `POST /api/v1/papers/{id}/revoke` **without providing any Bearer token**.
- **Impact**: Server-side role enforcement is entirely negated because all unauthenticated requests automatically adopt the `EXAM_AUTHORITY` role.

---

## 15. Time-Lock & Access Control Audit

The access evaluation engine is implemented in [backend/app/services/access_control_service.py](../backend/app/services/access_control_service.py).

### 15.1 Evaluation Steps Verified in Code:
1. **Paper Status Check**: Checks `paper.status != "REVOKED"`. (Returns `PAPER_REVOKED`).
2. **User Role Check**: Allows `["SUPER_ADMIN", "EXAM_AUTHORITY", "CENTRE_ADMIN", "INVIGILATOR"]`. (Returns `ROLE_INSUFFICIENT`).
3. **Centre Assignment Check**: Queries `paper_centre_assignments` table for `paper.id` and `centre_id`. (Returns `UNAUTHORIZED_CENTRE`).
4. **Device Authorization Check**: Queries `authorized_devices` table for `centre_id`, `device_fingerprint`, and `status == "AUTHORIZED"`. (Returns `DEVICE_MISMATCH`).
5. **Time Window Check**: Validates `window_start <= now <= window_end`. (Returns `RELEASE_WINDOW_NOT_STARTED` or `RELEASE_WINDOW_EXPIRED`).

### 15.2 Observed Bypasses & Limitations:
1. **Time Override Exploitation**: [backend/app/api/v1/access.py](../backend/app/api/v1/access.py#L33) states:
   ```python
   evaluation_time = req.override_time or datetime.now(timezone.utc)
   ```
   An attacker calling `POST /api/v1/access/request` can set `override_time` to match `release_window_start`, completely defeating the time-lock window check.
2. **Missing Network / IP Check**: `docs/security.md` claims a 6-gate model where Gate 5 validates client IP against an authorized subnet. In code, `evaluate_access()` does not take or check an IP address.
3. **Frontend Device Fingerprint Mismatch**: In [frontend/src/pages/papers/TimeLockReleasePage.tsx](../frontend/src/pages/papers/TimeLockReleasePage.tsx#L62), the page sends a hardcoded string `DEV_FINGERPRINT_C101_HARDWARE_TPM_SECURE`. In the database, device fingerprints are 64-character SHA-256 hashes generated during seeding (e.g. `calculate_sha256("HARDWARE_SERIAL_DEV-C101-01_SECURE_TPM")`). As a result, legitimate access requests from the UI fail with `DEVICE_MISMATCH`.

---

## 16. Audit Trail & Chain of Custody

The chain-of-custody engine records events across the paper lifecycle:

1. **Database Audit Records**:
   - `access_events`: Records user, centre, device, timestamp, decision (allowed/denied), denial reason, and transaction hash.
   - `blockchain_transactions`: Records event type, actor, payload hash, previous hash, signature, and block number.
   - `incidents`: Records type (`EARLY_ACCESS`, `DEVICE_MISMATCH`, `HASH_MISMATCH`), severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), description, and status (`OPEN`, `ACKNOWLEDGED`, `RESOLVED`).
2. **Simulated Block Chaining**:
   - Every transaction triggers `MockBlockchainService.record_transaction`.
   - Each transaction hashes the previous block hash and payload into a new SHA-256 transaction hash.
   - Transactions are batched into a new `BlockchainBlock` with a recalculated Merkle root in memory.
3. **Chain of Custody UI (`/custody`)**:
   - Displays a chronological timeline retrieved from `GET /api/v1/papers/{id}/chain-of-custody`.
   - Visualizes the paper lifecycle from `PAPER_CREATED`, `PAPER_APPROVED`, `PAPER_ASSIGNED`, to `ACCESS_GRANTED` / `ACCESS_DENIED`.

---

## 17. Testing Audit

The test suite was executed in the evaluation environment on Python 3.14.2:

```bash
python -m pytest -v
```

### 17.1 Test Coverage Matrix

| Test Module | Test Name | Target Functionality | Result | Notes |
|---|---|---|---|---|
| `tests/test_auth.py` | `test_password_hashing` | Bcrypt password hashing & checking | **PASSED** | Validates correct and incorrect passwords. |
| `tests/test_auth.py` | `test_jwt_tokens` | JWT creation and decoding | **PASSED** | Validates payload claims. |
| `tests/test_auth.py` | `test_digital_signature` | HMAC signature creation & verification | **PASSED** | Validates signature comparison and tamper detection. |
| `tests/test_blockchain.py` | `test_blockchain_transaction_mining` | Simulated block creation & tx hashing | **PASSED** | Validates `0x...` tx hash and block number increments. |
| `tests/test_blockchain.py` | `test_network_status` | Status endpoint payload structure | **PASSED** | Validates returned status fields. |
| `tests/test_crypto.py` | `test_sha256_hashing` | File SHA-256 generation | **PASSED** | Validates 64-char length and tamper detection. |
| `tests/test_crypto.py` | `test_aes_256_gcm_encryption_and_decryption` | AES-256-GCM roundtrip | **PASSED** | Validates 12-byte IV, 16-byte tag, plaintext match. |
| `tests/test_crypto.py` | `test_aes_gcm_tamper_detection` | Ciphertext byte corruption check | **PASSED** | Confirms GCM raises exception on tampered ciphertext. |
| `tests/test_crypto.py` | `test_merkle_root` | Binary Merkle tree root calculation | **PASSED** | Validates 64-char root from multiple hashes. |

**Total Tests**: 9 collected, 9 passed, 0 failed in 1.95 seconds.

### 17.2 Missing Test Coverage:
- **0 API Integration Tests**: No tests for FastAPI routers, status codes, or error handlers.
- **0 Database Tests**: No tests verifying database cascading deletes or constraint enforcement.
- **0 Policy Tests**: No automated tests for `AccessControlService.evaluate_access()`.
- **0 Smart Contract Tests**: No Solidity tests (no Hardhat/Foundry setup).
- **0 Frontend Tests**: No unit or component tests (no Jest/Vitest configured in frontend).

---

## 18. Deployment Audit

### 18.1 Containerization Status (`docker-compose.yml`)
The repository contains a top-level [docker-compose.yml](../docker-compose.yml) defining 4 services: `postgres`, `redis`, `backend`, and `frontend`.

#### Deployment Blockers Identified:
1. **Missing Backend Dockerfile**: Line 34 references `context: ./backend, dockerfile: Dockerfile`. No Dockerfile exists in `backend/`.
2. **Missing Frontend Dockerfile**: Line 58 references `context: ./frontend, dockerfile: Dockerfile`. No Dockerfile exists in `frontend/`.
3. **Unused Redis Service**: `docker-compose.yml` provisions a Redis container, but Redis is not utilized anywhere in the backend source code.
4. **Missing PostgreSQL Async Driver**: `docker-compose.yml` sets `DATABASE_URL=postgresql+asyncpg://...`, but `asyncpg` is not listed in `backend/requirements.txt`.
5. **Hardcoded Secrets in Docker Compose**: Plaintext credentials are hardcoded directly in `docker-compose.yml` (e.g. `POSTGRES_PASSWORD: veriq_password_2026`, `JWT_SECRET`, `ENCRYPTION_KEY`).

---

## 19. Dependency & Supply-Chain Audit

### 19.1 Workspace Manifests
- **Frontend**: Managed via `pnpm` catalog workspace. Uses React 19.1.0, Tailwind CSS 3.4.17, Vite 6.0.3.
- **Backend**: Python dependencies in `backend/requirements.txt`. Includes standard packages (`fastapi`, `uvicorn`, `sqlalchemy`, `aiosqlite`, `cryptography`, `bcrypt`, `pyjwt`).

### 19.2 Supply-Chain Findings:
1. **Supply-Chain Guard in Workspace**: [pnpm-workspace.yaml](../pnpm-workspace.yaml#L28) enforces `minimumReleaseAge: 1440` (24-hour delay on new npm package releases) to mitigate supply-chain attacks.
2. **Dead / Orphaned Monorepo Packages**: Packages in `lib/` (`@workspace/api-client-react`, `@workspace/api-spec`, `@workspace/api-zod`, `@workspace/db`) are artifacts of the superseded Express setup. They add clutter and maintenance overhead.
3. **Committed Bytecode and Binary DBs**: 18 compiled `.pyc` files, two SQLite databases, and 20 encrypted paper files are tracked in Git history, inflating repository size and violating hygiene practices.

---

## 20. Security Audit

| Finding ID | Severity | Category | Description & Evidence | Impact |
|---|---|---|---|---|
| **SEC-01** | **CRITICAL** | Authentication | **Global Authentication Bypass via Header Omission**<br>[backend/app/api/deps.py:16-22](../backend/app/api/deps.py#L16-L22) falls back to `authority@veriq.local` whenever the `Authorization` header is missing. | Any unauthenticated client can invoke administrative, paper approval, and revocation endpoints. |
| **SEC-02** | **CRITICAL** | Authorization | **Time-Lock Window Bypass via Request Payload**<br>[backend/app/api/v1/access.py:33](../backend/app/api/v1/access.py#L33) accepts `req.override_time` and uses it as the evaluation timestamp. | Any client can bypass the time-lock window by providing an arbitrary timestamp in the JSON payload. |
| **SEC-03** | **CRITICAL** | Secrets Management | **Plaintext Production Secrets Tracked in Git**<br>`.env` and `docker-compose.yml` contain static `ENCRYPTION_KEY`, `JWT_SECRET`, and database credentials. | Keys are compromised for anyone with repository read access. |
| **SEC-04** | **HIGH** | Cryptography | **Symmetric Key Used for Pseudo-Digital Signatures**<br>[backend/app/core/security.py:46-54](../backend/app/core/security.py#L46-L54) uses HMAC-SHA256 with the master encryption key instead of asymmetric ECDSA keys. | Any service or actor with the master key can forge signatures. Non-repudiation is compromised. |
| **SEC-05** | **HIGH** | Access Control | **Missing Network Perimeter (IP) Check**<br>`docs/security.md` claims an IP/subnet check at Gate 5, but [access_control_service.py](../backend/app/services/access_control_service.py) contains no IP validation logic. | Requests from rogue IP addresses are not blocked by the policy engine. |
| **SEC-06** | **MEDIUM** | Infrastructure | **Volatile In-Memory Blockchain State**<br>[blockchain_service.py](../backend/app/services/blockchain_service.py#L63) stores blocks in RAM (`self.chain`). | Restarting the server resets block height and hashes to genesis, desynchronizing with the database. |
| **SEC-07** | **MEDIUM** | Integrity | **Unprotected Solidity Methods**<br>[blockchain/contracts/VeriQLedger.sol](../blockchain/contracts/VeriQLedger.sol) lacks access modifiers on state-modifying methods (`approvePaper`, `revokePaper`, etc.). | If deployed to a live chain as-is, any external address could revoke or approve papers. |
| **SEC-08** | **LOW** | CORS | **Wildcard Permissive CORS**<br>[backend/app/main.py:39](../backend/app/main.py#L39) sets `allow_origins=["*"]`. | Potential cross-origin request issues if deployed to public staging environments. |

---

## 21. Documentation Claim Verification

| Documented Claim | Source Document | Evidence in Codebase | Actual Implementation State | Gap Analysis |
|---|---|---|---|---|
| **"AES-256-GCM authenticated envelope encryption"** | `README.md`, `architecture.md`, `security.md` | [encryption_service.py:15-40](../backend/app/services/encryption_service.py#L15-L40) | `[IMPLEMENTED + TESTED]` | Implemented correctly with 12-byte IV and 16-byte tag. Master key is hardcoded. |
| **"SHA-256 document hashing & anchoring"** | `README.md`, `architecture.md`, `security.md` | [hashing_service.py:6-22](../backend/app/services/hashing_service.py#L6-L22) | `[IMPLEMENTED + TESTED]` | Implemented and anchored to in-process simulated ledger. |
| **"Solidity smart contract on PoA private consortium chain"**| `README.md`, `blockchain.md` | `MockBlockchainService` in [blockchain_service.py](../backend/app/services/blockchain_service.py#L55) | `[MOCKED]` | No live blockchain or PoA node. Contract is uncompiled. Backend runs Python in-memory mock. |
| **"Multi-signature digital approvals"** | `README.md`, `architecture.md` | Single HMAC-SHA256 string in [papers.py:287](../backend/app/api/v1/papers.py#L287) | `[MOCKED]` | Single-party approval; no multi-sig threshold mechanism exists. |
| **"Gate 5: Network Perimeter IP whitelisting"** | `security.md` | [access_control_service.py:9-85](../backend/app/services/access_control_service.py#L9-L85) | `[DOCUMENTED ONLY]` | Client IP is not validated by the access control engine. |
| **"Binary Merkle tree proof generation"** | `architecture.md`, `blockchain.md` | [hashing_service.py:24-37](../backend/app/services/hashing_service.py#L24-L37) | `[IMPLEMENTED + TESTED]` | Implemented in Python and tested in pytest. |
| **"Containerized deployment via Docker Compose"** | `deployment.md`, `docker-compose.yml` | Missing Dockerfiles in `backend/` and `frontend/` | `[MOCKED / BROKEN]` | Dockerfiles are missing; `docker compose up` fails. |
| **"Decrypted paper streamed to terminal at exam time"**| `api.md`, `security.md` | `/access/request` returns JSON boolean | `[DOCUMENTED ONLY]` | Endpoint `/access/decrypt-and-release` does not exist in code. |

---

## 22. Implementation vs Documentation Master Matrix

| Capability | README Claim | Documentation Claim | Actual Implementation | Automated Tests | Current State | Critical Gap |
|---|---|---|---|---|---|---|
| **User Authentication** | JWT Auth with Bcrypt | Access & Refresh Tokens | Bcrypt + PyJWT | `test_password_hashing`, `test_jwt_tokens` | `[IMPLEMENTED + TESTED]` | Unauthenticated requests bypass auth via default user fallback. |
| **Role-Based Access Control** | 7 granular roles | Super Admin to Auditor | Enforced via `require_roles` | None | `[PARTIAL]` | Bypassed by default user fallback. |
| **AES-256-GCM Encryption** | Authenticated encryption | 12-byte IV, 16-byte tag | Python `cryptography.AESGCM` | `test_aes_256_gcm_...` | `[IMPLEMENTED + TESTED]` | Master key hardcoded in source. |
| **SHA-256 Plaintext Hashing** | Immutable document hash | Plaintext SHA-256 anchor | `hashlib.sha256` | `test_sha256_hashing` | `[IMPLEMENTED + TESTED]` | None. Fully functional. |
| **Off-Chain Paper Storage** | Encrypted binary storage | `./storage/encrypted_papers` | Files written to disk | None | `[IMPLEMENTED]` | Storage path duplicated across root and backend. |
| **Blockchain Anchoring** | Immutable proof ledger | Anchored on Ethereum/PoA | In-memory Python ledger | `test_blockchain_...` | `[MOCKED]` | Ledger is in-memory; resets on server restart. |
| **Smart Contract** | `VeriQLedger.sol` (0.8.20) | Full lifecycle contract | Uncompiled Solidity file | None | `[DOCUMENTED ONLY]` | No compilation, deployment, or Web3 connector. |
| **Time-Lock Release** | Time-locked release | Window check with buffer | Validates window start/end | None | `[PARTIAL]` | Bypassed by `override_time` parameter in payload. |
| **Device Verification** | Hardware fingerprinting | SHA-256 hardware hash | Checks `authorized_devices` | None | `[PARTIAL]` | Frontend sends mismatched hardcoded fingerprint. |
| **IP Whitelisting** | Center IP validation | Gate 5 network perimeter | Not implemented in service | None | `[DOCUMENTED ONLY]` | IP check missing in `access_control_service.py`. |
| **Digital Signatures** | ECDSA Ethereum signatures| ECDSA 65-byte signatures | HMAC-SHA256 | `test_digital_signature` | `[SIMULATED]` | Uses symmetric key; not asymmetric ECDSA. |
| **Multi-Signature Approval** | Multi-sig consensus | Controller + Authority | Single actor approval | None | `[NOT FOUND]` | No multi-sig mechanism exists. |
| **Audit Trail & Custody** | Non-repudiable audit | Full lifecycle logging | `blockchain_transactions` table | None | `[IMPLEMENTED]` | Fully functional and visualized in UI. |
| **Tamper Detection** | Instant tamper detection | Recovers & re-hashes file | Decrypts and checks SHA-256 | `test_aes_gcm_tamper...` | `[IMPLEMENTED]` | Logs `CRITICAL` incident on hash mismatch. |
| **Incident Management** | SOC triage & response | Auto incident dispatch | `incidents` table + endpoints | None | `[IMPLEMENTED]` | Working UI for viewing, acknowledging, resolving. |
| **Emergency Revocation** | Global instant revocation| Revokes across all centres | Status -> `REVOKED` | None | `[IMPLEMENTED]` | Revokes paper and blocks subsequent access. |
| **Auditor Report** | Single-click audit sheet | Collates proofs & events | Collates data into JSON | None | `[IMPLEMENTED]` | Renders detailed compliance view. |
| **Docker Compose** | Production orchestration | 4-tier containerized stack| Broken compose file | None | `[MOCKED / BROKEN]` | Missing Dockerfiles for backend and frontend. |

---

## 23. WB-03 Requirement Coverage

The table below evaluates the product against the specific security requirements of **WB-03**:

| WB-03 Security Property | Implementation in VeriQ | Evidence | State | Remaining Gap |
|---|---|---|---|---|
| **1. Confidentiality** | AES-256-GCM off-chain encryption; raw papers never stored in plaintext. | [encryption_service.py](../backend/app/services/encryption_service.py) | `[IMPLEMENTED]` | Master key is statically configured in `.env`. |
| **2. Integrity** | SHA-256 digest calculation anchored to cryptographic transaction blocks. | [hashing_service.py](../backend/app/services/hashing_service.py) | `[IMPLEMENTED]` | Plaintext hash verified on demand. |
| **3. Authentication** | Bcrypt password hashing + JWT access & refresh tokens. | [auth.py](../backend/app/api/v1/auth.py) | `[PARTIAL]` | Bypassed if Authorization header is omitted. |
| **4. Authorization** | Role validation + centre assignment + authorized device check. | [access_control_service.py](../backend/app/services/access_control_service.py) | `[PARTIAL]` | Bypassed by unauthenticated default user fallback. |
| **5. Controlled Release** | Time-lock window enforcement (`release_window_start`). | [access_control_service.py](../backend/app/services/access_control_service.py) | `[PARTIAL]` | Bypassed by `override_time` parameter in payload. |
| **6. Auditability** | Transaction log and custody timeline tracking all actions. | [papers.py](../backend/app/api/v1/papers.py#L560) | `[IMPLEMENTED]` | Visible in Auditor Portal and Custody views. |
| **7. Tamper Detection** | Decrypts ciphertext and flags mismatch against anchored digest. | [papers.py](../backend/app/api/v1/papers.py#L435) | `[IMPLEMENTED]` | Generates `CRITICAL` severity incident. |
| **8. Chain of Custody** | Chronological record of upload, approval, assignment, access, and verification. | [ChainOfCustodyPage.tsx](../frontend/src/pages/papers/ChainOfCustodyPage.tsx) | `[IMPLEMENTED]` | Visualized in the web command center. |
| **9. Non-Repudiation** | Claimed via digital signatures and blockchain ledger. | [security.py](../backend/app/core/security.py#L46) | `[SIMULATED]` | Uses symmetric HMAC-SHA256, compromising non-repudiation. |

---

## 24. Current MVP Boundary

### 24.1 Working MVP (Demonstrable Today)
These features are functional end-to-end and can be demonstrated today:
- **Authentication & Demo Persona Switching**: Logging in via username/password or 1-click persona switching in `LoginPage.tsx`.
- **Question Paper Upload & Off-Chain Encryption**: Uploading a PDF, generating SHA-256 digest, encrypting with AES-256-GCM, storing the encrypted `.enc` file, and mining a block into the in-process ledger.
- **Paper Approval & Digital Signing**: Authority signing a paper to transition status to `APPROVED`.
- **Centre & Device Directory**: Viewing and registering centres and authorized workstation devices.
- **Cryptographic Tamper Detection**: Running integrity verification on `/verify`. Normal files confirm `VALID MATCH`; clicking "Simulate Tampering" triggers a hash mismatch and automatically dispatches a `CRITICAL` incident.
- **Chain of Custody Visualizer**: Inspecting the chronological custody timeline on `/custody`.
- **Blockchain Explorer**: Browsing mined blocks, transactions, and Merkle root hashes on `/blockchain` (from in-process ledger).
- **Security Operations Center & Incidents**: Threat radar, centre risk heatmap, and incident triage on `/security` and `/incidents`.
- **Auditor Portal**: Generating formal compliance reports on `/audit`.

### 24.2 Partial MVP (Works with Limitations / Bugs)
- **Time-Lock Release (`/release`)**: Works in the backend service, but the frontend sends a hardcoded mock device fingerprint (`DEV_FINGERPRINT_C101_HARDWARE_TPM_SECURE`), causing legitimate access attempts to return `DEVICE_MISMATCH`.
- **Attack Simulation Bar**: Clicking "Simulate Early Access" or "Simulate Tampering" injects an incident into the database and displays a toast, but operates as a synthetic injection rather than executing the real API request flow.
- **Hourly Access Telemetry**: Summary counts are real, but hourly chart series data is statically defined in `security.py`.

### 24.3 Not MVP (Do NOT Claim in Demo)
- **Live Ethereum / Polygon Smart Contract Execution**: Do not claim transactions are mined on an external blockchain or testnet. The system uses an in-process cryptographic Python ledger.
- **Multi-Signature Approvals**: Do not claim multi-sig threshold consensus exists. Approvals are single-actor.
- **Asymmetric ECDSA Signatures**: Do not claim cryptographic non-repudiation via private key signatures. Signatures use symmetric HMAC-SHA256.
- **Decrypted Document Delivery**: Do not claim the client receives and renders the decrypted question paper PDF. `/access/request` returns an authorization boolean only.
- **Docker Compose Deployment**: Do not attempt `docker compose up` during the demo. It will fail due to missing Dockerfiles.

---

## 25. Hackathon Readiness Assessment

| Evaluation Dimension | Readiness Status | Justification & Summary |
|---|---|---|
| **Product & Concept** | `READY` | Clear alignment with WB-03, intuitive workflow, polished UI. |
| **Backend Core** | `READY` | Stable FastAPI architecture with working encryption, hashing, and relational schema. |
| **Frontend UI/UX** | `READY` | High visual polish, responsive navigation, clear data visualization with Recharts and Lucide. |
| **Blockchain Subsystem**| `NEEDS WORK` | Relies on in-memory mock ledger. Solidity contract is uncompiled and undeployed. |
| **Security Posture** | `NEEDS WORK` | Auth bypass in `deps.py` and `override_time` bypass in `access.py` must be addressed. |
| **Database** | `READY` | Clean SQLite schema with async SQLAlchemy. Seeds 10 centres, 20 devices, 15 users. |
| **API Layer** | `READY` | 40+ endpoints with consistent JSON schemas and validation. |
| **Automated Testing** | `NEEDS WORK` | 9 crypto/auth unit tests pass, but zero API, integration, or frontend tests exist. |
| **Deployment** | `BLOCKED` | Docker Compose is broken due to missing Dockerfiles. Local run is required. |
| **Interactive Demo** | `READY` | Excellent 1-click persona logins, interactive tamper verification, and custody explorer. |
| **Documentation** | `NEEDS WORK` | Extensive documentation exists, but diverges significantly from the actual code. |

---

## 26. Technical Debt & Codebase Observations

*Note: This section inventories observed technical debt and gaps. It does not make premature architectural design decisions.*

| Item ID | Observed Issue | Location | Impact | Observations / Gaps | Priority |
|---|---|---|---|---|---|
| **DEBT-01** | Orphaned Monorepo Packages | `lib/*`, `artifacts/*` | Clutter & confusion | 4 legacy packages from superseded Express/Drizzle setup remain committed and configured in `pnpm-workspace.yaml`. | P1 |
| **DEBT-02** | Tracked Bytecode & Databases | `backend/veriq.db`, `*.pyc`, `*.enc` | Repository bloat | Binary SQLite databases, 18 `.pyc` files, and `.env` are tracked in Git due to incomplete `.gitignore`. | P1 |
| **DEBT-03** | Dual Storage Directories | `/storage` vs `/backend/storage` | Inconsistency | Encrypted papers written to two locations depending on invocation directory. | P2 |
| **DEBT-04** | Volatile Block Storage | [blockchain_service.py](../backend/app/services/blockchain_service.py) | Data loss on restart | Blocks and Merkle roots exist in RAM only; reset on server reload. | P2 |
| **DEBT-05** | Hardcoded UI Fingerprint | [TimeLockReleasePage.tsx:62](../frontend/src/pages/papers/TimeLockReleasePage.tsx#L62) | UI access failure | Sends static mock string instead of querying a registered centre device fingerprint. | P0 |
| **DEBT-06** | Hardcoded Master Key Fallback | [config.py:22-24](../backend/app/core/config.py#L22-L24) | Security weakness | Static fallback encryption keys and JWT secrets exist in source code. | P1 |
| **DEBT-07** | Orphaned Entity | [entities.py:187](../backend/app/models/entities.py#L187) | Dead code | `AuditLog` table declared but never populated or queried. | P2 |

---

## 27. Known Limitations

1. **Simulated Blockchain Ledger**: The application does not communicate with an external EVM node or testnet. All block mining, hash chaining, and Merkle calculations occur in Python process memory.
2. **No Decrypted Payload Delivery**: When access is granted, the backend does not stream the decrypted question paper PDF or issue an ephemeral decryption key to the frontend.
3. **Symmetric HMAC Signatures**: Digital signatures are HMAC-SHA256 digests computed using the master encryption key, rather than asymmetric ECDSA public/private key pairs.
4. **Local Execution Required**: Due to missing Dockerfiles, the platform cannot be run via `docker compose up` and must be launched locally using `uvicorn` and `pnpm dev`.

---

## 28. Prioritized Backlog (Findings & Deficiencies)

*Note: This backlog records deficiencies identified by the audit. Architectural solutions and design decisions are deferred to subsequent planning phases (Docs 02, 06, 07, 11, 15).*

### P0 — Must Resolve Before Demo (Integrity & Operational Showstoppers)
- **AUTH-BYPASS**: Remove the unauthenticated default user fallback in [backend/app/api/deps.py:16-22](../backend/app/api/deps.py#L16-L22) so that API endpoints genuinely enforce authentication.
- **TIMELOCK-OVERRIDE**: Disallow client-declared `override_time` on production access routes in [backend/app/api/v1/access.py:33](../backend/app/api/v1/access.py#L33) to prevent arbitrary time-lock bypass.
- **FINGERPRINT-MISMATCH**: Resolve device fingerprint discrepancy in [TimeLockReleasePage.tsx](../frontend/src/pages/papers/TimeLockReleasePage.tsx) so legitimate access requests can succeed.
- **MISSING-DOCKERFILES**: Provide functional Dockerfiles for `backend/` and `frontend/` so the documented `docker compose up` launch workflow operates.

### P1 — Should Resolve Before Submission (Hygiene & Documentation Integrity)
- **GIT-HYGIENE**: Add Python (`__pycache__`, `*.pyc`, `*.db`, `.env`) ignore rules to `.gitignore` and purge tracked binaries from Git index.
- **DOC-RECONCILIATION**: Align documentation (`architecture.md`, `blockchain.md`, `database.md`, `api.md`) with the actual code (retire claims of multi-sig and live PoA chain).
- **ORPHAN-REMOVAL**: Clean up dead Replit/Express packages in `lib/` and `artifacts/`.

### P2 — Valuable Improvements (Technical Stability)
- **BLOCK-PERSISTENCE**: Persist block headers and Merkle roots to a database table to avoid state loss on server restart.
- **PAYLOAD-DELIVERY**: Implement a secure endpoint to stream decrypted file bytes upon verified access authorization.
- **API-TESTS**: Add automated route integration tests for auth, paper upload, approval, and verification flows.

### P3 — Future Production Roadmap (Target Architecture)
- **LIVE-CHAIN-INTEGRATION**: Connect backend to a live EVM consortium or testnet node via Web3.
- **ASYMMETRIC-PKI**: Implement asymmetric key pairs (ECDSA/Ed25519) per actor for non-repudiation.
- **HARDWARE-ENCLAVE**: Bind device fingerprints to hardware TPM / Secure Enclave chips.

---

## 29. Audit Conclusion

VeriQ possesses a **solid, demonstrable foundation** for the WB-03 problem statement. The core cryptographic pipeline—combining off-chain AES-256-GCM authenticated encryption with SHA-256 integrity anchoring—is genuinely implemented and verified by automated tests. The user interface is well-designed, featuring intuitive dashboards for paper lifecycle management, tamper verification, and chain-of-custody tracking.

However, the platform currently exhibits a significant gap between its **actual prototype implementation** and its **architectural documentation claims**. The blockchain is simulated in Python memory, containerization is non-functional, and critical security bypasses exist in the authentication and time-lock evaluation layers.

Addressing the P0 deficiencies—eliminating the authentication bypass, resolving the time-lock payload override, fixing the frontend device fingerprint mismatch, and providing working Dockerfiles—will establish a secure, credible, and competition-ready baseline.

---

## 30. Appendix — Evidence Locations

### Backend Core
- Application Entrypoint: [backend/app/main.py](../backend/app/main.py)
- Configuration & Secrets: [backend/app/core/config.py](../backend/app/core/config.py)
- Security & Crypto Helpers: [backend/app/core/security.py](../backend/app/core/security.py)
- Auth Dependencies (Bypass): [backend/app/api/deps.py](../backend/app/api/deps.py#L16-L22)
- Database Session: [backend/app/db/session.py](../backend/app/db/session.py)
- Entity Models: [backend/app/models/entities.py](../backend/app/models/entities.py)
- Pydantic Schemas: [backend/app/schemas/schemas.py](../backend/app/schemas/schemas.py)

### Cryptographic & Domain Services
- AES-256-GCM Encryption: [backend/app/services/encryption_service.py](../backend/app/services/encryption_service.py)
- SHA-256 & Merkle Tree: [backend/app/services/hashing_service.py](../backend/app/services/hashing_service.py)
- In-Memory Blockchain: [backend/app/services/blockchain_service.py](../backend/app/services/blockchain_service.py)
- Time-Lock Policy Engine: [backend/app/services/access_control_service.py](../backend/app/services/access_control_service.py)
- Anomaly Detection: [backend/app/services/anomaly_service.py](../backend/app/services/anomaly_service.py)

### API Endpoints
- Authentication: [backend/app/api/v1/auth.py](../backend/app/api/v1/auth.py)
- Paper Lifecycle: [backend/app/api/v1/papers.py](../backend/app/api/v1/papers.py)
- Access Control: [backend/app/api/v1/access.py](../backend/app/api/v1/access.py)
- Examinations: [backend/app/api/v1/exams.py](../backend/app/api/v1/exams.py)
- Centres: [backend/app/api/v1/centres.py](../backend/app/api/v1/centres.py)
- Devices: [backend/app/api/v1/devices.py](../backend/app/api/v1/devices.py)
- Blockchain Explorer: [backend/app/api/v1/blockchain.py](../backend/app/api/v1/blockchain.py)
- Security Operations: [backend/app/api/v1/security.py](../backend/app/api/v1/security.py)
- Incident Management: [backend/app/api/v1/incidents.py](../backend/app/api/v1/incidents.py)
- Auditor Portal: [backend/app/api/v1/audit.py](../backend/app/api/v1/audit.py)
- Attack Simulation: [backend/app/api/v1/demo.py](../backend/app/api/v1/demo.py)

### Frontend Components & Pages
- Shell & Simulation Bar: [frontend/src/components/layout/AppShell.tsx](../frontend/src/components/layout/AppShell.tsx)
- Auth State Provider: [frontend/src/store/AuthContext.tsx](../frontend/src/store/AuthContext.tsx)
- API Client Interceptors: [frontend/src/services/apiClient.ts](../frontend/src/services/apiClient.ts)
- Integrity Verification: [frontend/src/pages/papers/VerifyIntegrityPage.tsx](../frontend/src/pages/papers/VerifyIntegrityPage.tsx)
- Time-Lock Release: [frontend/src/pages/papers/TimeLockReleasePage.tsx](../frontend/src/pages/papers/TimeLockReleasePage.tsx)
- Chain of Custody: [frontend/src/pages/papers/ChainOfCustodyPage.tsx](../frontend/src/pages/papers/ChainOfCustodyPage.tsx)
- Blockchain Explorer: [frontend/src/pages/blockchain/BlockchainExplorerPage.tsx](../frontend/src/pages/blockchain/BlockchainExplorerPage.tsx)

### Blockchain & Smart Contracts
- Smart Contract: [blockchain/contracts/VeriQLedger.sol](../blockchain/contracts/VeriQLedger.sol)

### Tests & Operations
- Test Suite: [backend/tests/test_crypto.py](../backend/tests/test_crypto.py), [backend/tests/test_auth.py](../backend/tests/test_auth.py), [backend/tests/test_blockchain.py](../backend/tests/test_blockchain.py)
- Database Seed: [backend/scripts/seed_data.py](../backend/scripts/seed_data.py)
- Container Orchestration: [docker-compose.yml](../docker-compose.yml)
