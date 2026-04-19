import secrets
from fastapi import HTTPException, Depends , status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials , HTTPBasic , HTTPBasicCredentials
from app.auth.jwt_handler import verify_token
from app.database.getuser import get_user_v0
from app.database.db import SessionLocal


DOCS_USER = "admin"
DOCS_PASS = "admin"

security_jwt = HTTPBearer()
security_login = HTTPBasic()


def verify_docs(credentials: HTTPBasicCredentials = Depends(security_login)):
    correct_user = secrets.compare_digest(credentials.username, DOCS_USER)
    correct_pass = secrets.compare_digest(credentials.password, DOCS_PASS)

    if not (correct_user and correct_pass):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Basic"},
        )
    

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_jwt),
):
    token = credentials.credentials
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    id = payload.get("id")
    user = get_user_v0(id=id)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


#  Activation Enforcement
def get_active_user(current_user: dict = Depends(get_current_user)):
    if not (current_user["is_active"] == 1 ):
        raise HTTPException(
            status_code=403,
            detail="Complete profile first"
        )
    return current_user


def require_role(required_role: str):
    def role_checker(current_user: dict = Depends(get_active_user)):
        if current_user["role"] != required_role:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()