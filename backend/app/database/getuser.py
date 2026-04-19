from app.database.db import SessionLocal
from app.database.models import User
from fastapi import HTTPException

db = SessionLocal()

def get_user(id: int = None):
    with SessionLocal() as db:
        if id:
            user = db.query(User).filter(User.id == id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": str(user.id),
            "uid": user.uid,
            "handle": user.handle,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "password_hash": user.password_hash,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }


def get_user_v0(id: int = None):
    with SessionLocal() as db:
        if id:
            user = db.query(User).filter(User.id == id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": str(user.id),
            "uid": user.uid,
            "handle": user.handle,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }


def get_user_v1(uid: str = None):
    with SessionLocal() as db:
        if uid:
            user = db.query(User).filter(User.uid == uid).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": str(user.id),
            "uid": user.uid,
            "handle": user.handle,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }

    
# Get user by handle or email
def get_user_v2(*, handle: str = None, email: str = None):
    with SessionLocal() as db:
        if handle:
            user = db.query(User).filter(User.handle == handle).first()
        elif email:
            user = db.query(User).filter(User.email == email).first()
        else:
            raise HTTPException(status_code=400, detail="handle or email is required")
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": str(user.id),
            "uid": user.uid,
            "handle": user.handle,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "password_hash": user.password_hash,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    
