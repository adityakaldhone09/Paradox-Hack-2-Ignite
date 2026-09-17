import os
from contextlib import asynccontextmanager
from uuid import uuid4
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from app.core.config import settings
from app.db.session import engine, Base
import app.models # registers models with Base
from app.api.v1.auth import router as auth_router
from app.api.v1.exams import router as exams_router
from app.api.v1.papers import router as papers_router
from app.api.v1.access import router as access_router
from app.api.v1.centres import router as centres_router
from app.api.v1.devices import router as devices_router
from app.api.v1.blockchain import router as blockchain_router
from app.api.v1.security import router as security_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.audit import router as audit_router
from app.api.v1.demo import router as demo_router
from app.api.v1.users import router as users_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure runtime storage directory exists
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    # Initialize DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(
    title=settings.APP_NAME,
    description="VeriQ — Secure Examination Paper Distribution & Blockchain-Backed Chain of Custody (WB-03)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware - strict origins with credentials support and flexible deployment matching
def get_allowed_cors_origins() -> List[str]:
    origins = list(settings.CORS_ORIGINS) if settings.CORS_ORIGINS else []
    if settings.FRONTEND_URL and settings.FRONTEND_URL not in origins:
        origins.append(settings.FRONTEND_URL.rstrip("/"))
    for dev_origin in ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]:
        if dev_origin not in origins:
            origins.append(dev_origin)
    return origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_cors_origins(),
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$|^https://.*\.onrender\.com$|^https://.*\.vercel\.app$|^https://.*\.netlify\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if settings.APP_ENV.lower() in ("production", "prod"):
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Centralized Exception Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation Error", "details": jsonable_encoder(exc.errors())},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "request_id": getattr(request.state, "request_id", None),
        },
    )

# Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(exams_router, prefix="/api/v1")
app.include_router(papers_router, prefix="/api/v1")
app.include_router(access_router, prefix="/api/v1")
app.include_router(centres_router, prefix="/api/v1")
app.include_router(devices_router, prefix="/api/v1")
app.include_router(blockchain_router, prefix="/api/v1")
app.include_router(security_router, prefix="/api/v1")
app.include_router(incidents_router, prefix="/api/v1")
app.include_router(audit_router, prefix="/api/v1")
app.include_router(demo_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")

@app.get("/api/v1/healthz")
async def health_check():
    return {
        "status": "ok",
        "service": "VeriQ-Core-API",
        "version": "1.0.0",
        "security_pipeline": "AES-256-GCM + SHA-256 + Blockchain-Anchored"
    }

@app.get("/health")
@app.get("/api/v1/health")
async def health_root():
    return {"status": "ok", "service": "VeriQ"}

@app.get("/health/database")
@app.get("/api/v1/health/database")
async def health_database():
    try:
        from app.db.session import engine
        from sqlalchemy import text
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "unavailable"}

@app.get("/health/blockchain")
@app.get("/api/v1/health/blockchain")
async def health_blockchain():
    from app.services.blockchain_service import blockchain_service
    status = await blockchain_service.get_network_status()
    return {"status": "ok", "blockchain": status["network"], "mode": settings.BLOCKCHAIN_MODE}

@app.get("/health/storage")
@app.get("/api/v1/health/storage")
async def health_storage():
    import os
    from app.core.config import settings
    exists = os.path.isdir(settings.STORAGE_DIR)
    count = len([f for f in os.listdir(settings.STORAGE_DIR) if f.endswith('.enc')]) if exists else 0
    return {"status": "ok" if exists else "warning", "encrypted_files": count}

@app.get("/")
async def root():
    return {
        "name": "VeriQ API Platform",
        "tagline": "Secure Every Question Paper. Verify Every Action.",
        "docs_url": "/docs"
    }
