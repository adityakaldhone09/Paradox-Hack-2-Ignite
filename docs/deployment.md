# VeriQ Deployment Guide

This guide follows the repository's current architecture. Validate in staging before production; do not use the local mock chain or development secrets as production configuration.

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env
cd backend && python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 scripts/seed_data.py
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

In another terminal, run `pnpm --filter @veriq/frontend run dev`. The frontend is served at `http://localhost:3000` and the API at `http://localhost:8000`.

## Validation

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm run build:frontend
cd backend && python3 -m pytest -v
```

The backend production command is `uvicorn app.main:app --host 0.0.0.0 --port 8000` without `--reload`.

## Staging

Build and deploy the backend and frontend from the reviewed release commit. Supply staging-only values for `DATABASE_URL`, `STORAGE_DIR` or storage provider, `FRONTEND_URL`, `CORS_ORIGINS`, secrets, and blockchain network. Run database migrations using the repository's migration tooling when present; the current application creates missing SQLAlchemy tables at startup and does not provide a versioned migration command, so production schema changes require an explicit migration plan before release.

Run the smoke matrix in [production-checklist.md](production-checklist.md), including all four roles, paper encryption/hash verification, assignment, device authorization, time-lock, revocation, audit, and blockchain status.

## Production

Use managed PostgreSQL, private encrypted storage, a platform secret manager, HTTPS, and an explicitly selected blockchain network. Configure an unauthenticated health check at `/health` or `/healthz`. Deploy the backend without reload, verify health and logs, then deploy the compatible frontend artifact. Never place database credentials, JWT secrets, encryption keys, service-role keys, or blockchain private keys in the frontend bundle or image.

## Rollback and monitoring

Keep the previous frontend/backend artifacts available. Take and verify a database backup before schema changes. Roll back on authentication or authorization failure, cross-centre access, paper encryption/integrity failure, migration failure, critical API failure, or misleading blockchain status. See [disaster-recovery.md](disaster-recovery.md) for recovery procedures.

Monitor availability, 5xx rate, latency, database/storage failures, authentication failures, denied paper access, hash mismatches, security incidents, and blockchain failures. Request IDs are returned in `X-Request-ID` responses for correlation.

See [environment.md](environment.md) for the variable contract and [deployment-architecture.md](deployment-architecture.md) for the runtime topology.
