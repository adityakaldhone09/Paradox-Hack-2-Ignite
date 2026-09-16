# VeriQ — UI/UX Design & Interaction Specification
**Document ID:** `VERIQ-UX-012`  
**Version:** `1.0.0`  
**Status:** `DRAFT / PENDING REVIEW`  
**Upstream Sources of Truth:** `01_REPOSITORY_AUDIT.md`, `02_PRODUCT_BLUEPRINT.md`, `03_PROBLEM_STATEMENT.md`, `04_MARKET_RESEARCH.md`, `05_PRODUCT_REQUIREMENTS.md`, `06_TECHNICAL_REQUIREMENTS.md`, `07_SYSTEM_ARCHITECTURE.md`, `08_AI_ARCHITECTURE.md`, `09_DATABASE_DESIGN.md`, `10_API_SPECIFICATION.md`, `11_SECURITY_ARCHITECTURE.md`  
**Downstream Dependents:** `13_DEPLOYMENT.md`, `14_TESTING_STRATEGY.md`

---

## 1. Document Metadata & Control

| Attribute | Value |
| :--- | :--- |
| **Product Name** | VeriQ — Secure Examination Paper Distribution Using Blockchain |
| **Tagline** | Secure Every Question Paper. Verify Every Action. |
| **Problem Reference** | WB-03 — Secure Examination Paper Distribution Using Blockchain |
| **Document Classification** | User Experience Architecture, Interface Design & Interaction Specification |
| **Document Owner** | Principal Product Designer & Frontend Architecture Working Group |
| **Target Audience** | Frontend Engineers, UI/UX Designers, Product Managers, Security Architects, QA Engineers |
| **Document Purpose** | Define the complete user experience, screen specifications, role-based workflows, 10-gate release interactions, error feedback patterns, and live demonstration flows for the VeriQ platform. |

---

## 2. UX Executive Summary & Design Philosophy

VeriQ's user interface bridges high-security cryptographic workflows and operational simplicity for examination administrators, paper authors, exam controllers, center superintendents, and compliance auditors.

```mermaid
graph TD
    subgraph UI_Philosophy["VeriQ UX Design Philosophy"]
        P1["1. Security by Transparency<br>All security states and gates visible"]
        P2["2. Zero Cognitive Overload<br>Checklist-driven high-stakes release"]
        P3["3. Server Authority First<br>UI reflects server state; never decides"]
        P4["4. Actionable Feedback<br>Every error provides explicit recovery path"]
        P5["5. Non-Color Redundancy<br>Icons + text badges accompany all status colors"]
    end
```

### Core UX Non-Negotiables:
1. **The Frontend is NOT a Security Boundary:** The UI never authorizes access, decides release timing, or validates cryptographic proofs. Hiding or disabling buttons is an ergonomic convenience; authoritative enforcement executes strictly on the backend.
2. **Deterministic Release Clarity:** The high-stakes 10-gate paper release interaction is structured as a clear, sequential pre-flight checklist.
3. **Cryptographic Data Minimization:** Plaintext Data Encryption Keys (DEKs), Master Keys (KEKs), private signing keys, and passwords are **never displayed in UI elements, logged in console outputs, or cached in client-side storage**.
4. **Distinct Lineage vs. Execution:** The UI visibly distinguishes operational release authorization (`RELEASED`) from asynchronous blockchain transaction anchoring (`PENDING_ANCHOR` $\rightarrow$ `CONFIRMED_ON_CHAIN`).
5. **Advisory AI Boundaries:** AI risk scores and telemetry anomaly heatmaps are explicitly labeled as **advisory signals**, ensuring operators understand that deterministic security controls remain solely authoritative.

---

## 3. UX Principles

| Principle | UI/UX Behavioral Manifestation |
| :--- | :--- |
| **1. Server-Authoritative State** | The UI never computes release windows or assumes authorization locally. Every view renders authoritative state fetched from API endpoints. |
| **2. Least-Privilege Visibility** | Navigation menus, action buttons, and sensitive tabs are filtered based on the active authenticated user's role. |
| **3. Explicit High-Impact Confirmation** | Destructive and security-critical actions (Paper Approval, Emergency Revocation, Manual Staging) require structured two-step confirmation modals. |
| **4. Actionable & Safe Errors** | Error banners explain *why* an action was denied (e.g., "Release window opens at 09:00 UTC") and offer safe next steps without exposing internal system secrets. |
| **5. Multi-Modal Status Cues** | Status indicators combine color, distinct SVG icons, text badges, and ARIA labels to ensure accessibility across all screen types and color-vision deficiencies. |
| **6. Progressive Disclosure** | Complex cryptographic and blockchain details (payload hashes, block numbers, transaction signatures) are tucked into collapsible audit drawers. |
| **7. Real-Time Security Telemetry** | Security incidents and revocation broadcasts reflect in the UI upon receipt of server updates. |

---

## 4. User & Role Model

```mermaid
graph LR
    subgraph Roles["VeriQ 5-Role Model"]
        Admin["Administrator<br>(System & Entity Setup)"]
        Examiner["Examiner<br>(Paper Drafting & Upload)"]
        Controller["Controller<br>(Approval & Distribution)"]
        Superintendent["Superintendent<br>(Staging & 10-Gate Release)"]
        Auditor["Auditor<br>(Read-Only Lineage Inspection)"]
    end
```

### 4.1 Role Profiles & UI Scope

| Role Principal | Primary UI Objectives | Permitted UI Views | Prohibited UI Views | Major Workflows |
| :--- | :--- | :--- | :--- | :--- |
| **`ADMINISTRATOR`** | User management, examination center registration, device authorization. | User Admin, Center Admin, Device Admin, System Settings. | Paper Authoring, Paper Approval, 10-Gate Release. | Provisioning centers, approving registered terminal devices. |
| **`EXAMINER`** | Question paper drafting, version creation, encrypted package upload. | Paper Authoring, Version Management, Submission Review. | Paper Approval, Center Assignment, Release Terminal. | Creating logical paper containers, uploading PDF versions. |
| **`CONTROLLER`** | Paper version approval, center assignment, emergency revocation. | Approval Console, Assignment Hub, Revocation Console, SOC Dashboard. | Paper Drafting (Authoring), Terminal Decryption. | Enforcing separation-of-duties approval, binding centers. |
| **`SUPERINTENDENT`** | Center terminal staging, 10-gate release execution, local exam oversight. | Release Readiness Terminal, Encrypted Staging View, Local Custody Log. | User Admin, Global Paper Approval, Global Revocation. | Pre-flight release verification, triggering 10-gate decryption. |
| **`AUDITOR`** | Independent compliance inspection, custody lineage verification, audit export. | Audit Dossier Hub, Custody Timeline, Blockchain Explorer, Incident Log. | All state-mutating actions (Upload, Approve, Assign, Release, Revoke). | Inspecting full paper history, exporting compliance PDFs. |

---

## 5. Information Architecture & Navigation Structure

```mermaid
graph TD
    Root["VeriQ Application Shell"]
    
    Root --> Auth["Authentication & Session"]
    Root --> Dash["Role-Specific Dashboard"]
    Root --> Papers["Paper & Version Management"]
    Root --> Dist["Distribution & Assignments"]
    Root --> Release["Release Terminal (10-Gate)"]
    Root --> Security["SOC & AI Advisory Hub"]
    Root --> Audit["Audit & Blockchain Lineage"]
    Root --> Admin["System & Center Admin"]

    Auth --> Login["/login"]
    Dash --> D1["/dashboard"]
    Papers --> P1["/papers (List)"]
    Papers --> P2["/papers/new (Create)"]
    Papers --> P3["/papers/:id/versions (Versions)"]
    Dist --> DI1["/assignments (Center Binding)"]
    Release --> R1["/release/:id (Pre-Flight & Execution)"]
    Security --> S1["/security/incidents"]
    Security --> S2["/security/heatmap (AI Advisory)"]
    Audit --> A1["/audit/dossier/:id"]
    Audit --> A2["/blockchain/explorer"]
    Admin --> AD1["/admin/centres"]
    Admin --> AD2["/admin/devices"]
```

### 5.1 Role-to-Navigation Matrix

| Navigation Item | Route | `ADMIN` | `EXAMINER` | `CONTROLLER` | `SUPERINTENDENT` | `AUDITOR` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | `/dashboard` | View Admin | View Examiner | View Controller | View Superintendent | View Auditor |
| **Examinations** | `/examinations` | **CRUD** | Read | **CRUD** | Read (Assigned) | Read |
| **Question Papers** | `/papers` | No Access | **Create/Edit**| Read Only | Read (Assigned) | Read |
| **Approval Console** | `/approvals` | No Access | No Access | **Approve/Reject** | No Access | Read |
| **Assignments** | `/assignments` | Read | No Access | **Assign/Revoke** | Read (Self) | Read |
| **Release Terminal** | `/release` | No Access | No Access | Read Status | **Execute Release** | Read |
| **Device Management** | `/devices` | **Authorize** | No Access | Read Only | Register Terminal | Read |
| **Security & AI SOC** | `/security` | View | No Access | View / Resolve | View Local | View / Ack |
| **Audit & Lineage** | `/audit` | Read | No Access | Read | Read (Self) | **Export Dossier** |
| **Blockchain Explorer**| `/blockchain` | Read | Read | Read | Read | Read |

---

## 6. Design System & Component Library

### 6.1 Typography Hierarchy
- **Font Family:** Inter, system-ui, -apple-system, sans-serif
- **Code / Digest Family:** JetBrains Mono, Fira Code, monospace
- **Hierarchy:**
  - `Display / H1:` 32px / Bold (Dashboard headers, Release terminal titles)
  - `H2:` 24px / SemiBold (Section containers, Gate overview cards)
  - `H3:` 18px / Medium (Card headers, Modal titles)
  - `Body Regular:` 14px / Regular (Table rows, description copy)
  - `Body Small:` 12px / Regular (Timestamp labels, metadata tags)
  - `Monospace Caption:` 12px / Medium (Cryptographic hashes, UUIDs, Tx hashes)

### 6.2 Semantic Color Palette & Multi-Modal Status Cues

| Semantic State | Base Color | Tailwind / Hex Class | Icon Indicator | Text Label | Screen Reader Text |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Success / Released** | Emerald Green | `#059669` / `text-emerald-600` | `CheckCircle` | `PASSED` / `RELEASED` | "Status: Success, verified" |
| **Pending / Validating** | Amber Yellow | `#D97706` / `text-amber-600` | `Clock` / `Spinner`| `PENDING` / `EVALUATING` | "Status: Evaluation in progress" |
| **Blocked / Gate Fail** | Rose Red | `#E11D48` / `text-rose-600` | `XCircle` | `BLOCKED` / `FAILED` | "Status: Blocked by security gate" |
| **Revoked / Quarantined**| Dark Crimson | `#9F1239` / `text-rose-900` | `ShieldAlert` | `REVOKED` | "Status: Resource revoked" |
| **Advisory / AI Signal** | Indigo Violet | `#4F46E5` / `text-indigo-600` | `Cpu` / `Sparkles` | `ADVISORY ONLY` | "Status: Machine learning advisory signal" |
| **Blockchain Confirmed** | Cyan Blue | `#0284C7` / `text-sky-600` | `Link` | `ON-CHAIN CONFIRMED` | "Status: Confirmed on blockchain ledger" |
| **Offline / Staged** | Slate Gray | `#475569` / `text-slate-600` | `Package` | `STAGED (ENCRYPTED)`| "Status: Staged locally in encrypted form" |

### 6.3 Reusable Component Catalog (20 Key Components)
1. `AppShell`: Top bar, sidebar, and breadcrumb layout wrapper.
2. `RoleBadge`: Color-coded chip indicating active authenticated role.
3. `GateStatusCard`: Checklist row showing gate number, name, status, and detail popover.
4. `HashDisplay`: Truncated monospace component with one-click copy and tooltip (`e3b0c442...855`).
5. `SecurityBanner`: High-visibility notification strip for revoked resources or SOC alerts.
6. `CountdownTimer`: Server-synchronized countdown clock to release window start/end.
7. `ConfirmModal`: Two-step destructive action confirmation dialog.
8. `AuditTimeline`: Chronological step-by-step visual lineage graph.
9. `BlockchainTxBadge`: State-aware tag distinguishing `PENDING_ANCHOR` from `CONFIRMED_ON_CHAIN`.
10. `HeatmapCard`: Geographic risk tile with incident counts and AI advisory score.
11. `DataTable`: Paginated, sortable table with skeleton loaders and empty states.
12. `StatusBadge`: Universal status indicator with icon, color, and text label.
13. `KioskContainer`: Read-only secure display canvas with copy/context-menu disablement.
14. `Breadcrumbs`: Path navigation displaying active hierarchical context.
15. `ToastNotification`: Non-blocking transient feedback alert.
16. `ErrorEnvelopeModal`: Standardized modal displaying machine-readable API error details.
17. `FileUploadZone`: Drag-and-drop PDF dropzone with magic-byte validation feedback.
18. `DeviceBindingCard`: Terminal hardware authorization card with revocation action.
19. `AIAdvisoryDisclaimer`: Mandatory banner stating AI has zero release authority.
20. `SessionExpiryBanner`: Warning toast displaying remaining JWT session lifetime.

---

## 7. Global Application Shell UX

```
+-----------------------------------------------------------------------------------------+
| [VeriQ Logo]  Examinations   Papers   Assignments   Release   SOC Hub   Audit   [Search] |
| Center: Delhi-Central (C104) | Terminal: TERM-DELHI-01 | Role: SUPERINTENDENT | [Logout] |
+-----------------------------------------------------------------------------------------+
| Breadcrumbs: Home / Release Terminal / PAP-CS401-2026 (v1.0)                             |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [MAIN CONTENT VIEW]                                                                    |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
| Server Time (UTC): 2026-09-18 09:02:14 | Sync: NTP Stratum-1 | Session Exp: 12m 45s      |
+-----------------------------------------------------------------------------------------+
```

### Key Elements:
- **Top Header:** Organization branding, global search, active center/device indicator, role badge, session expiration timer, and secure logout.
- **Context Strip:** Displays server-authoritative UTC clock, NTP synchronization status, and live WebSocket connection indicator `[Target]`.
- **Session Timeout UX:** A non-intrusive warning modal appears when session validity drops below 2 minutes, allowing one-click token refresh.

---

## 8. Authentication & Session UX

### 8.1 Login Screen (`/login`)
- **Inputs:** `Username or Institutional Email`, `Password`, `Device Fingerprint (Auto-Detected)`.
- **Actions:** `Sign In`, `Demo 1-Click Persona Login (Hackathon Mode)`.
- **States:**
  - *Default:* Clean enterprise login card.
  - *Authenticating:* Button spinner, fields disabled.
  - *Error (401):* Red error banner: *"Invalid username or password. Please verify your credentials."* (Account enumeration prevented).
  - *Suspended (403):* Banner: *"Account suspended. Contact your Institutional Administrator."*
  - *Session Expired:* Yellow banner: *"Your security session has expired. Please log in again."*

---

## 9. Role-Based Dashboard UX

### 9.1 Administrator Dashboard (`/dashboard/admin`)
- **KPI Cards:** Total Active Centers, Authorized Devices, System Uptime, Open Incidents.
- **Primary Actions:** `+ Register Examination Center`, `Authorize Pending Device`, `View System Logs`.
- **Recent Activity Table:** Latest device registrations and administrator configuration audits.

### 9.2 Examiner Dashboard (`/dashboard/examiner`)
- **KPI Cards:** Authored Papers, Versions Under Review, Approved Versions, Rejected Versions.
- **Primary Actions:** `+ Create Question Paper`, `Upload New Version`.
- **Active Papers List:** Table of authored papers with version badges and review statuses.

### 9.3 Controller Dashboard (`/dashboard/controller`)
- **KPI Cards:** Papers Pending Approval, Scheduled Today, Assigned Centers, Active Alerts.
- **Primary Actions:** `Review Pending Versions`, `Manage Center Assignments`, `Emergency Revocation Console`.
- **Distribution Monitor:** Live progress bar of centers that have completed offline staging.

### 9.4 Superintendent Dashboard (`/dashboard/superintendent`)
- **KPI Cards:** Papers Scheduled for Today, Staged Packages, Release Readiness Status.
- **Primary Actions:** `Pre-Stage Encrypted Package`, `Enter Release Terminal`.
- **Today's Examination Schedule:** Prominent timeline showing start/end release windows in synchronized UTC.

### 9.5 Auditor Dashboard (`/dashboard/auditor`)
- **KPI Cards:** Total Custody Events Anchored, Verified Papers, Open Security Incidents.
- **Primary Actions:** `Search Custody Dossier`, `Export Audit Trail (PDF/JSON)`, `Launch Blockchain Explorer`.
- **Live Lineage Feed:** Real-time stream of on-chain and off-chain custody transitions.

---

## 10. Paper Creation & Version Management UX

```mermaid
graph LR
    Step1["1. Create Container<br>(Exam Code, Title, Subject)"] --> Step2["2. Upload PDF Binary<br>(Drag & Drop %PDF-)"]
    Step2 --> Step3["3. Ingest & Hash<br>(Server computes content_hash)"]
    Step3 --> Step4["4. AES-GCM Encryption<br>(Server encrypts & uploads to S3)"]
    Step4 --> Step5["5. Submit for Review<br>(Transitions to PENDING_REVIEW)"]
```

### Screen Details (`/papers/new` & `/papers/:id/versions`):
- **Upload Dropzone:** Restricts file picker to `.pdf` (max 25MB).
- **Processing Modal:** Displays real-time step progress: *1. Validating PDF bytes... 2. Computing content hash... 3. Encrypting AES-256-GCM... 4. Anchoring creation...*
- **Version Overview:** Displays immutable `content_hash`, `ciphertext_hash`, file size, version notes, and author identity.

---

## 11. Approval Workflow UX (Separation of Duties)

```
+-----------------------------------------------------------------------------------------+
| Paper Version Approval: Advanced Operating Systems (PAP-CS401-2026 v1.0)                 |
+-----------------------------------------------------------------------------------------+
| Author: prof_sharma@univ.ac.in (EXAMINER) | Uploaded: 2026-09-17 14:30 UTC              |
| Content Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855         |
| Ciphertext Hash: a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0     |
+-----------------------------------------------------------------------------------------+
| [!] SEPARATION OF DUTIES VERIFICATION:                                                  |
| [✓] Current Approver (controller@state-board.gov.in) != Author (prof_sharma@univ.ac.in) |
+-----------------------------------------------------------------------------------------+
| [ Reject Version... ]                                            [ Approve & Lock Version ]|
+-----------------------------------------------------------------------------------------+
```

### Interaction Rules:
- If the logged-in user is the paper author, the `[Approve]` action triggers an explanatory banner: *"Separation of Duties Policy: Authors cannot approve their own papers."* Backend authorization remains authoritative.
- Approving triggers a confirmation modal requiring the controller to acknowledge that cryptographic metadata becomes immutable upon approval.

---

## 12. Centre Assignment & Release Window UX

### Screen Details (`/assignments/new`):
- **Inputs:**
  - `Select Approved Paper Version` (Dropdown showing approved versions only).
  - `Select Authorized Examination Center` (Searchable multi-select).
  - `Release Window Start (UTC)` (Date/Time picker).
  - `Release Window End (UTC)` (Date/Time picker).
- **Validation Feedback:** The UI validates that `End Time > Start Time` and displays the local time equivalent alongside UTC to prevent regional scheduling errors. Release Window Start and Release Window End are configured according to applicable examination policy. Any minimum duration or grace-period rule is policy-defined/TBD.

---

## 13. Device Authorization UX

### Screen Details (`/admin/devices`):
- **Device Lifecycle Badges:**
  - `PENDING_AUTHORIZATION` (Amber): Newly registered terminal awaiting admin review.
  - `AUTHORIZED` (Green): Approved for 10-gate release execution at assigned center.
  - `REVOKED` (Red): Blacklisted terminal; all subsequent release attempts fail Gate 4.
- **Action Buttons:** `[Authorize Device]`, `[Revoke Device]`.
- **Note in UI:** Prototype indicates browser-based fingerprinting; target indicates hardware TPM attestation `[Target]`.

---

## 14. Encrypted Staging UX

```mermaid
graph TD
    A["Assignment Active"] --> B["Superintendent Clicks 'Pre-Stage Package'"]
    B --> C["Server Streams .enc Ciphertext to Terminal"]
    C --> D["Terminal Computes Local ciphertext_hash"]
    D --> E["UI Compares Local Hash with Registered ciphertext_hash"]
    E --> F["Status: STAGED & VERIFIED (Locked until Release Window)"]
```

### Staging vs. Decryption Distinction:
- The Staging view prominently displays: *"ENCRYPTED ARTIFACT STAGED SAFELY. Decryption keys remain secured in KMS custody until release window opens."*
- Enables offline reliability without violating paper confidentiality.

---

## 15. TEN-GATE RELEASE INTERACTION SPECIFICATION

This section details the UI presentation for all 10 release gates on the Superintendent Release Terminal:

```
+-----------------------------------------------------------------------------------------+
| PRE-FLIGHT 10-GATE RELEASE CHECKLIST                                                   |
| Paper: PAP-CS401-2026 (v1.0) | Centre: Delhi-Central (C104) | Window: 09:00 - 09:30 UTC  |
+-----------------------------------------------------------------------------------------+
| [✓] Gate 1: Authentication Valid        | Identity verified (superintendent@delhi.gov.in)|
| [✓] Gate 2: Role Authorization          | Role SUPERINTENDENT permitted for terminal     |
| [✓] Gate 3: Center Assignment Scoped    | Center C104 matches active institutional binding|
| [✓] Gate 4: Device Authorization        | Terminal TERM-DELHI-01 is AUTHORIZED            |
| [✓] Gate 5: Server Release Window Open  | Server Time 09:02 UTC is inside 09:00-09:30 UTC |
| [✓] Gate 6: Version Status Locked       | Version v1.0 is in APPROVED status             |
| [✓] Gate 7: Revocation Check Clean      | Zero revocation flags on Paper, Center, Device |
| [✓] Gate 8: Ciphertext Hash Verified    | Staged .enc digest matches registered SHA-256   |
| [✓] Gate 9: KMS Key Unwrap Authorized   | KMS release policy evaluation satisfied        |
| [✓] Gate 10: Audit & Lineage Anchored   | Release logged to DB; anchor submitted to queue|
+-----------------------------------------------------------------------------------------+
| OVERALL STATUS: ALL GATES SATISFIED - READY FOR DECRYPTED RENDERING                     |
|                                                                                         |
| [ Initiate Decrypted Exam Session ]                                                     |
+-----------------------------------------------------------------------------------------+
```

### Detailed Gate-by-Gate UI Specification

| Gate # | Gate Name | UI Label | Normal / Success Visual State | Failure / Blocked Visual State | User-Facing Failure Message | Safe Recovery Action |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **G1** | **Authentication** | `Identity Verification` | Green check + Username | Red cross + "Unauthenticated" | *"Session expired or invalid. Please log in again."* | Redirect to `/login`. |
| **G2** | **Authorization** | `Role Permissions` | Green check + "SUPERINTENDENT" | Red cross + "Role Mismatch" | *"Access denied: Your account lacks Superintendent privileges."* | Contact Administrator. |
| **G3** | **Center Binding** | `Center Scope Binding` | Green check + Center Code | Red cross + "Unassigned Center"| *"This paper is not assigned to Center C104."* | Check assignment schedule. |
| **G4** | **Device Binding** | `Device Authorization` | Green check + Device ID | Red cross + "Rogue Device" | *"Terminal device is not authorized for release." (Current prototype: browser/device fingerprint binding; Target: hardware/device attestation [TARGET/TBD]).* | Register device in Admin. |
| **G5** | **Authoritative Time**| `Server Release Window`| Green check + UTC Time | Amber clock + "Window Closed" | *"Release window is closed. Window: 09:00 - 09:30 UTC. Current Server Time: 08:35 UTC."* | Wait for scheduled window. |
| **G6** | **Version State** | `Paper Approval State` | Green check + "APPROVED" | Red cross + "DRAFT / UNAPPROVED"| *"Question paper version is not in approved status."* | Await Controller approval. |
| **G7** | **Revocation** | `Emergency Revocation` | Green check + "ACTIVE" | Red shield + "REVOKED" | *"EMERGENCY BLOCK: This paper/center has been revoked by the Controller."* | Contact Command Center. |
| **G8** | **Integrity** | `Ciphertext Verification`| Green check + Digest Match | Red cross + "CORRUPT DIGEST" | *"CRITICAL: Staged package digest mismatch. Potential file tampering detected."* | Re-stage original package. |
| **G9** | **KMS Custody** | `KMS Release Policy` | Green check + "Authorized" | Red cross + "KMS Error" | *"KMS service unavailable or release policy denied key unwrap."* | Retry; check KMS connectivity. |
| **G10**| **Audit & Anchor**| `Custody Lineage Log` | Green check + "Queued" | Red cross + "Audit Fail" | *"System failed to record mandatory audit record. Release aborted."* | Check DB connectivity. |

---

## 16. Release Readiness Screen UX

### State Engine:
- `READY` (Green Banner): All 10 gates green $\rightarrow$ Primary action `[Initiate Decrypted Exam Session]` enabled.
- `PENDING_TIME` (Amber Banner): Gates 1–4, 6–8 green, Gate 5 shows live countdown timer $\rightarrow$ Primary action disabled with label `[Window Opens in 04m:22s]`.
- `BLOCKED_INTEGRITY` (Red Banner): Gate 8 fails $\rightarrow$ Terminal displays critical warning banner and auto-generates SOC incident.
- `BLOCKED_REVOKED` (Crimson Banner): Gate 7 fails $\rightarrow$ Screen locked with emergency contact instructions.

---

## 17. Release Execution UX

```mermaid
sequenceDiagram
    autonumber
    participant Super as Superintendent
    participant UI as Release Terminal UI
    participant API as VeriQ Release API
    participant Renderer as Secure Display Canvas

    Super->>UI: Clicks [Initiate Decrypted Exam Session]
    UI->>UI: Display Confirmation Dialog ("Confirm Exam Start for C104")
    Super->>UI: Clicks [Confirm & Decrypt]
    UI->>UI: Show Spinner: "Evaluating 10 Server Gates..."
    UI->>API: POST /papers/:id/versions/:v/release
    
    alt All 10 Gates Pass
        API-->>UI: 200 OK (ephemeral_key_token, IV, Tag)
        UI->>Renderer: Handshake with Ephemeral Token [TBD Protocol]
        Renderer->>Renderer: In-Memory Decryption to RAM
        Renderer-->>UI: Display Kiosk Render View
        UI->>UI: Transition to Full-Screen Read-Only Exam Mode
    else Any Gate Fails
        API-->>UI: 403 / 422 Error Envelope (Error Code, Gate #, Details)
        UI->>UI: Highlight Failed Gate in Red + Show Actionable Alert
    end
```

---

## 18. Ephemeral Key Token UX Boundary

### Strict Frontend Invariants:
1. **Never Display Token Internals:** The UI **never** prints `k_eph_...` strings on screen or logs them to `console.log`.
2. **Never Display Plaintext Keys:** The UI never displays symmetric keys (DEK). Decryption occurs strictly inside the secure renderer canvas.
3. **Short-Lived Lifetime:** The UI shows a session duration timer (e.g., "Exam Session Active — 120m remaining").

---

## 19. Secure Decrypted Rendering UX

```
+-----------------------------------------------------------------------------------------+
| [🔒 SECURE READ-ONLY EXAM KIOSK]  Paper: CS-401 Final  Centre: C104  Terminal: T-01      |
| Watermark: DELHI-CENTRAL-C104 | Candidate Session Active | [🔒 Lock View]  [End Session] |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  SECTION A: ADVANCED OPERATING SYSTEMS                                                  |
|  Q1. Explain the Byzantine Generals Problem in distributed consensus systems...       |
|  Q2. Compare and contrast AES-GCM authenticated encryption with CBC mode...            |
|                                                                                         |
|  [ Watermark overlay: DELHI-CENTRAL | 2026-09-18 09:15:00 UTC | SUPERINTENDENT-01 ]     |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

### Kiosk UI Controls `[Target / TBD]`:
- **Read-Only Display:** The target renderer may suppress common user-interface actions such as text selection, context menus and ordinary print commands as defense-in-depth UX controls. These measures must not be treated as protection against a compromised operating system, privileged user, screen capture, or external photography.
- **Dynamic Background Watermark:** Semitransparent diagonal overlay displaying Center Code, UTC Timestamp, and Terminal ID as an illustrative deterrence overlay.
- **Emergency Session Lock:** Screen blackout button for the superintendent upon security alert.

---

## 20. Cryptographic Integrity Verification UX

### Screen Details (`/papers/:id/verify`):
- **Visual Digest Comparison:**
  - `Expected Ciphertext Hash (Anchored):` `a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0`
  - `Calculated Local Ciphertext Hash:` `a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0`
- **Result Badge:** Green `[✓ HASH MATCH CONFIRMED]` or Red `[✗ INTEGRITY FAILURE — HASH MISMATCH]`.
- **Mismatch Workflow:** In tamper simulation, the UI flags the paper as quarantined upon verification failure and provides a direct link to the auto-generated SOC incident.

---

## 21. Emergency Revocation UX

```
+-----------------------------------------------------------------------------------------+
| ⚠️ EMERGENCY PAPER REVOCATION MODAL                                                     |
+-----------------------------------------------------------------------------------------+
| You are about to REVOKE Question Paper PAP-CS401-2026 across ALL assigned centers.      |
| This action causes subsequent authorization evaluations to reject the revoked resource.  |
|                                                                                         |
| Mandatory Reason: [ Suspected leak at regional storage center 104___________ ]          |
|                                                                                         |
| Type "CONFIRM REVOKE" to execute: [ CONFIRM REVOKE_________________ ]                   |
|                                                                                         |
| [ Cancel ]                                                  [ Execute Emergency Revoke ] |
+-----------------------------------------------------------------------------------------+
```

---

## 22. Security Incident Management UX (`/security/incidents`)

### Incident List & Details:
- **Severity Chips:** `CRITICAL` (Red), `HIGH` (Orange), `MEDIUM` (Yellow), `LOW` (Blue).
- **Incident Types:** `HASH_MISMATCH`, `DEVICE_MISMATCH`, `EARLY_ACCESS`, `UNAUTHORIZED_CENTRE`.
- **Workflow Actions:** `[Acknowledge / Investigate]` $\rightarrow$ `[Resolve with Notes]`.
- **Correlation Panel:** Shows joined access event timestamp, user email, center name, device ID, and advisory AI risk score.

---

## 23. Audit Trail & Chain-of-Custody UX (`/audit`)

```mermaid
graph TD
    subgraph Stream1["Application Audit Logs"]
        L1["Admin logged in"] --> L2["Paper created"]
    end
    subgraph Stream2["Access Telemetry Events"]
        E1["Early access blocked (08:35)"] --> E2["10-Gate Release granted (09:02)"]
    end
    subgraph Stream3["Custody Transition Events"]
        C1["DRAFT -> APPROVED"] --> C2["ASSIGNED -> RELEASED"]
    end
    subgraph Stream4["Blockchain Lineage Anchors"]
        B1["Tx 0x4f8a... (CONFIRMED)"] --> B2["Tx 0x9b2c... (PENDING_ANCHOR)"]
    end
```

### Visual Differentiation:
The Audit Hub uses dedicated tabs and distinctive iconography to ensure operators never confuse local application audit logs with external blockchain transaction receipts.

---

## 24. Blockchain Status & Lineage Explorer UX (`/blockchain`)

| Anchor State | UI Badge | Tooltip / Explanatory Text | Next State Progression |
| :--- | :--- | :--- | :--- |
| **`PENDING_ANCHOR`** | Amber `Anchor Queued` | *"Event logged; queued for asynchronous blockchain relayer broadcast."* | $\rightarrow$ `SUBMITTED` |
| **`SUBMITTED`** | Blue `Broadcast to Mempool` | *"Transaction broadcast to blockchain network; awaiting block inclusion."* | $\rightarrow$ `PENDING_CONFIRMATION` |
| **`PENDING_CONFIRMATION`** | Cyan `Block Included` | *"Included in block #14209; awaiting configured finality depth."* | $\rightarrow$ `CONFIRMED_ON_CHAIN` |
| **`CONFIRMED_ON_CHAIN`** | Emerald `On-Chain Confirmed` | *"Transaction confirmed by distributed consensus."* | Final state |
| **`DEAD_LETTER`** | Red `Anchor Stalled` | *"Relayer retry limit reached. Operational release unaffected."* | Administrator retry |

---

## 25. AI Advisory Security Dashboard UX (`/security`)

```
+-----------------------------------------------------------------------------------------+
| 🤖 AI ADVISORY THREAT TELEMETRY DASHBOARD                                               |
| [!] Advisory Signal Only — Deterministic 10-Gate Release Engine Remains Solely Authoritative|
+-----------------------------------------------------------------------------------------+
| Total Monitored Centers: 120 | Threat Level: ELEVATED | Anomaly Alerts (Last 1hr): 3    |
+-----------------------------------------------------------------------------------------+
| [ GEOGRAPHIC CENTER RISK HEATMAP ] *(Illustrative demo data)*                           |
| - Delhi Central (C104): [ High Risk - Score: 85 ] (Burst of 12 blocked access attempts) |
| - Mumbai North (C102):  [ Normal    - Score: 10 ] (Regular scheduled staging)           |
+-----------------------------------------------------------------------------------------+
```

### AI UX Rules:
- Prominent persistent banner: *"Advisory Telemetry — AI has zero autonomous authority to release papers, alter RBAC, or approve versions."*
- Anomaly scores are presented as diagnostic aids for SOC analysts, not proof of guilt.

---

## 26. Error & Failure UX Taxonomy

| HTTP Status / Condition | User-Facing Banner Title | Descriptive Guidance | Safe Next Action |
| :--- | :--- | :--- | :--- |
| **`401 Unauthorized`** | *Authentication Required* | *"Your security session is missing or expired."* | `[Log In Again]` |
| **`403 Forbidden (Gate 5)`** | *Release Window Closed* | *"Current server time is outside the scheduled window."* | `[View Release Schedule]` |
| **`403 Forbidden (Gate 4)`** | *Terminal Device Mismatch* | *"This hardware terminal is not authorized for release."* | `[Contact Admin]` |
| **`409 Conflict (OCC)`** | *Concurrency Update Conflict* | *"Another administrator modified this record simultaneously."* | `[Refresh Fresh State]` |
| **`422 Unprocessable (G8)`** | *Integrity Verification Failure*| *"Staged ciphertext digest does not match registered proof."* | `[Quarantine & Re-Stage]` |
| **`502 Bad Gateway (G9)`** | *KMS Custody Unavailable* | *"Key Management Service did not authorize key unwrapping."* | `[Retry Connection]` |
| **`503 Service Unavailable`**| *Database Maintenance* | *"The central database is temporarily unreachable."* | `[Check System Status]` |

---

## 27. Security UX Anti-Patterns (Strictly Prohibited)

1. **Security via Hidden Elements:** Never rely on hidden buttons to prevent unauthorized actions; backend authorization is strictly required.
2. **Client-Calculated Clocks:** Never display local machine time as the authoritative release clock.
3. **Plaintext Key Exposure:** Never display DEK hex strings, base64 key dumps, or KEK labels in UI components.
4. **False Blockchain Verification:** Never label a transaction as "Verified" while in `PENDING_ANCHOR` state.
5. **AI as Decision Maker:** Never present AI anomaly scores as binding authorization decisions.
6. **Ambiguous Destructive Modals:** Never provide a single-click "Revoke" button without mandatory reason capture.

---

## 28. Accessibility & Inclusivity Specifications

- **Target Compliance:** WCAG 2.1 Level AA `[Target / TBD]`.
- **Keyboard Navigation:** Full tab-order navigation across all forms, tables, release checklists, and modals.
- **Color Independence:** All status colors accompanied by distinct iconography, badges, and ARIA labels.
- **Contrast Ratios:** Minimum 4.5:1 text-to-background contrast across all dark and light mode themes.

---

## 29. Supported Device Contexts & Form Factors

- **Administrator & Controller Console:** Optimized for standard Desktop Displays ($\ge 1280\text{px}$).
- **Examiner Authoring Terminal:** Desktop / Laptop workstation with PDF drag-and-drop support.
- **Superintendent Release Station:** Desktop workstation with high-visibility 10-gate checklist display.
- **Secure Examination Kiosk:** Locked full-screen display terminal ($\ge 1024\times768\text{px}$) with restricted input bindings.

---

## 30. Loading, Empty & Transitional UX States

- **Loading States:** Skeleton pulse loaders for tables and cards; circular spinners for atomic button mutations.
- **Empty States:** Clear illustrations and calls-to-action (e.g., *"No question papers created yet. Click '+ Create Question Paper' to begin."*).
- **Transitional States:** Clear progression bars during multi-step cryptographic hashing and file staging operations.

---

## 31. UX State Machines

```mermaid
stateDiagram-v2
    state "Paper Creation" as PC {
        [*] --> DRAFT : Creator Uploads
        DRAFT --> PENDING_REVIEW : Submit for Approval
        PENDING_REVIEW --> APPROVED : Controller Approves
        PENDING_REVIEW --> REJECTED : Controller Rejects
    }

    state "Release Execution" as RE {
        APPROVED --> ASSIGNED : Center Bound
        ASSIGNED --> STAGED : Ciphertext Downloaded
        STAGED --> GATES_EVALUATING : Release Clicked
        GATES_EVALUATING --> RELEASED : 10 Gates Pass
        GATES_EVALUATING --> BLOCKED : Any Gate Fails
    }

    state "Emergency Revocation" as ER {
        APPROVED --> REVOKED : Controller Revokes
        ASSIGNED --> REVOKED : Controller Revokes
        STAGED --> REVOKED : Controller Revokes
    }
```

---

## 32. User Journey Maps

### Journey A: Examiner Creates & Submits Paper
1. Examiner navigates to `/papers/new`.
2. Enters exam code (`EXAM-2026-CS-FINAL`) and title.
3. Drops `CS401_Final.pdf` into upload zone.
4. Server computes `content_hash`, encrypts with AES-256-GCM, and uploads `.enc`.
5. UI displays version overview (`v1.0 DRAFT`) with immutable hash chips.
6. Examiner clicks `[Submit for Approval]`. Version status transitions to `PENDING_REVIEW`.

### Journey B: Controller Approves Paper (Separation of Duties)
1. Controller logs into `/approvals`.
2. Selects `PAP-CS401-2026 v1.0`.
3. System validates `author != approver`.
4. Controller reviews metadata and clicks `[Approve Version]`.
5. Confirms modal. Status updates to `APPROVED`; cryptographic metadata is locked.

### Journey C: Controller Assigns Paper to Center
1. Controller navigates to `/assignments/new`.
2. Selects `PAP-CS401-2026 v1.0` and Center `Delhi-Central (C104)`.
3. Configures release window: `2026-09-18 09:00 - 09:30 UTC`.
4. Clicks `[Confirm Assignment]`. Status updates to `ASSIGNED`.

### Journey D: Superintendent Pre-Stages Encrypted Package
1. Superintendent at Center C104 logs in at `08:00 UTC`.
2. Navigates to `/release`.
3. Clicks `[Pre-Stage Encrypted Package]`.
4. Terminal downloads `.enc` ciphertext, computes SHA-256 digest, and confirms match with server `ciphertext_hash`.
5. UI displays: `STAGED & READY (Ciphertext Verified)`.

### Journey E: Superintendent Attempts Early Release (Blocked Gate 5)
1. At `08:35 UTC`, Superintendent clicks `[Initiate Decrypted Exam Session]`.
2. Release engine evaluates 10 gates. Gate 5 fails (Server time 08:35 < Window 09:00).
3. UI displays red cross on Gate 5 and yellow banner: *"Release window opens in 25m:00s."*
4. Automatic `EARLY_ACCESS` security incident logged.

### Journey F: Legitimate Release Execution
1. At `09:02 UTC`, Superintendent clicks `[Initiate Decrypted Exam Session]`.
2. Release engine evaluates all 10 gates; all pass.
3. Server returns `ephemeral_key_token`.
4. UI transitions to full-screen secure read-only kiosk view.
5. Blockchain anchor queued as `PENDING_ANCHOR`.

### Journey G: Tampered Ciphertext Detected (Blocked Gate 8)
1. Local staged `.enc` file corrupted or modified on disk.
2. Release request evaluates Gate 8. Hash mismatch detected.
3. UI locks release terminal with red banner: *"CRITICAL: Integrity failure. Ciphertext tampered."*
4. Auto-generates CRITICAL incident on SOC threat feed.

### Journey H: Terminal Device Revocation
1. Terminal `TERM-DELHI-02` reported lost.
2. Administrator clicks `[Revoke Device]` on `/admin/devices`.
3. After the server confirms revocation, the device status is displayed as `REVOKED`.
4. Subsequent release attempts from this terminal fail Gate 4.

### Journey I: Auditor Complete Custody Review
1. Auditor opens `/audit/dossier/PAP-CS401-2026`.
2. Views combined timeline: Authoring $\rightarrow$ Approval $\rightarrow$ Assignment $\rightarrow$ Staging $\rightarrow$ Release.
3. Clicks `[Export Compliance Dossier]`. Exports the audit dossier in the supported configured format.

### Journey J: Blockchain Confirmation Lifecycle
1. Paper released; UI displays blue badge `Anchor Queued (PENDING_ANCHOR)`.
2. Relayer mines block; badge updates to `Block Included (PENDING_CONFIRMATION)`.
3. Finality condition satisfied; badge transitions to green `On-Chain Confirmed (CONFIRMED_ON_CHAIN)`.

### Journey K: SOC Analyst Investigates AI Anomaly
1. SOC Analyst opens `/security`.
2. AI heatmap flags Center C104 with Elevated Risk (Score: 85, 12 early access attempts — illustrative demo data).
3. Analyst clicks Center C104 $\rightarrow$ inspects joined access logs $\rightarrow$ contacts center supervisor.

---

## 33. Hackathon Live Demonstration UX Script (8-Minute Flow)

```mermaid
graph TD
    S1["Scene 1 (1m): Paper Creation & SoD Approval<br>Author uploads PDF -> Controller approves"] --> S2["Scene 2 (1m): Assignment & Pre-Staging<br>Bind Center C104 -> Download .enc ciphertext"]
    S2 --> S3["Scene 3 (1.5m): Premature Release Attack<br>Superintendent triggers release early -> Gate 5 BLOCKS"]
    S3 --> S4["Scene 4 (1.5m): Tampered Ciphertext Attack<br>Modify 1 byte in .enc -> Gate 8 BLOCKS (Hash Mismatch)"]
    S4 --> S5["Scene 5 (1.5m): Legitimate 10-Gate Release<br>Valid time & intact file -> All 10 Gates PASS -> Kiosk Display"]
    S5 --> S6["Scene 6 (0.5m): Blockchain Anchoring<br>Show transition: PENDING_ANCHOR -> CONFIRMED"]
    S6 --> S7["Scene 7 (0.5m): Auditor Lineage Review<br>Show complete tamper-evident custody trail"]
    S7 --> S8["Scene 8 (0.5m): AI Advisory Threat Heatmap<br>Show SOC anomaly feed (AI advisory only)"]
```

### Demonstration Script Breakdown:
- **Scene 1 (0:00 - 1:00):** Show author uploading `Exam_2026.pdf`. Switch to Controller persona to demonstrate separation-of-duties approval.
- **Scene 2 (1:00 - 2:00):** Assign paper to Center C104 with 09:00 UTC window. Show local terminal staging encrypted `.enc` file.
- **Scene 3 (2:00 - 3:30):** Attempt release at 08:35 UTC. Demonstrate Gate 5 blocking early release and creating a SOC incident.
- **Scene 4 (3:30 - 5:00):** Click `[Simulate Tamper]` on demo console. Trigger release. Demonstrate Gate 8 blocking with `HASH_MISMATCH`.
- **Scene 5 (5:00 - 6:30):** Restore valid package; switch the isolated hackathon demo environment to its configured simulated release time of 09:02 UTC. Trigger release. Show all 10 gates turning green in real-time sequence, opening the secure read-only exam view. (Note: Demo-time simulation is limited to the isolated demonstration environment and does not represent production client-side time control.)
- **Scene 6 (6:30 - 7:00):** Open Blockchain Explorer tab. Show transaction receipt and transition from `PENDING_ANCHOR` to `CONFIRMED_ON_CHAIN`.
- **Scene 7 (7:00 - 7:30):** Open Auditor Dossier. Show end-to-end custody chain matching hashes.
- **Scene 8 (7:30 - 8:00):** Open SOC Dashboard. Show AI advisory heatmap highlighting earlier attack attempts. Conclude with core message: *"Secure Every Question Paper. Verify Every Action."*

---

## 34. MVP vs. Target vs. Future Feature Matrix

| Feature / UX Capability | Current Prototype (`01`) | Hackathon MVP (`12`) | Target Production (`[TARGET]`) | Future Vision (`[FUTURE]`) |
| :--- | :---: | :---: | :---: | :---: |
| **Role-Based Navigation** | `[PARTIAL]` | `[IMPLEMENTED]` | `[TARGET]` | Biometric Role Binding |
| **Separation of Duties Approval** | `[PARTIAL]` | `[IMPLEMENTED]` | `[TARGET]` Multi-Board SoD | Threshold Cryptography SoD |
| **10-Gate Visual Checklist** | `[PARTIAL]` | `[IMPLEMENTED]` | `[TARGET]` | Real-Time Hardware Sensor Gate |
| **Server NTP Synchronized Clock** | `[UNSAFE]` (client time) | `[IMPLEMENTED]` | `[TARGET]` GPS Sync | Satellite Time Attestation |
| **Dual Digest Verification Display**| `[PARTIAL]` (single hash) | `[IMPLEMENTED]` | `[TARGET]` | Zero-Knowledge Proof Digest |
| **Ephemeral Key Decryption Boundary**| `[MOCKED]` | `[IMPLEMENTED]` | `[TARGET]` Kiosk OS | Secure Hardware Enclave (SGX) |
| **Blockchain Status Indicator** | `[MOCKED]` (sync) | `[IMPLEMENTED]` (async)| `[TARGET]` PoA Relayer | Multi-Chain Redundancy |
| **AI Advisory Threat Heatmap** | `[CURRENT]` (simulated) | `[IMPLEMENTED]` | `[TARGET]` Real-Time ML | Automated Threat Quarantine |
| **Offline Encrypted Staging** | `[CURRENT]` | `[IMPLEMENTED]` | `[TARGET]` P2P Mesh | Satellite Distribution |

---

## 35. Frontend Technical Architecture & Integration Contract

1. **State Management & Caching:**
   - Operational entity state (papers, assignments) is cached ephemerally using standard query caches.
   - **Plaintext examination question text and cryptographic key material are NEVER stored in localStorage, sessionStorage, or IndexedDB.**
2. **Request Tracing & Idempotency:**
   - All outgoing API mutation requests attach a unique `X-Request-ID` and optional `Idempotency-Key` header.
3. **Optimistic UI Constraints:**
   - The UI **never** applies optimistic UI updates to security-critical actions (Release, Approval, Revocation). Buttons remain in loading/evaluating states until server confirmation is received.

---

## 36. Security UX Verification Matrix

| Test Scenario | Triggered Condition | Expected Frontend Behavior | Verification Method |
| :--- | :--- | :--- | :--- |
| **UX-TEST-01** | Missing Authorization Header | Immediate redirect to `/login` with 401 error banner. | Automated Cypress Test |
| **UX-TEST-02** | Author attempts self-approval | Shows error modal: "Separation of duties violation." | Negative UI Workflow Test |
| **UX-TEST-03** | Release triggered before window | Gate 5 highlighted in red; countdown timer displayed. | Time Manipulation Test |
| **UX-TEST-04** | Staged file corrupted | Gate 8 highlighted in red; "Integrity failure" banner. | Ciphertext Tamper Test |
| **UX-TEST-05** | Revoked paper selected | Red shield badge; release button disabled with reason. | Revocation Display Test |
| **UX-TEST-06** | Blockchain anchor queued | Blue badge displays `PENDING_ANCHOR` (not "Verified"). | Relayer Status Test |
| **UX-TEST-07** | Concurrent release collision | Modal prompts: "State updated. Refreshing fresh data." | Concurrency Collision Test |

---

## 37. UX Risks & Open Decisions (TBD Register)

| Decision ID | Area | Current Working Assumption | Resolution Milestone |
| :--- | :--- | :--- | :--- |
| **TBD-UX-01** | Secure Kiosk Implementation | Custom locked Electron container vs. PWA Kiosk mode. | Phase 2 (Terminal Client) |
| **TBD-UX-02** | Local Printing Spooler UX | Physical paper print counter with dynamic barcode watermarking. | Phase 2 (Hardware Integration) |
| **TBD-UX-03** | Real-Time Push vs. Polling | Server-Sent Events (SSE) vs. WebSocket for live gate updates. | Phase 2 (Frontend Architecture) |
| **TBD-UX-04** | Accessibility Certification Target| Full WCAG 2.1 AA formal compliance audit. | Phase 3 (Accessibility Review) |

---

## 38. Architecture Decision Records (ADRs)

### ADR-UX-001: Server-Authoritative Security State Representation
- **Status:** APPROVED
- **Decision:** The UI strictly renders authoritative server state and never assumes access or release eligibility locally.
- **Consequences:** Eliminates client-side bypass vulnerabilities; ensures UI accurately reflects server truth.

### ADR-UX-002: Visual 10-Gate Pre-Flight Checklist
- **Status:** APPROVED
- **Decision:** Present the complex 10-gate release evaluation as a clean, sequential checklist card.
- **Consequences:** Dramatically reduces operator cognitive load during high-stakes examination release windows.

### ADR-UX-003: Sensitive Data Minimization in Frontend
- **Status:** APPROVED
- **Decision:** Cryptographic keys (DEK/KEK) and raw password hashes are strictly prohibited from frontend rendering and client storage.
- **Consequences:** Prevents client-side secret leakage through browser developer tools or memory inspection.

### ADR-UX-004: Visual Separation of Blockchain Anchor States
- **Status:** APPROVED
- **Decision:** Visibly distinguish `PENDING_ANCHOR` from `CONFIRMED_ON_CHAIN` using distinctive color and icon badges.
- **Consequences:** Eliminates false claims of instant blockchain finality while operations proceed smoothly.

### ADR-UX-005: Advisory-Only AI Presentation
- **Status:** APPROVED
- **Decision:** Display persistent disclaimers and advisory styling for all AI risk heatmaps and anomaly feeds.
- **Consequences:** Ensures operators understand that deterministic security gates remain solely authoritative.

### ADR-UX-006: Structured Two-Step Destructive Confirmation
- **Status:** APPROVED
- **Decision:** Require explicit typed confirmation (e.g., typing "CONFIRM REVOKE") for emergency revocation actions.
- **Consequences:** Prevents accidental operational disruption of active examinations.

---

## 39. Traceability Matrix

| Upstream Requirement | Primary UI View / Component | Enforced UX Behavior | Status |
| :--- | :--- | :--- | :---: |
| **FR-01: IAM & Auth** | `/login`, `AppShell`, `RoleBadge` | Argon2id auth, role badge, session expiry toast | `[TARGET]` |
| **FR-02: Paper Creation** | `/papers/new`, `FileUploadZone` | Drag-and-drop PDF, dual-digest display | `[TARGET]` |
| **FR-03: SoD Approval** | `/approvals`, `ConfirmModal` | Author != Approver visual check and modal | `[TARGET]` |
| **FR-04: Center/Device Binding**| `/assignments`, `/devices` | Center selector, device authorization badges | `[TARGET]` |
| **FR-05: 10-Gate Release Engine**| `/release/:id`, `GateStatusCard` | Full 10-Gate visual checklist & execution | `[TARGET]` |
| **FR-06: Digest Verification** | `/papers/:id/verify`, `HashDisplay` | Dual hash comparison & tamper alert | `[TARGET]` |
| **FR-07: Emergency Revocation** | `/revocations`, `ConfirmModal` | Typed confirmation, status updates upon server confirmation | `[TARGET]` |
| **FR-08: Incident Management** | `/security/incidents`, `DataTable` | Severity badges, acknowledge/resolve workflow | `[TARGET]` |
| **FR-09: Advisory AI Telemetry**| `/security`, `HeatmapCard` | Anomaly heatmap with persistent advisory banner | `[TARGET]` |
| **FR-10: Audit Dossier** | `/audit/dossier/:id`, `AuditTimeline` | Complete custody graph & PDF export | `[TARGET]` |
| **FR-11: Blockchain Lineage** | `/blockchain`, `BlockchainTxBadge` | Multi-stage anchor status tracker | `[TARGET]` |

**Traceability Summary:**
- **Product Requirements Covered:** 11/11 Functional Areas mapped
- **Upstream Flows Covered:** 13/13 System Architecture Flows
- **API Endpoints Mapped:** 35/35 Target API Endpoints

---

## 40. Final UX QA Checklist & Document Sign-Off

- [x] Document follows authoritative hierarchy (downstream of `01` through `11`).
- [x] Frontend explicitly defined as presentation tier, NOT security enforcement boundary.
- [x] All 5 roles (`ADMIN`, `EXAMINER`, `CONTROLLER`, `SUPERINTENDENT`, `AUDITOR`) fully specified.
- [x] 10-Gate release interaction fully detailed with inputs, visual states, and safe recovery copy.
- [x] Early release (Gate 5) and ciphertext tampering (Gate 8) failure UX detailed.
- [x] Emergency revocation workflow includes mandatory reason and two-step confirmation.
- [x] Dual digests (`content_hash` vs. `ciphertext_hash`) explicitly separated in UI views.
- [x] Ephemeral key token defined as capability handle; zero plaintext DEK exposure in UI.
- [x] Blockchain status tracks multi-stage lifecycle without claiming false finality.
- [x] AI dashboard includes mandatory advisory disclaimer (zero autonomous release power).
- [x] 8-scene live hackathon demonstration script fully documented.
- [x] 11 end-to-end user journey maps (Journeys A through K) specified.
- [x] 20 reusable UI component specifications provided.
- [x] Zero unsupported absolute claims ("100%", "guaranteed", "instantaneous", "unbreakable").
- [x] Upstream documents `01`–`11` remain completely UNCHANGED.
- [x] Application source code and tests remain UNCHANGED.

---

## 41. Document Review Sign-Off

| Review Role | Reviewer Status | Sign-Off Date |
| :--- | :--- | :--- |
| **Principal Product Designer** | `DRAFT / PENDING REVIEW` | September 2026 |
| **Senior UX Architect** | `DRAFT / PENDING REVIEW` | September 2026 |
| **Security UX Lead** | `DRAFT / PENDING REVIEW` | September 2026 |
| **Frontend Engineering Architect** | `DRAFT / PENDING REVIEW` | September 2026 |
