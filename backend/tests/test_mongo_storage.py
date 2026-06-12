from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.storage.mongo import MongoStore


class FakeCursor:
    def __init__(self, documents):
        self.documents = list(documents)

    def sort(self, field, direction):
        reverse = direction < 0
        self.documents.sort(key=lambda item: item.get(field, 0), reverse=reverse)
        return self

    def limit(self, count):
        self.documents = self.documents[:count]
        return self

    def __iter__(self):
        return iter(self.documents)


class FakeCollection:
    def __init__(self):
        self.documents = []

    def replace_one(self, filter_query, replacement, upsert=False):
        for index, document in enumerate(self.documents):
            if all(document.get(key) == value for key, value in filter_query.items()):
                self.documents[index] = dict(replacement)
                return
        if upsert:
            self.documents.append(dict(replacement))

    def find_one(self, filter_query):
        for document in self.documents:
            if all(document.get(key) == value for key, value in filter_query.items()):
                return dict(document)
        return None

    def delete_one(self, filter_query):
        self.documents = [
            document
            for document in self.documents
            if not all(document.get(key) == value for key, value in filter_query.items())
        ]

    def insert_one(self, document):
        stored = dict(document)
        stored.setdefault("_id", f"fake-{len(self.documents) + 1}")
        self.documents.append(stored)

    def find(self):
        return FakeCursor([dict(document) for document in self.documents])


class FakeDatabase:
    def __init__(self):
        self.collections = {}

    def __getitem__(self, name):
        self.collections.setdefault(name, FakeCollection())
        return self.collections[name]


def test_mongo_store_persists_gmail_tokens_by_demo_user():
    store = MongoStore(db=FakeDatabase())

    store.set_gmail_token("demo", {"token": "access-token", "refresh_token": "refresh-token"})

    assert store.has_gmail_token("demo") is True
    assert store.get_gmail_token("demo") == {"token": "access-token", "refresh_token": "refresh-token"}


def test_mongo_store_consumes_oauth_state_once():
    store = MongoStore(db=FakeDatabase())

    store.add_gmail_oauth_state("state-123")

    assert store.consume_gmail_oauth_state("state-123") is True
    assert store.consume_gmail_oauth_state("state-123") is False


def test_mongo_store_persists_telegram_messages_newest_first():
    store = MongoStore(db=FakeDatabase())

    store.add_telegram_message({"message_id": "1", "chat_id": "11", "from_name": "A", "text": "old", "date": 1})
    store.add_telegram_message({"message_id": "2", "chat_id": "22", "from_name": "B", "text": "new", "date": 2})

    messages = store.list_telegram_messages(limit=1)

    assert messages == [{"message_id": "2", "chat_id": "22", "from_name": "B", "text": "new", "date": 2}]


def test_mongo_store_persists_and_deletes_otp():
    store = MongoStore(db=FakeDatabase())

    store.set_otp("+919999999999", "123456")

    assert store.get_otp("+919999999999") == "123456"
    store.delete_otp("+919999999999")
    assert store.get_otp("+919999999999") is None


def test_mongo_store_persists_ai_suggestions_newest_first():
    store = MongoStore(db=FakeDatabase())

    store.add_ai_suggestion({"kind": "reply_suggestion", "platform": "telegram", "output": {"suggestion": "Old"}})
    store.add_ai_suggestion({"kind": "improve_reply", "platform": "gmail", "output": {"improved_reply": "New"}})

    suggestions = store.list_ai_suggestions(limit=1)

    assert suggestions == [{"kind": "improve_reply", "platform": "gmail", "output": {"improved_reply": "New"}}]
