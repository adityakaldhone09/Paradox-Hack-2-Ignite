# VeriQ Disaster Recovery

## Recovery objectives

Set and approve RTO/RPO with the hosting and database owners before production. This repository does not claim a recovery objective or retention period without an operating provider.

## Protected assets

- **Database:** enable managed PostgreSQL backups and point-in-time recovery. Test a restore into an isolated database before release.
- **Encrypted papers:** back up the private storage volume/bucket and encryption metadata together. A storage backup without the active key material is not a usable recovery.
- **Configuration:** retain versioned, non-secret configuration and release metadata. Keep secrets in the platform secret manager and maintain an access-controlled rotation/recovery procedure.
- **Blockchain:** treat confirmed external transactions as immutable. Reconcile database transaction records after recovery; pending or failed records must remain visible rather than being marked confirmed.

## Incident procedure

1. Declare the incident and record the release commit, database migration, environment, and request IDs.
2. Stop promotion and disable affected workflows if authorization, paper access, encryption, or integrity checks are suspect.
3. Preserve logs and audit events without copying paper plaintext or secrets.
4. Restore database and storage into an isolated environment, then validate role authorization, paper hashes, release windows, revocation, and audit continuity.
5. Rotate compromised secrets and invalidate affected sessions before resuming traffic.
6. Promote the last verified application artifact or apply a forward-compatible database fix. Do not use destructive database rollback as the default recovery method.
7. Run the staging smoke matrix, then document validation and the decision to resume.

## Rollback triggers

Rollback or traffic isolation is required for broken authentication, authorization bypass, cross-centre access, paper decryption/integrity failure, failed migration, unavailable critical API workflows, or misleading blockchain confirmation states.
