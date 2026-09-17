from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy import event
from app.core.config import settings

engine_kwargs = {}
if "sqlite" in settings.DATABASE_URL:
    from sqlalchemy.pool import AsyncAdaptedQueuePool
    engine_kwargs = {
        "poolclass": AsyncAdaptedQueuePool,
        "pool_size": 20,
        "max_overflow": 30,
        "pool_timeout": 30,
        "connect_args": {"timeout": 30}
    }
else:
    connect_args = {"statement_cache_size": 0}
    if any(k in settings.DATABASE_URL for k in ("supabase.com", "sslmode=require", "ssl=require", "pooler", "rds.amazonaws.com")):
        connect_args["ssl"] = "require"
    engine_kwargs = {
        "connect_args": connect_args
    }

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    **engine_kwargs
)

@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if "sqlite" in settings.DATABASE_URL:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA cache_size=-64000")
        cursor.execute("PRAGMA busy_timeout=10000")
        cursor.execute("PRAGMA temp_store=MEMORY")
        cursor.close()

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

