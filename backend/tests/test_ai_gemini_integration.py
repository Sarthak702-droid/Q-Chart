from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import get_settings
from app.main import app
from app.storage import repository


client = TestClient(app)


def setup_function():
    get_settings.cache_clear()
    repository.reset_store_for_tests(repository.MemoryStore())


def test_ai_status_reports_disconnected_without_key(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    get_settings.cache_clear()

    response = client.get("/ai/status")

    assert response.status_code == 200
    assert response.json() == {
        "configured": False,
        "provider": "gemini",
        "model": "gemini-3.5-flash",
    }


def test_ai_reply_suggestion_rejects_empty_message():
    response = client.post(
        "/ai/reply-suggestion",
        json={"platform": "telegram", "customer_message": "   "},
    )

    assert response.status_code == 422


def test_ai_reply_suggestion_uses_gemini_and_saves_audit(monkeypatch):
    from app.services.ai import router as ai_router

    class FakeProvider:
        provider = "gemini"
        model = "gemini-test"

        def reply_suggestion(self, *, platform, customer_message, recent_context, tone):
            assert platform == "gmail"
            assert customer_message == "Is this product available?"
            assert recent_context == ["Customer asked about stock"]
            assert tone == "professional"
            return "Yes, this product is currently available. I can help you place the order."

    monkeypatch.setattr(ai_router, "get_ai_provider", lambda: FakeProvider())

    response = client.post(
        "/ai/reply-suggestion",
        json={
            "platform": "gmail",
            "customer_message": "Is this product available?",
            "recent_context": ["Customer asked about stock"],
            "tone": "professional",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "provider": "gemini",
        "model": "gemini-test",
        "suggestion": "Yes, this product is currently available. I can help you place the order.",
    }
    saved = repository.list_ai_suggestions(limit=1)
    assert saved[0]["kind"] == "reply_suggestion"
    assert saved[0]["platform"] == "gmail"
    assert saved[0]["output"]["suggestion"].startswith("Yes, this product")


def test_ai_improve_reply_uses_gemini(monkeypatch):
    from app.services.ai import router as ai_router

    class FakeProvider:
        provider = "gemini"
        model = "gemini-test"

        def improve_reply(self, *, draft, customer_message, tone):
            assert draft == "ok we have it"
            assert customer_message == "Is this product available?"
            assert tone == "friendly"
            return "Yes, we have it available. I can help you with the next step."

    monkeypatch.setattr(ai_router, "get_ai_provider", lambda: FakeProvider())

    response = client.post(
        "/ai/improve-reply",
        json={
            "draft": "ok we have it",
            "customer_message": "Is this product available?",
            "tone": "friendly",
        },
    )

    assert response.status_code == 200
    assert response.json()["improved_reply"].startswith("Yes, we have it")


def test_ai_conversation_insights_returns_structured_result(monkeypatch):
    from app.services.ai import router as ai_router

    class FakeProvider:
        provider = "gemini"
        model = "gemini-test"

        def conversation_insights(self, *, platform, customer_message, recent_context):
            return {
                "summary": "Customer wants product availability.",
                "intent": "availability",
                "sentiment": "neutral",
                "urgency": "medium",
                "suggested_next_action": "Confirm stock and offer ordering help.",
            }

    monkeypatch.setattr(ai_router, "get_ai_provider", lambda: FakeProvider())

    response = client.post(
        "/ai/conversation-insights",
        json={"platform": "telegram", "customer_message": "Is this product available?"},
    )

    assert response.status_code == 200
    assert response.json()["insights"] == {
        "summary": "Customer wants product availability.",
        "intent": "availability",
        "sentiment": "neutral",
        "urgency": "medium",
        "suggested_next_action": "Confirm stock and offer ordering help.",
    }
