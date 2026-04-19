# auth/jwt_handler.py

from jose import jwt, JWTError
import time
# from scripts.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_SECONDS

SECRET_KEY = "hello"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 60 * 60



def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = int(time.time()) + ACCESS_TOKEN_EXPIRE_SECONDS
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None