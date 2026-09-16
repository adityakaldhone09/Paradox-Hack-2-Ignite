# VeriQ — Product Requirements
## Secure Examination Paper Distribution Using Blockchain (WB-03)

---

## 1. Document Metadata

- **Document ID**: `VERIQ-PR-05`
- **Document Title**: Product Requirements Specification
- **Product**: VeriQ
- **Hackathon**: Hack 2 Ignite
- **Problem Statement**: WB-03 — Secure Examination Paper Distribution Using Blockchain
- **Version**: `1.1.0`
- **Status**: `BASELINE / DRAFT`
- **Date**: September 2026
- **Authors/Owner**: Principal Product Architect, Security Architect, QA/Verification Architect
- **Upstream Documents**:
  - `01_REPOSITORY_AUDIT.md`
  - `02_PRODUCT_BLUEPRINT.md`
  - `03_PROBLEM_STATEMENT.md`
  - `04_MARKET_RESEARCH.md`
- **Downstream Documents**:
  - `06_TECHNICAL_REQUIREMENTS.md`
  - `07_SYSTEM_ARCHITECTURE.md`
  - `09_DATABASE_DESIGN.md`
- **Intended Audience**: Product Managers, System Architects, Developers, Security Engineers, QA Engineers, Compliance Auditors.
- **Document Purpose**: Formally define what VeriQ SHALL, SHOULD, and MAY provide as a secure examination-paper distribution platform across the complete controlled lifecycle.

---

## 2. Requirements Engineering Method

- **Derivation**: Requirements were derived systematically from the identified operational vulnerabilities documented in the Problem Statement (`03_PROBLEM_STATEMENT.md`), verified against the evidence landscape in Market Research (`04_MARKET_RESEARCH.md`), and mapped to the capabilities defined in the Product Blueprint (`02_PRODUCT_BLUEPRINT.md`).
- **Inputs Used**: Security constraints from NIST SP 800-53, baseline repository capabilities (`01_REPOSITORY_AUDIT.md`), and WB-03 hackathon problem constraints.
- **Product vs. Technical Requirements**: This document (05) defines WHAT the system must do to solve the business/security problem. It avoids prescribing HOW the system is built (e.g., specific libraries or cloud providers), which is reserved for Technical Requirements (06).
- **Requirement Decomposition Method**: High-level capabilities are decomposed into atomic, testable statements.
- **Requirement Prioritization**: Prioritized using MoSCoW principles (MUST, SHOULD, MAY) aligned to an MVP/Target/Future release timeline.
- **Acceptance Criteria Methodology**: Formulated as observable, deterministic conditions to ensure objectivity.
- **Traceability Methodology**: Every functional requirement traces back to a Product Blueprint capability and a Problem Statement gap.
- **Verification Methodology**: Each requirement maps to a specific quality assurance method (e.g., Unit Test, Security Test, Contract Test).

**Engineering Flow**:
`Evidence → Problem → Product Capability → Requirement → Verification`

---

## 3. Requirement Classification

- **DOC (Document Lifecycle)**: Registration, metadata, and status management.
- **DIST (Distribution)**: Secure routing and payload transfer to centers.
- **AUTH (Authentication / Identity)**: Establishing actor identity and credentials.
- **ACC (Authorization / Access Control)**: Enforcing role, resource, and location constraints.
- **TIME (Time / Controlled Release)**: Authoritative time evaluation and release gating.
- **DEV (Device / Endpoint Binding)**: Managing and verifying authorized retrieval endpoints.
- **CRY (Cryptographic Requirement)**: Symmetric encryption, hashing, and key protection.
- **INT (Integrity Requirement)**: Ensuring payloads remain unaltered and verifiable.
- **BC (Blockchain / Ledger Requirement)**: Tamper-evident anchoring and smart contract logic.
- **COC (Chain-of-Custody Requirement)**: Chronological state transitions of the document.
- **AUD (Audit / Accountability)**: Forensic logging of security-relevant events.
- **SEC (Security Requirement)**: Defensive mechanisms, revocations, and threat response.
- **PRI (Privacy Requirement)**: Minimization and protection of confidential data.
- **DAT (Data Requirement)**: Conceptual entity relationships and persistence guarantees.
- **PERF (Performance)**: Latency, throughput, and scale constraints.
- **AVAIL (Availability / Reliability)**: Uptime, fail-safe behaviors, and disaster recovery.
- **UX (Usability)**: Effectiveness and efficiency of user interaction.
- **INTG (Integration / Interoperability)**: Boundaries and APIs connecting external systems.
- **OBS (Observability)**: System health, metrics, and operational logging.
- **OPS (Operations)**: Infrastructure management and maintenance workflows.
- **DEP (Deployment)**: Packaging, environments, and secret injection.

---

## 4. Requirement Priority Model

- **MUST**: Mandatory requirement. The solution is unacceptable without it.
- **SHOULD**: Highly recommended requirement. Omission requires documented justification.
- **MAY**: Optional enhancement. Nice to have, but not critical for the core mission.

**Lifecycle Categories**:
- **MVP**: Minimum Viable Product required to demonstrate the WB-03 problem statement effectively.
- **Target**: Expected state of the final production-ready application.
- **Future**: Roadmap item beyond the immediate scope.

**Critical Note**: A requirement marked `MUST` denotes its formal priority for the target system, NOT its current implementation status in the repository baseline.

---

## 5. Actors and System Roles

1. **Examination Authority (Admin)**
   - *Purpose*: Executive oversight.
   - *Responsibilities*: Schedule exams, assign centers, trigger emergency revocations.
   - *Allowed*: Manage exams, centers, assign papers, revoke access.
   - *Restricted*: Cannot view decrypted papers.
   - *Security Significance*: Highest administrative privilege.
2. **Paper Setter**
   - *Purpose*: Content authorship.
   - *Responsibilities*: Create and upload the draft examination paper.
   - *Allowed*: Upload documents, define paper metadata.
   - *Restricted*: Cannot assign centers, modify time-locks, or access others' papers.
   - *Security Significance*: Source of the initial plaintext.
3. **Moderator / Reviewer**
   - *Purpose*: Content quality assurance.
   - *Responsibilities*: Review drafts, finalize approval, trigger final cryptographic seal.
   - *Allowed*: Approve papers in draft status.
   - *Restricted*: Cannot modify release policies or center assignments.
   - *Security Significance*: Final gatekeeper before payload distribution.
4. **Distribution Administrator**
   - *Purpose*: Logistics coordination.
   - *Responsibilities*: Monitor payload transit to centers.
   - *Allowed*: View center synchronization telemetry.
   - *Restricted*: Cannot decrypt payloads.
   - *Security Significance*: Monitors network health but holds no cryptographic authority.
5. **Examination Center Administrator**
   - *Purpose*: Regional institutional head.
   - *Responsibilities*: Maintain authorized endpoints, receive encrypted payloads.
   - *Allowed*: Register devices, view center-specific assigned papers, trigger integrity checks.
   - *Restricted*: Cannot view papers before release window, cannot access other centers' papers.
   - *Security Significance*: Controls the physical staging endpoint.
6. **Proctor / Authorized Recipient**
   - *Purpose*: Exam hall supervision.
   - *Responsibilities*: Execute the secure unwrap and print/render process.
   - *Allowed*: Request key release within the valid window.
   - *Restricted*: Cannot alter system time or assign policies.
   - *Security Significance*: Executes the final plaintext exposure.
7. **Auditor / Investigator**
   - *Purpose*: Compliance and forensic oversight.
   - *Responsibilities*: Verify ledger proofs and investigate anomalies.
   - *Allowed*: Read-only access to tamper-evident ledger and audit reports.
   - *Restricted*: Cannot modify anything or decrypt papers.
   - *Security Significance*: Independent verification.
8. **System** (Automated Engine)
   - *Purpose*: Enforces all policies without human intervention.
   - *Responsibilities*: Cryptography, hashing, time validation, audit logging.
9. **Blockchain / Ledger Service**
   - *Purpose*: Tamper-evident anchoring.
   - *Responsibilities*: Record lifecycle hashes and events in an append-oriented manner.
10. **Time Authority**
    - *Purpose*: Authoritative clock.
    - *Responsibilities*: Provide an authoritative temporal context for release policies.

---

## 6. Product-Level Requirements Overview

- **Secure Paper Registration** → DOC / CRY / INT
- **Identity & Sessions** → AUTH
- **Access Control & Routing** → ACC
- **Controlled Release** → TIME
- **Endpoint Binding** → DEV
- **Data Protection** → CRY / PRI
- **Integrity Anchoring** → INT / BC
- **Chronological Lifecycle** → COC
- **Tamper-Evident History** → AUD / BC
- **Resilience & Threats** → SEC / AVAIL

---

## FUNCTIONAL REQUIREMENTS

---

## 7. Document Lifecycle Requirements

### DOC-001 — Paper Registration and Metadata
**Category:** Document Lifecycle
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL permit an authorized Paper Setter to register a new examination paper with unique metadata including course identifier, schedule, and expected duration.

**Rationale:**
Every paper requires a unique authoritative identity to prevent collisions.

**Acceptance Criteria:**
1. A successful registration creates a unique `paperId`.
2. Metadata is persistently stored.
3. The paper is placed in a `REGISTERED` or `DRAFT` state.

**Verification Method:** Unit Test / API Test
**Traceability:**
- Product Blueprint: Paper Registration
- Problem Statement: Weak Chain of Custody
- Market Research: Fragmentation constraints

### DOC-002 — Explicit Approval Gate
**Category:** Document Lifecycle
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL require an explicit approval action by an authorized Moderator before a registered paper can be scheduled for distribution.

**Rationale:**
Ensures no unvetted draft questions enter the distribution pipeline.

**Acceptance Criteria:**
1. Only a Moderator role can transition the state to `APPROVED`.
2. Unapproved papers cannot be assigned to centers.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Moderator Persona
- Problem Statement: Paper substitution
- WB-03: Secure Examination Paper

### DOC-003 — Secure Delivery of Decrypted Material
**Category:** Document Lifecycle
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
Upon successful authorization, the system SHALL securely transmit the decrypted examination paper payload (or the temporary decryption key) to the authorized endpoint, ensuring it is rendered without persisting plaintext to untrusted local disk.

**Rationale:**
Authorization without actual payload delivery renders the system functionally useless; storing plaintext on local disk defeats the encryption.

**Acceptance Criteria:**
1. An authorized request within the time window results in the delivery of the document payload.
2. The document can be rendered/printed by the center administrator.

**Verification Method:** End-to-End Test
**Traceability:**
- Repository Audit: No Decrypted Payload Delivery
- Product Blueprint: Secure Access

### DOC-004 — Version Integrity Post-Approval
**Category:** Document Lifecycle
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL reject any modifications to the examination paper payload or its metadata once the paper reaches the `APPROVED` state.

**Rationale:**
Changes post-approval bypass the Moderator review, creating a risk of tampering or unauthorized substitutions.

**Acceptance Criteria:**
1. An update request on an `APPROVED` paper returns a policy rejection.
2. The payload hash remains fixed for the duration of the lifecycle.

**Verification Method:** API Test
**Traceability:**
- Product Blueprint: Uncompromising Integrity
- Problem Statement: Paper Tampering

### DOC-005 — Invalid Transition Rejection
**Category:** Document Lifecycle
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL explicitly deny state transitions that violate the predefined document lifecycle rules (e.g., bypassing `REGISTERED` directly to `APPROVED`).

**Rationale:**
Prevents skipped security checks in the workflow.

**Acceptance Criteria:**
1. Attempting an out-of-sequence status change returns an error.
2. The event is recorded as an invalid transition attempt.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Product Lifecycle
- Problem Statement: Weak Chain of Custody

---

## 8. Distribution Requirements

### DIST-001 — Encrypted Distribution Payload
**Category:** Distribution
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL distribute examination papers to regional centers exclusively as encrypted ciphertext payloads.

**Rationale:**
Distribution networks are untrusted. Plaintext must be cryptographically protected from exposure during transit and storage.

**Acceptance Criteria:**
1. Downloading a paper for staging returns only the encrypted binary.
2. A center cannot decrypt the payload merely by possessing the file.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Custody Transfer (Staging)
- WB-03: Secure Distribution

### DIST-002 — Destination Validation
**Category:** Distribution
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL permit a center to download an encrypted payload for staging ONLY if the examination authority has explicitly authorized that specific center to receive the paper.

**Rationale:**
Prevents malicious or accidental pre-caching of exams at unauthorized locations.

**Acceptance Criteria:**
1. Center B requests staging download for an exam assigned only to Center A.
2. The system denies the download.

**Verification Method:** API Test
**Traceability:**
- Product Blueprint: Stage 5 Authorized Distribution
- Problem Statement: Unauthorized Recipient

### DIST-003 — Distribution Status Telemetry
**Category:** Distribution
**Priority:** SHOULD
**Lifecycle:** Target

**Statement:**
The system SHOULD record the successful download of an encrypted payload by an authorized center and provide real-time status telemetry to the Examination Authority.

**Rationale:**
Authorities need to know which centers are pre-staged and ready versus which are offline before the exam begins.

**Acceptance Criteria:**
1. A completed staging download transitions center status to `CUSTODY_TRANSFER_ACKNOWLEDGED`.
2. Authorities can view this status on the central dashboard.

**Verification Method:** End-to-End Test
**Traceability:**
- Product Blueprint: Authorized Distribution Officer
- Problem Statement: Manual Distribution Dependencies

---

## 9. Identity and Authentication Requirements

### AUTH-001 — Protected Operations Require Authentication
**Category:** Authentication
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL require successful authentication before an actor can perform protected examination-paper operations.

**Rationale:**
Protected paper operations must be attributable to an authenticated actor.

**Acceptance Criteria:**
1. An unauthenticated request to a protected operation is rejected.
2. No default actor identity is assigned.
3. Invalid credentials do not result in authorization.
4. The failed attempt is logged.

**Verification Method:** Automated Test / API Test
**Traceability:**
- Product Blueprint: Authentication
- Problem Statement: Identity Ambiguity

### AUTH-002 — Prohibition of Default Identity Fallback
**Category:** Authentication
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL NOT automatically assign a privileged or default identity if an incoming request lacks a valid authentication credential.

**Rationale:**
Prevents catastrophic authentication bypasses (as identified in the current repository baseline).

**Acceptance Criteria:**
1. A missing `Authorization` header results in an HTTP 401 Unauthorized response.
2. The system executes no fallback impersonation logic.

**Verification Method:** Security Test
**Traceability:**
- Repository Audit: Critical Authentication Bypass
- Product Blueprint: Least Privilege

### AUTH-003 — Session Lifecycle and Expiration
**Category:** Authentication
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL enforce session timeouts, invalidating authenticated sessions after a period of inactivity or an absolute time limit.

**Rationale:**
Reduces the risk of an unattended workstation being hijacked to access or release papers.

**Acceptance Criteria:**
1. A session token expires and is rejected after the configured limit.
2. The user must re-authenticate to continue.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Compromised Endpoint Risk
- Problem Statement: Unauthorized Access

### AUTH-004 — Authentication Failure Logging
**Category:** Authentication
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL log all failed authentication attempts, including invalid credentials and expired tokens, without exposing sensitive credentials in the logs.

**Rationale:**
Provides visibility into brute-force attacks or credential stuffing against examination authorities.

**Acceptance Criteria:**
1. A failed login generates an audit log event.
2. Passwords or raw tokens are omitted from the payload.

**Verification Method:** Unit Test
**Traceability:**
- Product Blueprint: Auditable by Default
- Problem Statement: Audit Investigation

---

## 10. Authorization and RBAC Requirements

### ACC-001 — Role-Based Authorization Enforcement
**Category:** Authorization
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL enforce Role-Based Access Control (RBAC), verifying that the authenticated actor holds the requisite role permissions for the requested operation.

**Rationale:**
Limits lateral movement and enforces least privilege.

**Acceptance Criteria:**
1. A Center Administrator attempting to approve a paper (Moderator action) is denied.
2. Denials are logged as security events.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Role Matrix
- Problem Statement: Unauthorized Access

### ACC-002 — Resource-Level Center Binding
**Category:** Authorization
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL deny access if a Center Administrator attempts to access an examination paper that has not been explicitly assigned to their registered center.

**Rationale:**
Prevents cross-center contamination and leakage.

**Acceptance Criteria:**
1. User with `CENTER_ADMIN` role requests Paper X.
2. Paper X is assigned to Center A. User belongs to Center B.
3. Access is denied.

**Verification Method:** API Test
**Traceability:**
- Product Blueprint: Recipient Verification
- Problem Statement: Authorization Ambiguity

### ACC-003 — Separation of Duties
**Category:** Authorization
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL enforce separation of duties, ensuring that the actor who sets (authors) the paper cannot act as the final moderator (approver) for the same paper.

**Rationale:**
Prevents unilateral malicious paper injection by a single compromised account.

**Acceptance Criteria:**
1. The `Setter` identity for Paper A cannot execute the `Approve` operation for Paper A.
2. Attempting to bypass this returns an authorization failure.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Paper Setter & Moderator Personas
- Problem Statement: Unauthorized Access

### ACC-004 — Revoked Actor Denial
**Category:** Authorization
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL deny access for any actor whose identity or role has been explicitly revoked, taking effect before any subsequent authorization decisions.

**Rationale:**
Provides immediate protection when an insider threat is detected.

**Acceptance Criteria:**
1. An admin revokes a Center Administrator account.
2. The revoked account attempts to download a staged payload.
3. Access is strictly denied.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Emergency Revocation
- Problem Statement: Compromised Credential Response

---

## 11. Controlled Release Requirements

### TIME-001 — Time-Locked Release Gating
**Category:** Time / Controlled Release
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL deny decryption and access to the examination paper payload if the authoritative current time is strictly earlier than the configured release window start time.

**Rationale:**
Prevents premature early-morning distribution of papers.

**Acceptance Criteria:**
1. Request arrives 1 minute before release window.
2. The system returns an access denial (e.g., HTTP 403 or specific status).
3. The event is recorded in the audit ledger.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Controlled Availability
- Problem Statement: Premature Access

### TIME-002 — Authoritative Time Enforcement
**Category:** Time / Controlled Release
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL evaluate release eligibility using an authoritative, server-controlled time source and SHALL explicitly reject client-provided timestamps or overrides for security decisions.

**Rationale:**
Client clocks can be easily manipulated to bypass release locks.

**Acceptance Criteria:**
1. A client request containing an `override_time` parameter is ignored or rejected.
2. The server's secure clock dictates the evaluation.

**Verification Method:** Security Test
**Traceability:**
- Repository Audit: Time-Lock Policy Bypass
- Problem Statement: Weak Release-Time Enforcement

### TIME-003 — Active Release Window Duration
**Category:** Time / Controlled Release
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL enforce a strict expiration of the release window (release end time), after which decryption keys or access permissions are no longer granted for that examination.

**Rationale:**
Reduces the window of opportunity for post-exam key extraction.

**Acceptance Criteria:**
1. Request arrives after the `release_window_end` time.
2. The system denies the request.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Stage 10 Closeout & Archiving
- Problem Statement: Controlled Availability

---

## 12. Device / Endpoint Binding Requirements

### DEV-001 — Registered Endpoint Enforcement
**Category:** Device / Endpoint Binding
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL permit key release and decryption only to a registered hardware device or verified endpoint that has been explicitly bound to the authorized center.

**Rationale:**
Prevents a legitimate center administrator from logging in on an untrusted personal laptop and leaking the paper.

**Acceptance Criteria:**
1. User logs in from an unknown device footprint.
2. System denies release, requiring an authorized device.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Recipient Verification
- Problem Statement: Compromised Recipient / Endpoint Risk

### DEV-002 — Device Revocation
**Category:** Device / Endpoint Binding
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL permit the Examination Authority to revoke a specific registered device, preventing it from being used in any subsequent release authorizations.

**Rationale:**
Stops an ongoing leak if a center laptop is stolen or compromised by malware.

**Acceptance Criteria:**
1. Authority marks a device fingerprint as `REVOKED`.
2. Access requested from that device is blocked.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Endpoint Risk
- Problem Statement: Endpoint Compromise

---

## 13. Cryptography Requirements

### CRY-001 — Authenticated Encryption of Document Payload
**Category:** Cryptography
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL encrypt the plaintext document payload prior to persistent storage using an authenticated symmetric encryption cipher (e.g., AES-256-GCM).

**Rationale:**
Protects confidentiality against unauthorized access and storage compromise.

**Acceptance Criteria:**
1. The plaintext paper is never written to persistent storage.
2. The ciphertext, IV, and authentication tag are generated successfully.

**Verification Method:** Security Test / Unit Test
**Traceability:**
- Product Blueprint: Confidentiality
- Problem Statement: Confidentiality Risk

### CRY-002 — Secure Key Separation
**Category:** Cryptography
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL NOT store the cryptographic decryption key in the same persistent data structure as the encrypted payload.

**Rationale:**
Prevents a single database breach from exposing both ciphertext and keys.

**Acceptance Criteria:**
1. Payload resides in off-chain storage.
2. Keys are managed via a dedicated key management interface or secure configuration.

**Verification Method:** Architecture Review
**Traceability:**
- Product Blueprint: Separation of Concerns
- Problem Statement: Centralized Trust Dependency

### CRY-003 — Key Release Authorization
**Category:** Cryptography
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL release the specific decryption key material to a client ONLY if the client successfully passes authentication, role, center binding, time-lock, and device posture validations simultaneously.

**Rationale:**
Ensures all security policy checks act as a unified gate to cryptographic unwrapping.

**Acceptance Criteria:**
1. Failure of any single validation step results in key denial.
2. Successful validation returns the precise key needed for that specific paper.

**Verification Method:** Integration Test / End-to-End Test
**Traceability:**
- Product Blueprint: Stage 9 Secure Paper Access
- Problem Statement: Multiple Controls Required

---

## 14. Integrity Verification Requirements

### INT-001 — Document Hash Generation
**Category:** Integrity
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL generate a cryptographic digest (e.g., SHA-256) of the examination paper immediately upon registration and encryption.

**Rationale:**
Establishes the mathematical baseline for all future verification.

**Acceptance Criteria:**
1. The digest is generated deterministically.
2. The digest is anchored to the paper's metadata.

**Verification Method:** Unit Test
**Traceability:**
- Product Blueprint: Integrity
- Problem Statement: Paper Tampering

### INT-002 — Pre-Release Integrity Verification
**Category:** Integrity
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL compare the computed cryptographic digest of the received/stored payload against the original anchored digest, and SHALL deny decryption if a mismatch is detected.

**Rationale:**
Detects bit-rot, transmission errors, or malicious file substitution before printing.

**Acceptance Criteria:**
1. Submit a corrupted ciphertext for verification.
2. The system calculates the hash, detects the mismatch.
3. The system generates a `CRITICAL` tamper incident and denies release.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Recipient Verification
- Problem Statement: Paper Substitution

---

## 15. Blockchain / Tamper-Evident Ledger Requirements

### BC-001 — Tamper-Evident Audit Anchoring
**Category:** Blockchain / Ledger
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL record security-critical lifecycle events (Registration, Approval, Assignment, Release Attempt, Revocation) to a tamper-evident ledger mechanism that supports cryptographic verification of event history.

**Rationale:**
Removes reliance on mutable, centralized database logs that can be wiped by insiders.

**Acceptance Criteria:**
1. An event produces a cryptographic receipt/transaction hash.
2. The chain of events can be traversed chronologically.
3. Modifying a past event breaks the verifiable integrity of the chain.

**Verification Method:** Contract Test / Integration Test
**Traceability:**
- Product Blueprint: Auditability & Accountability
- Problem Statement: Fragmented Audit Trails

### BC-002 — Zero Plaintext on Ledger
**Category:** Blockchain / Ledger
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL NOT store confidential examination paper payloads or plaintext cryptographic decryption keys directly on a public or shared blockchain ledger.

**Rationale:**
Blockchains are permanent public ledgers; storing secrets on them destroys confidentiality.

**Acceptance Criteria:**
1. Inspection of the ledger payload reveals only hashes, metadata identifiers, and status codes.
2. No file binary data is present in the transaction.

**Verification Method:** Architecture Review / Security Test
**Traceability:**
- Product Blueprint: Blockchain as Evidence
- Problem Statement: Data Protection

### BC-003 — Event Ordering and Lineage
**Category:** Blockchain / Ledger
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL ensure that events committed to the ledger are strictly ordered, providing a cryptographically verifiable chronological lineage for any given examination paper.

**Rationale:**
Allows auditors to reconstruct the exact sequence of custody transfers and access requests.

**Acceptance Criteria:**
1. Events contain previous hash references or block numbering enabling chronological sorting.
2. An auditor can retrace a paper's history from `REGISTERED` to `ACCESSED`.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Cryptographic Chain of Custody
- Problem Statement: Chain of Custody

---

## 16. Chain-of-Custody Requirements

### COC-001 — Strict State Transitions
**Category:** Chain-of-Custody
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL enforce a strict state machine for examination papers, rejecting transitions that violate the chronological chain of custody (e.g., jumping from `REGISTERED` directly to `RELEASED` without `APPROVED`).

**Rationale:**
Ensures due process and prevents bypassing of moderation steps.

**Acceptance Criteria:**
1. Attempting to assign an unapproved paper fails.
2. Valid transitions generate corresponding ledger events.

**Verification Method:** Unit Test
**Traceability:**
- Product Blueprint: Product Lifecycle
- Problem Statement: Weak Chain of Custody

### COC-002 — Custody Transfer Evidence
**Category:** Chain-of-Custody
**Priority:** SHOULD
**Lifecycle:** Target

**Statement:**
The system SHOULD record an explicit custody transfer event when an encrypted payload is successfully staged at a regional examination center.

**Rationale:**
Proves that the center received the payload prior to the release window, establishing readiness.

**Acceptance Criteria:**
1. Payload staging completion emits a `CUSTODY_TRANSFER_ACKNOWLEDGED` event.
2. This event is anchored to the ledger.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Custody Transfer (Staging)
- Problem Statement: Insufficient Chain-of-Custody Evidence

---

## 17. Audit and Accountability Requirements

### AUD-001 — Security Event Logging
**Category:** Audit
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL generate an audit record for all authentication attempts, authorization decisions, cryptographic key requests, and integrity verifications.

**Rationale:**
Provides the forensic foundation for incident investigation.

**Acceptance Criteria:**
1. Logs include actor ID, timestamp, resource ID, action type, and result.
2. Sensitive PII/passwords are redacted.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Auditable by Default
- Problem Statement: Disputed Access

### AUD-002 — Audit Evidence Integrity
**Category:** Audit
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL ensure that audit records exported for investigation are mathematically linked to the tamper-evident ledger, proving that the logs have not been truncated or forged.

**Rationale:**
Allows regulators to trust the system logs during an inquiry.

**Acceptance Criteria:**
1. Audit logs include verification proofs (e.g., Merkle inclusion proofs).
2. Proofs can be verified independently against the ledger root.

**Verification Method:** Architecture Review / Contract Test
**Traceability:**
- Product Blueprint: Security & Audit Officer Persona
- Problem Statement: Auditability

### AUD-003 — Sensitive Action Correlation
**Category:** Audit
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL attach a unique, traceable correlation identifier to composite business transactions (e.g., upload + encrypt + anchor) ensuring individual micro-events can be forensically reconstructed.

**Rationale:**
Distributed architectures produce disjointed logs; correlation IDs bind them.

**Acceptance Criteria:**
1. The `upload` log event shares an ID with the `encrypt` log event.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Transparent Accountability
- Problem Statement: Fragmented Audit Trails

---

## 18. Security Incident Requirements

### SEC-001 — Emergency Paper Revocation
**Category:** Security
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL permit an Examination Authority to revoke an examination paper, taking effect before subsequent authorization decisions, invalidating all pending and active release authorizations across all centers.

**Rationale:**
Provides a kill-switch if a leak is suspected prior to the exam start.

**Acceptance Criteria:**
1. Authority marks Paper X as `REVOKED`.
2. A Center Administrator subsequently requests access within the valid time window.
3. Access is denied due to revocation.
4. Revocation is recorded to the ledger.

**Verification Method:** End-to-End Test
**Traceability:**
- Product Blueprint: Revocation
- Problem Statement: Security and Operational Impact

### SEC-002 — Incident Generation on Policy Violation
**Category:** Security
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL automatically generate a high-priority security incident record when an integrity mismatch or an unauthorized access attempt is detected.

**Rationale:**
Alerts authorities to active threats rather than passively failing.

**Acceptance Criteria:**
1. A hash mismatch generates a `HASH_MISMATCH` incident.
2. The incident is visible on the security dashboard.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Security Dashboard
- Problem Statement: Audit Investigation

---

## 19. Privacy and Data Protection Requirements

### PRI-001 — Data Minimization
**Category:** Privacy
**Priority:** SHOULD
**Lifecycle:** Target

**Statement:**
The system SHALL minimize the storage of Personally Identifiable Information (PII) on immutable ledgers, referencing user identities via pseudonymous identifiers or public keys where appropriate.

**Rationale:**
Prevents privacy violations arising from immutable public records.

**Acceptance Criteria:**
1. No plaintext names or emails are stored in ledger transactions.

**Verification Method:** Architecture Review
**Traceability:**
- Product Blueprint: Privacy
- Problem Statement: Confidentiality

### PRI-002 — Secure Artifact Deletion
**Category:** Privacy / Data Protection
**Priority:** SHOULD
**Lifecycle:** Future

**Statement:**
The system SHOULD securely overwrite or definitively delete off-chain ciphertext payloads after the authorized archival retention period has expired.

**Rationale:**
Minimizes the cryptographic attack surface long after an examination is over.

**Acceptance Criteria:**
1. A scheduled job removes obsolete ciphertext blobs according to policy.
2. Ledger events persist, confirming the archival closure.

**Verification Method:** Integration Test
**Traceability:**
- Product Blueprint: Closeout & Archiving
- Problem Statement: Problem Boundary

---

## 20. Data Requirements

### DAT-001 — Conceptual Integrity Anchor Linking
**Category:** Data
**Priority:** MUST
**Lifecycle:** MVP

**Statement:**
The system SHALL strictly link every examination paper entity to exactly one original cryptographic integrity anchor and one definitive release schedule.

**Rationale:**
Data divergence causes conflicting release behaviors.

**Acceptance Criteria:**
1. An examination paper cannot possess multiple active conflicting release schedules.

**Verification Method:** Architecture Review
**Traceability:**
- Product Blueprint: Architectural Constraints
- Problem Statement: Core Problem

---

## NON-FUNCTIONAL REQUIREMENTS

---

## 21. Performance Requirements

### PERF-001 — Release Window Concurrency
**Category:** Performance
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL process concurrent access requests from all registered examination centers within a defined critical window following a release opening (duration TBD pending benchmark).

**Rationale:**
Multiple centers may concurrently attempt to download the exam precisely when the window opens.

**Acceptance Criteria:**
1. Target: TBD pending benchmark for authorization evaluation under load.

**Verification Method:** Performance / Load Test
**Traceability:**
- Product Blueprint: Operational Resilience
- Problem Statement: Manual Distribution Dependencies

---

## 22. Availability and Reliability Requirements

### AVAIL-001 — Fail-Closed Security Posture
**Category:** Availability
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
If a critical dependency (e.g., authoritative time server, ledger verification node, or database) is unreachable, the system SHALL fail-closed and deny access rather than failing open.

**Rationale:**
In high-stakes exams, it is safer to delay an exam than to accidentally leak it to an unauthorized party due to a system error.

**Acceptance Criteria:**
1. Disconnect the time authority.
2. Attempt a release request.
3. System denies access and logs an error.

**Verification Method:** Chaos Engineering / Integration Test
**Traceability:**
- Product Blueprint: Fail Closed Principle
- Problem Statement: Unauthorized Access

### AVAIL-002 — Operational Degradation
**Category:** Availability
**Priority:** SHOULD
**Lifecycle:** Target

**Statement:**
The system SHOULD support localized verification and degraded operation if a center loses wide-area network connectivity after staging, provided pre-synchronized cryptographic release conditions are safely met.

**Rationale:**
Centers frequently face network outages precisely at the release window.

**Acceptance Criteria:**
1. Off-grid release mechanisms (if implemented) preserve verifiable audit evidence for delayed reconciliation.

**Verification Method:** Architecture Review
**Traceability:**
- Product Blueprint: Operational Resilience
- Problem Statement: Distribution

---

## 23. Usability Requirements

### UX-001 — Actionable Security Errors
**Category:** Usability
**Priority:** SHOULD
**Lifecycle:** MVP

**Statement:**
The system SHOULD provide clear, actionable feedback to users upon access denial (e.g., "Access Denied: Release window opens at 09:00 UTC") without exposing underlying vulnerability intelligence.

**Rationale:**
Reduces panic at examination centers while maintaining security.

**Acceptance Criteria:**
1. Failed access attempts return a user-friendly status message.
2. System internals and stack traces are suppressed.

**Verification Method:** UI Testing / Manual Validation
**Traceability:**
- Product Blueprint: Center Administrator Persona
- Problem Statement: Operational Disruption

---

## 24. Integration and Observability Requirements

### OBS-001 — Sensitive Data Redaction
**Category:** Observability
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL redact confidential examination payloads, cryptographic keys, and user passwords from all operational logging, metric streams, and application traces.

**Rationale:**
Prevents leaks via DevOps monitoring tools.

**Acceptance Criteria:**
1. Application logs do not contain plaintext exam content.
2. Log ingestion systems remain free of keys.

**Verification Method:** Security Code Review
**Traceability:**
- Product Blueprint: Cloud Infrastructure Admins
- Problem Statement: Fragmented Audit Trails

### INTG-001 — Audit Export Support
**Category:** Integration / Interoperability
**Priority:** SHOULD
**Lifecycle:** Target

**Statement:**
The system SHOULD support the secure export of tamper-evident audit logs and custody receipts in a standardized machine-readable format for external regulators.

**Rationale:**
Regulatory compliance requires evidence portability.

**Acceptance Criteria:**
1. Authorized auditors can request JSON/CSV exports containing linked event histories.

**Verification Method:** API Test
**Traceability:**
- Product Blueprint: Stakeholder Ecosystem
- Problem Statement: Auditability Gaps

---

## 25. Deployment and Operations Requirements

### DEP-001 — Secret Isolation
**Category:** Deployment
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL isolate cryptographic secrets (master keys, JWT secrets, database passwords) from source code and SHALL NOT track environment variables containing secrets in version control.

**Rationale:**
Hardcoded secrets compromise the entire cryptographic foundation.

**Acceptance Criteria:**
1. `.env` files and static keys are removed from Git history.
2. Secrets are injected via secure environment variables or a vault during deployment.

**Verification Method:** Security Code Review
**Traceability:**
- Repository Audit: Tracked Secrets
- Problem Statement: Confidentiality

### OPS-001 — Secure Operations Baseline
**Category:** Operations
**Priority:** MUST
**Lifecycle:** Target

**Statement:**
The system SHALL support secure infrastructure baselines, ensuring privileged administrative access is strictly logged and partitioned away from application-level paper access.

**Rationale:**
Infrastructure administrators should manage server uptime without gaining application-level access to exam keys.

**Acceptance Criteria:**
1. Database and OS logs capture administrative commands.
2. Root admins cannot execute decryption APIs.

**Verification Method:** Security Review
**Traceability:**
- Product Blueprint: System Administrator Persona
- Problem Statement: Centralized Trust Dependency

---

## 26. CURRENT BASELINE VS TARGET STATE

| Domain | Current Repository Baseline (Verified via Audit) | Target Product Requirement |
| :--- | :--- | :--- |
| **Authentication** | `deps.py` falls back to a default `SUPER_ADMIN` identity if no token is provided. | `AUTH-002`: System SHALL explicitly reject unauthenticated requests without assigning a default identity. |
| **Time Policy** | `access.py` accepts an `override_time` parameter from the client. | `TIME-002`: System SHALL evaluate release against an authoritative server clock and reject client overrides. |
| **Payload Delivery** | API evaluates access but never streams the decrypted file to the client. | `DOC-003`: System SHALL securely deliver the decrypted payload to the authorized endpoint. |
| **Blockchain** | In-process Python simulated ledger (`MockBlockchainService`). | `BC-001`: System SHALL anchor events to a verifiable, tamper-evident ledger mechanism. |
| **Secrets** | Master encryption keys and DB binaries are tracked in Git. | `DEP-001`: System SHALL isolate secrets from version control. |

*(Note: Target requirements marked MUST are obligatory for production readiness, regardless of the current prototype's shortcuts).*

---

## 27. MVP / TARGET / FUTURE COVERAGE

| Requirement ID | Description | Priority | Lifecycle |
| :--- | :--- | :--- | :--- |
| **DOC-001** | Paper Registration | MUST | MVP |
| **DOC-002** | Explicit Approval Gate | MUST | MVP |
| **DOC-003** | Secure Payload Delivery | MUST | Target |
| **DOC-004** | Version Integrity | MUST | MVP |
| **DOC-005** | Invalid Transition Rejection | MUST | MVP |
| **DIST-001**| Encrypted Distribution | MUST | MVP |
| **DIST-002**| Destination Validation | MUST | Target |
| **DIST-003**| Distribution Status Telemetry | SHOULD | Target |
| **AUTH-001**| Enforce Authentication | MUST | MVP |
| **AUTH-002**| Prevent Identity Fallback | MUST | Target |
| **AUTH-003**| Session Lifecycle | MUST | Target |
| **AUTH-004**| Authentication Failure Logging | MUST | MVP |
| **ACC-001** | Enforce RBAC | MUST | MVP |
| **ACC-002** | Center Binding | MUST | MVP |
| **ACC-003** | Separation of Duties | MUST | Target |
| **ACC-004** | Revoked Actor Denial | MUST | Target |
| **TIME-001**| Time-Lock Release | MUST | MVP |
| **TIME-002**| Authoritative Time | MUST | Target |
| **TIME-003**| Active Release Window | MUST | Target |
| **DEV-001** | Registered Endpoint Enforcement| MUST | Target |
| **DEV-002** | Device Revocation | MUST | Target |
| **CRY-001** | Authenticated Encryption | MUST | MVP |
| **CRY-002** | Secure Key Separation | MUST | Target |
| **CRY-003** | Key Release Authorization | MUST | Target |
| **INT-001** | Document Hash | MUST | MVP |
| **INT-002** | Pre-Release Verification| MUST | MVP |
| **BC-001**  | Tamper-Evident Ledger | MUST | MVP |
| **BC-002**  | Zero Plaintext on Ledger | MUST | Target |
| **BC-003**  | Event Ordering | MUST | Target |
| **COC-001** | Strict State Transitions | MUST | MVP |
| **COC-002** | Custody Transfer Evidence | SHOULD | Target |
| **AUD-001** | Security Event Logging | MUST | MVP |
| **AUD-002** | Audit Evidence Integrity | MUST | Target |
| **AUD-003** | Sensitive Action Correlation | MUST | Target |
| **SEC-001** | Emergency Revocation | MUST | MVP |
| **SEC-002** | Incident Generation | MUST | MVP |
| **PRI-001** | Data Minimization | SHOULD | Target |
| **PRI-002** | Secure Artifact Deletion | SHOULD | Future |
| **DAT-001** | Conceptual Anchor Linking | MUST | MVP |
| **PERF-001**| Concurrency Target | MUST | Target |
| **AVAIL-001**| Fail-Closed Posture | MUST | Target |
| **AVAIL-002**| Operational Degradation | SHOULD | Target |
| **UX-001**  | Actionable Security Errors | SHOULD | MVP |
| **OBS-001** | Sensitive Data Redaction | MUST | Target |
| **INTG-001**| Audit Export Support | SHOULD | Target |
| **DEP-001** | Secret Isolation | MUST | Target |
| **OPS-001** | Secure Operations Baseline | MUST | Target |

---

## 28. REQUIREMENT COVERAGE MATRIX

| Family | Total | MUST | SHOULD | MAY | MVP | Target | Future | Primary Verification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DOC**  | 5 | 5 | 0 | 0 | 4 | 1 | 0 | API Test, Unit Test |
| **DIST** | 3 | 2 | 1 | 0 | 1 | 2 | 0 | Integration Test |
| **AUTH** | 4 | 4 | 0 | 0 | 2 | 2 | 0 | Security Test, API Test |
| **ACC**  | 4 | 4 | 0 | 0 | 2 | 2 | 0 | Integration Test, API Test |
| **TIME** | 3 | 3 | 0 | 0 | 1 | 2 | 0 | Chaos Test, Integration Test |
| **DEV**  | 2 | 2 | 0 | 0 | 0 | 2 | 0 | Integration Test |
| **CRY**  | 3 | 3 | 0 | 0 | 1 | 2 | 0 | Security Review, Unit Test |
| **INT**  | 2 | 2 | 0 | 0 | 2 | 0 | 0 | Integration Test |
| **BC**   | 3 | 3 | 0 | 0 | 1 | 2 | 0 | Contract Test, Integration Test |
| **COC**  | 2 | 1 | 1 | 0 | 1 | 1 | 0 | Unit Test |
| **AUD**  | 3 | 3 | 0 | 0 | 1 | 2 | 0 | Integration Test, Verification |
| **SEC**  | 2 | 2 | 0 | 0 | 2 | 0 | 0 | End-to-End Test |
| **PRI**  | 2 | 0 | 2 | 0 | 0 | 1 | 1 | Architecture Review |
| **DAT**  | 1 | 1 | 0 | 0 | 1 | 0 | 0 | Architecture Review |
| **PERF** | 1 | 1 | 0 | 0 | 0 | 1 | 0 | Load Test |
| **AVAIL**| 2 | 1 | 1 | 0 | 0 | 2 | 0 | Chaos Engineering |
| **UX**   | 1 | 0 | 1 | 0 | 1 | 0 | 0 | Manual Validation |
| **OBS**  | 1 | 1 | 0 | 0 | 0 | 1 | 0 | Security Review |
| **INTG** | 1 | 0 | 1 | 0 | 0 | 1 | 0 | API Test |
| **DEP**  | 1 | 1 | 0 | 0 | 0 | 1 | 0 | Source Code Review |
| **OPS**  | 1 | 1 | 0 | 0 | 0 | 1 | 0 | Security Review |
| **Total**| **47**| **40** | **7** | **0** | **20** | **26** | **1** | (Aggregate Summary) |

---

## 29. OPEN REQUIREMENTS / TBD

- **TBD-001 (Retention Policy)**: The exact archival and secure deletion period for ciphertexts post-examination requires stakeholder policy definition.
- **TBD-002 (Endpoint Binding)**: The exact hardware mechanism (e.g., TPM, OS fingerprinting) for verifying center devices requires technical architecture definition.
- **TBD-003 (Ledger Topology)**: The exact deployment model for the tamper-evident ledger (Public vs. Consortium/Private PoA) requires business/cost analysis.
- **TBD-004 (Offline Verification)**: Exact boundaries for off-grid degraded release behavior (AVAIL-002) require further technical design.

---

## 30. WB-03 TRACEABILITY MATRIX

| WB-03 Theme | Problem Addressed | Core Product Capability | Target Requirements |
| :--- | :--- | :--- | :--- |
| **Secure** | Premature access & unauthorized viewing. | Encryption & Time-Locks. | CRY-001, AUTH-001, TIME-001, TIME-002, DEV-001 |
| **Distribution**| Inability to securely route to regional centers. | Center-bound RBAC & Authorized Retrieval. | ACC-001, ACC-002, DOC-003, DIST-001, DIST-002 |
| **Blockchain** | Fragmented, mutable, centralized audit logs. | Tamper-evident ledger & Integrity Anchoring. | BC-001, INT-001, INT-002, AUD-001, COC-001 |

---

## 31. DECISION LOG

| ID | Decision | Rationale |
| :--- | :--- | :--- |
| DEC-001 | **Fail-Closed Security** | Given the high stakes of examination leakage, it is preferable to cause an operational delay (requiring manual intervention) than to accidentally expose a paper due to a system failure. |
| DEC-002 | **Off-Chain Payload** | Confidentiality constraints prohibit the storage of encrypted exam papers on a shared ledger. The ledger is exclusively for verifiable evidence. |
| DEC-003 | **Server-Authoritative Time** | Client endpoints are untrusted. Release evaluations must discard client-provided time assertions to prevent bypasses. |
| DEC-004 | **Prototype Divergence** | Requirements define the target production state. Current baseline limitations (like the mock python ledger or authentication bypass) are explicitly classified as gaps to be resolved, not as accepted requirements. |
| DEC-005 | **Avoidance of Absolute Guarantees** | Terms like "100%", "zero risk", or "impossible" are omitted in favor of "cryptographically verifiable" and "tamper-evident" due to foundational security principles. |

---

## 32. COMPLETION CHECKLIST

- [x] Executive metadata and purpose defined.
- [x] Traceable methodology established.
- [x] Actors and roles defined.
- [x] Atomic, verifiable MUST/SHOULD/MAY requirements created.
- [x] Explicitly separated from architecture implementation specifics.
- [x] Addressed current baseline gaps (Auth bypass, Time override).
- [x] Blockchain role properly bounded.
- [x] No plaintext stored on blockchain.
- [x] Acceptance criteria attached to requirements.
- [x] Traceability matrix built.
- [x] Open/TBD items documented.
- [x] Verification strategy mapped via Coverage Matrix.
- [x] Security edge-cases handled (Time override, revoked users, unapproved papers).
- [x] "Immutable" limited to cryptographic context, avoiding absolute claims.
