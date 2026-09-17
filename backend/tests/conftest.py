import os
import pytest
from app.db.session import engine
from scripts.seed_data import seed

@pytest.fixture(autouse=True, scope="session")
async def initialize_test_database():
    """Ensure database schema is created and test seed data is present in clean CI runs."""
    await seed()
    yield
    await engine.dispose()

