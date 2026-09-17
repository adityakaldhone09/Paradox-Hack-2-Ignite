# VeriQ Production Checklist

Use this checklist for every release. Mark an item complete only with evidence from the target environment.

## Environment and secrets

- [ ] Separate staging and production database, storage, auth, and blockchain resources.
- [ ] `APP_ENV=production`, `DEBUG=false`, explicit HTTPS `FRONTEND_URL`, and explicit `CORS_ORIGINS`.
- [ ] JWT access/refresh secrets and the 32-byte encryption key come from the platform secret manager.
- [ ] No `.env` files, private keys, service-role keys, paper plaintext, or generated build output are committed.

## Build and release

- [ ] `pnpm install --frozen-lockfile` passes.
- [ ] `pnpm run build:frontend` passes.
- [ ] `python3 -m pytest -v` passes from `backend/`.
- [ ] Backend runs without `--reload`; frontend artifact is built once and promoted.
- [ ] Release commit, build timestamp, migration version, and blockchain network are recorded.

## Security and data

- [ ] HTTPS, secure transport, security headers, and restricted CORS verified in staging.
- [ ] Login, logout, refresh, expiry, reset, role redirects, and unauthorized routes verified.
- [ ] Only `SUPER_ADMIN`, `PAPER_SETTER`, `CENTRE_ADMIN`, and `INVIGILATOR` are production roles.
- [ ] Centre, device, assignment, release-window, revocation, and tenant boundaries are tested server-side.
- [ ] Paper upload validates authentication, authorization, size/type, encryption, and SHA-256 integrity.
- [ ] Storage is private; downloads require authorization and do not expose permanent public URLs.
- [ ] Error responses do not expose stack traces, paths, SQL details, secrets, or paper content.

## Dependencies and operations

- [ ] Database migration is backward-compatible, tested in staging, and covered by a verified backup.
- [ ] Storage backup, database restore, secret recovery, and blockchain reconciliation procedures are tested.
- [ ] Liveness/readiness checks, request IDs, structured logs, alerts, and retention are configured.
- [ ] Rate limits and abuse controls protect authentication, uploads, paper access, verification, and admin routes.
- [ ] Dependency and secret scans reviewed; critical findings resolved or explicitly accepted.

## Smoke matrix

| Area | Expected result |
|---|---|
| Login/logout | Session is issued and cleared correctly |
| RBAC | Wrong role is denied |
| Paper upload | Authenticated authorized upload is encrypted |
| Hash verification | Untampered paper matches; tampered copy fails |
| Assignment | Only assigned centre sees the paper |
| Device | Unauthorized device is denied |
| Time lock | Before/after window denied; active window allowed |
| Revocation | Revoked paper is denied |
| Storage | Direct public access is denied |
| Blockchain | `PENDING`, `CONFIRMED`, and `FAILED` are truthful |
| Audit | Paper history is complete and paginated |

## Go / no-go

**GO** only when all critical security and workflow checks pass in staging and production smoke tests pass.

**NO-GO** for authentication, authorization, centre/device isolation, paper encryption, time-lock, revocation, hash verification, private storage, database integrity, or critical API failures.
