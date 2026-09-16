# VeriQ Deployment & Operations Guide

**Secure Every Question Paper. Verify Every Action.**
Problem Statement: **WB-03 — Secure Examination Paper Distribution Using Blockchain**

---

## 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x`
- **pnpm**: `v10.x` or `v11.x`
- **Python**: `3.11+` (developed & tested on Python `3.13`)
- **Docker & Docker Compose** (Optional for containerized setup)

---

## 2. Quickstart: Local Native Running

### Backend Setup
1. Open a terminal in `backend/`:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Seed the database with realistic examinations, centres, question papers, and blockchain blocks:
   ```bash
   python scripts/seed_data.py
   ```
3. Run the backend development server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   API Docs will be accessible at: `http://localhost:8000/docs`.

### Frontend Setup
1. In the repository root, install dependencies:
   ```bash
   pnpm install
   ```
2. Start the Vite development server:
   ```bash
   pnpm --filter @veriq/frontend run dev
   ```
   The application dashboard will be live at: `http://localhost:3000`.

---

## 3. Containerized Deployment with Docker Compose

VeriQ includes a production-ready `docker-compose.yml` orchestrating:
- `backend`: FastAPI server running Uvicorn workers
- `frontend`: High-performance Nginx web server serving Vite SPA
- `db`: PostgreSQL 16 database instance
- `storage`: Persistent Docker volume mounting `/storage/encrypted_papers/`

To launch:
```bash
docker compose up --build -d
```
Stop containers:
```bash
docker compose down
```

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env` in the project root:
```ini
# Application
PROJECT_NAME="VeriQ"
ENVIRONMENT="development"
DEBUG=True
API_V1_STR="/api/v1"

# Security
SECRET_KEY="super-secret-hex-encoded-production-key"
ACCESS_TOKEN_EXPIRE_MINUTES=480
AES_MASTER_KEY_HEX="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Storage
ENCRYPTED_STORAGE_PATH="./storage/encrypted_papers"

# Database
DATABASE_URL="sqlite+aiosqlite:///./veriq.db"
```
