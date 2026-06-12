from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app
from app.storage import repository


client = TestClient(app)


def setup_function():
    repository.reset_store_for_tests(repository.MemoryStore())


def test_gmail_auth_url_returns_google_consent_url(monkeypatch):
    monkeypatch.setenv(
        "GOOGLE_CLIENT_SECRET_FILE",
        r"C:\Users\91891\Downloads\client_secret_464962628043-ulc6bg5asld898ubo3rvj00tmrj50au6.apps.googleusercontent.com.json",
    )

    response = client.get("/integrations/gmail/auth-url")

    assert response.status_code == 200
    payload = response.json()
    assert payload["auth_url"].startswith("https://accounts.google.com/")
    assert payload["state"]
    assert "gmail.readonly" in payload["auth_url"]
    assert "gmail.send" in payload["auth_url"]


def test_gmail_callback_rejects_unknown_state():
    response = client.get("/integrations/gmail/callback?code=fake-code&state=unknown-state")

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid OAuth state"


def test_gmail_messages_use_connected_account(monkeypatch):
    from app.services.gmail import router as gmail_router

    repository.set_gmail_token("demo", {"token": "fake-token"})

    class FakeMessages:
        def list(self, userId, maxResults):
            assert userId == "me"
            assert maxResults == 10
            return self

        def get(self, userId, id, format):
            assert userId == "me"
            assert format == "metadata"
            return self

        def execute(self):
            if not hasattr(self, "_listed"):
                self._listed = True
                return {"messages": [{"id": "msg-1", "threadId": "thread-1"}]}
            return {
                "id": "msg-1",
                "threadId": "thread-1",
                "snippet": "Hello from Gmail",
                "payload": {
                    "headers": [
                        {"name": "From", "value": "buyer@example.com"},
                        {"name": "Subject", "value": "Product question"},
                        {"name": "Date", "value": "Thu, 11 Jun 2026 08:00:00 +0000"},
                    ]
                },
            }

    class FakeUsers:
        def messages(self):
            return FakeMessages()

    class FakeService:
        def users(self):
            return FakeUsers()

    monkeypatch.setattr(gmail_router, "get_gmail_service", lambda: FakeService())

    response = client.get("/gmail/messages")

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": "msg-1",
            "thread_id": "thread-1",
            "from_email": "buyer@example.com",
            "subject": "Product question",
            "snippet": "Hello from Gmail",
            "date": "Thu, 11 Jun 2026 08:00:00 +0000",
        }
    ]


def test_gmail_reply_sends_message(monkeypatch):
    from app.services.gmail import router as gmail_router

    repository.set_gmail_token("demo", {"token": "fake-token"})
    sent_payloads = []

    class FakeSend:
        def __init__(self, body):
            self.body = body

        def execute(self):
            sent_payloads.append(self.body)
            return {"id": "sent-1", "threadId": "thread-1"}

    class FakeMessages:
        def send(self, userId, body):
            assert userId == "me"
            return FakeSend(body)

    class FakeUsers:
        def messages(self):
            return FakeMessages()

    class FakeService:
        def users(self):
            return FakeUsers()

    monkeypatch.setattr(gmail_router, "get_gmail_service", lambda: FakeService())

    response = client.post("/gmail/messages/thread-1/reply", json={"message": "Yes, it is available."})

    assert response.status_code == 200
    assert response.json() == {"status": "sent", "message_id": "sent-1", "thread_id": "thread-1"}
    assert sent_payloads
    assert "raw" in sent_payloads[0]
