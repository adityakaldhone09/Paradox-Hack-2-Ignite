import os
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "VeriQ"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # API & Hosts
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]
    
    # Cryptography & Security
    # 32-byte hex key for AES-256-GCM
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
        return v

    @field_validator("STORAGE_DIR", mode="after")
    @classmethod
    def resolve_storage_dir(cls, v: str) -> str:
        if v.startswith("./"):
            backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            return os.path.abspath(os.path.join(backend_dir, v[2:]))
        return v
    
    # Blockchain Configuration
    BLOCKCHAIN_MODE: str = "mock"
    BLOCKCHAIN_NETWORK: str = "VeriQ-Proof-Ledger-Local"
    BLOCKCHAIN_RPC_URL: str = "http://localhost:8545"
    BLOCKCHAIN_CHAIN_ID: int = 31337
    BLOCKCHAIN_CONTRACT_ADDRESS: str = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

settings = Settings()

os.makedirs(settings.STORAGE_DIR, exist_ok=True)
