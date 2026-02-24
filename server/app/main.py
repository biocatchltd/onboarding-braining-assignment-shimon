"""Onboarding Assignment - FastAPI main application."""

from contextlib import asynccontextmanager
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

from app.config import settings
from app.models.session import Session
from app.schemas.session import SessionCreate, SessionUpdate, PaginatedSessions
from app.db.mongodb import (
    get_collection,
    seed_sessions_if_empty,
    get_all_sessions,
    get_session as db_get_session,
    create_session as db_create_session,
    update_session as db_update_session,
    delete_session as db_delete_session,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(settings.mongo_uri)
    app.state.mongo_client = client
    collection = get_collection(client)
    app.state.sessions_collection = collection
    await seed_sessions_if_empty(collection)
    yield
    client.close()


app = FastAPI(
    title="Onboarding Assignment",
    description="Initial FastAPI project for onboarding.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_sessions_collection() -> AsyncIOMotorCollection:
    return app.state.sessions_collection


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

# Session CRUD

@app.get("/sessions", response_model=PaginatedSessions)
async def list_sessions(
    include_deleted: bool = False,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    collection: AsyncIOMotorCollection = Depends(get_sessions_collection),
):
    """List sessions with pagination. Default limit 20. By default excludes soft-deleted."""
    sessions, total = await get_all_sessions(
        collection, include_deleted=include_deleted, limit=limit, offset=offset
    )
    return PaginatedSessions(items=sessions, total=total, limit=limit, offset=offset)


@app.get("/sessions/{session_id}", response_model=Session)
async def get_session(
    session_id: UUID,
    collection: AsyncIOMotorCollection = Depends(get_sessions_collection),
):
    """Get a session by ID."""
    s = await db_get_session(collection, str(session_id))
    if s is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return s


@app.post("/sessions", response_model=Session, status_code=201)
async def create_session(
    body: SessionCreate,
    collection: AsyncIOMotorCollection = Depends(get_sessions_collection),
):
    """Create a new session."""
    session = Session(
        id=uuid4(),
        multi_user_id=body.multi_user_id,
        device_type=body.device_type,
        transfer_usd=body.transfer_usd,
        fraud=body.fraud,
        is_deleted=body.is_deleted,
    )
    return await db_create_session(collection, session)


@app.patch("/sessions/{session_id}", response_model=Session)
async def update_session(
    session_id: UUID,
    body: SessionUpdate,
    collection: AsyncIOMotorCollection = Depends(get_sessions_collection),
):
    """Update a session (partial update)."""
    updates = body.model_dump(exclude_unset=True)
    s = await db_update_session(collection, str(session_id), **updates)
    if s is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return s

@app.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: UUID,
    soft: bool = True,
    collection: AsyncIOMotorCollection = Depends(get_sessions_collection),
):
    """Delete a session. Default is soft delete (sets is_deleted=True)."""
    ok = await db_delete_session(collection, str(session_id), soft=soft)
    if not ok:
        raise HTTPException(status_code=404, detail="Session not found")
