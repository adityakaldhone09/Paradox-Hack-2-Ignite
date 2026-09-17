from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
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

@asynccontextmanager
async def lifespan(app: FastAPI):
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

# CORS Middleware - strict origins with credentials support
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Centralized Exception Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation Error", "details": exc.errors()},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal Server Error", "message": str(exc)},
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

@app.get("/api/v1/healthz")
async def health_check():
    return {
        "status": "ok",
        "service": "VeriQ-Core-API",
        "version": "1.0.0",
        "security_pipeline": "AES-256-GCM + SHA-256 + Blockchain-Anchored"
    }

@app.get("/")
async def root():
    return {
        "name": "VeriQ API Platform",
        "tagline": "Secure Every Question Paper. Verify Every Action.",
        "docs_url": "/docs"
    }
