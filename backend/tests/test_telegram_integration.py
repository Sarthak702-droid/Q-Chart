from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import get_settings
from app.main import app
from app.storage import repository


client = TestClient(app)


def setup_function():
    repository.reset_store_for_tests(repository.MemoryStore())


def test_telegram_status_reports_configured_token(monkeypatch):
    monkeypatch.setenv("TELEGRAM_BOT_TOKEN", "test-token")
    get_settings.cache_clear()

    response = client.get("/telegram/status")

    assert response.status_code == 200
    assert response.json() == {"connected": True, "bot_username": None}


def test_telegram_webhook_stores_incoming_message():
    response = client.post(
        "/telegram/webhook",
        json={
            "message": {
                "message_id": 101,
                "date": 1781148000,
                "chat": {"id": 12345, "first_name": "Anaya", "type": "private"},
                "from": {"id": 12345, "first_name": "Anaya"},
                "text": "Is this product available?",
            }
        },
    )

    assert response.status_code == 200
    assert response.json() == {"status": "accepted"}

    messages = client.get("/telegram/messages").json()
    assert messages[0]["chat_id"] == "12345"
    assert messages[0]["from_name"] == "Anaya"
    assert messages[0]["text"] == "Is this product available?"


def test_telegram_reply_uses_bot_api(monkeypatch):
    from app.services.telegram import router as telegram_router

    sent = []

    def fake_send(chat_id: str, text: str):
        sent.append({"chat_id": chat_id, "text": text})
        return {"ok": True, "result": {"message_id": 202}}

    monkeypatch.setattr(telegram_router, "send_telegram_message", fake_send)

    response = client.post("/telegram/messages/12345/reply", json={"message": "Yes, it is available."})

    assert response.status_code == 200
    assert response.json() == {"status": "sent", "message_id": "202", "chat_id": "12345"}
    assert sent == [{"chat_id": "12345", "text": "Yes, it is available."}]
