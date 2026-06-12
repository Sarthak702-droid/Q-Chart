from fastapi import APIRouter
from pydantic import BaseModel

from app.models.entities import Platform

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


class IncomingMessageBody(BaseModel):
    platform: Platform
    external_contact_id: str
    message: str
    platform_message_id: str | None = None


@router.post("/{platform}/message")
def receive_message(platform: Platform, body: IncomingMessageBody) -> dict[str, str]:
    return {
        "status": "accepted",
        "platform": platform.value,
        "message": body.message
    }
