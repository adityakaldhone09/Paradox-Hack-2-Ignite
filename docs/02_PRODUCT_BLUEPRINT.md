# VeriQ — Product Blueprint
## Secure Examination Paper Distribution & Chain-of-Custody Verification Platform
### Problem Statement WB-03 | Hack 2 Ignite

---

## 1. Document Metadata

- **Document ID**: `VERIQ-PB-02`
- **Document Title**: Product Blueprint: Operational Architecture, Trust Boundary, & Functional Definition
- **Project**: VeriQ
- **Tagline**: Secure Every Question Paper. Verify Every Action.
- **Problem Statement**: WB-03 — Secure Examination Paper Distribution Using Blockchain
- **Hackathon**: Hack 2 Ignite
- **Version**: `1.0.0`
- **Status**: `BASELINE / DRAFT`
- **Date**: September 2026
- **Author**: Principal Product Architect & Security Solutions Lead
- **Upstream Dependencies**: [01_REPOSITORY_AUDIT.md](01_REPOSITORY_AUDIT.md) (Frozen Baseline at Commit `52c0b4a`)
- **Supersedes**: Legacy draft notes and informal README claims regarding end-to-end production readiness.
- **Next Dependent Documents**:
  - `03_PROBLEM_STATEMENT.md` (Operational Problem Elaboration)
  - `04_MARKET_RESEARCH.md` (Domain Landscape & Comparative Analysis)
  - `05_PRODUCT_REQUIREMENTS.md` (Functional & Non-Functional Specifications)
  - `06_TECHNICAL_REQUIREMENTS.md` (Engineering Constraints & SLOs)
  - `07_SYSTEM_ARCHITECTURE.md` (High-Level Technical Architecture)

---

## 2. Executive Product Definition

**VeriQ** is a purpose-built chain-of-custody and controlled-release platform designed to safeguard confidential examination question papers across their entire lifecycle—from authoring and pre-examination quarantine to scheduled decryption at authorized examination centers.

### The Operational Problem Solved
High-stakes academic and civil service examinations depend on paper distribution processes that are historically vulnerable to premature disclosure ("paper leaks"), unauthorized physical or digital interception, insider tampering, ambiguous chain of custody, and uncoordinated local delivery. Traditional physical paper transport relies on tamper-evident envelopes and armed escorts, which are labor-intensive, logistically brittle, and lack automated real-time verification. Conversely, naive digital distribution systems (such as emailing password-protected PDFs or uploading files to generic cloud storage) fail because they transfer plaintext or static decryptable payloads well before the examination window, enabling early decryption, unauthorized dissemination, and non-attributable leaks.

### What VeriQ Protects
VeriQ protects the **confidentiality, integrity, provenance, and time-synchronized availability** of digital examination question papers.

### The Transformative Change
VeriQ replaces implicit institutional trust and static document transfers with a **cryptographically enforced chain of custody** and a **strictly governed release gate**:
1. **Confidentiality via Content Protection**: Sensitive examination papers are encrypted at source with symmetric authenticated ciphers (AES-256-GCM); plaintext is never broadcast across untrusted transport networks or persistent public datastores.
2. **Integrity via Cryptographic Anchoring**: Mathematical fingerprints (cryptographic digests and Merkle trees) are generated at registration, enabling independent detection of any modification, bit-rot, or tampering.
3. **Accountability via Tamper-Evident Ledger Evidence**: Critical custody actions—registration, center allocation, custody transfer, release authorization, access attempts, and anomalies—are recorded in a tamper-evident append-only ledger structure.
4. **Controlled Availability via Time-Locked Gating**: Authorized recipients receive encrypted payloads in advance, but cryptographic release is categorically prohibited until authoritative release parameters (time window, center assignment, authorized role, and device posture) are satisfied.
5. **Separation of Concerns**: Cryptographic storage, access authorization, and ledger verification are strictly decoupled. The blockchain is not an expensive database for exam papers; it is a tamper-evident witness to lifecycle events.

---

## 3. Product Vision

The vision of VeriQ is to establish a **verifiable, tamper-evident digital infrastructure for high-stakes examination paper distribution** that is designed to reduce the opportunity for unilateral insider access, enforces synchronized release across distributed centers, and provides cryptographically verifiable audit evidence, subject to the security of the identity and signing mechanisms used without exposing confidential assessment content to public networks or centralized single points of failure.

VeriQ seeks to transform examination logistics from an anxiety-driven, opaque physical relay into a transparent, mathematically verifiable digital protocol where:
- No single entity—not even an examination authority administrator—should be able to covertly access an examination paper prior to its mandated schedule while generating auditable evidence of the access attempt.
- Every examination center ca cryptographically verify the authenticity and integrity of the received content.
- Examination authorities maintain continuous situational awareness over distribution status without retaining unmonitored backdoors into distributed documents.

---

## 4. Product Mission

To provide examination authorities, paper setters, and examination centers with a robust, intuitive, and secure platform that **encrypts, registers, tracks, releases, and verifies** confidential examination papers, enforcing strict temporal and spatial custody policies while recording every critical interaction on a tamper-evident, verifiable ledger.

VeriQ accomplishes this mission by bridging modern cryptographic protection (authenticated symmetric encryption, deterministic hashing) with distributed ledger evidence, ensuring that legitimate candidates and proctors experience timely, friction-free access while malicious or premature distribution attempts are blocked when the defined authorization conditions are not satisfied and logged.

---

## 5. Product Identity

### 5.1 Identity Attributes
- **Product Name**: VeriQ
- **Product Category**: Secure Digital Custody & Controlled-Release Platform
- **Tagline**: *Secure Every Question Paper. Verify Every Action.*
- **Product Type**: Dual-plane enterprise custody system (Web-based Administrative & Center Console backed by cryptographic verification services).
- **Primary Domain**: High-stakes Academic, Professional Licensing, and Competitive Civil Service Examinations.
- **Core Value Proposition**: Cryptographically enforced reduction of premature document disclosure combined with cryptographically verifiable evidence of paper authenticity and handling history.

### 5.2 Product Personality & Guiding Principles
- **Uncompromising Integrity**: Security and verification take absolute precedence over casual convenience.
- **Transparent Accountability**: Every operation leaves an indelible footprint; ambiguity in operational logs is treated as a security defect.
- **Operational Resilience**: The system handles degraded network connectivity gracefully at examination centers without sacrificing verification requirements.
- **Surgical Precision**: Role boundaries, release windows, and paper statuses are deterministic and strictly enforced.

### 5.3 What VeriQ Is NOT

| What VeriQ Is NOT | Why VeriQ Rejects This Definition |
| :--- | :--- |
| **Not a Generic Document Management System (DMS)** | VeriQ does not provide arbitrary document collaboration, version branching, public sharing links, or unstructured document storage. Its domain is strictly regulated high-stakes examination workflows. |
| **Not a Decentralized Public Storage System (e.g., IPFS/Filecoin clone)** | VeriQ does not upload confidential examination content to public decentralized storage nodes. Plaintext and public visibility on untrusted peers violate the primary tenet of examination confidentiality. |
| **Not a Naive File Encryption Utility (e.g., standard zip/GPG wrapper)** | File encryption alone lacks synchronized time-gating, center-specific access authorization, multi-party role governance, real-time revocation, and centralized custody monitoring. |
| **Not Merely an Audit-Log Dashboard** | VeriQ does not passively observe logs generated elsewhere; it actively mediates the custody transfer and cryptographic release of papers based on policy evaluation. |
| **Not a Learning Management System (LMS) or Online Assessment Engine** | VeriQ does not manage student enrollments, deliver interactive student quizzes, grade answer sheets, or conduct video proctoring. It delivers the official examination paper securely to the examination hall proctor/administrator. |

---

## 6. Problem Definition

High-stakes examination administration faces severe security, logistical, and structural challenges across physical and naive digital distribution models.

### 6.1 Confidentiality Risk
Examination question papers are high-value targets. An unauthorized party gaining access even thirty minutes prior to an examination compromises the validity of testing across all participating institutions, imposing severe financial, reputational, and psychological costs. In conventional setups, confidential files sit unencrypted on local disks, email servers, or unsegmented network shares during review and transport.

### 6.2 Unauthorized Access
System administrators, transport personnel, IT operators, and middle managers often possess administrative credentials granting blanket access to files. Conventional access control lacks cryptographically enforced resource-level binding: a user with "read" rights to a server directory can access all papers stored therein regardless of specific assignment.

### 6.3 Premature Access
The period between final paper approval and the actual scheduled examination start (the "quarantine window") is the most critical vulnerability window. Naive digital distribution pushes files to local center computers days or hours in advance. Without independent, non-bypassable temporal gating, local administrators or compromised endpoints can open files prematurely.

### 6.4 Document Tampering
Malicious actors or compromised software may alter examination content (swapping questions, injecting hints, or modifying formulas) during transit or at the local storage tier. Without cryptographic integrity checks anchored to a tamper-evident integrity reference, recipients cannot independently prove that the paper received is identical to the paper authorized by the examination committee.

### 6.5 Identity and Authorization Ambiguity
In paper-based and legacy digital relays, documents are passed between individuals based on visual identification, shared generic credentials (e.g., "admin@center101.edu"), or informal handoffs. In the event of an unauthorized leak, authorities cannot reliably isolate the specific actor or workstation responsible.

### 6.6 Weak Chain of Custody
Traditional distribution offers disjointed, paper-based receipts or isolated application logs. When custody passes from paper setter to moderator, from moderator to controller, and from controller to center administrator, these transitions are rarely validated against a single, unbroken cryptographic lineage.

### 6.7 Manual Distribution Dependencies
Physical paper transport relies on physical locks, security guards, and courier logistics vulnerable to weather, traffic, physical interception, coercion, and vehicle accidents. Physical seals can be tampered with or replicated by sophisticated adversaries without immediate detection.

### 6.8 Lack of Independent Verification
When an examination center downloads an exam file, it rarely possesses an external, verifiable reference to corroborate that the file is authentic and unaltered. If the central distribution server itself is compromised or returns corrupted data, the center has no mathematical mechanism to detect the discrepancy before exam administration.

### 6.9 Auditability and Accountability Gaps
Standard relational database logs and server syslog files can be modified, truncated, or overwritten by a root administrator or an intruder with elevated database permissions. This enables insider threat actors to access sensitive documents and subsequently erase audit trails ("log wiping").

### 6.10 Compromised Recipient / Endpoint Risk
Examination centers frequently operate commodity hardware with inconsistent patch management, unverified peripherals, and shared user sessions. If an authorized center workstation is compromised by malware or remote access software, confidential papers can be exfiltrated the instant they are accessed.

---

## 7. Problem-to-Product Mapping

| Problem | Operational Consequence | VeriQ Product Response | Verification Mechanism |
| :--- | :--- | :--- | :--- |
| **6.1 Confidentiality Risk** | Pre-exam leaks, illicit sale of questions, cancelled exams, public scandal. | Mandatory source-side authenticated symmetric encryption (AES-256-GCM). Off-chain payload isolation. Plaintext never persisted on public storage. | Decryption requires valid authenticated session, center assignment, and verified key unwrap. |
| **6.2 Unauthorized Access** | Personnel viewing papers unrelated to their jurisdiction or subject. | Multi-dimensional authorization: Identity + Role + Resource Assignment + Temporal Window. | Policy enforcement point blocks request; rejection recorded to audit ledger. |
| **6.3 Premature Access** | Questions leaked hours or days before exam start. | Controlled Release Engine: Cryptographic release keys withheld until release window opens based on authoritative time. | Authoritative time-lock validation; attempts before release window rejected according to the defined access policy. |
| **6.4 Document Tampering** | Altered questions, fraudulent scoring criteria, undetected corrupted files. | Cryptographic Document Fingerprinting (SHA-256 digest + Merkle verification). | Hash recomputed on receipt and strictly matched against tamper-evident ledger anchor. |
| **6.5 Identity Ambiguity** | Inability to attribute leaks; shared credentials disguise culprit. | Role-Based Access Control tied to authenticated individual identities and designated center contexts. | Authenticated session identity stamped onto every signed custody and access event. |
| **6.6 Weak Chain of Custody** | Gaps in accountability; shifting blame between setter, authority, and center. | State Machine Tracking: Explicit lifecycle states (`REGISTERED`, `ASSIGNED`, `RELEASED`, `ACCESSED`). | Every custody transition requires a verified transaction recorded to the audit log. |
| **6.7 Manual Dependencies** | Physical couriers delayed; physical lock compromise; high logistical overhead. | Secure digital distribution protocol transmitting encrypted payloads to authorized endpoints over network channels. | End-to-end receipt confirmation and remote status monitoring via dashboard. |
| **6.8 Lack of Independent Verification** | Inability to prove center received genuine paper if central server is suspect. | Tamper-Evident Ledger Anchoring: Document digest anchored to tamper-evident ledger. | Center independently recomputes file digest and verifies it against ledger record. |
| **6.9 Auditability Gaps** | Malicious administrators wipe database logs to hide unauthorized downloads. | Append-Only Cryptographic Ledger: Chronological blocks/events where past entries cannot be altered without breaking integrity. | Cryptographic hash chaining; Merkle audit verification; root hash validation. |
| **6.10 Endpoint Risk** | Exam papers exfiltrated via unauthorized devices or rogue center laptops. | Registered Center & Device Binding: Access restricted to authorized center identity and approved client posture. | Device fingerprint and center association validated before paper release. |

---

## 8. Target Users & Personas

VeriQ defines eight operational personas across the institutional examination hierarchy.

```
       ┌─────────────────────────────────────────────────────────┐
       │                EXAMINATION COMMISSION                   │
       └────────────────────────────┬────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
  [Paper Setter]             [Moderator]            [Exam Authority / Admin]
  Authors & Enters           Vets, Approves,        Schedules, Allocates,
  Encrypted Paper            Finalizes Payload      Oversees Master Keys
                                    │
                                    │ Cryptographically Anchored
                                    │ Controlled Release
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             EXAMINATION CENTER / HALL                   │
       └────────────────────────────┬────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
         [Center Administrator]          [Proctor / Invigilator]
         Manages Station, Re-verifies    Releases Paper to Hall,
         Payload & Device                Prints/Displays Questions
                                    │
                                    ▼
                         [Security / Auditor]
                         Independent Oversight &
                         Incident Investigation
```

### 8.1 Examination Authority / Controller of Examinations (CoE)
- **Role**: Executive operational authority overseeing the entire examination cycle across all centers.
- **Responsibilities**: Creates examination schedules, defines release windows, assigns papers to approved centers, authorizes emergency revocations, and conducts final audit reconciliation.
- **Goals**: Prevention of leaks, reliable on-time exam starts across all regional centers, comprehensive operational oversight.
- **Security Sensitivity**: **Highest**. Holds administrative command over scheduling, allocation, and emergency overrides.
- **Needs from VeriQ**: Real-time status dashboard showing allocation status, center readiness, release confirmations, and tamper alerts.
- **Forbidden Actions**: Must NOT be able to view decrypted plaintext exam papers outside designated review workflows; must NOT be able to bypass tamper-evident audit logging.

### 8.2 Paper Setter
- **Role**: Subject matter expert commissioned to author exam questions.
- **Responsibilities**: Authors the examination document, performs initial registration into VeriQ, triggers local encryption, and submits the sealed draft.
- **Goals**: Friction-free, secure submission without risk of drafting-stage leakage.
- **Security Sensitivity**: **High** (holds primary knowledge of questions prior to sealing).
- **Needs from VeriQ**: Clean, intuitive interface for uploading documents, selecting metadata (subject, grade, duration), and receiving cryptographic proof of registration.
- **Forbidden Actions**: Cannot assign papers to centers, modify schedules, or access other setters' papers; cannot alter an exam paper once sealed and approved by the moderator.

### 8.3 Moderator / Reviewer
- **Role**: Senior academic official responsible for vetting question quality, curriculum compliance, and formatting.
- **Responsibilities**: Reviews submitted papers, requests revisions, approves final content, and seals the final payload.
- **Goals**: Verify question correctness while maintaining total secrecy before final sealing.
- **Security Sensitivity**: **High**.
- **Needs from VeriQ**: Secure preview interface within authorized review periods, cryptographic sealing mechanism.
- **Forbidden Actions**: Cannot reassign paper centers, cannot alter paper content post-sealing, cannot access papers outside assigned subject domains.

### 8.4 Authorized Distribution Officer
- **Role**: Logistics coordinator managing digital dispatch and center readiness.
- **Responsibilities**: Monitors encrypted payload dispatch to regional servers or center endpoints, tracks pre-flight receipt acknowledgments, and flags offline centers.
- **Goals**: Ensure all designated centers have received encrypted payloads before the release window, subject to connectivity and operational availability.
- **Security Sensitivity**: **Medium**.
- **Needs from VeriQ**: Transmission verification status, network health indicators, center acknowledgment telemetry.
- **Forbidden Actions**: Cannot decrypt exam payloads; cannot alter release time-locks.

### 8.5 Examination Center Administrator
- **Role**: Institutional lead at the physical examination center (e.g., college principal, testing center head).
- **Responsibilities**: Maintains local center workstation, ensures network connectivity, registers center endpoint devices with the authority, and receives encrypted payloads.
- **Goals**: Smooth exam day operations, zero technical failures during decryption, compliance with authority rules.
- **Security Sensitivity**: **High**.
- **Needs from VeriQ**: Center dashboard showing assigned exams, countdown to release window, automated pre-flight integrity check, and one-click authorized release.
- **Forbidden Actions**: Cannot view or decrypt papers before the authorized release window; cannot access papers assigned to other examination centers.

### 8.6 Invigilator / Room Proctor
- **Role**: Authorized exam room supervisor administering the test to candidates.
- **Responsibilities**: Requests paper printout or digital presentation inside the exam hall at the scheduled start time; supervises test conduct.
- **Goals**: Receive the correct question paper at the exact appointed minute.
- **Security Sensitivity**: **Operational**.
- **Needs from VeriQ**: Clear verification display confirming paper authenticity and release authorization.
- **Forbidden Actions**: Cannot access administrative consoles, assign centers, or alter system clocks.

### 8.7 Security & Audit Officer
- **Role**: Independent compliance auditor or vigilance officer.
- **Responsibilities**: Continuously monitors the chain of custody, investigates tamper warnings or premature access attempts, and verifies cryptographic proofs.
- **Goals**: Verify institutional integrity, provide defensible forensic proof in legal or regulatory inquiries.
- **Security Sensitivity**: **High** (read-only audit oversight).
- **Needs from VeriQ**: Real-time incident logs, Merkle proof verifier, chain-of-custody inspection views, tamper alert triage console.
- **Forbidden Actions**: Cannot modify audit records, cannot decrypt examination papers, cannot alter schedules or center assignments.

### 8.8 System Administrator / DevOps Engineer
- **Role**: Technical custodian of servers, databases, and network infrastructure.
- **Responsibilities**: Maintains platform uptime, monitors server resources, manages database backups, and deploys software updates.
- **Goals**: 99.9% platform availability, low latency, robust disaster recovery.
- **Security Sensitivity**: **Infrastructure** (controls underlying operating systems).
- **Needs from VeriQ**: Structured health metrics, clean deployment manifests, automated database migration utilities.
- **Forbidden Actions**: Must NOT be able to view decrypted paper contents; must NOT be able to tamper with cryptographic ledger entries without detection; must NOT possess application-level bypass keys.

---

## 9. Stakeholder Ecosystem

```
       ┌──────────────────────────────────────────────────────────┐
       │             GOVERNING EXAMINATION BOARD                  │
       │       (Policy, Syllabus, Regulatory Oversight)           │
       └─────────────────────────────┬────────────────────────────┘
                                     │ Mandates Compliance & Security
                                     ▼
       ┌──────────────────────────────────────────────────────────┐
       │                 VERIQ CORE PLATFORM                      │
       │   - Identity & Access Enforcement (RBAC)                 │
       │   - Content Encryption & Storage Broker                  │
       │   - Controlled Release & Time-Lock Engine                │
       │   - Tamper-Evident Ledger Service                        │
       └─────────────────────────────┬────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  CENTRAL AUTHORITY   │  │ REGIONAL EXAMINATION │  │ INDEPENDENT AUDIT &  │
│      STATION         │  │       CENTERS        │  │     REGULATORS       │
│ - Paper Setters      │  │ - Center Admins      │  │ - Forensic Auditors  │
│ - Moderators         │  │ - Center Workstations│  │ - Legal & Compliance │
│ - Controllers of Exam│  │ - Proctors           │  │ - Public Scrutiny    │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

The VeriQ ecosystem encompasses primary actors interacting with the application layer and secondary institutional stakeholders who rely on the platform's outputs:
- **Primary Users**: Core institutional actors (Setters, Moderators, Controllers) and Regional Center Operators who directly execute lifecycle steps and manage paper delivery.
- **Supporting Stakeholders**: External Regulators & Watchdogs who inspect cryptographic ledger proofs post-examination to validate fair conduct.
- **Indirect Beneficiaries**: Candidates & General Public, whose academic and career outcomes are safeguarded against corrupt leaks and administrative unfairness.

---

## 10. Trust Model

A primary design failure of legacy systems is treating human roles as unconditionally trusted. VeriQ establishes a **principled trust boundary**: it defines what is trusted, what is partially trusted, and what is treated as strictly untrusted.

```
       [ UNTRUSTED / HOSTILE ]
       - Public Internet & Transit Networks
       - Candidate-Facing Environments & Open Physical Space
       - Unverified Personal Laptops & Client Clock Settings
       ─────────────────────────────────────────────────────────────────
       [ PARTIALLY TRUSTED (Monitored & Constrained) ]
       - Examination Center Workstations (Authorized but endpoint-vulnerable)
       - Center Administrators & Proctors (Authorized within window only)
       - Cloud Infrastructure & Database Admins (OS root access, untrusted for content)
       - Paper Setters & Moderators (Trusted only for assigned subjects)
       ─────────────────────────────────────────────────────────────────
       [ STRICTLY TRUSTED CORE ]
       - Authoritative Cryptographic Algorithms (AES-256-GCM, SHA-256)
       - Cryptographic Key Management & Release Engine
       - Authoritative Time Source
       - Tamper-Evident Ledger Integrity Rules
```

### 10.1 Trust Classification Matrix

| Entity | Trust Level | Justification & Safeguards |
| :--- | :--- | :--- |
| **Public Network / Internet** | **Untrusted** | All data in transit must be encrypted using modern TLS. Examination payloads remain doubly encrypted at the application layer. |
| **Client System Clocks** | **Untrusted** | Local operating system time on client laptops can be modified effortlessly. Release determinations must depend exclusively on verified server/network time. |
| **Center Endpoints** | **Partially Trusted** | Center hardware is vulnerable to spyware, shoulder surfing, or unauthorized USB sticks. Mitigated by device fingerprinting, single-session release, and localized watermarking. |
| **Center Personnel** | **Partially Trusted** | Center personnel must be authenticated and authorized, but they are NOT trusted with early access. Release keys are strictly quarantined until the release window. |
| **System Administrators** | **Partially Trusted** | System administrators have OS-level host access but must NEVER possess unilateral plaintext paper decryption keys or the ability to quietly alter the audit trail. |
| **Paper Setters** | **Partially Trusted** | Trusted to compose quality questions; untrusted regarding administrative scheduling or modifying papers once sealed. |
| **Cryptographic Engine** | **Strictly Trusted** | The mathematics of standard cryptography (AES-GCM, SHA-256, Merkle proofs) are mathematically sound and verifiable. |
| **Ledger Anchor** | **Strictly Trusted** | `[TARGET STATE]` A distributed blockchain ledger provides consensus-backed, tamper-evident state. `[CURRENT BASELINE]` The in-process Python ledger simulates tamper-evident ledger behavior within process RAM. |

### 10.2 Cryptographic Separation of Concerns
VeriQ refuses to conflate distinct security responsibilities:
- **Blockchain does NOT encrypt files**: The ledger does not provide confidentiality; storing secrets on a distributed ledger exposes them permanently.
- **Encryption does NOT guarantee access control**: A file encrypted with a shared static key can be decrypted whenever that key leaks. Dynamic access authorization is governed by the release engine.
- **Authentication does NOT equal authorization**: Verifying *who* a user is does not automatically grant access to *every* examination paper. Access requires active, center-specific resource binding.
- **Auditing does NOT prevent attacks in real time**: Auditing provides cryptographically verifiable detection, forensic evidence, and deterrent accountability. Prevention is enforced by the encryption and release gating layers.

---

## 11. Core Security Model

VeriQ's security model is formulated around **CIA + Controlled Availability + Authentication, Authorization & Auditability**:

```
                  ┌────────────────────────────────────────┐
                  │          VERIQ SECURITY MODEL          │
                  └───────────────────┬────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
  CONFIDENTIALITY                 INTEGRITY              CONTROLLED AVAILABILITY
  - AES-256-GCM Payload       - SHA-256 Digests           - Authoritative Time Gating
  - Zero Plaintext Storage    - Merkle Root Anchoring     - Center Allocation Binding
  - Key Wrapping Protocol     - Tamper Alerts             - Pre-window Lockout
         │                            │                            │
         └────────────────────────────┼────────────────────────────┘
                                      │
         ┌────────────────────────────┴────────────────────────────┐
         │                                                         │
         ▼                                                         ▼
   AUTHENTICATION & RBAC                               AUDITABILITY & ACCOUNTABILITY
   - Verified Identity Tokens                          - Tamper-Evident Ledger Events
   - Least-Privilege Roles                             - Actor-Stamped Actions
   - Device Binding Attributes                         - Cryptographic Chain of Custody
```

### 11.1 Confidentiality
- Examination content must remain opaque to all unauthorized intermediaries, network carriers, database administrators, and storage providers.
- Confidentiality is preserved through symmetric authenticated encryption (AES-256-GCM). Plaintext papers are never written to disk or database tables outside ephemeral memory buffers during authorized rendering.

### 11.2 Integrity
- Any alteration of an examination paper—whether by bit-rot, transmission error, malicious question substitution, or partial truncation—must be mathematically detectable prior to paper release.
- Integrity is verified using SHA-256 digests generated at paper sealing, anchored to the audit ledger, and checked prior to decryption.

### 11.3 Controlled Availability (Time-Locked Gating)
- In standard IT systems, "availability" means 24/7/365 immediate access upon request. In examination security, **unconstrained availability is a vulnerability**.
- VeriQ enforces *Controlled Availability*: examination papers must remain provably *unavailable* for decryption prior to the scheduled start time, become reliably *available* during the designated release window, and revert to a restricted *post-examination archive state* after completion.

### 11.4 Authentication & Least Privilege
- Every request must be tied to a verified identity authenticated via secure sessions.
- Authorization enforces least privilege: a Center Administrator can only request papers assigned specifically to their registered center, and only within that center's active window.

### 11.5 Non-Repudiation & Auditability
- Each lifecycle action is associated with an authenticated actor identity and recorded as cryptographically verifiable audit evidence. Stronger non-repudiation properties depend on the identity, key-custody, and asymmetric signing mechanisms used.
- Every state transition is stamped with the actor's identifier, client metadata, authoritative timestamp, and previous state reference, forming a cryptographically verifiable chain of custody.

---

## 12. Product Principles

VeriQ is guided by twelve core product architecture principles:

1. **Security by Design**: Security is not an operational afterthought or an optional wrapper; it dictates every data flow, lifecycle transition, and UI interaction.
2. **Least Privilege**: Users, microservices, and processes operate with the minimum permissions required to perform their discrete functions.
3. **Never Trust Client Time**: Client operating system clocks are inherently untrusted. All release evaluations rely strictly on authoritative, tamper-resistant server/network time.
4. **Encrypt Sensitive Content at Rest and in Transit**: Plaintext examination papers never touch persistent storage or unencrypted network paths.
5. **Verify Before Release**: No paper is ever decrypted or handed to a center endpoint without prior recalculation and validation of its cryptographic digest against the ledger anchor.
6. **Blockchain as Evidence, Not Storage**: Distributed ledgers are utilized for tamper-evident event logging, timestamping, and digest anchoring—never for storing heavy binary payloads or unencrypted secrets.
7. **Fail Closed**: In any ambiguous state (network partition, digest mismatch, unverified device, clock desynchronization, or missing authorization), the system defaults to blocking access and raising a high-priority alert.
8. **Explicit Authorization Gating**: Access requires positive satisfaction of all conditions: `Identity + Role + Resource Assignment + Device Posture + Release Window + Integrity Check`.
9. **Minimize Plaintext Exposure Window**: Decrypted paper content exists in memory for the absolute minimum duration necessary to render or print, minimizing memory-scraping vulnerabilities.
10. **Auditable by Default**: Every significant lifecycle event generates a tamper-evident ledger record. There are no "silent" operational actions.
11. **Separation of Prototype Baseline from Target Architecture**: Prototype mocks and simulated components must be clearly distinguished from production-grade security mechanisms.
12. **Operational Resilience Under Crisis**: The system must provide deterministic, verifiable behavior even during regional network instability or server failover without compromising confidentiality.

---

## 13. Product Lifecycle

The VeriQ examination paper lifecycle progresses through ten deterministic, sequentially gated stages:

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────────┐
│ 1. CREATION     │──────▶│ 2. REGISTRATION     │──────▶│ 3. PROTECTION        │
│ Author compiles │       │ Metadata registered │       │ AES-256-GCM Encrypt, │
│ draft questions │       │ into VeriQ platform │       │ Digest generated     │
└─────────────────┘       └─────────────────────┘       └──────────┬───────────┘
                                                                   │
┌─────────────────┐       ┌─────────────────────┐                  │
│ 6. CUSTODY      │◀──────│ 5. DISTRIBUTION     │◀─────────────────┘
│    TRANSFER     │       │ Encrypted payload   │  4. INTEGRITY ANCHORING
│ Center receives │       │ dispatched to center│  Digest & metadata anchored
│ encrypted blob  │       └─────────────────────┘  to tamper-evident ledger
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────────┐
│ 7. RELEASE      │──────▶│ 8. RECIPIENT        │──────▶│ 9. SECURE ACCESS     │
│    WINDOW       │       │    VERIFICATION     │       │ Verified unwrap,     │
│ Authoritative   │       │ Digest matched,     │       │ Decrypted in-memory, │
│ time arrives    │       │ Station validated   │       │ Rendered/Printed     │
└─────────────────┘       └─────────────────────┘       └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │ 10. CLOSEOUT & AUDIT │
                                                        │ Paper archived/sealed│
                                                        │ Full ledger verified │
                                                        └──────────────────────┘
```

### Stage Details

#### Stage 1: Paper Creation
- **Actor**: Paper Setter
- **Purpose**: Prepare original examination questions in supported document format (PDF).
- **Input**: Raw authoring file, course metadata, target exam date.
- **Output**: Unsealed draft exam document.
- **Security Objective**: Prevent early leakage during file composition.
- **Audit Event**: `PAPER_CREATION_INITIATED`

#### Stage 2: Paper Registration
- **Actor**: Paper Setter / Examination Coordinator
- **Purpose**: Register formal examination instance into VeriQ with curriculum code, scheduled time, and access parameters.
- **Input**: Draft document, examination metadata.
- **Output**: Registered paper record in `REGISTERED` state.
- **Security Objective**: Bind document to authoritative academic metadata.
- **Audit Event**: `PAPER_REGISTERED`

#### Stage 3: Content Protection
- **Actor**: VeriQ Cryptographic Engine
- **Purpose**: Encrypt document payload using authenticated symmetric cipher and generate cryptographic digest.
- **Input**: Plaintext document stream.
- **Output**: Ciphertext payload, initialization vector (IV), authentication tag, SHA-256 document digest.
- **Security Objective**: Eliminate plaintext storage; establish mathematical integrity baseline.
- **Audit Event**: `PAPER_ENCRYPTED_AND_SEALED`

#### Stage 4: Integrity Anchoring
- **Actor**: VeriQ Ledger Broker
- **Purpose**: Commit document digest, metadata, and creator signature to the tamper-evident ledger.
- **Input**: Document digest, paper ID, timestamp, cryptographic signature.
- **Output**: Tamper-evident ledger transaction record and Merkle receipt.
- **Security Objective**: Establish a tamper-evident, publicly/auditably verifiable integrity anchor.
- **Audit Event**: `INTEGRITY_ANCHOR_RECORDED`

#### Stage 5: Authorized Distribution
- **Actor**: Examination Authority / Controller
- **Purpose**: Associate the sealed paper with approved examination centers.
- **Input**: Paper ID, Center IDs, scheduled release window.
- **Output**: Center-specific distribution manifest.
- **Security Objective**: Restrict paper availability exclusively to designated testing venues.
- **Audit Event**: `CENTERS_ALLOCATED`

#### Stage 6: Custody Transfer (Staging)
- **Actor**: Distribution Officer / Center Administrator
- **Purpose**: Transmit encrypted payload to regional/center staging storage prior to exam day.
- **Input**: Encrypted payload bundle.
- **Output**: Staged encrypted payload on center station; receipt acknowledgment.
- **Security Objective**: Confirm physical/network delivery without revealing plaintext.
- **Audit Event**: `CUSTODY_TRANSFER_ACKNOWLEDGED`

#### Stage 7: Release Window Activation
- **Actor**: VeriQ Controlled Release Engine
- **Purpose**: Evaluate authoritative time against scheduled release window parameters.
- **Input**: Authoritative server timestamp, paper schedule configuration.
- **Output**: Gating status transition from `LOCKED` to `RELEASEABLE`.
- **Security Objective**: Enforce strict temporal barrier; reject all early access attempts.
- **Audit Event**: `RELEASE_WINDOW_OPENED`

#### Stage 8: Recipient Verification
- **Actor**: Center Administrator & VeriQ Verification Engine
- **Purpose**: Authenticate center credentials, inspect endpoint posture, recompute payload hash, and verify against the ledger anchor.
- **Input**: Staged ciphertext, center credentials, device attributes.
- **Output**: Integrity verification certificate or tamper alert.
- **Security Objective**: Prove payload is pristine and recipient station is authentic before key release.
- **Audit Event**: `INTEGRITY_VERIFIED_SUCCESS` (or `TAMPER_DETECTED_ALERT`)

#### Stage 9: Secure Paper Access
- **Actor**: Authorized Center Proctor
- **Purpose**: Release decryption key material, perform ephemeral in-memory decryption, render/print paper in testing hall.
- **Input**: Authorized session token, integrity certificate, key unwrap request.
- **Output**: Rendered question paper display / printed physical papers.
- **Security Objective**: Minimize plaintext exposure window; prevent unauthorized digital copy creation.
- **Audit Event**: `PAPER_DECRYPTED_AND_ACCESSED`

#### Stage 10: Audit Closeout & Archiving
- **Actor**: Security Officer / Controller of Examinations
- **Purpose**: Seal the examination cycle, revoke ephemeral decryption keys, archive encrypted payloads, and verify full ledger integrity.
- **Input**: Paper ID, center completion telemetry.
- **Output**: Final chain-of-custody compliance report, archived record.
- **Security Objective**: Provide cryptographically verifiable post-exam forensic accountability.
- **Audit Event**: `EXAMINATION_CYCLE_CLOSED`

---

## 14. Core Product Capabilities

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             VERIQ CAPABILITY MATRIX                              │
├────────────────────────────┬─────────────────────────────┬───────────────────────┤
│ ADMINISTRATIVE & CONTROL   │ CRYPTOGRAPHIC & STORAGE     │ AUDIT & VERIFICATION  │
├────────────────────────────┼─────────────────────────────┼───────────────────────┤
│ 14.1 Paper Registration    │ 14.2 Encrypted Storage      │ 14.3 Integrity Hash   │
│ 14.4 Identity & RBAC       │ 14.7 Time-Lock Release      │ 14.9 Chain of Custody │
│ 14.5 Center Authorization  │ 14.8 Secure Access & Unwrap │ 14.10 Audit Ledger    │
│ 14.6 Device Posture Binding│                             │ 14.11 Tamper Alerts   │
│ 14.12 Executive Oversight  │                             │                       │
└────────────────────────────┴─────────────────────────────┴───────────────────────┘
```

### 14.1 Secure Paper Registration
- **Purpose**: Ingest examination metadata and documents securely.
- **User**: Paper Setter / Examination Authority.
- **User Outcome**: Document accepted, bound to an authoritative exam identifier, and prepared for encryption.
- **Security Value**: Prevents uncatalogued or spoofed examination papers from entering circulation.
- **Product Behavior**: Validates MIME type (PDF), enforces required metadata fields, and initializes state machine.
- **Status**: `[IMPLEMENTED]` in prototype API and UI; requires strict multi-center metadata binding in production.

### 14.2 Encrypted Paper Protection
- **Purpose**: Protect examination paper confidentiality at rest and in transit.
- **User**: System / Automated Engine.
- **User Outcome**: Paper transformed into ciphertext; plaintext is minimized and removed from temporary buffers after processing, subject to runtime and operating-system memory-handling constraints.
- **Security Value**: Neutralizes database breaches, storage snooping, and network wiretapping.
- **Product Behavior**: Generates random 256-bit symmetric key, encrypts payload via AES-256-GCM, stores IV and tag alongside ciphertext.
- **Status**: `[IMPLEMENTED]` via Python `cryptography` library; key management currently uses static/ephemeral environment secrets.

### 14.3 Cryptographic Integrity Verification
- **Purpose**: Verify that unauthorized alterations to examination papers are detectable through the defined integrity verification process.
- **User**: All actors (automated verification).
- **User Outcome**: Instant cryptographic verification of file integrity and authenticity relative to the recorded integrity anchor.
- **Security Value**: Prevents question tampering, insertion of fraudulent items, and corrupted distributions.
- **Product Behavior**: Computes SHA-256 digest of plaintext and ciphertext; constructs Merkle verification tree.
- **Status**: `[IMPLEMENTED]` in core engine; Merkle tree generation active.

### 14.4 Identity & Role-Based Access Control (RBAC)
- **Purpose**: Restrict platform operations based on verified user identity and role.
- **User**: All actors.
- **User Outcome**: Users access only features and records commensurate with their responsibilities.
- **Security Value**: Prevents privilege escalation and horizontal access violations.
- **Product Behavior**: Issues scoped session tokens upon authentication; validates role permissions on every interaction.
- **Status**: `[PARTIAL]` Authentication exists, but current prototype contains development bypasses (`deps.py` fallback user) that must be hardened in production.

### 14.5 Recipient Center Authorization & Allocation
- **Purpose**: Formally assign examination papers to specific verified testing centers.
- **User**: Controller of Examinations.
- **User Outcome**: Center administrators see only exams scheduled for their institution.
- **Security Value**: Eliminates broad dissemination; establishes strict jurisdictional boundaries.
- **Product Behavior**: Creates explicit mapping records between Paper ID and Center ID with custom time parameters.
- **Status**: `[IMPLEMENTED]` in database models and administrative allocation screens.

### 14.6 Device & Station Posture Verification
- **Purpose**: Restrict decryption to authorized, verified workstations located at testing venues.
- **User**: Examination Center Administrator.
- **User Outcome**: Decryption occurs solely on registered administrative hardware.
- **Security Value**: Prevents proctors or staff from exporting decryption tokens to personal smartphones or home laptops.
- **Product Behavior**: Collects client hardware attributes (IP address, browser fingerprint, MAC/hardware hash where available) and verifies against center registration profiles.
- **Status**: `[PARTIAL]` Device fingerprinting models exist in schema; client-side enforcement currently simulated/mocked.

### 14.7 Controlled Release / Time-Lock Gating
- **Purpose**: Prevent early paper decryption prior to the scheduled exam window.
- **User**: Automated Policy Engine.
- **User Outcome**: Decryption keys remain mathematically or procedurally inaccessible until scheduled start time.
- **Security Value**: Closes the critical pre-examination leak window.
- **Product Behavior**: Evaluates server-side authoritative time against `start_time` and `end_time`. Automatically rejects access requests outside window.
- **Status**: `[PARTIAL / SECURITY DEFECT]` Time evaluation logic exists, but current prototype accepts an `override_time` parameter in requests, which violates the security model and must be removed for production.

### 14.8 Secure Paper Access & Key Unwrapping
- **Purpose**: Safely deliver decrypted content to authorized proctors during the valid release window.
- **User**: Center Administrator / Proctor.
- **User Outcome**: Authorized proctor views or prints the official question paper.
- **Security Value**: Decrypts payload only after all authorization and integrity checks succeed.
- **Product Behavior**: Validates session, checks time window, verifies hash match, unwraps decryption key, decrypts in-memory, and returns secured display stream.
- **Status**: `[PARTIAL]` Current prototype access endpoint returns metadata and status, but does not yet deliver the streaming decrypted PDF payload.

### 14.9 Chain-of-Custody Tracking
- **Purpose**: Maintain an unbroken record of every entity that touched, reviewed, assigned, or accessed the paper.
- **User**: Security Auditor / Controller of Examinations.
- **User Outcome**: Complete historical provenance graph available for any paper.
- **Security Value**: Eliminates ambiguity during leak investigations; supports accountability.
- **Product Behavior**: Every lifecycle action appends a custody record containing actor ID, center ID, timestamp, and action signature.
- **Status**: `[IMPLEMENTED]` in relational schema and mock ledger.

### 14.10 Tamper-Evident Audit Trail
- **Purpose**: Provide cryptographically verifiable, chronological proof of system events that are tamper-evident.
- **User**: Security Auditor / External Regulators.
- **User Outcome**: Verifiable event stream confirming fair and secure examination conduct.
- **Security Value**: Prevents rogue administrators or attackers from wiping logs to cover unauthorized access.
- **Product Behavior**: Logs critical transactions to an append-only ledger with cryptographic hash chaining.
- **Status**: `[SIMULATED BASELINE]` Implemented via in-process Python `MockBlockchainService` in RAM. `[TARGET STATE]` Requires on-chain deployment to EVM-compatible ledger (`VeriQLedger.sol`).

### 14.11 Verification & Incident Detection
- **Purpose**: Automatically detect and alert on anomalous actions, hash mismatches, and unauthorized attempts.
- **User**: Security Auditor / System Dashboard.
- **User Outcome**: Real-time alerts highlighting potential compromise attempts.
- **Security Value**: Immediate situational awareness enables rapid containment before widespread leakage.
- **Product Behavior**: Triggers `TAMPER_ALERT` or `UNAUTHORIZED_ACCESS_ATTEMPT` events when cryptographic checks fail or invalid roles attempt access.
- **Status**: `[IMPLEMENTED]` Tamper detection endpoints and mock event generators exist.

### 14.12 Administrative Oversight & Situational Dashboard
- **Purpose**: Provide central authorities with real-time operational status across all centers.
- **User**: Controller of Examinations.
- **User Outcome**: Unified bird's-eye view of dispatch progress, center check-ins, unlock countdowns, and audit health.
- **Security Value**: Early identification of offline centers, distribution bottlenecks, or localized anomalies.
- **Product Behavior**: Aggregates telemetry across centers and displays visual indicators (status badges, countdown timers, ledger block feeds).
- **Status**: `[IMPLEMENTED]` React dashboard displays active papers, allocation counts, and simulated blockchain blocks.

---

## 15. Core User Journeys

### Journey A: Paper Setter Creates & Registers Paper

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Paper Setter (Paper Setter A)
- **Preconditions**: Authenticated with `SETTER` role; assigned to "CS-401: Advanced Algorithms".
- **Trigger**: Clicks "Register New Paper" on Setter Dashboard.
- **Main Flow**:
  1. Setter uploads `CS401_Final_2026.pdf` and inputs metadata (exam date, scheduled duration, allowed centers).
  2. Client-side validates PDF format and transmits file stream over TLS.
  3. VeriQ server generates a random 256-bit symmetric key and encrypts the file via AES-256-GCM.
  4. System computes SHA-256 hash of original document and ciphertext.
  5. System records `PAPER_REGISTERED` and `INTEGRITY_ANCHOR_RECORDED` on audit ledger.
  6. Original plaintext is scrubbed from temporary memory buffers.
  7. Paper state moves to `REGISTERED`.
- **Security Checks**: Validates session token, role permissions, file MIME type, and cryptographic cipher generation.
- **Success Outcome**: Setter receives confirmation receipt with Paper ID and Document Hash. Plaintext is protected.
- **Failure Outcome**: Malformed file rejected; unauthenticated session redirected to login; failure logged.
- **Audit Implications**: Audit ledger records paper creation timestamp, setter ID, and document hash.

### Journey B: Moderator Reviews & Seals Paper

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Moderator (Moderator A)
- **Preconditions**: Authenticated with `MODERATOR` role; paper is in `REGISTERED` state.
- **Trigger**: Opens paper review queue and selects assigned paper.
- **Main Flow**:
  1. Moderator reviews questions in an ephemeral preview window.
  2. Moderator enters approval comments and clicks "Approve & Seal Paper".
  3. System transitions paper state to `APPROVED` and subsequently `SEALED`.
  4. Cryptographic sealing record is stamped onto the audit ledger.
- **Security Checks**: Moderator identity verified; ensures paper cannot be approved twice or altered post-approval.
- **Success Outcome**: Paper is locked against further editing; status updated to `SEALED`.
- **Failure Outcome**: Rejection returns paper to setter with comments; logs revision request.
- **Audit Implications**: Ledger logs moderator approval signature and exact sealing timestamp.

### Journey C: Authority Assigns Paper to Examination Centers

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Controller of Examinations (Controller of Examinations)
- **Preconditions**: Authenticated with `ADMIN` role; paper is in `SEALED` state.
- **Trigger**: Opens "Center Allocation" module.
- **Main Flow**:
  1. Authority selects sealed paper `CS401`.
  2. Authority selects approved regional centers (e.g., Center 101, Center 102).
  3. Authority defines release parameters (e.g., Start: 09:00 AM, End: 12:00 PM, Unlock Grace: 15 mins prior).
  4. System generates center allocation bindings in database.
  5. System appends `CENTERS_ALLOCATED` transaction to ledger.
  6. Paper transitions to `ASSIGNED`.
- **Security Checks**: Validates admin privileges; verifies selected centers exist in active directory; verifies time windows are strictly future-dated.
- **Success Outcome**: Centers are authorized to stage encrypted payloads; state reflects `ASSIGNED`.
- **Failure Outcome**: Invalid time window (past date) rejected; unassigned centers cannot see paper.
- **Audit Implications**: Ledger records center IDs, release window boundaries, and allocating authority ID.

### Journey D: Authorized Center Requests Staged Paper Payload

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Center Administrator (Center Administrator A)
- **Preconditions**: Authenticated with `CENTER` role; bound to Center 101; paper is in `ASSIGNED` state.
- **Trigger**: Clicks "Stage Encrypted Payload" on Center Console.
- **Main Flow**:
  1. Center workstation requests paper payload bundle.
  2. Server verifies Center 101 is on the approved distribution manifest.
  3. Server transmits encrypted payload (ciphertext + IV + tag).
  4. Center station persists encrypted blob locally.
  5. Center station calculates SHA-256 of received ciphertext and acknowledges receipt.
  6. System logs `CUSTODY_TRANSFER_ACKNOWLEDGED`.
- **Security Checks**: Center identity checked; ciphertext integrity verified; plaintext is NOT transmitted or accessible.
- **Success Outcome**: Encrypted payload safely staged at center; paper status marked `DISTRIBUTED`.
- **Failure Outcome**: Center not on allocation list receives `403 Forbidden`; unauthorized download blocked.
- **Audit Implications**: Custody transfer logged with center network address and receipt timestamp.

### Journey E: Unauthorized User Attempts Access

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Rogue Student or Unassigned Center Staff
- **Preconditions**: User possesses valid credentials for an unassigned center or student role.
- **Trigger**: Submits API request or clicks link to access `CS401`.
- **Main Flow**:
  1. System extracts user identity and role from session token.
  2. Policy Enforcement Point queries paper allocation manifest.
  3. System determines user's center is NOT authorized for `CS401`.
  4. System immediately terminates request with `403 Forbidden`.
  5. System records `UNAUTHORIZED_ACCESS_ATTEMPT` security event to ledger.
  6. Security alert increments on Security Officer console.
- **Security Checks**: Identity validation, resource-level center binding check.
- **Success Outcome**: Access completely denied; No sensitive paper content is returned when the authorization policy rejects the request.; attempt recorded to the ledger.
- **Failure Outcome**: N/A (Attack fails closed).
- **Audit Implications**: Offender IP, user ID, target paper ID, and timestamp are recorded in the tamper-evident audit trail.

### Journey F: Recipient Attempts Access Before Release Window

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Center Administrator (Center 101)
- **Preconditions**: Correctly authenticated and allocated, but current time is 08:30 AM (Release window: 09:00 AM).
- **Trigger**: Clicks "Unlock Exam Paper" early.
- **Main Flow**:
  1. Center submits unlock request.
  2. Controlled Release Engine queries authoritative server time (08:30 AM).
  3. Engine evaluates condition: `Current_Time >= Window_Start` (08:30 < 08:45 unlock threshold).
  4. Condition evaluates to `FALSE`.
  5. Server rejects request with `425 Too Early: Release Window Locked`.
  6. System logs `EARLY_ACCESS_ATTEMPT_REJECTED` event to ledger.
- **Security Checks**: Authoritative server-side time verification (client timestamps ignored).
- **Success Outcome**: Decryption key withheld; paper remains sealed ciphertext; UI displays countdown timer.
- **Failure Outcome**: Early access strictly blocked.
- **Audit Implications**: Early attempt recorded with authoritative timestamp and client identity.

### Journey G: Recipient Accesses Paper During Valid Release Window

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Authorized Center Administrator (Center 101)
- **Preconditions**: Authenticated; Center 101 allocated; current authoritative time is 08:50 AM (within 15-min grace window).
- **Trigger**: Clicks "Decrypt & Access Paper" at 08:50 AM.
- **Main Flow**:
  1. Center workstation submits unlock request with device posture tokens.
  2. Server evaluates authorization: Identity valid, Center 101 assigned, time within window.
  3. Pre-flight integrity check: Server and client verify staged payload hash against ledger anchor.
  4. Hash check matches perfectly.
  5. Key Management Service securely unwraps the symmetric decryption key.
  6. Ciphertext is decrypted in ephemeral memory.
  7. Decrypted PDF stream is rendered in secure browser viewer with watermarks (Center 101, Timestamp, IP).
  8. System records `PAPER_DECRYPTED_AND_ACCESSED` on ledger.
  9. Paper state moves to `RELEASED` / `ACCESSED`.
- **Security Checks**: Multi-factor authorization (Identity + Assignment + Time + Integrity + Device).
- **Success Outcome**: Proctors print or display legitimate exam paper on schedule; pre-window decryption is prevented under the defined security assumptions.
- **Failure Outcome**: Network drop during unwrap triggers secure retry; hash mismatch aborts decryption.
- **Audit Implications**: Definitive access record stamped on blockchain ledger with proctor signature.

### Journey H: Tampered Paper Is Presented

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Adversary with modified local payload or corrupted disk file.
- **Preconditions**: Encrypted file on center storage has been modified (even by a single byte).
- **Trigger**: Center initiates decryption/verification process.
- **Main Flow**:
  1. Verification Engine computes SHA-256 digest of presented payload.
  2. Engine fetches official anchor digest from tamper-evident ledger.
  3. Comparison evaluates: `Computed_Digest == Anchor_Digest`.
  4. Digests do NOT match.
  5. Decryption is instantly aborted; key material is withheld.
  6. System generates critical `TAMPER_DETECTED_ALERT`.
  7. Paper state at Center 101 transitions to `COMPROMISED`.
  8. Emergency alert dispatched to Controller of Examinations.
- **Security Checks**: Cryptographic digest verification against tamper-evident ledger baseline.
- **Success Outcome**: Corrupted or malicious payload is blocked from distribution to candidates; incident captured.
- **Failure Outcome**: System fails closed; no decryption permitted.
- **Audit Implications**: Critical security violation transaction appended to ledger with mismatched hashes.

### Journey I: Security / Audit Officer Reviews Chain of Custody

> **State:** `[TARGET PRODUCT JOURNEY]`
>
> This journey describes the intended MVP behavior and does not imply that every step is currently implemented in the repository.
- **Actor**: Independent Auditor (Security Auditor)
- **Preconditions**: Authenticated with `AUDITOR` role.
- **Trigger**: Selects paper `CS401` on Audit Verification Console.
- **Main Flow**:
  1. Auditor requests complete lifecycle history for `CS401`.
  2. System retrieves chronological event sequence from audit ledger: Creation -> Registration -> Sealing -> Allocation -> Staging -> Access.
  3. Auditor clicks "Verify Ledger Integrity".
  4. Verifier recalculates hash links across all blocks/records and validates Merkle proofs against root.
  5. Interface renders green validation badge: "Chain of Custody Intact: 0 Discrepancies Found".
- **Security Checks**: Read-only auditor permissions; cryptographic proof validation across entire transaction history.
- **Success Outcome**: Independent cryptographic verification of the recorded chain of custody and integrity evidence.
- **Failure Outcome**: If any record was altered in the database, ledger verification fails with exact block mismatch.
- **Audit Implications**: Auditor review session itself logged as `AUDIT_INSPECTION_PERFORMED`.

---

## 16. Critical Product States

VeriQ models the examination paper lifecycle as a **finite state machine (FSM)** with strictly enforced valid transitions and prohibited shortcuts.

```
┌──────────────┐     ┌────────────────┐     ┌──────────────┐     ┌──────────────┐
│    DRAFT     │────▶│   REGISTERED   │────▶│   APPROVED   │────▶│    SEALED    │
└──────────────┘     └────────────────┘     └──────────────┘     └──────┬───────┘
                                                                        │
┌──────────────┐     ┌────────────────┐     ┌──────────────┐            │
│  DISTRIBUTED │◀────│    ASSIGNED    │◀────┴──────────────┴────────────┘
└──────┬───────┘     └────────────────┘
       │
       ▼
┌──────────────┐
│    LOCKED    │◀─── (Payload staged, waiting for authoritative time)
└──────┬───────┘
       │
       ├─────────────────────────────────────────┐
       │ (Valid Release Window + Integrity OK)   │ (Tamper Detected)
       ▼                                         ▼
┌──────────────┐                          ┌──────────────┐
│   RELEASED   │                          │ COMPROMISED  │
└──────┬───────┘                          └──────────────┘
       │
       ▼
┌──────────────┐     ┌────────────────┐
│   ACCESSED   │────▶│    ARCHIVED    │
└──────────────┘     └────────────────┘
       │
       ▼ (Emergency / Cancellation)
┌──────────────┐
│   REVOKED    │
└──────────────┘
```

### 16.1 State Definitions

| State | Description | Invariants & Business Rules |
| :--- | :--- | :--- |
| `DRAFT` | Document uploaded by Setter; initial metadata populated. | Editable only by author. Not visible to centers. |
| `REGISTERED` | Cryptographic hash computed; paper queued for moderation. | File content frozen. Metadata assigned. |
| `APPROVED` | Moderator reviewed questions; academic quality confirmed. | Cannot be modified without re-triggering registration. |
| `SEALED` | AES-256-GCM encryption committed; digest anchored to ledger. | Plaintext completely inaccessible. Anchor committed to ledger. |
| `ASSIGNED` | Mapped to authorized examination centers and release windows. | Centers visible in allocation table; dispatch permitted. |
| `DISTRIBUTED` | Encrypted payload transmitted and staged at center stations. | Payload remains encrypted; receipt acknowledged. |
| `LOCKED` | Pre-exam quarantine state. File present locally, decryption locked. | Gating engine blocks all key unwrap requests. |
| `RELEASED` | Authoritative time window open; conditions satisfied. | Key unwrap authorized for designated proctor. |
| `ACCESSED` | Paper successfully decrypted and displayed/printed in hall. | Decryption event recorded to the tamper-evident ledger. |
| `COMPROMISED` | Hash mismatch or integrity violation detected. | Decryption permanently blocked; incident alert raised. |
| `REVOKED` | Emergency cancellation by Controller of Examinations. | All center decryption keys invalidated immediately. |
| `ARCHIVED` | Exam concluded; paper retired to long-term audit storage. | Read-only post-examination forensic access only. |

### 16.2 Forbidden State Transitions

The state machine explicitly forbids the following transitions to prevent security circumvention:

1. **`DRAFT` → `SEALED`**: Direct sealing without registration and moderation bypasses academic vetting.
2. **`LOCKED` → `ACCESSED`**: Bypassing the `RELEASED` gating verification permits early paper disclosure.
3. **`REGISTERED` → `DISTRIBUTED`**: Distributing an unapproved, unsealed paper leaks draft material.
4. **`COMPROMISED` → `RELEASED`**: A compromised or tampered paper must NEVER be transitioned to release under any circumstance.
5. **`ARCHIVED` → `RELEASED`**: An archived examination paper cannot be re-opened for testing; it is permanently closed.
6. **`REVOKED` → `RELEASED`**: Once cancelled by executive authority, a paper cannot be unlocked without a formal, audited re-registration.

---

## 17. Access Control Model

VeriQ implements a multi-dimensional, context-aware access control model:

$$\text{Access Granted} \iff \mathcal{F}(\text{Identity}, \text{Role}, \text{Resource Allocation}, \text{Temporal Window}, \text{Integrity State}, \text{Device Posture}) = \text{TRUE}$$

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CONTEXTUAL AUTHORIZATION PIPELINE                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    1. Identity & Session Token     ▼
   [ Authenticated & Active? ] ───▶ NO ───▶ [ 401 Unauthorized ]
                                    │ YES
    2. Role-Based Permission        ▼
   [ Role has permission? ]    ───▶ NO ───▶ [ 403 Forbidden: Role Mismatch ]
                                    │ YES
    3. Center-Resource Binding      ▼
   [ Center allocated to paper?]──▶ NO ───▶ [ 403 Forbidden: Not Allocated ]
                                    │ YES
    4. Authoritative Time Gate      ▼
   [ Time inside window? ]     ───▶ NO ───▶ [ 425 Too Early / 410 Expired ]
                                    │ YES
    5. Cryptographic Integrity      ▼
   [ Payload hash matches? ]   ───▶ NO ───▶ [ 409 Conflict: Tamper Detected ]
                                    │ YES
    6. Device Posture Binding       ▼
   [ Approved station posture?]───▶ NO ───▶ [ 403 Forbidden: Unverified Device]
                                    │ YES
                                    ▼
                     [ 200 OK: AUTHORIZED RELEASE ]
```

### 17.1 Authorization Dimensions
- **Identity**: The cryptographically verifiable subject making the request, established via secure session tokens.
- **Role**: Coarse-grained functional permissions (`ADMIN`, `SETTER`, `MODERATOR`, `CENTER`, `AUDITOR`).
- **Resource Allocation**: Fine-grained discretionary binding: an authenticated Center Administrator can only access `Paper X` if `Center ID == Allocated Center ID`.
- **Temporal Window**: Strict temporal gating: `Start_Time <= Current_Server_Time <= End_Time`.
- **Integrity State**: The physical/digital payload must have an unbroken cryptographic match with the ledger anchor (`Hash == Anchor_Hash`).
- **Device Posture**: The physical client station must match registered hardware profiles (IP, client attributes).

---

## 18. Controlled Release Model

In traditional cloud storage, releasing a file simply means toggling a download permission. In VeriQ, **Controlled Release** is an active cryptographic and temporal gating protocol.

```
       PRE-EXAM PERIOD                  RELEASE WINDOW OPEN                 POST-EXAM
  [ T < Start_Time - Grace ]       [ Start_Time <= T <= End_Time ]        [ T > End_Time ]
┌────────────────────────────┐    ┌───────────────────────────────┐    ┌─────────────────┐
│     STATE: LOCKED          │    │       STATE: RELEASED         │    │ STATE: ARCHIVED │
│ Payload: Staged Encrypted  │───▶│ Payload: Ephemeral Decrypt    │───▶│ Key: Destroyed  │
│ Key: Quarantined           │    │ Key: Unwrapped & Active       │    │ Access: Read-Only│
│ Action: REJECT Requests    │    │ Action: RENDER / PRINT        │    │ Logs: Frozen    │
└────────────────────────────┘    └───────────────────────────────┘    └─────────────────┘
```

### 18.1 Authoritative Time vs. Client Manipulation
A frequent attack against naive client-side time locks is setting the client operating system clock forward.
- **VeriQ Principle**: The client clock is completely irrelevant.
- **Enforcement**: All temporal evaluations occur exclusively on the central backend release engine, cross-referenced against authoritative network time sources. Any client request transmitting local timestamps for gating evaluations is rejected or stripped.

### 18.2 Decryption Key Quarantine
The symmetric key used to protect the examination paper is not bundled with the staged ciphertext. It is securely isolated within the server-side Key Management Service. During the pre-exam quarantine period, the key cannot be unwrapped by any user, including the center administrator. The unwrap mechanism is unlocked solely when the authoritative time crosses the scheduled release threshold.

---

## 19. Blockchain's Role in VeriQ

A critical architectural distinction in VeriQ is defining **what belongs on the blockchain and what must remain off-chain**.

```
┌────────────────────────────────────────┐    ┌────────────────────────────────────────┐
│        ON-CHAIN (LEDGER PLANE)         │    │        OFF-CHAIN (DATA PLANE)          │
├────────────────────────────────────────┤    ├────────────────────────────────────────┤
│ - Paper ID & Subject Metadata Reference│    │ - Full Examination PDF Payload         │
│ - SHA-256 Document Integrity Digest    │    │ - Heavy Binary Question Attachments    │
│ - Merkle Tree Root Hashes              │    │ - Student Personal Identifiable Info   │
│ - State Transition Events (SEALED, etc)│    │ - Symmetric Decryption Keys            │
│ - Center Allocation Manifest Reference │    │ - Ephemeral In-Memory Decrypted Views  │
│ - Authorized Release Timestamps        │    │ - Session Authentication Tokens        │
│ - Cryptographic Signatures & Receipts  │    │ - High-Frequency Diagnostic Logs       │
└────────────────────────────────────────┘    └────────────────────────────────────────┘
```

### 19.1 What VeriQ Blockchain IS NOT
- **Not a File System**: VeriQ does not store multi-megabyte PDF files on the blockchain. Storing large files on-chain incurs massive transaction costs, network bloat, and permanently exposes ciphertext to public analysis.
- **Not an Encryption Mechanism**: The blockchain does not encrypt data; smart contracts execute deterministically in public node environments.
- **Not an Identity Provider**: The blockchain records identity proofs; it does not replace operational authentication middleware.

### 19.2 What VeriQ Blockchain IS
VeriQ uses blockchain as an **append-only, tamper-evident witness**:
1. **Integrity Anchor**: Storing the SHA-256 digest of the examination paper creates a cryptographically verifiable integrity reference. If anyone alters the off-chain file, the discrepancy is immediately provable against the ledger.
2. **Cryptographically Verifiable Custody History**: When an authority allocates a paper or a center acknowledges receipt, the transaction is stamped onto the ledger. Participants are cryptographically bound to actions or claim a paper was not delivered.
3. **Independent Verification**: External auditors and examination centers do not need to blindly trust the central database. They can query the ledger to verify that the paper digest has remained unchanged since registration.

### 19.3 Baseline vs. Target Blockchain Implementation
- `[CURRENT BASELINE]`: The repository currently runs an in-process, in-memory Python simulation (`MockBlockchainService`) that maintains a chain of Python dictionaries in memory with SHA-256 block hashing. It demonstrates ledger concepts but lacks decentralized consensus, persistence across process restarts, and cryptographic wallet signatures.
- `[TARGET STATE]`: Transition to an EVM-compatible ledger utilizing the existing Solidity smart contract (`VeriQLedger.sol`) deployed to an institutional Ethereum/Polygon/Hyperledger network, using ECDSA signatures for all transaction submissions.

---

## 20. Cryptographic Role Separation

VeriQ strictly delineates the responsibilities of each cryptographic primitive:

```
┌──────────────────────────────┬─────────────────────────────────────────────────────────┐
│ CRYPTOGRAPHIC PRIMITIVE      │ PRODUCT RESPONSIBILITY IN VERIQ                         │
├──────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Symmetric Cipher             │ CONFIDENTIALITY                                         │
│ (AES-256-GCM)                │ Transforms plaintext paper into unreadable ciphertext.  │
│                              │ Protects content across untrusted storage and networks. │
├──────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Cryptographic Digest         │ INTEGRITY VERIFICATION                                  │
│ (SHA-256)                    │ Produces 256-bit cryptographic digest used as a practical integrity fingerprint.       │
│                              │ Detects even single-bit tampering or file corruption.   │
├──────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Hierarchical Tree            │ EFFICIENT BATCH PROOF                                   │
│ (Merkle Tree)                │ Anchors multiple custody events or question sections    │
│                              │ into a single root digest for lightweight verification. │
├──────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Symmetric MAC                │ MESSAGE AUTHENTICATION & INTEGRITY                      │
│ (Current HMAC-SHA256)        │ Provides integrity and message authentication.          │
├──────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Digital Signature            │ ACTOR AUTHENTICATION & AUTHORIZATION                    │
│ (Target Asymmetric Scheme)   │ Provides authorization evidence and stronger            │
│                              │ attribution/non-repudiation properties.                 │
├──────────────────────────────┼─────────────────────────────────────────────────────────┤
│ Tamper-Evident Ledger             │ TAMPER-EVIDENT CHRONOLOGY                               │
│ (Blockchain Event Stream)    │ Chains historical custody transactions; prevents        │
│                              │ retroactive deletion or modification of audit trails.   │
└──────────────────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 21. Chain of Custody Model

The Chain of Custody in VeriQ is an **unbroken, auditable provenance graph** that answers the core forensic questions of high-stakes administration:

```
[WHO]  ────────▶ Authenticated Actor ID & Digital Signature
[WHAT] ────────▶ Paper Identifier & Anchored SHA-256 Digest
[WHEN] ────────▶ Authoritative Network Timestamp
[WHERE]────────▶ Center ID & Verified Endpoint IP/Device Fingerprint
[WHY]  ────────▶ Explicit Lifecycle Action (e.g., ALLOCATE, STAGE, ACCESS)
[PROOF]────────▶ Ledger Transaction Hash & Merkle Receipt
```

### Forensic Questions Answered by the Model
1. **Who authored and sealed the paper?** Verified by Setter and Moderator registration signatures.
2. **Who authorized distribution to Center 101?** Verified by Controller of Examinations allocation transaction.
3. **When was the encrypted file received by the center?** Verified by Center staging receipt acknowledgment.
4. **Did the file change in transit?** Verified by SHA-256 digest comparison against the initial registration anchor.
5. **Who authorized decryption in the exam hall?** Verified by Center Proctor unlock session token.
6. **Was any early access attempted?** Verified by rejected access events recorded on the ledger.

---

## 22. Audit & Accountability Model

Auditability is a first-class operational capability in VeriQ, categorizing events across three functional tiers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EVENT TAXONOMY                                │
├──────────────────────────┬──────────────────────┬───────────────────────┤
│ SECURITY EVENTS          │ BUSINESS EVENTS      │ AUDIT EVENTS          │
├──────────────────────────┼──────────────────────┼───────────────────────┤
│ - Failed Logins          │ - Paper Registered   │ - Ledger Block Mined  │
│ - Unauthorized Access    │ - Moderator Approved │ - Merkle Root Anchor  │
│ - Early Access Attempt   │ - Center Allocated   │ - Chain Verification  │
│ - Tamper / Hash Mismatch │ - Payload Staged     │ - Auditor Session Log │
│ - Token Revocation       │ - Paper Decrypted    │ - Reconciliation Run  │
└──────────────────────────┴──────────────────────┴───────────────────────┘
```

### Event Retention & Incorruptibility
- Traditional database rows can be silently modified with an SQL `UPDATE` statement by an administrator with root access.
- In VeriQ, all audit entries are sequentially chained:
  $$\text{Block Hash}_n = \text{SHA-256}(\text{Block Hash}_{n-1} + \text{Payload}_n + \text{Timestamp}_n)$$
- Any modification to an earlier audit entry invalidates all downstream block hashes, triggering an immediate integrity alert during automatic or manual audit verification runs.

---

## 23. Failure & Threat Scenarios

VeriQ is designed to handle adversarial threats and infrastructure failures deterministically:

| Threat / Failure Scenario | Expected System Behavior | Security Objective | Audit Consequence |
| :--- | :--- | :--- | :--- |
| **1. Unauthorized User Attempts Access** | Request terminated immediately with `403 Forbidden`. No file or key released. | Confidentiality & Authorization. | `UNAUTHORIZED_ACCESS_ATTEMPT` logged with user ID, IP, and target paper ID. |
| **2. Valid User Attempts Early Access** | Controlled Release Engine evaluates authoritative server time; rejects with `425 Too Early`. | Controlled Availability (Time-Lock). | `EARLY_ACCESS_ATTEMPT` recorded on ledger with client timestamp and server delta. |
| **3. Client Manipulates Local OS Time** | Local client time is ignored; server enforces authoritative authoritative time. Key withheld. | Controlled Availability. | Rejection logged; repeated attempts flag potential compromised station. |
| **4. Paper Modified After Registration** | Recomputed SHA-256 hash does not match ledger anchor. Decryption permanently aborted. | Cryptographic Integrity. | Critical `TAMPER_DETECTED_ALERT` broadcast to dashboard and recorded to ledger. |
| **5. Recipient Device Not Recognized** | Hardware fingerprint does not match registered center profile. Access blocked. | Endpoint Posture Assurance. | `UNRECOGNIZED_DEVICE_REJECTED` logged with client hardware telemetry. |
| **6. Paper Assignment Invalid / Revoked** | Center allocation manifest queried; unassigned center receives `403 Forbidden`. | Principle of Least Privilege. | `UNASSIGNED_RESOURCE_REQUEST` logged to security event log. |
| **7. Authentication Token Expired / Forged** | JWT validation fails signature or expiration check. Request rejected with `401 Unauthorized`. | Authentication Integrity. | `AUTHENTICATION_FAILURE` logged; IP rate-limiting triggered. |
| **8. Blockchain / Network Ledger Offline** | System fails closed or enters degraded mode: enters a degraded verification mode or fails closed depending on the finalized resilience policy. | Operational Resilience & Fail-Closed. | `LEDGER_CONNECTIVITY_DEGRADED` event logged; alerts operations team. |
| **9. Off-Chain Storage Tier Offline** | Center station cannot retrieve encrypted payload blob. Clear error displayed. | Graceful Error Handling. | `STORAGE_RETRIEVAL_FAILED` logged; automatic retry to regional backup mirror. |
| **10. Recipient Receives Corrupted Data** | Downloaded payload fails initial checksum validation before staging. | Data Sanitization & Integrity. | `CORRUPTED_PAYLOAD_DETECTED` logged; triggers automated re-download. |
| **11. Admin Attempts Silent Decryption** | Admin has no bypass key; unwrap protocol requires center context and open window. | Defense Against Insider Threat. | Administrative query logged; attempt rejected if window closed. |
| **12. Compromised Recipient Workstation** | Memory protection minimizes unencrypted lifetime; output watermarked with center ID. | Endpoint Risk Mitigation. | Access logged; forensic watermark enables leak tracing if screen is photographed. |

---

## 24. Product Differentiation

> **Note:** This is a conceptual product-positioning comparison, not an evidence-based competitive benchmark. Verified competitor analysis will be provided in `04_MARKET_RESEARCH.md`.

VeriQ combines a set of controls specifically tailored to the operational realities of high-stakes testing:

```
┌─────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ CAPABILITY              │ GENERIC CLOUD│ SECURE FILE  │ PUBLIC       │ VERIQ        │
│                         │ (Drive/S3)   │ TRANSFER     │ BLOCKCHAIN   │ PLATFORM     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ At-Rest Encryption      │ Yes (Server) │ Yes          │ No (Public)  │ Yes (Source) │
│ Authoritative Time-Lock │ No           │ Partial      │ No           │ Yes (Strict) │
│ Chain of Custody Ledger │ No (DB logs) │ No           │ Yes          │ Yes (Native) │
│ Center-Specific Binding │ Partial      │ No           │ No           │ Yes (Strict) │
│ In-Memory Stream Render │ No           │ No           │ No           │ Yes (Native) │
│ Tamper-Evident Proofs   │ No           │ No           │ Yes          │ Yes (Merkle) │
│ Offline Tamper Detection│ No           │ No           │ Partial      │ Yes (Digest) │
└─────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### Key Differentiators
1. **Purpose-Built Controlled Release**: Unlike generic cloud drives that treat files as continuously downloadable once uploaded, VeriQ enforces an active, time-synchronized cryptographic quarantine.
2. **True Separation of Content and Evidence**: VeriQ avoids the catastrophic privacy mistake of putting confidential exam papers onto public blockchains, while leveraging the ledger for tamper-evident event anchoring.
3. **Multi-Dimensional Authorization**: Access is not just a username and password; it requires the correct role, center assignment, authoritative time window, device posture, and uncompromised payload hash.

---

## 25. MVP Definition

The Minimum Viable Product (MVP) for Hack 2 Ignite establishes a defensible, end-to-end demonstrable security workflow.

### 25.1 MVP DEFINITION AND IMPLEMENTATION STATUS

| MVP Capability | Required | Current Baseline |
| :--- | :--- | :--- |
| **Authentication without bypass** | MUST HAVE | `PARTIAL` (Fallback user exists) |
| **Role-Based Access Control (RBAC)** | MUST HAVE | `PARTIAL` |
| **Paper Registration** | MUST HAVE | `IMPLEMENTED` |
| **AES-256-GCM Encryption** | MUST HAVE | `IMPLEMENTED` |
| **SHA-256 Hash Verification** | MUST HAVE | `IMPLEMENTED` |
| **Center Allocation** | MUST HAVE | `IMPLEMENTED` |
| **Server-authoritative release gating** | MUST HAVE | `PARTIAL / DEFECT` (Time override exists) |
| **No client time override** | MUST HAVE | `PARTIAL` |
| **Cryptographic Integrity Verification** | MUST HAVE | `IMPLEMENTED` |
| **Secure paper release flow** | MUST HAVE | `PARTIAL` (Decrypted PDF not streamed) |
| **Chain-of-Custody Events** | MUST HAVE | `IMPLEMENTED` |
| **Tamper-Evident Ledger** | MUST HAVE | `SIMULATED` (In-memory mock) |
| **Unauthorized-access scenario** | MUST HAVE | `IMPLEMENTED` |
| **Early-access scenario** | MUST HAVE | `IMPLEMENTED` |
| **Tamper-detection scenario** | MUST HAVE | `IMPLEMENTED` |
| **Authorized-release scenario** | MUST HAVE | `PARTIAL` |
| **Dynamic watermarking** | SHOULD HAVE | `NOT IMPLEMENTED` |
| **Multi-center batch allocation** | SHOULD HAVE | `NOT IMPLEMENTED` |
| **Audit certificate export** | SHOULD HAVE | `NOT IMPLEMENTED` |
| **Enhanced device posture** | SHOULD HAVE | `NOT IMPLEMENTED` |
| **Operational dashboard improvements** | SHOULD HAVE | `NOT IMPLEMENTED` |

### 25.2 POST-MVP (Future Scope)
- **Production blockchain infrastructure**
- **Hardware-backed attestation**
- **Threshold/multisig authorization**
- **Advanced offline-resilient mechanisms**

---

## 26. MVP Demo Story

A compelling, four-act live demonstration scenario for hackathon judges that proves VeriQ’s security model in under 5 minutes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ACT 1: UNAUTHORIZED USER                        │
│ - Attacker logs in with unassigned center account                      │
│ - Clicks to download exam paper CS-401                                 │
│ - RESULT: 403 Forbidden. Access Denied. Attempt logged to ledger.     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ACT 2: PREMATURE ACCESS                         │
│ - Legitimate Center Administrator logs in at 08:30 AM                  │
│ - Scheduled exam release window is 09:00 AM                            │
│ - Clicks "Unlock Exam Paper"                                           │
│ - RESULT: 425 Too Early. Time-Lock Active. Countdown displayed.        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ACT 3: TAMPER DETECTION                         │
│ - System injects a 1-byte modification into staged center ciphertext   │
│ - Center attempts verification prior to release                        │
│ - Digest recomputed: SHA-256 does not match ledger anchor              │
│ - RESULT: CRITICAL ALERT. Decryption blocked. Paper Compromised.       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ACT 4: AUTHORIZED RELEASE                       │
│ - Clock reaches 08:45 AM (Valid release window)                        │
│ - Pristine payload verified against ledger anchor: Hash MATCH          │
│ - Multi-dimensional check passes: Key unwrapped, paper decrypted       │
│ - RESULT: SUCCESS. Official Paper Rendered. Event Stamped on Ledger.   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 27. Non-Goals

To maintain realistic product boundaries during the hackathon lifecycle, VeriQ explicitly excludes the following non-goals:

1. **Physical Testing Center Security**: VeriQ does not manage physical access control to the examination hall, metal detectors, CCTV surveillance, or frisking.
2. **Preventing Analog Screen Photography**: VeriQ cannot prevent a corrupt proctor from using an external analog camera or smartphone to photograph a decrypted monitor screen. (Mitigated via dynamic forensic watermarking, but physical exfiltration is outside digital boundary).
3. **Replacing Examination Governance**: VeriQ does not replace the academic committee that selects questions, sets passing criteria, or hires invigilators.
4. **On-Chain Document Storage**: VeriQ will NEVER upload full PDF question papers or plaintext exam questions directly to a blockchain ledger.
5. **Universal Endpoint Security**: VeriQ cannot sanitize an endpoint already compromised by kernel-level keyloggers or rootkits; it focuses on server-enforced gating, payload integrity, and device attestation.
6. **Online Student Exam Delivery**: VeriQ is a paper custody and distribution platform to centers—not a candidate-facing Computer Based Testing (CBT) portal.

---

## 28. Product Boundaries

```
┌────────────────────────────────────────────────────────────────────────┐
│                       INSIDE VERIQ BOUNDARY                            │
├────────────────────────────────────────────────────────────────────────┤
│ - Digital Question Paper Ingestion, Encryption, and Sealing           │
│ - Cryptographic Digest Generation and Ledger Anchoring                 │
│ - Center Allocation and Temporal Schedule Management                   │
│ - Server-Side Authoritative Time-Locked Key Quarantine                 │
│ - Pre-Flight Integrity Verification at Recipient Endpoints             │
│ - Ephemeral In-Memory Decryption and Secure Presentation Brokerage    │
│ - Tamper-Evident Chain-of-Custody Event Logging                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ Interface Hand-off
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       OUTSIDE VERIQ BOUNDARY                           │
├────────────────────────────────────────────────────────────────────────┤
│ - Candidate Registration, Fee Collection, and Hall Ticket Generation   │
│ - Student Answer Sheet Collection, Scanning, and Grading               │
│ - Physical Printing Machine Hardware & Paper Stock Security            │
│ - High-Frequency Video Surveillance / Remote Video Proctoring          │
│ - Physical Security Guards and Exam Hall Patrols                       │
│ - Enterprise Human Resource / Payroll Systems                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 29. Product Assumptions

1. **Organizational Hierarchy Exists**: The examination authority possesses a well-defined governance structure with clear separation of duties (Setters, Moderators, Controllers, Center Administrators).
2. **Reliable Server-Side Time**: Central server infrastructure has access to synchronized, authoritative time sources.
3. **Intermittent Center Connectivity**: Testing centers possess network connectivity prior to the examination to stage payloads and receive release keys, but may operate under low-bandwidth conditions.
4. **Modern Web Standards**: Center workstations run modern HTML5/Wasm-compliant web browsers supporting standard Web Cryptography APIs and secure TLS.
5. **Decryption Secrets Are Server-Managed**: In the MVP, key wrapping and unwrap decisions are managed by the central VeriQ backend acting as an authoritative policy gate.

---

## 30. Product Constraints

1. **Cryptographic Overhead**: Symmetric encryption and hashing must execute efficiently on commodity server and workstation hardware without inducing operational lag during mass release windows.
2. **Blockchain Transaction Latency & Costs**: Any interaction with distributed ledgers must be scoped to lightweight transaction hashes and state updates to avoid prohibitive gas fees and network congestion.
3. **Prevention of Plaintext Leakage**: System architecture must strictly ensure that temporary files or unencrypted buffers are wiped immediately following cryptographic operations.
4. **Hackathon Delivery Timeframe**: Scope must prioritize a rock-solid, demonstrable core security flow over sprawling, half-finished enterprise features.
5. **Regulatory Compliance**: Must adhere to institutional data protection norms regarding the isolation of confidential academic materials.

---

## 31. Product Success Criteria

The operational success of VeriQ as a product is measured against concrete, verifiable milestones:

1. **Prevention of Premature Access**: Zero papers can be decrypted or read prior to the designated release window; All tested early-access requests outside the configured release window must be rejected by the server-side release policy.
2. **Verifiable Tamper Detection**: Any modification covered by the integrity verification process must result in a digest mismatch and release failure, subject to the security assumptions of SHA-256 and the integrity of the anchor.
3. **Zero Plaintext on Public Ledger**: No confidential examination content or unencrypted personal data are exposed on the blockchain ledger.
4. **Unbroken Chain of Custody**: Every lifecycle stage from registration to access produces an auditable, timestamped ledger record traceable to an authenticated actor.
5. **Punctual Exam Release**: Authorized centers with verified payloads successfully unwrap and access examination papers within 3 seconds of the scheduled release threshold.
6. **Defensible Audit Evidence**: Independent auditors can verify the entire historical event log using cryptographic hash chains and Merkle receipts without reliance on mutable database tables.

---

## 32. Product Requirements Preview

This blueprint provides the high-level architecture that will be expanded into exhaustive specifications in `docs/05_PRODUCT_REQUIREMENTS.md`:

```
┌─────────────────────────────┬──────────────────────────────────────────────────────────┐
│ REQUIREMENT DOMAIN          │ SPECIFICATION PREVIEW IN 05_PRODUCT_REQUIREMENTS.md      │
├─────────────────────────────┼──────────────────────────────────────────────────────────┤
│ Functional Requirements     │ - Complete document ingestion workflow (PDF formats)     │
│                             │ - Center allocation and multi-center scheduling engine   │
│                             │ - Streamed in-memory rendering pipeline                  │
├─────────────────────────────┼──────────────────────────────────────────────────────────┤
│ Security Requirements       │ - Hardened JWT token validation; elimination of bypasses │
│                             │ - Strict removal of client-side override parameters      │
│                             │ - Ephemeral memory buffer zeroization protocol           │
├─────────────────────────────┼──────────────────────────────────────────────────────────┤
│ Controlled Release Specs    │ - Authoritative time-drift tolerance thresholds          │
│                             │ - Pre-unlock staging and grace-period algorithms         │
│                             │ - Automatic expiration and post-exam revocation logic    │
├─────────────────────────────┼──────────────────────────────────────────────────────────┤
│ Blockchain & Ledger Specs   │ - Transition plan from mock Python ledger to EVM contract│
│                             │ - Event payload schema definitions and gas budgets       │
│                             │ - Merkle tree construction and proof verification rules  │
├─────────────────────────────┼──────────────────────────────────────────────────────────┤
│ Audit & Usability Specs     │ - Real-time incident triage and alert notifications     │
│                             │ - Role-specific UI views tailored to high-stress exam day│
└─────────────────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 33. Future Product Evolution

The long-term roadmap expands VeriQ into an institutional standard for confidential document custody:

- `[FUTURE] Threshold Authorization`: Require multiple senior officials to present their keys concurrently to authorize high-stakes paper release.
- `[FUTURE] Production Blockchain Infrastructure`: Deploy the ledger contract across a private consortium network connecting regional university boards and civil service commissions.
- `[FUTURE] Advanced Endpoint Attestation`: Bind center decryption to hardware-backed enclaves, guaranteeing that keys can only be unwrapped inside attested physical chips.
- `[FUTURE] Hardware-Backed Identity`: Equip examination officials with hardware tokens or asymmetric identity wallets for signing all custody transitions.
- `[FUTURE] Offline-Resilient Verification`: Enable centers to prove they possess the valid, uncorrupted paper and release authorization even during catastrophic wide-area Internet blackouts using advanced cryptographic mechanisms.

---

## 34. Product Risks

| Risk Description | Potential Impact | Product Implication | Mitigation Direction |
| :--- | :--- | :--- | :--- |
| **1. Central Server Key Compromise** | Attacker gaining access to central KMS could decrypt papers before release. | Single point of failure for confidentiality. | Implement envelope encryption, split-key custody, and threshold authorization schemes. |
| **2. Administrator Privilege Abuse** | Rogue database admin modifies allocation tables or attempts direct decryption. | Insider threat bypasses conventional controls. | Enforce dual-control approvals; log all administrative actions to tamper-evident ledger. |
| **3. Center Station Malware / Screen Capture** | Malware on center laptop captures decrypted paper during exam hall rendering. | Post-decryption localized leak. | Implement dynamic forensic watermarking (proctor ID, IP, time) to ensure rapid leak attribution. |
| **4. Network Outage During Release Window** | Center loses internet connectivity at 08:59 AM; cannot fetch unwrap key. | Delayed examination start; institutional crisis. | **[PRODUCT CONSTRAINT / OPEN DESIGN QUESTION]** VeriQ must balance fail-closed security against examination-day availability during network outages. The exact offline-release mechanism is intentionally deferred to the Technical Requirements, System Architecture, and Security Architecture documents. |
| **5. False Sense of Security from Blockchain** | Stakeholders assume blockchain magically secures files while endpoint is weak. | Organizational complacency; neglected endpoint hygiene. | Clear architectural education: blockchain secures *evidence*; encryption secures *content*. |

---

## 35. Product Decision Log

| ID | Product Decision | Rationale & Context | Status |
| :--- | :--- | :--- | :--- |
| `DEC-001` | **No Plaintext or Ciphertext on Public Blockchain** | Storing confidential examination papers on public distributed ledgers violates confidentiality, incurs excessive gas costs, and risks permanent exposure. | `FROZEN` |
| `DEC-002` | **Blockchain Dedicated to Evidence & Anchoring** | Blockchain is utilized strictly for tamper-evident lifecycle events, SHA-256 integrity digests, and cryptographically verifiable audit evidence. | `FROZEN` |
| `DEC-003` | **Authoritative Server Time for All Release Gating** | Client operating system clocks are easily spoofed; time-lock gating must depend entirely on synchronized authoritative server/consensus time. | `FROZEN` |
| `DEC-004` | **Mandatory Cryptographic Separation of Concerns** | Encryption (AES), Hashing (SHA-256), Identity (RBAC), and Audit (Ledger) operate as decoupled, specialized primitives. | `FROZEN` |
| `DEC-005` | **Acknowledge Prototype Mock as Non-Production** | The current in-process Python `MockBlockchainService` is recognized as an in-memory prototype baseline, distinct from the target EVM architecture. | `FROZEN` |
| `DEC-006` | **Fail-Closed Default Posture** | Any anomaly in hash verification, role permissions, release timing, or device posture results in immediate denial of access. | `FROZEN` |

---

## 36. Current Baseline vs. Product Target

This section provides an objective comparison between the audited repository baseline ([01_REPOSITORY_AUDIT.md](01_REPOSITORY_AUDIT.md)) and the intended VeriQ product target:

| Capability Area | Current Repository State (`01_REPOSITORY_AUDIT.md`) | Intended Product Target | Product Gap & Scope |
| :--- | :--- | :--- | :--- |
| **Blockchain Ledger** | `[SIMULATED]` In-process Python `MockBlockchainService` in RAM. Data lost on server restart. | `[TARGET STATE]` Consensus-backed tamper-evident distributed ledger (EVM / `VeriQLedger.sol`) with persistent consensus. | Replace in-memory dictionary with persistent on-chain transaction anchoring. |
| **Smart Contract** | `[IMPLEMENTED BUT DORMANT]` `VeriQLedger.sol` exists in repository; not wired to active FastAPI runtime. | `[TARGET STATE]` Smart contract compiled, deployed, and connected via Web3 provider for custody events. | Connect backend service to deployed contract instance. |
| **Content Encryption** | `[IMPLEMENTED]` AES-256-GCM symmetric encryption via Python `cryptography` package. | `[TARGET STATE]` AES-256-GCM envelope encryption with hardware-backed key isolation. | Introduce proper key wrapping and lifecycle rotation. |
| **Integrity Verification**| `[IMPLEMENTED]` SHA-256 digest calculation and Merkle tree generation active. | `[TARGET STATE]` Automated client/server pre-flight integrity check prior to decryption unwrap. | Seamlessly integrate digest validation into UI release flow. |
| **Authentication & RBAC**| `[PARTIAL / DEFECT]` JWT auth exists, but `deps.py` contains development fallback user bypass. | `[PRODUCT REQUIREMENT]` Strict, non-bypassable JWT verification with fine-grained role claims. | Remove development bypass logic from authentication dependencies. |
| **Time-Lock Release** | `[PARTIAL / DEFECT]` Time evaluation exists, but API accepts an `override_time` testing parameter. | `[PRODUCT REQUIREMENT]` Pure authoritative server time gating; zero client-controlled time overrides. | Strip `override_time` parameter; enforce authoritative authoritative server time source. |
| **Secure Paper Access** | `[PARTIAL]` Access endpoint validates status but does not stream decrypted PDF payload. | `[PRODUCT REQUIREMENT]` End-to-end ephemeral in-memory decrypted PDF stream delivered to secure viewer. | Complete the payload delivery and rendering pipeline in center UI. |
| **Device Verification** | `[SIMULATED]` Device fingerprint models exist in schema; client validation mocked. | `[TARGET STATE]` Rigorous browser/station attribute binding before release authorization. | Implement genuine device posture collection and validation. |
| **Digital Signatures** | `[SIMULATED]` HMAC-SHA256 symmetric message authentication code used for transaction signatures. | `[TARGET STATE]` Asymmetric public/private key pairs (ECDSA / secp256k1) for all participants. | Upgrade signature generation to asymmetric cryptographic wallets. |

---

## 37. Traceability to Problem Statement WB-03

VeriQ's product capabilities directly address every requirement set forth in Problem Statement WB-03 (*Secure Examination Paper Distribution Using Blockchain*):

| WB-03 Problem Requirement | VeriQ Product Capability | Tangible Product Outcome |
| :--- | :--- | :--- |
| **Confidentiality of Exam Papers** | Source-Side AES-256-GCM Encryption (Section 14.2) | Papers remain completely unreadable across transport networks and untrusted storage tiers. |
| **Preventing Premature Paper Leaks** | Authoritative Time-Locked Release Gating (Section 14.7, 18) | Decryption keys are strictly quarantined; early access attempts are rejected and logged. |
| **Detecting Modification / Tampering**| Cryptographic SHA-256 Anchoring & Merkle Trees (Section 14.3, 19) | Any alteration of the examination paper is instantly detected; corrupted files fail closed. |
| **Cryptographically Verifiable Chain of Custody** | Append-Only Ledger Event Tracking (Section 14.9, 21) | Every handling event (registration, allocation, staging, access) is recorded in a tamper-evident ledger structure. |
| **Center-Specific Distribution** | Multi-Dimensional Authorization & Allocation (Section 14.5, 17) | Examination centers access only papers explicitly allocated to their specific institution. |
| **Auditable Historical Record** | Tamper-Evident Chronological Audit Trail (Section 14.10, 22) | Independent authorities can mathematically verify the full examination cycle without trusting mutable DBs. |

---

## 38. Document Dependency Map

This Product Blueprint (`02_PRODUCT_BLUEPRINT.md`) establishes the operational and conceptual foundation for all subsequent project documentation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   01_REPOSITORY_AUDIT.md (FROZEN)                      │
│                   "What exists in the repository today?"               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   02_PRODUCT_BLUEPRINT.md (THIS DOC)                   │
│                   "What is VeriQ, what problem does it solve,          │
│                    what is its trust model & product boundary?"        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│03_PROBLEM_      │        │04_MARKET_       │        │05_PRODUCT_      │
│  STATEMENT.md   │        │  RESEARCH.md    │        │  REQUIREMENTS.md│
│In-depth domain  │        │Competitive &    │        │Exhaustive PRD   │
│failure analysis │        │domain landscape │        │specifications   │
└────────┬────────┘        └────────┬────────┘        └────────┬────────┘
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   06_TECHNICAL_REQUIREMENTS.md                         │
│                   Engineering constraints, latency SLOs, and metrics   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│07_SYSTEM_       │        │08_AI_           │        │09_DATABASE_     │
│  ARCHITECTURE.md│        │  ARCHITECTURE.md│        │  DESIGN.md      │
│Technical diagram│        │Telemetry anomaly│        │Schema, entities,│
│& component flows│        │detection engine │        │and migrations   │
└────────┬────────┘        └────────┬────────┘        └────────┬────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│10_API_          │        │11_SECURITY_     │        │12_UI_UX_        │
│  SPECIFICATION  │        │  ARCHITECTURE.md│        │  DESIGN.md      │
│REST/WSS schemas │        │Threat model &   │        │Wireframes, user │
│and contracts    │        │crypto specs     │        │flows, & design  │
└────────┬────────┘        └────────┬────────┘        └────────┬────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│13_DEPLOYMENT.md │        │14_TESTING_      │        │15_ROADMAP.md    │
│Docker, Infra,   │        │  STRATEGY.md    │        │Phased delivery  │
│and Cloud deploy │        │QA, Unit, E2E,   │        │milestones       │
│                 │        │and Security test│        │                 │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

---

## 39. Blueprint Completion Checklist

- [x] Document metadata defined with status, version, and dependencies.
- [x] Executive product definition established (what it is, what it solves, what is protected).
- [x] Long-term product vision articulated without unrealistic hyperbole.
- [x] Operational product mission defined.
- [x] Product identity and category clarified; non-definitions explicitly stated.
- [x] Concrete operational problem definition broken down (Sections 6.1–6.10).
- [x] Problem-to-Product mapping table completed with verification mechanisms.
- [x] Target personas detailed across the institutional hierarchy (8 distinct roles).
- [x] Stakeholder ecosystem mapped out.
- [x] Rigorous trust model formulated (trusted, partially trusted, untrusted).
- [x] Core security model established (CIA + Controlled Availability + Authentication, Authorization & Auditability).
- [x] 12 foundational product principles detailed.
- [x] 10-stage end-to-end product lifecycle specified.
- [x] Core product capabilities cataloged and mapped to repository status.
- [x] Comprehensive user journeys detailed (Journeys A through I).
- [x] Critical product states and forbidden transitions formalized.
- [x] Multi-dimensional access control model formulated.
- [x] Controlled release and time-lock mechanisms defined conceptually.
- [x] Blockchain’s role clearly scoped (On-chain evidence vs. Off-chain data).
- [x] Cryptographic role separation explicitly documented.
- [x] Chain-of-custody provenance model defined.
- [x] Auditability and event taxonomy formalized.
- [x] 12 comprehensive failure and threat scenarios evaluated.
- [x] Product differentiation established against generic cloud and file transfer tools.
- [x] MVP boundaries clearly split into MUST HAVE, SHOULD HAVE, and POST-MVP.
- [x] 4-act hackathon MVP demonstration story outlined.
- [x] Explicit non-goals documented to protect scope.
- [x] Internal vs. external product boundaries established.
- [x] Foundational product assumptions articulated.
- [x] Known operational constraints detailed.
- [x] Measurable product success criteria defined.
- [x] Product requirements preview structured for `05_PRODUCT_REQUIREMENTS.md`.
- [x] Long-term future product evolution roadmap outlined.
- [x] Major product risks, impacts, and mitigations evaluated.
- [x] Product decision log recorded (`DEC-001` through `DEC-006`).
- [x] Current baseline vs. product target gap table aligned with audit findings.
- [x] Direct traceability matrix mapped to Problem Statement WB-03.
- [x] Full document dependency graph visualized.
- [x] Blueprint completion checklist verified.
