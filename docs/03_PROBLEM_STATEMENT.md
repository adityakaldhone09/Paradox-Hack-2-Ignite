# VeriQ — Problem Statement
## Secure Examination Paper Distribution Using Blockchain (WB-03)

---

## 1. DOCUMENT METADATA

- **Document ID**: VERIQ-PS-03
- **Document Name**: Problem Statement
- **Project**: VeriQ
- **Hackathon**: Hack 2 Ignite
- **Problem Statement**: WB-03
- **Version**: 1.0.0
- **Status**: BASELINE / DRAFT
- **Date**: September 2026
- **Author/Role**: Product & Engineering Documentation
- **Upstream Documents**:
  - `01_REPOSITORY_AUDIT.md` (Baseline Audit)
  - `02_PRODUCT_BLUEPRINT.md` (Product Definition)
- **Downstream Documents**:
  - `04_MARKET_RESEARCH.md`
  - `05_PRODUCT_REQUIREMENTS.md`

---

## 2. EXECUTIVE PROBLEM STATEMENT

High-stakes academic and civil service examinations depend on the secure distribution of examination papers from a central authority to distributed regional centers. Currently, many distribution workflows rely on fragmented, trusted intermediaries—such as physical couriers, unmonitored digital file shares, or manually emailed password-protected documents. This creates an environment highly susceptible to premature paper leaks, unauthorized access, unverified paper substitution, and a complete lack of accountability when a leak occurs.

These vulnerabilities matter because a single leaked examination paper invalidates the assessment for thousands of candidates, causing immense reputational damage, financial loss, and severe emotional distress for students. When leaks occur in existing systems, authorities struggle to definitively prove who accessed the paper, when they accessed it, or whether the paper was tampered with, because standard application logs can be easily bypassed, altered, or wiped.

A dedicated solution is necessary because conventional access controls and standard file distribution methods lack the cryptographically verifiable evidence, strict time-locked release mechanisms, and tamper-evident auditability required to secure high-stakes testing. VeriQ addresses this by shifting the paradigm from implicit trust in intermediaries to mathematically verifiable trust in cryptographic access controls and tamper-evident ledger records.

---

## 3. CONTEXT

The examination-paper lifecycle traverses several highly sensitive stages, each representing a critical security boundary:

1. **Paper Creation**: A subject matter expert authors the exam. The boundary involves protecting the draft from exposure.
2. **Review / Approval**: Moderators vet the questions. The boundary requires secure collaboration without creating multiple unmanaged copies.
3. **Secure Storage**: The approved paper is finalized. The boundary requires preventing database administrators or IT staff from accessing the plaintext.
4. **Distribution**: The paper is dispatched to regional centers. The boundary involves traversing untrusted networks without exposing content.
5. **Controlled Release**: Centers hold the paper until the exam. The boundary requires preventing center administrators from opening the file before the strictly scheduled time.
6. **Examination**: The paper is opened and distributed to candidates. The boundary involves the narrow window of authorized plaintext exposure.
7. **Post-Exam Audit**: Regulators review the process. The boundary requires trustworthy, tamper-evident logs to verify compliance and investigate any reported anomalies.

---

## 4. CORE PROBLEM

**The core problem is that traditional examination paper distribution relies on easily bypassed temporal controls, fragile trust in decentralized human actors, and mutable audit trails, making it difficult to prevent or forensically trace premature paper leaks.**

### 4.1 Confidentiality
There is a severe risk of unauthorized disclosure before the examination. If papers are stored in plaintext on central servers or emailed as standard PDFs, any compromised account, rogue IT administrator, or intercepted network packet can expose the entire assessment.

### 4.2 Integrity
There is a risk of modification, substitution, or corruption. Centers receiving a digital file or physical packet often lack a mathematical mechanism to verify whether the received paper exactly matches the one officially approved by the board.

### 4.3 Authentication
Uncertainty exists regarding whether the person or device requesting the paper is genuinely authorized. Shared generic passwords (e.g., "center101") obscure the actual human actor attempting access.

### 4.4 Authorization
There is a risk of users obtaining access outside their assigned role. An administrator at Center A might exploit weak access controls to download papers destined for Center B, for which they have no legitimate jurisdiction.

### 4.5 Controlled Availability
Legitimate recipients (center administrators) often receive digital payloads hours or days in advance. Without cryptographically enforced time-locks, there is a risk they will open the paper prematurely.

### 4.6 Accountability
When a leak occurs, it is difficult to reconstruct who performed which sensitive action and when, leading to endless blame-shifting between setters, regional coordinators, and IT staff.

### 4.7 Chain of Custody
It is difficult to maintain a verifiable history of the paper. Handoffs are often recorded on disconnected spreadsheets, physical receipts, or easily manipulated local database tables.

### 4.8 Auditability
After an incident, it is difficult to produce trustworthy evidence. Standard logs can be truncated or modified by attackers to cover their tracks, leaving regulators without reliable forensic data.

---

## 5. PROBLEM SCENARIOS

### Scenario A — Premature Access
An authorized center administrator receives the encrypted exam file 24 hours before the exam. Feeling pressured, they attempt to open the file to print it early.
- **What can go wrong**: If the system relies merely on a front-end UI blocker, the administrator can bypass it and leak the paper.
- **Why authorization alone is insufficient**: The user *is* authorized to view the paper, but only *when* the release window opens.
- **Required control**: Server-side, time-locked release gating.

### Scenario B — Paper Tampering
A compromised server node or a malicious insider modifies a question in the exam paper payload after it has been approved by the moderator.
- **Detection challenge**: The regional center cannot visually tell that a question was subtly altered.
- **Integrity requirement**: The system must provide a mechanism to verify the exact bit-for-bit authenticity of the file.
- **Evidence requirement**: A tamper-evident reference digest must be available to the recipient.

### Scenario C — Unauthorized Recipient
A student gains access to a regional coordinator's laptop and attempts to download the examination paper.
- **Identity problem**: The system must distinguish between the authorized coordinator and the unauthorized student.
- **Authorization problem**: The request must be rejected if the requester lacks the correct role, center assignment, or cryptographic credentials.
- **Audit requirement**: The failed access attempt must be recorded in a tamper-evident manner for security review.

### Scenario D — Paper Substitution
During network transit, a man-in-the-middle attack or a logistical error swaps the Mathematics exam payload with the Physics exam payload.
- **Authenticity/Integrity problem**: The center might unknowingly print the wrong exam, causing a massive logistical failure on exam day.
- **Verification requirement**: The center must be able to independently verify the curriculum metadata and integrity anchor of the payload before decryption.

### Scenario E — Audit Investigation
Following rumors of a leak on social media, the Examination Board launches an investigation.
- **The Need**: Stakeholders must determine exactly who accessed the paper, at what specific timestamp, which version was involved, and whether the release policy was respected.
- **The Challenge**: If logs are scattered across application servers, local laptops, and email servers, correlating events is difficult. Fragmented, mutable logs destroy forensic credibility.

---

## 6. STAKEHOLDERS AFFECTED

| Stakeholder | Problem Experienced | Consequence | Required Capability |
| :--- | :--- | :--- | :--- |
| **Examination Authority** | Cannot reliably trace distribution leaks or enforce synchronized exam starts. | Cancelled exams, severe reputational damage, massive financial cost for re-testing. | Centralized monitoring with decentralized cryptographic enforcement of time-locks. |
| **Paper Setter** | Fear that draft questions will be exposed during upload or peer review. | Reluctance to participate; compromised question integrity. | Secure, encrypted-at-source registration workflows. |
| **Moderator / Reviewer** | Difficult to verify final paper versions without creating vulnerable plaintext copies. | Accidental circulation of draft versions. | Secure in-memory viewing with restricted role-based access. |
| **Examination Center** | Receives papers without a way to verify authenticity; logistical stress on exam morning. | May accidentally distribute tampered or incorrect papers. | Automated, one-click integrity verification prior to printing. |
| **Authorized Proctor** | Pressured to obtain physical papers early due to inefficient printing logistics. | Potential complicity in early-access leaks. | Streamlined, time-gated decryption that balances security with operational speed. |
| **System Administrator** | Blamed for application leaks; holds dangerous blanket access to databases. | Unfair liability; risk of insider threat if compromised. | Zero-knowledge architecture where administrators cannot access plaintext payloads. |
| **Auditor / Investigator** | Cannot trust server logs that are easily modified by root users. | Inability to prove compliance or identify offenders. | Cryptographically verifiable, tamper-evident audit trails. |

---

## 7. ROOT CAUSES

### 7.1 Centralized Trust Dependency
Systems often rely entirely on a central database and its administrators. If the central database is compromised, confidentiality and audit trails are at risk.

### 7.2 Fragmented Audit Trails
Logging is scattered across syslog, database tables, and application files, making correlation and verification difficult.

### 7.3 Weak Release-Time Enforcement
Access controls focus on *who* can access the file, but neglect *when* they can access it. Time enforcement is often pushed to untrusted client clocks rather than authoritative server time.

### 7.4 Inconsistent Identity / Authorization Controls
Shared generic accounts and lack of explicit center-to-resource binding allow authorized users to access files outside their specific jurisdiction.

### 7.5 Lack of Cryptographic Integrity Verification
Documents are moved as simple files without appended cryptographic hashes, making it difficult for recipients to detect silent corruption or deliberate tampering.

### 7.6 Insufficient Chain-of-Custody Evidence
Custody handoffs rely on administrative trust rather than cryptographically verified receipts, breaking the chain of evidence required for accountability.

### 7.7 Inadequate Separation Between Confidential Content and Audit Evidence
Systems often store sensitive files and audit logs in the same vulnerable environment, allowing an attacker who breaches the storage to also wipe the logs.

---

## 8. LIMITATIONS OF CONVENTIONAL APPROACHES

| Approach | Useful Control | Remaining Gap |
| :--- | :--- | :--- |
| **Email Distribution** | Fast, utilizes existing infrastructure. | No time-gating, plaintext transmission, easily forwarded, fragmented auditability of opening. |
| **Password-Protected PDFs** | Basic confidentiality if intercepted. | Passwords can be shared alongside the file; early access is trivial once the password leaks. |
| **Shared Network Drives** | Centralized access control. | Sysadmins have full access; easily downloaded in bulk; no cryptographic integrity proofs. |
| **Conventional App DBs** | Structured RBAC and logging. | Database admins can read payloads and quietly delete audit logs to cover their tracks. |
| **Physical Courier** | Physical chain of custody. | High logistical cost, slow, vulnerable to physical interception, coercion, or envelope tampering. |

*Note: Conventional systems are not inherently insecure, but their security relies heavily on correct implementation, operational controls, and trusting the administrators. They may lack the verifiable, tamper-evident properties desired for high-stakes testing.*

---

## 9. WHY THE PROBLEM REQUIRES MULTIPLE CONTROLS

Blockchain alone does NOT solve the complete problem. Securing examination distribution requires a layered approach where different controls address distinct risks:

| Security Need | Control Category |
| :--- | :--- |
| **Confidentiality** | Encryption |
| **Integrity** | Cryptographic hashing |
| **Authentication** | Identity verification |
| **Authorization** | RBAC / policy enforcement |
| **Controlled Release** | Time-based access policy |
| **Auditability** | Tamper-evident event records |
| **Accountability** | Identity + signed/verified evidence |
| **Chain of Custody** | Linked lifecycle events |

A blockchain cannot encrypt a file, and encryption cannot enforce a release time. The responsibilities must be separated.

---

## 10. WHY BLOCKCHAIN IS RELEVANT TO WB-03

Blockchain technology directly addresses the auditability, integrity, and chain-of-custody gaps inherent in centralized systems by providing:

- **Tamper-Evident Lifecycle Records**: Once an event (e.g., paper registration, release authorization) is anchored to the ledger, it becomes computationally difficult to silently alter or delete it.
- **Shared Verification**: Auditors and regional centers can verify the integrity of the process without blindly trusting a single mutable audit source.
- **Chronological Event History**: The ledger records a strict, chronological sequence of events, providing evidence of exactly when a paper was allocated or accessed.
- **Reduced Dependence on a Single Mutable Audit Source**: It removes the systemic risk of a rogue administrator altering syslog files to cover up a leak.

**What Blockchain SHOULD NOT Store:**
- Plaintext examination papers.
- Encryption keys.
- Sensitive personal information unless justified.
- Unnecessary confidential metadata.

The problem framing supports an off-chain/on-chain separation where confidential payloads remain off-chain and the integrity anchor and lifecycle events are committed to the tamper-evident ledger.

---

## 11. PROBLEM → REQUIRED OUTCOMES

| Problem | Required Outcome |
| :--- | :--- |
| **Unauthorized access** | Only authorized actors can request protected content. |
| **Premature access** | Release policy must prevent access before the authorized time. |
| **Tampering** | Recipient can verify document integrity. |
| **Paper substitution** | Recipient can verify identity/version/integrity. |
| **Weak audit trail** | Critical lifecycle actions produce verifiable records. |
| **Disputed access** | System retains evidence sufficient for investigation. |

---

## 12. SCOPE OF THE PROBLEM

### In Scope
- Secure examination-paper lifecycle.
- Confidential paper handling.
- Authorized distribution.
- Controlled release.
- Integrity verification.
- Chain of custody.
- Auditability.
- Security event recording.

### Out of Scope
- Conducting the examination itself.
- Automated grading.
- Student performance analytics.
- Question generation.
- Complete examination management systems.
- Replacing institutional identity infrastructure.
- Guaranteeing prevention of human leakage.
- Solving endpoint compromise in all circumstances.

---

## 13. ASSUMPTIONS

- The examination authority defines authorized actors.
- Paper content originates from an approved source.
- Authorized users have identifiable credentials.
- Release policies are configured by a trusted authority.
- Participating systems have basic operational security.
- Endpoint security remains an important external dependency.

---

## 14. SECURITY AND OPERATIONAL IMPACT

Failing to address the vulnerabilities in examination distribution leads to severe consequences:

- **Examination Integrity**: A leaked paper destroys the validity of the assessment.
- **Fairness**: Candidates who receive leaked papers gain an unjust advantage.
- **Institutional Trust**: Leaks erode public and regulatory confidence in the examination board.
- **Operational Disruption**: Canceling and rescheduling a nationwide exam requires massive logistical coordination.
- **Incident Investigation**: Without tamper-evident logs, authorities struggle to identify the source of the leak.
- **Reputational Impact**: High-profile leaks result in severe media scrutiny.
- **Administrative Burden**: Manual distribution workflows are highly inefficient.

---

## 15. MEASURABLE PROBLEM OUTCOMES

A successful solution to this problem must demonstrate the following measurable outcomes:

- Unauthorized access attempts are rejected.
- Premature release attempts are rejected.
- Document integrity can be independently checked.
- Critical lifecycle events are recorded.
- Access history can be reconstructed.
- Authorized recipients can verify received content.
- Audit evidence is linked to the relevant paper/version/event.

---

## 16. WB-03 TRACEABILITY

| WB-03 Requirement / Theme | Problem Addressed | VeriQ Response Area |
| :--- | :--- | :--- |
| **Secure Distribution** | Vulnerability of papers in transit and at rest. | Encryption and payload management. |
| **Blockchain Integration** | Lack of trust in centralized, mutable audit logs. | Tamper-evident ledger for event tracking. |
| **Tamper Detection** | Difficulty detecting modified or substituted papers. | Integrity verification against the ledger anchor. |
| **Access Control** | Unauthorized personnel accessing sensitive papers. | Authorization policy and controlled release. |

---

## 17. PROBLEM BOUNDARY

VeriQ is solving the problem of securely controlling, verifying, distributing, releasing, and auditing sensitive examination papers. 

VeriQ is NOT claiming to eliminate every possible leakage vector. Endpoint compromise, screenshots, photography, insider behavior (e.g., memorizing questions), and physical security of printed materials remain broader operational and security concerns unless explicitly addressed by future controls.

---

## 18. PROBLEM STATEMENT — FINAL FORM

High-stakes examinations suffer from distribution workflows where confidential papers are exposed to unauthorized interception, insider tampering, and premature access. Traditional workflows rely on easily bypassed temporal controls, manual handoffs, and centralized databases with mutable audit logs, making it difficult to reduce leaks or reliably trace the source of a breach.

This creates severe operational risk: a single premature leak destroys assessment integrity, invalidates outcomes, and causes significant reputational and logistical damage.

To resolve this, examination authorities require a digital distribution infrastructure that provides stronger controls. The solution must ensure that papers remain unavailable until the authorized release time, allow regional centers to independently verify document integrity, and record critical custody events to a tamper-evident ledger, providing cryptographic evidence and verifiable accountability for the entire paper lifecycle.

---

## 19. DOCUMENT DECISION LOG

| ID | Decision | Rationale |
| :--- | :--- | :--- |
| PS-DEC-001 | Blockchain is treated as an audit/trust mechanism rather than the complete security solution. | Security responsibilities are distributed across encryption, identity, authorization, release policy, and audit. |
| PS-DEC-002 | Examination paper content remains outside the blockchain. | Confidentiality and data-minimization requirements. |
| PS-DEC-003 | Endpoint compromise is outside the complete MVP problem boundary. | Cannot be solved solely through the distribution platform. |

---

## 20. TRACEABILITY TO DOCUMENT SUITE

`01_REPOSITORY_AUDIT.md`
↓
`02_PRODUCT_BLUEPRINT.md`
↓
**`03_PROBLEM_STATEMENT.md`**
↓
`04_MARKET_RESEARCH.md`
↓
`05_PRODUCT_REQUIREMENTS.md`
↓
`06_TECHNICAL_REQUIREMENTS.md`
↓
`07_SYSTEM_ARCHITECTURE.md`

This document contributes to the chain by establishing the foundational *reason* for the solution. By defining the problem, it justifies the requirements, architectural decisions, and specific technical controls detailed in subsequent documents.

---

## 21. COMPLETION CHECKLIST

- [x] Problem clearly defined
- [x] WB-03 alignment documented
- [x] Stakeholders identified
- [x] Threat/problem scenarios documented
- [x] Root causes documented
- [x] Conventional approach limitations documented
- [x] Blockchain role clearly bounded
- [x] Non-blockchain controls identified
- [x] Scope and non-goals defined
- [x] Assumptions documented
- [x] Measurable outcomes defined
- [x] Final problem statement written
- [x] No implementation claims presented as current reality
- [x] No unsupported statistics invented
- [x] No source code modified
