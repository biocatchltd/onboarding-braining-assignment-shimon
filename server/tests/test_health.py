"""Tests for the health check endpoint."""

import pytest


@pytest.mark.asyncio
async def test_health_returns_ok(client):
    """Health endpoint should return healthy status."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
