# VeriQ Database Schema & Entity Relationships

**Secure Every Question Paper. Verify Every Action.**
Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

---

## 1. Schema Architecture Overview

VeriQ uses an asynchronous SQLAlchemy 2.0 ORM layer supporting both SQLite (`sqlite+aiosqlite`) for local zero-dependency operation and PostgreSQL (`postgresql+asyncpg`) for enterprise production deployments.

### Entity Relationship Diagram
```
  ┌─────────────────┐           ┌──────────────────────┐
  │   examinations  │◄──────────┤        papers        │
  └─────────────────┘           └──────────┬───────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
  ┌─────────────────┴─────┐      ┌─────────┴─────────┐    ┌───────┴──────────────┐
  │paper_centre_assignment│      │   access_events   │    │      incidents       │
  └─────────┬─────────────┘      └─────────┬─────────┘    └───────┬──────────────┘
            │                              │                      │
            ▼                              │                      │
  ┌─────────────────┐                      │                      │
  │     centres     │◄─────────────────────┼──────────────────────┘
  └─────────┬───────┘                      │
            │                              │
            ▼                              │
  ┌─────────────────┐                      │
  │authorized_devices│◄────────────────────┘
  └─────────────────┘
```

---

## 2. Table Definitions

### `users`
- `id` (VARCHAR(36), PK): UUID
- `email` (VARCHAR(255), UNIQUE, INDEX)
- `full_name` (VARCHAR(255))
- `hashed_password` (VARCHAR(255))
- `role` (ENUM: `CENTRAL_AUTHORITY`, `EXAM_CONTROLLER`, `CENTRE_SUPERINTENDENT`, `PROCTOR`, `AUDITOR`, `SECURITY_OPS`)
- `centre_id` (VARCHAR(36), FK -> `centres.id`, NULLABLE)
- `public_key` (TEXT)
- `is_active` (BOOLEAN, default True)

### `examinations`
- `id` (VARCHAR(36), PK)
- `code` (VARCHAR(64), UNIQUE, INDEX)
- `title` (VARCHAR(255))
- `start_time` (DATETIME)
- `end_time` (DATETIME)
- `early_access_window_minutes` (INTEGER, default 30)
- `status` (VARCHAR(32), default 'SCHEDULED')

### `papers`
- `id` (VARCHAR(36), PK)
- `examination_id` (VARCHAR(36), FK -> `examinations.id`)
- `code` (VARCHAR(64), UNIQUE, INDEX)
- `title` (VARCHAR(255))
- `subject` (VARCHAR(128))
- `file_hash` (VARCHAR(64), INDEX) - Original plaintext SHA-256
- `encrypted_hash` (VARCHAR(64)) - Ciphertext SHA-256
- `storage_path` (VARCHAR(512))
- `encryption_algorithm` (VARCHAR(32), 'AES-256-GCM')
- `iv_hex` (VARCHAR(32))
- `auth_tag_hex` (VARCHAR(32))
- `digital_signature` (TEXT)
- `status` (ENUM: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `SCHEDULED`, `RELEASED`, `ARCHIVED`, `REVOKED`)
- `blockchain_tx_hash` (VARCHAR(66))
- `blockchain_block_number` (INTEGER)

### `centres`
- `id` (VARCHAR(36), PK)
- `code` (VARCHAR(64), UNIQUE, INDEX)
- `name` (VARCHAR(255))
- `city` (VARCHAR(128))
- `state` (VARCHAR(128))
- `ip_whitelist` (TEXT) - Comma-separated CIDRs or IPs
- `is_active` (BOOLEAN, default True)

### `authorized_devices`
- `id` (VARCHAR(36), PK)
- `centre_id` (VARCHAR(36), FK -> `centres.id`)
- `device_name` (VARCHAR(128))
- `device_fingerprint` (VARCHAR(64), UNIQUE, INDEX) - SHA-256 of hardware UUID + MAC
- `ip_address` (VARCHAR(45))
- `status` (ENUM: `ACTIVE`, `PENDING`, `REVOKED`)

### `access_events`
- `id` (VARCHAR(36), PK)
- `paper_id` (VARCHAR(36), FK -> `papers.id`)
- `centre_id` (VARCHAR(36), FK -> `centres.id`)
- `device_id` (VARCHAR(36), FK -> `authorized_devices.id`)
- `user_id` (VARCHAR(36), FK -> `users.id`)
- `access_type` (ENUM: `EVALUATE`, `DECRYPT_REQUEST`, `TAMPER_TEST`, `DOWNLOAD`)
- `decision` (ENUM: `ALLOW`, `DENY`)
- `reason` (VARCHAR(255))
- `ip_address` (VARCHAR(45))
- `blockchain_tx_hash` (VARCHAR(66))
- `timestamp` (DATETIME)

### `blockchain_transactions`
- `id` (VARCHAR(36), PK)
- `tx_hash` (VARCHAR(66), UNIQUE, INDEX)
- `block_number` (INTEGER, INDEX)
- `block_hash` (VARCHAR(66))
- `action` (VARCHAR(64))
- `paper_id` (VARCHAR(36), NULLABLE)
- `signer` (VARCHAR(128))
- `payload` (JSON)
- `timestamp` (DATETIME)

### `incidents`
- `id` (VARCHAR(36), PK)
- `incident_type` (VARCHAR(64))
- `severity` (ENUM: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- `paper_id` (VARCHAR(36), NULLABLE)
- `centre_id` (VARCHAR(36), NULLABLE)
- `description` (TEXT)
- `blockchain_tx_hash` (VARCHAR(66))
- `status` (ENUM: `OPEN`, `INVESTIGATING`, `RESOLVED`, `FALSE_POSITIVE`)
