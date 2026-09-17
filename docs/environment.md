# VeriQ Environment Contract

Use one isolated environment per deployment: `development`, `staging`, and `production`. Never point staging at production database, storage, authentication, or blockchain resources.

## Required backend values

| Variable | Scope | Required | Notes |
|---|---|---:|---|
| `APP_ENV` | backend | yes | `development`, `staging`, or `production` |
| `DATABASE_URL` | backend secret | yes | PostgreSQL with `postgresql+asyncpg://` in deployed environments |
| `JWT_SECRET` | backend secret | yes | At least 32 unpredictable characters in production |
| `JWT_REFRESH_SECRET` | backend secret | yes | Separate unpredictable secret in production |
| `ENCRYPTION_KEY` | backend secret | yes | Exactly 32 bytes encoded as 64 hexadecimal characters |
| `FRONTEND_URL` | backend | yes | Canonical frontend origin |
| `CORS_ORIGINS` | backend | yes for deployed environments | JSON list of explicit HTTPS origins; never `*` |
| `STORAGE_DIR` | backend | yes | Mounted private storage path or provider-backed adapter |
| `BLOCKCHAIN_MODE` | backend | yes | Must identify mock, staging, or production behavior explicitly |
| `BLOCKCHAIN_NETWORK` | backend | yes | Network name used for status and audit context |
| `BLOCKCHAIN_RPC_URL` | backend secret/config | when applicable | Never expose signing credentials to the frontend |
| `BLOCKCHAIN_CONTRACT_ADDRESS` | backend config | when applicable | Verify against the selected network |

`REDIS_URL`, AI settings, and provider-specific values are optional only when the selected deployment does not use those services. The checked-in `.env.example` contains development placeholders only. Use the platform secret manager for real values; do not commit `.env.production`.

## Public frontend values

Only intentionally public `VITE_*` values may be compiled into the browser bundle. This repository currently resolves its API base URL from the browser location in production and uses a Vite development proxy locally. Review every new frontend variable before adding it.

## Startup validation

Production startup already rejects missing or known-insecure JWT and encryption defaults. A deployment is incomplete until the platform also supplies the database, explicit frontend origin, private storage, and intended blockchain configuration.
