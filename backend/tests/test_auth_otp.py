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


def test_request_otp_rejects_non_dummy_number():
    response = client.post("/auth/request-otp", json={"phone": "+910000000000"})

    assert response.status_code == 400
    assert "Use dummy number" in response.json()["detail"]


def test_verify_otp_returns_dev_token():
    phone = "+919999999999"
    repository.set_otp(phone, "123456")

    response = client.post("/auth/verify-otp", json={"phone": phone, "otp": "123456"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "verified"
    assert payload["access_token"].startswith("dev-token-")
    assert payload["token_type"] == "bearer"
    assert repository.get_otp(phone) is None
