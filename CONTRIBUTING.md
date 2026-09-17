# Contributing to VeriQ

Thank you for your interest in contributing to **VeriQ** (*Secure Examination Paper Distribution Using Blockchain*)!

VeriQ is an enterprise security system designed for mission-critical national examination workflows. As such, all contributions must meet strict engineering, cryptographic, testing, and documentation standards.

---

## 🧭 Code of Conduct

All contributors and maintainers are expected to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to `community@veriq.local`.

---

## 🌿 Branching & Git Workflow

We use a modified Git Flow model:
- `main`: Protected branch containing production-grade, audited code and frozen architectural specifications.
- `develop`: Integration branch for active feature development (when enabled).
- `feat/<feature-name>`: New features, endpoints, or UI enhancements.
- `fix/<issue-name>`: Bug fixes and security patches.
- `docs/<doc-name>`: Documentation improvements and specification updates.
- `refactor/<module>`: Non-functional architectural refactorings.

---

## 📝 Commit Message Conventions

We enforce the **Conventional Commits** specification (`v1.0.0`):

```text
<type>(<optional-scope>): <short-imperative-description>

[optional body explaining motivation and architectural context]

[optional footer(s) like Closes #123]
```

### Allowed Types
- `feat`: New feature or user-facing capability.
- `fix`: Bug fix or error correction.
- `docs`: Documentation updates or additions under `docs/` or root Markdown files.
- `style`: Code formatting changes (Prettier, Black, Ruff) that do not affect logic.
- `refactor`: Code refactoring without behavioral modifications.
- `perf`: Performance optimization.
- `test`: Adding or modifying automated test suites (pytest, vitest).
- `sec`: Cryptographic enhancements, policy engine patches, or CVE remediation.
- `chore`: Build tooling, dependency bumps, or repository configuration.

### Examples
```bash
feat(release-engine): implement Gate 4 hardware MAC verification
sec(crypto): enforce 96-bit unique IV generation in AES-GCM envelope
docs(architecture): freeze system architecture specification v1.0.1
fix(auth): handle expired token revocation in Redis blacklist
```

---

## 🛠️ Local Development Setup

### 1. Monorepo Setup
```bash
# Clone the repository
git clone https://github.com/shlok926/Paradox-Hack-2-Ignite.git
cd Paradox-Hack-2-Ignite

# Install all JavaScript/TypeScript dependencies across workspaces
pnpm install
```

### 2. Backend Environment (Python 3.11+)
```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python scripts/seed_data.py
```

### 3. Frontend Environment (React 19 + TypeScript)
```bash
# From workspace root
pnpm --filter @veriq/frontend run dev
```

---

## 🧪 Testing & Verification Requirements

No Pull Request will be merged without passing automated verification suites:

1. **Backend Tests**:
   ```bash
   pnpm run test:backend
   # Or directly inside backend/:
   pytest -v --cov=app
   ```
2. **Frontend Tests & Typechecks**:
   ```bash
   pnpm run test:frontend
   pnpm --filter @veriq/frontend run typecheck
   ```
3. **Security Invariant Verification**:
   - Verify that no plaintext paper content or raw DEKs are persisted.
   - Verify all 10 release gates fail-closed on dependency failure.

---

## 📬 Pull Request (PR) Submission Checklist

Before submitting your PR, verify:
- [ ] Code adheres to project formatting (`black`/`ruff` for Python, `prettier`/`eslint` for TypeScript).
- [ ] All new logic is covered by unit/integration tests in `backend/tests` or `frontend/src/__tests__`.
- [ ] No hardcoded secrets, API keys, or private keys are introduced.
- [ ] Upstream documentation under `docs/` is updated if architectural behaviors change.
- [ ] PR description follows [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md).

Thank you for helping secure national examinations with VeriQ!
