# VeriQ Security Policy & Vulnerability Disclosure

**VeriQ** is an enterprise-grade cryptographic distribution platform designed for high-stakes national examinations. Maintaining the confidentiality, integrity, and non-repudiation of examination papers is our highest priority.

This document outlines our security policies, vulnerability reporting procedures, response service-level agreements (SLAs), and responsible disclosure practices.

---

## 🔒 Supported Versions

Only the current major version of VeriQ receives active security updates and cryptographic patches:

| Version | Supported | Status |
|:---|:---:|:---|
| `v1.0.x` | ✅ Yes | Current Active Architecture & Baseline |
| `< v1.0.0` | ❌ No | Deprecated Pre-release Prototypes |

---

## 🛡️ Scope of Security Assessment

### In-Scope Vulnerabilities
- **Cryptographic Envelope Flaws**: Key generation weakness, IV reuse, improper AEAD tag validation, or insecure DEK unwrap.
- **10-Gate Release Engine Bypasses**: Logic flaws that permit decryption key retrieval outside permitted time windows, unauthorized centers, or unregistered hardware devices.
- **Authentication & RBAC Escalation**: JWT forging, signature bypass, role confusion, center scope bypass.
- **Smart Contract & Integrity Exploits**: On-chain hash registry manipulation, replay attacks, or unauthorized multi-sig publishing in `VeriQLedger.sol`.
- **Zero-Plaintext Invariant Violations**: Exposure of unencrypted question paper contents or plaintext DEKs in persistent storage, logs, telemetry, or cache.
- **Remote Code Execution (RCE) / Injection**: SQL injection, command injection, path traversal in paper ingestion pipelines.

### Out-of-Scope Issues
- Theoretical attacks without practical proof-of-concept.
- Physical theft of developer hardware without software bypass.
- Rate-limiting or DoS attacks against staging/local demo instances without amplification impact.
- Social engineering attacks against simulated hackathon demo personas.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or cryptographic flaw in VeriQ, **please DO NOT file a public GitHub issue**.

### Reporting Channel
- **Email**: `security@veriq.local` (or submit a private security advisory via GitHub Security Advisories)
- **Subject**: `[SECURITY VULNERABILITY] <Component/Subsystem> - <Brief Description>`

### Report Checklist
Please include the following details to expedite triage:
1. **Summary**: Concise description of the vulnerability and its potential impact.
2. **Component Affected**: Core API, 10-Gate Engine, Smart Contract, Key Management (KMS), Frontend Client, etc.
3. **Step-by-Step Reproduction**: Detailed steps or minimal proof-of-concept (PoC) script.
4. **Impact Assessment**: Evaluation against confidentiality, integrity, or time-lock enforcement.
5. **Remediation Suggestion**: Recommended patch or architectural fix (if available).

---

## ⏱️ Response & Triage SLAs

We adhere to the following response timeline for reported vulnerabilities:

| Severity | Initial Response | Triage & Assessment | Patch Release SLA |
|:---|:---:|:---:|:---:|
| **CRITICAL** (e.g., Key exposure, Gate bypass, RCE) | `< 12 hours` | `< 24 hours` | `< 48 hours` |
| **HIGH** (e.g., Scope escalation, Nonce reuse) | `< 24 hours` | `< 48 hours` | `< 5 business days` |
| **MEDIUM** (e.g., Advisory telemetry spoofing) | `< 48 hours` | `< 5 business days` | `< 10 business days` |
| **LOW** (e.g., Informational / Non-exploitable header) | `< 72 hours` | `< 10 business days` | Next release cycle |

---

## 🤝 Responsible Disclosure & Bug Bounty Terms

- We request a minimum **90-day embargo period** from the initial triage before public disclosure, allowing sufficient time for verification and patch deployment.
- Security researchers who discover and responsibly report verified vulnerabilities will be credited in our [CHANGELOG.md](CHANGELOG.md) and security acknowledgments.
- We will not pursue legal action against researchers who adhere in good faith to this Responsible Disclosure Policy.

---

## 📜 Architectural Invariants Reference

For deep technical context regarding our security architecture, threat model (STRIDE), and cryptographic invariants, please consult:
- [`docs/11_SECURITY_ARCHITECTURE.md`](docs/11_SECURITY_ARCHITECTURE.md)
- [`docs/06_TECHNICAL_REQUIREMENTS.md`](docs/06_TECHNICAL_REQUIREMENTS.md)
- [`docs/07_SYSTEM_ARCHITECTURE.md`](docs/07_SYSTEM_ARCHITECTURE.md)
