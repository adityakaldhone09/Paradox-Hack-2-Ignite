import os
import pytest
from app.db.session import engine, Base
from app.core.config import settings

@pytest.fixture(autouse=True, scope="session")
async def initialize_test_database():
    """Ensure database schema is created and test seed data is present in clean CI runs."""
    if "sqlite" in settings.DATABASE_URL:
        from scripts.seed_data import seed
        await seed()
    else:
        # In remote postgres, ensure tables exist safely without dropping live database
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()
