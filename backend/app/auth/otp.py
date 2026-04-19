import secrets
from datetime import datetime, timedelta
from sqlalchemy import delete, or_ , select
from app.database.db import SessionLocal
from app.database.service import simple_hash
from app.database.getuser import get_user_v0
from app.database.models import OTPCode
from fastapi import HTTPException


def create_token() -> str:
    return secrets.token_urlsafe(32)

def create_otp() -> str:
    return f"{secrets.randbelow(1000000):06d}"

from datetime import datetime, timedelta
from sqlalchemy import update

OTP_EXPIRY_MINUTES = 5  # tweak as needed


def store_otp(
    otp: str,
    purpose: str,
    contact:str,
    id: int = None
):
    otp = simple_hash(otp)
    with SessionLocal() as db:
        # 1. mark all previous OTPs as used for this user + purpose
        db.execute(
            update(OTPCode)
            .where(
                OTPCode.contact == contact,
                OTPCode.purpose == purpose,
                OTPCode.is_used == False,
                OTPCode.expires_at > datetime.utcnow()
            )
            .values(is_used=True)
        )

        # 2. create new OTP row
        new_otp = OTPCode(
            user_id=id,
            contact=contact,
            code_hash=otp,
            purpose=purpose,
            expires_at=datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
            is_used=False,
            attempt_count=0,
            created_at=datetime.utcnow()
        )

        db.add(new_otp)
        db.commit()
        return None
    
def verify_otp (otp: str, purpose: str ,id: int = None ,contact: str = None):
    otp_hash = simple_hash(otp)

    with SessionLocal() as db:
        if id:
            otp_obj = db.query(OTPCode).filter(
                OTPCode.user_id == id,
                OTPCode.purpose == purpose,
                OTPCode.code_hash == otp_hash,
                OTPCode.is_used == False,
                OTPCode.expires_at > datetime.utcnow()
            ).first()
        elif contact:
            otp_obj = db.query(OTPCode).filter(
                OTPCode.contact == contact,
                OTPCode.purpose == purpose,
                OTPCode.code_hash == otp_hash,
                OTPCode.is_used == False,
                OTPCode.expires_at > datetime.utcnow()
            ).first()
        else:
            return HTTPException(status_code=422, detail="Invalid Request")

        if not otp_obj:
            return HTTPException(status_code=400, detail="Invalid or Expired OTP")

        otp_obj.is_used = True
        db.commit()
        return None

def can_send_otp(purpose: str, id: int = None, contact: str = None, cooldown_seconds: int = 60):
    cleanup()
    with SessionLocal() as db:
        if id :
            last_created = db.execute(
                select(OTPCode.created_at)
                .where(
                    OTPCode.user_id == id,
                    OTPCode.purpose == purpose
                )
                .order_by(OTPCode.created_at.desc())
                .limit(1)
            ).scalar_one_or_none()

        elif contact:
            last_created = db.execute(
                select(OTPCode.created_at)
                .where(
                    OTPCode.contact == contact,
                    OTPCode.purpose == purpose
                )
                .order_by(OTPCode.created_at.desc())
                .limit(1)
            ).scalar_one_or_none()
        else:
            return HTTPException(status_code=422, detail="Invalid Request")

        if last_created is None:
            return None

        cooldown_time = last_created + timedelta(seconds=cooldown_seconds)

        if datetime.utcnow() < cooldown_time:
            raise HTTPException(status_code=400, detail="Cooldown not expired")
        return None

def cleanup():
    with SessionLocal() as db:
        now = datetime.utcnow()

        db.execute(
            delete(OTPCode).where(
                or_(
                    OTPCode.is_used == True,
                    OTPCode.expires_at < now
                )
            )
        )

        db.commit()
       