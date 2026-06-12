from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/livechat", tags=["livechat"])


class WidgetSessionBody(BaseModel):
    website_url: str
    visitor_name: str | None = None


@router.get("/widget.js")
def widget_script() -> dict[str, str]:
    return {
        "script": "<script src=\"https://cdn.qchat.local/widget.js\" data-qchat=\"YOUR_KEY\"></script>"
    }


@router.post("/sessions")
def create_session(body: WidgetSessionBody) -> dict[str, UUID | str]:
    return {
        "session_id": uuid4(),
        "status": "created",
        "website_url": body.website_url
    }
