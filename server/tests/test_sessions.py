"""Tests for session CRUD endpoints."""

import pytest
from uuid import uuid4


@pytest.mark.asyncio
async def test_list_sessions_returns_paginated(client):
    """GET /sessions returns paginated list with items and total."""
    response = await client.get("/sessions")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "limit" in data
    assert "offset" in data
    assert isinstance(data["items"], list)
    assert data["limit"] == 20
    assert data["offset"] == 0


@pytest.mark.asyncio
async def test_list_sessions_pagination_params(client):
    """GET /sessions accepts limit and offset query params."""
    response = await client.get("/sessions", params={"limit": 5, "offset": 2})
    assert response.status_code == 200
    data = response.json()
    assert data["limit"] == 5
    assert data["offset"] == 2
    assert len(data["items"]) <= 5


@pytest.mark.asyncio
async def test_list_sessions_excludes_deleted_by_default(client):
    """GET /sessions excludes soft-deleted sessions by default."""
    response = await client.get("/sessions")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["is_deleted"] is False


@pytest.mark.asyncio
async def test_create_session_returns_201(client):
    """POST /sessions creates a session and returns 201."""
    payload = {
        "multi_user_id": str(uuid4()),
        "device_type": "pc",
        "transfer_usd": 99.99,
        "fraud": False,
    }
    response = await client.post("/sessions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["multi_user_id"] == payload["multi_user_id"]
    assert data["device_type"] == payload["device_type"]
    assert data["transfer_usd"] == payload["transfer_usd"]
    assert data["fraud"] == payload["fraud"]
    assert data["is_deleted"] is False


@pytest.mark.asyncio
async def test_create_session_invalid_transfer_usd(client):
    """POST /sessions rejects transfer_usd <= 0."""
    payload = {
        "multi_user_id": str(uuid4()),
        "device_type": "pc",
        "transfer_usd": 0,
        "fraud": False,
    }
    response = await client.post("/sessions", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_session_by_id(client):
    """GET /sessions/{id} returns session when it exists."""
    # Create a session first
    create_payload = {
        "multi_user_id": str(uuid4()),
        "device_type": "android",
        "transfer_usd": 50.0,
        "fraud": True,
    }
    create_resp = await client.post("/sessions", json=create_payload)
    assert create_resp.status_code == 201
    session_id = create_resp.json()["id"]

    response = await client.get(f"/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id
    assert data["device_type"] == "android"
    assert data["fraud"] is True


@pytest.mark.asyncio
async def test_get_session_404_when_not_found(client):
    """GET /sessions/{id} returns 404 for non-existent session."""
    fake_id = str(uuid4())
    response = await client.get(f"/sessions/{fake_id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_session(client):
    """PATCH /sessions/{id} updates session fields."""
    create_payload = {
        "multi_user_id": str(uuid4()),
        "device_type": "pc",
        "transfer_usd": 100.0,
        "fraud": False,
    }
    create_resp = await client.post("/sessions", json=create_payload)
    assert create_resp.status_code == 201
    session_id = create_resp.json()["id"]

    update_payload = {"device_type": "ios", "fraud": True}
    response = await client.patch(f"/sessions/{session_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["device_type"] == "ios"
    assert data["fraud"] is True
    assert data["transfer_usd"] == 100.0  # unchanged


@pytest.mark.asyncio
async def test_update_session_404_when_not_found(client):
    """PATCH /sessions/{id} returns 404 for non-existent session."""
    fake_id = str(uuid4())
    response = await client.patch(
        f"/sessions/{fake_id}",
        json={"device_type": "ios"},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_session_soft(client):
    """DELETE /sessions/{id} soft-deletes by default (sets is_deleted=True)."""
    create_payload = {
        "multi_user_id": str(uuid4()),
        "device_type": "pc",
        "transfer_usd": 25.0,
        "fraud": False,
    }
    create_resp = await client.post("/sessions", json=create_payload)
    assert create_resp.status_code == 201
    session_id = create_resp.json()["id"]

    response = await client.delete(f"/sessions/{session_id}")
    assert response.status_code == 204

    # Session should still exist but be marked deleted
    get_resp = await client.get(f"/sessions/{session_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["is_deleted"] is True

    # Should not appear in default list (excludes deleted)
    list_resp = await client.get("/sessions")
    ids = [s["id"] for s in list_resp.json()["items"]]
    assert session_id not in ids


@pytest.mark.asyncio
async def test_delete_session_404_when_not_found(client):
    """DELETE /sessions/{id} returns 404 for non-existent session."""
    fake_id = str(uuid4())
    response = await client.delete(f"/sessions/{fake_id}")
    assert response.status_code == 404
