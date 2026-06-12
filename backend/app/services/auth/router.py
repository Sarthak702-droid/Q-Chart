from secrets import randbelow
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.config import get_settings
from app.storage import repository

router = APIRouter(prefix="/auth", tags=["auth"])


class RequestOtpBody(BaseModel):
    phone: str


class VerifyOtpBody(BaseModel):
    phone: str
    otp: str


@router.post("/request-otp")
def request_otp(body: RequestOtpBody) -> dict[str, str]:
    settings = get_settings()
    if body.phone != settings.dummy_phone_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Use dummy number {settings.dummy_phone_number} for local OTP testing."
        )

    otp = f"{randbelow(900000) + 100000}"
    repository.set_otp(body.phone, otp)
    print(f"[QCHAT OTP] Phone={body.phone} OTP={otp}", flush=True)
    return {"status": "otp_sent", "delivery": "terminal"}


@router.post("/verify-otp")
def verify_otp(body: VerifyOtpBody) -> dict[str, str]:
    expected = repository.get_otp(body.phone)
    if not expected or expected != body.otp:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP")

    repository.delete_otp(body.phone)
    return {
        "status": "verified",
        "access_token": f"dev-token-{uuid4()}",
        "token_type": "bearer"
    }
