from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "QChat"
    environment: str = "development"
    dummy_phone_number: str = "+919999999999"
    otp_ttl_seconds: int = 300
    google_client_secret_file: str | None = None
    google_redirect_uri: str = "http://127.0.0.1:8000/integrations/gmail/callback"
    frontend_gmail_connected_url: str = "http://127.0.0.1:3000/integrations?gmail=connected"
    telegram_bot_token: str | None = None
    mongodb_uri: str = "mongodb://127.0.0.1:27017"
    mongodb_database: str = "qchat"
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-3.5-flash"
    ai_provider: str = "gemini"

    model_config = SettingsConfigDict(env_file=(".env", "../.env"), env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
