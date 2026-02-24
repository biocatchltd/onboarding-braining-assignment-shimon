"""Pytest configuration and fixtures for API tests."""

import os

# Use test database before any app imports
os.environ.setdefault("MONGO_DB_NAME", "onboarding_test")

import pytest
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    """Async HTTP client for testing the FastAPI app. Runs lifespan so MongoDB is connected."""
    async with LifespanManager(app):
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as ac:
            yield ac
