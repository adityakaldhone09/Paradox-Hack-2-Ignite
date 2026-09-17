import os
from typing import List, Set
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env from the project root (3 levels up: core → app → backend → project_root)
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_ENV_FILE = os.path.join(_PROJECT_ROOT, ".env")

INSECURE_DEFAULT_JWT_SECRETS: Set[str] = {
    "veriq_super_secret_jwt_key_hackathon_demo_2026_secure",
    "veriq_super_secret_refresh_jwt_key_hackathon_demo_2026",
    "secret",
    "jwt_secret",
    "change_me",
    "password",
    "admin",
}

INSECURE_DEFAULT_ENCRYPTION_KEYS: Set[str] = {
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "0000000000000000000000000000000000000000000000000000000000000000",
    "1111111111111111111111111111111111111111111111111111111111111111",
}

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=_ENV_FILE, extra="ignore")

    APP_NAME: str = "VeriQ"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # API & Hosts
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]
    
    # Cryptography & Security (Defaults provided for development/demo ease, strictly validated in production)
    ENCRYPTION_KEY: str = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    JWT_SECRET: str = "veriq_super_secret_jwt_key_hackathon_demo_2026_secure"
    JWT_REFRESH_SECRET: str = "veriq_super_secret_refresh_jwt_key_hackathon_demo_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./veriq.db"
    
    # Storage
    STORAGE_DIR: str = "./storage/encrypted_papers"
    
    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def resolve_db_url(cls, v: str) -> str:
        if v.startswith("sqlite+aiosqlite:///./"):
            backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            db_name = v.replace("sqlite+aiosqlite:///./", "")
            return f"sqlite+aiosqlite:///{os.path.join(backend_dir, db_name)}"
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        return v

    @field_validator("STORAGE_DIR", mode="after")
    @classmethod
    def resolve_storage_dir(cls, v: str) -> str:
        if v.startswith("./"):
            backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            return os.path.abspath(os.path.join(backend_dir, v[2:]))
        return v

    @model_validator(mode="after")
    def validate_security_credentials(self) -> "Settings":
        is_prod = self.APP_ENV.lower() in ("production", "prod")

        # Validate ENCRYPTION_KEY format in all environments if set
        if self.ENCRYPTION_KEY:
            try:
                key_bytes = bytes.fromhex(self.ENCRYPTION_KEY)
                if len(key_bytes) != 32:
                    raise ValueError("ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters) for AES-256")
            except Exception as e:
                raise ValueError(f"Invalid ENCRYPTION_KEY format: {e}")

        if is_prod:
            # 1. JWT_SECRET enforcement
            if not self.JWT_SECRET or not self.JWT_SECRET.strip():
                raise ValueError("JWT_SECRET must be explicitly configured in production environment")
            if self.JWT_SECRET in INSECURE_DEFAULT_JWT_SECRETS or len(self.JWT_SECRET) < 32:
                raise ValueError("Insecure or insufficient JWT_SECRET provided for production (must be at least 32 chars and not a known default)")

            # 2. JWT_REFRESH_SECRET enforcement
            if not self.JWT_REFRESH_SECRET or not self.JWT_REFRESH_SECRET.strip():
                raise ValueError("JWT_REFRESH_SECRET must be explicitly configured in production environment")
            if self.JWT_REFRESH_SECRET in INSECURE_DEFAULT_JWT_SECRETS or len(self.JWT_REFRESH_SECRET) < 32:
                raise ValueError("Insecure or insufficient JWT_REFRESH_SECRET provided for production (must be at least 32 chars and not a known default)")

            # 3. ENCRYPTION_KEY enforcement
            if not self.ENCRYPTION_KEY or not self.ENCRYPTION_KEY.strip():
                raise ValueError("ENCRYPTION_KEY must be explicitly configured in production environment")
            if self.ENCRYPTION_KEY.lower() in INSECURE_DEFAULT_ENCRYPTION_KEYS:
                raise ValueError("Insecure demo ENCRYPTION_KEY cannot be used in production environment")

        return self
    
    # Blockchain Configuration
    BLOCKCHAIN_MODE: str = "mock"
    BLOCKCHAIN_NETWORK: str = "VeriQ-Proof-Ledger-Local"
    BLOCKCHAIN_RPC_URL: str = "http://localhost:8545"
    BLOCKCHAIN_CHAIN_ID: int = 31337
    BLOCKCHAIN_CONTRACT_ADDRESS: str = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

settings = Settings()

os.makedirs(settings.STORAGE_DIR, exist_ok=True)
