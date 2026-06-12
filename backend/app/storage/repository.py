from __future__ import annotations

from typing import Any

from app.core.config import get_settings
from app.storage import memory
from app.storage.mongo import MongoStore


class MemoryStore:
    def set_gmail_token(self, user_key: str, token_info: dict[str, Any]) -> None:
        memory.gmail_tokens[user_key] = dict(token_info)

    def get_gmail_token(self, user_key: str) -> dict[str, Any] | None:
        token_info = memory.gmail_tokens.get(user_key)
        return dict(token_info) if token_info else None

    def has_gmail_token(self, user_key: str) -> bool:
        return user_key in memory.gmail_tokens

    def add_gmail_oauth_state(self, state: str) -> None:
        memory.gmail_oauth_states.add(state)

    def consume_gmail_oauth_state(self, state: str) -> bool:
        if state not in memory.gmail_oauth_states:
            return False
        memory.gmail_oauth_states.remove(state)
        return True

    def add_telegram_message(self, message: dict[str, Any]) -> None:
        memory.telegram_messages.insert(0, dict(message))

    def list_telegram_messages(self, limit: int = 20) -> list[dict[str, Any]]:
        return [dict(message) for message in memory.telegram_messages[:limit]]

    def set_otp(self, phone: str, otp: str) -> None:
        memory.otp_store[phone] = otp

    def get_otp(self, phone: str) -> str | None:
        return memory.otp_store.get(phone)

    def delete_otp(self, phone: str) -> None:
        memory.otp_store.pop(phone, None)

    def add_ai_suggestion(self, suggestion: dict[str, Any]) -> None:
        if not hasattr(memory, "ai_suggestions"):
            memory.ai_suggestions = []
        memory.ai_suggestions.insert(0, dict(suggestion))

    def list_ai_suggestions(self, limit: int = 20) -> list[dict[str, Any]]:
        if not hasattr(memory, "ai_suggestions"):
            memory.ai_suggestions = []
        return [dict(suggestion) for suggestion in memory.ai_suggestions[:limit]]


_store: MongoStore | MemoryStore | None = None
_using_mongo = False


def get_store() -> MongoStore | MemoryStore:
    global _store, _using_mongo
    if _store is not None:
        return _store

    settings = get_settings()
    try:
        _store = MongoStore.connect(settings.mongodb_uri, settings.mongodb_database)
        _using_mongo = True
    except Exception:
        _store = MemoryStore()
        _using_mongo = False
    return _store


def using_mongo() -> bool:
    get_store()
    return _using_mongo


def reset_store_for_tests(store: MongoStore | MemoryStore | None = None) -> None:
    global _store, _using_mongo
    _store = store
    _using_mongo = isinstance(store, MongoStore)


def set_gmail_token(user_key: str, token_info: dict[str, Any]) -> None:
    get_store().set_gmail_token(user_key, token_info)


def get_gmail_token(user_key: str) -> dict[str, Any] | None:
    return get_store().get_gmail_token(user_key)


def has_gmail_token(user_key: str) -> bool:
    return get_store().has_gmail_token(user_key)


def add_gmail_oauth_state(state: str) -> None:
    get_store().add_gmail_oauth_state(state)


def consume_gmail_oauth_state(state: str) -> bool:
    return get_store().consume_gmail_oauth_state(state)


def add_telegram_message(message: dict[str, Any]) -> None:
    get_store().add_telegram_message(message)


def list_telegram_messages(limit: int = 20) -> list[dict[str, Any]]:
    return get_store().list_telegram_messages(limit=limit)


def set_otp(phone: str, otp: str) -> None:
    get_store().set_otp(phone, otp)


def get_otp(phone: str) -> str | None:
    return get_store().get_otp(phone)


def delete_otp(phone: str) -> None:
    get_store().delete_otp(phone)


def add_ai_suggestion(suggestion: dict[str, Any]) -> None:
    get_store().add_ai_suggestion(suggestion)


def list_ai_suggestions(limit: int = 20) -> list[dict[str, Any]]:
    return get_store().list_ai_suggestions(limit=limit)
