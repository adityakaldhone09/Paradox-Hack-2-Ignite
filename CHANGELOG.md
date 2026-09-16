# Changelog

All notable changes to **VeriQ** (*Secure Examination Paper Distribution Using Blockchain*) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-17

### 🚀 Added
- **Enterprise Documentation Suite**:
  - `01_REPOSITORY_AUDIT.md`: Baseline repository audit, test inventory, and gap analysis.
  - `02_PRODUCT_BLUEPRINT.md`: Full product blueprint, vision, and system pillars.
  - `03_PROBLEM_STATEMENT.md`: Formal problem statement for WB-03 national examination distribution.
  - `04_MARKET_RESEARCH.md`: Indian examination board landscape, compliance benchmarks, and competitive analysis.
  - `05_PRODUCT_REQUIREMENTS.md`: Functional requirements, user stories, and acceptance criteria.
  - `06_TECHNICAL_REQUIREMENTS.md`: Non-functional requirements, cryptographic specs, latency SLAs.
  - `07_SYSTEM_ARCHITECTURE.md`: Dual-plane architecture design, module specs, and component topology.
  - `08_AI_ARCHITECTURE.md`: Advisory threat intelligence, telemetry modeling, and human-in-the-loop boundaries.
  - `09_DATABASE_DESIGN.md`: Relational schema design, indexes, and state machine constraints.
  - `10_API_SPECIFICATION.md`: OpenAPI REST contracts, request/response models, and error schemas.
  - `11_SECURITY_ARCHITECTURE.md`: STRIDE threat modeling, KMS key hierarchy, and 10-Gate security engine.
  - `12_UI_UX_DESIGN.md`: Design system, persona workflows, and responsive wireframes.
  - `13_DEPLOYMENT.md`: Container orchestration, Docker Compose configs, and CI/CD blueprints.
  - `14_TESTING_STRATEGY.md`: Verification matrix, unit/integration suites, and cryptographic testing strategy.
  - `15_ROADMAP.md`: Phased execution roadmap, delivery milestones, and engineering deliverables.
- **Enterprise Governance & Community Files**:
  - `LICENSE`: Apache License 2.0.
  - `SECURITY.md`: Vulnerability disclosure policy, SLAs, and responsible disclosure terms.
  - `CONTRIBUTING.md`: Developer onboarding, branching guidelines, and commit standards.
  - `CODE_OF_CONDUCT.md`: Contributor Covenant v2.0.
  - GitHub issue templates (`bug_report.md`, `feature_request.md`, `security_vulnerability.md`) and `PULL_REQUEST_TEMPLATE.md`.
- **System Architecture & Engine Specifications**:
  - Deterministic 10-Gate Release Engine specification (Gates G1 through G10).
  - Off-Chain AES-256-GCM Envelope Encryption specification with KMS KEK wrapping.
  - On-Chain Merkle Tree Hash Anchoring specification on EVM (`VeriQLedger.sol`).
  - Decoupled asynchronous blockchain state queuing architecture.
- **UI & UX Architecture**:
  - 5 pre-seeded role dashboards: Central Authority, Exam Controller, Center Superintendent, Auditor/Inspector, SecOps.
  - Live Threat Simulation Suite for interactive hackathon evaluations.

### 🔒 Security Invariants Enforced
- Zero-Plaintext Persistence guarantee across all tiers.
- Advisory-only AI threat telemetry with zero autonomous key release authority.
- Fails closed on any 10-Gate evaluation or dependency failure.

---

[1.0.0]: https://github.com/shlok926/Paradox-Hack-2-Ignite/releases/tag/v1.0.0
