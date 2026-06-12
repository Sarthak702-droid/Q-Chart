from fastapi import APIRouter
from pydantic import BaseModel

from app.models.entities import Platform

router = APIRouter(prefix="/integrations", tags=["integrations"])


class ConnectAccountBody(BaseModel):
    platform: Platform
    account_id: str


@router.get("/platforms")
def list_platforms() -> dict[str, list[str]]:
    return {
        "platforms": [
            Platform.whatsapp.value,
            Platform.instagram.value,
            Platform.facebook.value,
            Platform.telegram.value,
            Platform.email.value,
            Platform.livechat.value
        ]
    }


@router.post("/connect")
def connect_account(body: ConnectAccountBody) -> dict[str, str]:
    return {
        "status": "connected",
        "platform": body.platform.value,
        "account_id": body.account_id
    }
