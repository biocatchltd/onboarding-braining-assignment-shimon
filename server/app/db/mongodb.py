"""MongoDB connection and session collection access."""

from uuid import UUID, uuid4

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

from app.config import settings
from app.models.session import Session
from app.models.device import Device
from app.schemas.session import SessionUpdate

COLLECTION_SESSIONS = "sessions"


def _session_to_doc(s: Session) -> dict:
    return {
        "_id": str(s.id),
        "multi_user_id": str(s.multi_user_id),
        "device_type": s.device_type.value,
        "transfer_usd": s.transfer_usd,
        "fraud": s.fraud,
        "is_deleted": s.is_deleted,
    }


def _doc_to_session(doc: dict) -> Session:
    return Session(
        id=UUID(doc["_id"]),
        multi_user_id=UUID(doc["multi_user_id"]),
        device_type=Device(doc["device_type"]),
        transfer_usd=doc["transfer_usd"],
        fraud=doc["fraud"],
        is_deleted=doc["is_deleted"],
    )


def get_collection(client: AsyncIOMotorClient) -> AsyncIOMotorCollection:
    return client[settings.mongo_db_name][COLLECTION_SESSIONS]


async def seed_sessions_if_empty(collection: AsyncIOMotorCollection) -> None:
    if await collection.estimated_document_count() > 0:
        return
    ids = [uuid4() for _ in range(5)]
    user_ids = [uuid4() for _ in range(3)]
    mock = [
        Session(
            id=ids[0],
            multi_user_id=user_ids[0],
            device_type=Device.PC,
            transfer_usd=150.50,
            fraud=False,
            is_deleted=False,
        ),
        Session(
            id=ids[1],
            multi_user_id=user_ids[0],
            device_type=Device.IOS,
            transfer_usd=25.00,
            fraud=False,
            is_deleted=False,
        ),
        Session(
            id=ids[2],
            multi_user_id=user_ids[1],
            device_type=Device.ANDROID,
            transfer_usd=1200.00,
            fraud=True,
            is_deleted=False,
        ),
        Session(
            id=ids[3],
            multi_user_id=user_ids[2],
            device_type=Device.PC,
            transfer_usd=99.99,
            fraud=False,
            is_deleted=True,
        ),
        Session(
            id=ids[4],
            multi_user_id=user_ids[1],
            device_type=Device.IOS,
            transfer_usd=5.50,
            fraud=False,
            is_deleted=False,
        ),
    ]
    await collection.insert_many(_session_to_doc(s) for s in mock)


# CRUD helpers (take collection as argument so main.py can pass it via dependency)

async def get_all_sessions(
    collection: AsyncIOMotorCollection,
    include_deleted: bool = False,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[Session], int]:
    """Return (sessions page, total count) for the given filter and pagination."""
    q = {} if include_deleted else {"is_deleted": False}
    total = await collection.count_documents(q)
    cursor = collection.find(q).skip(offset).limit(limit)
    sessions = [_doc_to_session(doc) async for doc in cursor]
    return sessions, total


async def get_session(collection: AsyncIOMotorCollection, session_id: str) -> Session | None:
    doc = await collection.find_one({"_id": session_id})
    return _doc_to_session(doc) if doc else None


async def create_session(collection: AsyncIOMotorCollection, session: Session) -> Session:
    await collection.insert_one(_session_to_doc(session))
    return session


async def update_session(
    collection: AsyncIOMotorCollection, session_id: str, **kwargs: SessionUpdate
) -> Session | None:
    doc = await collection.find_one({"_id": session_id})
    if doc is None:
        return None
    update: dict = {}
    if "multi_user_id" in kwargs and kwargs["multi_user_id"] is not None:
        update["multi_user_id"] = str(kwargs["multi_user_id"])
    if "device_type" in kwargs and kwargs["device_type"] is not None:
        update["device_type"] = kwargs["device_type"].value
    if "transfer_usd" in kwargs and kwargs["transfer_usd"] is not None:
        update["transfer_usd"] = kwargs["transfer_usd"]
    if "fraud" in kwargs and kwargs["fraud"] is not None:
        update["fraud"] = kwargs["fraud"]
    if "is_deleted" in kwargs and kwargs["is_deleted"] is not None:
        update["is_deleted"] = kwargs["is_deleted"]
    if not update:
        return _doc_to_session(doc)
    await collection.update_one({"_id": session_id}, {"$set": update})
    updated = await collection.find_one({"_id": session_id})
    return _doc_to_session(updated) if updated else None


async def delete_session(
    collection: AsyncIOMotorCollection, session_id: str, soft: bool = True
) -> bool:
    doc = await collection.find_one({"_id": session_id})
    if doc is None:
        return False
    if soft:
        await collection.update_one({"_id": session_id}, {"$set": {"is_deleted": True}})
    else:
        await collection.delete_one({"_id": session_id})
    return True
