import json
from typing import Any
from urllib import request
from urllib.error import HTTPError, URLError

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.storage import repository

router = APIRouter(prefix="/telegram", tags=["telegram"])


class TelegramStatus(BaseModel):
    connected: bool
    bot_username: str | None = None


class TelegramMessage(BaseModel):
    message_id: str
    chat_id: str
    from_name: str
    text: str
    date: int | None = None


class TelegramReplyBody(BaseModel):
    message: str = Field(min_length=1)


def _token() -> str:
    token = get_settings().telegram_bot_token
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Telegram bot token is not configured")
    return token


def telegram_api(method: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    data = json.dumps(payload or {}).encode("utf-8")
    req = request.Request(
        f"https://api.telegram.org/bot{_token()}/{method}",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=12) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore") or "Telegram API request failed"
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail) from exc
    except URLError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Telegram API is unreachable") from exc


def send_telegram_message(chat_id: str, text: str) -> dict[str, Any]:
    return telegram_api("sendMessage", {"chat_id": chat_id, "text": text})


def _message_from_update(update: dict[str, Any]) -> TelegramMessage | None:
    raw = update.get("message") or update.get("edited_message")
    if not raw:
        return None

    chat = raw.get("chat", {})
    sender = raw.get("from", {})
    first = sender.get("first_name") or chat.get("first_name") or ""
    last = sender.get("last_name") or chat.get("last_name") or ""
    name = " ".join(part for part in [first, last] if part).strip() or chat.get("title") or "Telegram User"

    return TelegramMessage(
        message_id=str(raw.get("message_id", "")),
        chat_id=str(chat.get("id", "")),
        from_name=name,
        text=raw.get("text") or raw.get("caption") or "",
        date=raw.get("date"),
    )


@router.get("/status", response_model=TelegramStatus)
def telegram_status() -> TelegramStatus:
    token = get_settings().telegram_bot_token
    return TelegramStatus(connected=bool(token))


@router.post("/webhook")
def telegram_webhook(update: dict[str, Any]) -> dict[str, str]:
    message = _message_from_update(update)
    if message:
        repository.add_telegram_message(message.model_dump())
    return {"status": "accepted"}


@router.get("/messages", response_model=list[TelegramMessage])
def list_telegram_messages() -> list[TelegramMessage]:
    return [TelegramMessage(**message) for message in repository.list_telegram_messages(limit=20)]


@router.post("/messages/{chat_id}/reply")
def reply_telegram(chat_id: str, body: TelegramReplyBody) -> dict[str, str]:
    result = send_telegram_message(chat_id, body.message)
    message_id = result.get("result", {}).get("message_id", "")
    return {"status": "sent", "message_id": str(message_id), "chat_id": chat_id}
