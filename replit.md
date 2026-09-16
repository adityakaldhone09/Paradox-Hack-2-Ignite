# ExamChain

ExamChain is a secure examination paper chain-of-custody platform for controlled release, integrity verification, centre authorization, and blockchain-backed auditability.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/examchain/src/` — React command center, routes, and reusable security UI
- `artifacts/api-server/src/routes/examchain-data.ts` — API-backed demo data and contract handlers
- `lib/api-spec/openapi.yaml` — source of truth for ExamChain API contracts
- `lib/api-client-react/src/generated/` — generated React Query client
- `lib/api-zod/src/generated/` — generated request/response validation

## Architecture decisions

- The first build is contract-first: the OpenAPI spec generates both client hooks and server validation schemas.
- The API uses realistic in-memory demo records so the security workflows are usable immediately while storage and blockchain providers remain replaceable.
- Sensitive paper bytes are intentionally not represented in the UI or API; the product surface exposes hashes, encryption state, release policy, custody events, and audit metadata.
- The frontend is a route-driven command center with real API-backed queries and mutations, not a static dashboard mockup.

## Product

- Secure gateway and operator workspace
- Dashboard KPIs, activity feed, access telemetry, and blockchain health
- Examination, paper, centre, and incident management
- Paper integrity verification and chain-of-custody timeline
- Blockchain transaction explorer
- Auditor-facing paper verification flow
- Settings and security posture surface

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- The web preview is served at the root artifact path; API calls use the shared `/api` route.
- The generated React client requires `dom.iterable` in its TypeScript library configuration for `Headers.entries()`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
