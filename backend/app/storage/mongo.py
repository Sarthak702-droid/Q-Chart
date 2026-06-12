from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def _strip_mongo_id(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if document is None:
        return None
    cleaned = dict(document)
    cleaned.pop("_id", None)
    cleaned.pop("received_at", None)
    return cleaned


class MongoStore:
    def __init__(self, db):
        self.db = db
        self._audit_order = 0
        self.gmail_tokens = db["gmail_tokens"]
        self.gmail_oauth_states = db["gmail_oauth_states"]
        self.telegram_messages = db["telegram_messages"]
        self.otp_store = db["otp_store"]
        self.ai_suggestions = db["ai_suggestions"]

    @classmethod
    def connect(cls, uri: str, database: str) -> "MongoStore":
        from pymongo import MongoClient

        client = MongoClient(uri, serverSelectionTimeoutMS=1000)
        client.admin.command("ping")
        return cls(client[database])

    def set_gmail_token(self, user_key: str, token_info: dict[str, Any]) -> None:
        self.gmail_tokens.replace_one(
            {"user_key": user_key},
            {
                "user_key": user_key,
                "token_info": dict(token_info),
                "updated_at": datetime.now(timezone.utc),
            },
            upsert=True,
        )

    def get_gmail_token(self, user_key: str) -> dict[str, Any] | None:
        document = self.gmail_tokens.find_one({"user_key": user_key})
        if not document:
            return None
        return dict(document.get("token_info") or {})

    def has_gmail_token(self, user_key: str) -> bool:
        return self.get_gmail_token(user_key) is not None

    def add_gmail_oauth_state(self, state: str) -> None:
        self.gmail_oauth_states.replace_one(
            {"state": state},
            {"state": state, "created_at": datetime.now(timezone.utc)},
            upsert=True,
        )

    def consume_gmail_oauth_state(self, state: str) -> bool:
        document = self.gmail_oauth_states.find_one({"state": state})
        if not document:
            return False
        self.gmail_oauth_states.delete_one({"state": state})
        return True

    def add_telegram_message(self, message: dict[str, Any]) -> None:
        document = dict(message)
        document["received_at"] = datetime.now(timezone.utc)
        self.telegram_messages.insert_one(document)

    def list_telegram_messages(self, limit: int = 20) -> list[dict[str, Any]]:
        rows = self.telegram_messages.find().sort("date", -1).limit(limit)
        return [_strip_mongo_id(row) for row in rows if _strip_mongo_id(row) is not None]

    def set_otp(self, phone: str, otp: str) -> None:
        self.otp_store.replace_one(
            {"phone": phone},
            {"phone": phone, "otp": otp, "created_at": datetime.now(timezone.utc)},
            upsert=True,
        )

    def get_otp(self, phone: str) -> str | None:
        document = self.otp_store.find_one({"phone": phone})
        if not document:
            return None
        return document.get("otp")

    def delete_otp(self, phone: str) -> None:
        self.otp_store.delete_one({"phone": phone})

    def add_ai_suggestion(self, suggestion: dict[str, Any]) -> None:
        self._audit_order += 1
        document = dict(suggestion)
        document["created_at"] = datetime.now(timezone.utc)
        document["created_order"] = self._audit_order
        self.ai_suggestions.insert_one(document)

    def list_ai_suggestions(self, limit: int = 20) -> list[dict[str, Any]]:
        rows = self.ai_suggestions.find().sort("created_order", -1).limit(limit)
        cleaned_rows = []
        for row in rows:
            cleaned = _strip_mongo_id(row)
            if cleaned:
                cleaned.pop("created_at", None)
                cleaned.pop("created_order", None)
                cleaned_rows.append(cleaned)
        return cleaned_rows
