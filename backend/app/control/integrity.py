#app/control/login.py
import re
from app.database.models import User
from app.database.db import SessionLocal
from fastapi import HTTPException

def contact_integrity(email:str , phone:str = None):
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        if user:
            return HTTPException(status_code=400, detail="Email already exists")
        
        if phone:
            user = db.query(User).filter(User.phone == phone).first()
            if user:
                return HTTPException(status_code=400, detail="Phone already exists")

        return None     
    

def handle_integrity(handle: str) -> str:
    if not handle:
        return HTTPException(status_code=400, detail="Handle is required")
    
    # basic checks
    if len(handle) < 3 or len(handle) > 20:
        return HTTPException(status_code=400, detail="Handle must be between 3 and 20 characters")

    if handle.startswith("_"):
        return HTTPException(status_code=400, detail="Handle must start with a letter")

    # allowed characters
    if not re.fullmatch(r"[a-z0-9_]+", handle):
        return HTTPException(status_code=400, detail="Handle can only contain letters, numbers, and underscores")

    # must start with letter
    if not handle[0].isalpha():
        return HTTPException(status_code=400, detail="Handle must start with a letter")

    # no consecutive underscores (optional but recommended)
    if "__" in handle:
        return HTTPException(status_code=400, detail="Handle cannot contain consecutive underscores")
    
    with SessionLocal() as db:
        user = db.query(User).filter(User.handle == handle).first()
        if user:
            return HTTPException(status_code=400, detail="Handle already exists")

    return None

   
def sanitize_handle(handle: str) -> str:
    handle = handle.lower().strip()
    handle = re.sub(r"[^a-z0-9_]", "", handle)
    handle = re.sub(r"_+", "_", handle)
    return handle