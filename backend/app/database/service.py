#app/database/service.py
import hashlib
from app.database.models import User

from app.database.db import SessionLocal
from fastapi import HTTPException
from app.database.getuser import get_user , get_user_v2

def simple_hash(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_hash(password: str, stored_hash: str) -> bool:
    return simple_hash(password) == stored_hash

def create_user(email: str, password: str, handle: str, role :str ,name: str = None, phone: str = None ) :
    with SessionLocal() as db:
        user = User(
            email=email,
            handle = handle.strip().lower(),
            name=name,
            phone=phone,
            password_hash=simple_hash(password),
            role=role
        )
        db.add(user)
        db.commit()
        return True
    
def authenticate_user(password: str , id : int = None,email : str = None , handle: str =None):
    with SessionLocal() as db:
        if id :
            user = get_user(id=id)
        elif email:
            user = get_user_v2(email=email)
        elif handle:
            user = get_user_v2(handle=handle)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not verify_hash(password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid password")
        
        return user
 