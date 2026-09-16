## 📋 Pull Request Summary

### 🎯 Motivation & Description
<!-- Provide a concise description of the motivation for this change and what problem it solves. -->

### 🏷️ PR Type
- [ ] 🚀 Feature (`feat`)
- [ ] 🐛 Bug Fix (`fix`)
- [ ] 🛡️ Security / Cryptography (`sec`)
- [ ] 📚 Documentation (`docs`)
- [ ] 🧪 Testing / Quality Assurance (`test`)
- [ ] ⚙️ Performance Optimization (`perf`)
- [ ] 🔧 Refactoring / Cleanup (`refactor`)
- [ ] 📦 Build / Tooling / Dependencies (`chore`)

---

## 🔒 Security & Invariant Checklist

Please check all that apply:
- [ ] **Zero-Plaintext Invariant**: Confirmed no raw question paper plaintext or DEK keys are written to disk, database, logs, or blockchain.
- [ ] **10-Gate Engine**: Verified any release gate logic changes fail closed on error.
- [ ] **No Secret Leaks**: Verified no hardcoded tokens, API keys, private keys, or credentials are present.
- [ ] **RBAC & Center Scope**: Verified proper authorization and center isolation are maintained.

---

## 🧪 Verification & Testing Evidence

### Automated Tests Run
- [ ] Backend tests passing (`pnpm run test:backend` or `pytest`)
- [ ] Frontend tests passing (`pnpm run test:frontend`)
- [ ] Type checks passing (`pnpm --filter @veriq/frontend run typecheck`)

### Test Output / Evidence
```text
<!-- Paste terminal test output or attach test screenshots here -->
```

---

## 📖 Documentation Impact
- [ ] Relevant documentation under `docs/` or root Markdown updated.
- [ ] Swagger API contracts updated if endpoints changed.

---

**Closes Issue / References**: `#`
