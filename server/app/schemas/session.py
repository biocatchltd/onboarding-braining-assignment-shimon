from uuid import UUID
from pydantic import BaseModel, Field, model_validator

from app.models.device import Device
from app.models.session import Session


class PaginatedSessions(BaseModel):
    """Paginated list of sessions with metadata."""

    items: list[Session]
    total: int
    limit: int
    offset: int


class SessionCreate(BaseModel):
    multi_user_id: UUID
    device_type: Device
    transfer_usd: float = Field(gt=0.0)
    fraud: bool = False
    is_deleted: bool = False


class SessionUpdate(BaseModel):
    multi_user_id: UUID | None = None
    device_type: Device | None = None
    transfer_usd: float | None = None
    fraud: bool | None = None
    is_deleted: bool | None = None

    @model_validator(mode="after")
    def transfer_usd_positive(self):
        if self.transfer_usd is not None and self.transfer_usd <= 0:
            raise ValueError("transfer_usd must be greater than 0")
        return self
