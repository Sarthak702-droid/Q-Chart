from datetime import datetime
from enum import Enum
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr, Field


class Platform(str, Enum):
    whatsapp = "whatsapp"
    instagram = "instagram"
    facebook = "facebook"
    telegram = "telegram"
    email = "email"
    livechat = "livechat"


class ConversationStatus(str, Enum):
    open = "open"
    pending = "pending"
    resolved = "resolved"


class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    email: EmailStr
    plan: str = "starter"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ConnectedAccount(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    platform: Platform
    account_id: str
    status: str = "connected"


class Contact(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    name: str
    phone: str | None = None
    email: EmailStr | None = None
    platform: Platform
    external_id: str


class Conversation(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    contact_id: UUID
    platform: Platform
    status: ConversationStatus = ConversationStatus.open
    last_message_at: datetime = Field(default_factory=datetime.utcnow)


class Message(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    conversation_id: UUID
    sender_type: Literal["customer", "agent", "ai"]
    message: str
    media_url: str | None = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    platform_message_id: str | None = None
