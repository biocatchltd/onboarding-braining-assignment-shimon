from pydantic import BaseModel, Field
from app.models.device import Device
from uuid import UUID


class Session(BaseModel):
    id: UUID
    multi_user_id: UUID
    device_type: Device
    transfer_usd: float = Field(gt=0.0)
    fraud: bool = Field(default=False)
    is_deleted: bool = Field(default=False)
