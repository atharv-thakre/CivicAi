from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=60)
    name: str = Field(min_length=2, max_length=60)
    phone: Optional[str] = Field(default=None, min_length=10, max_length=10)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)
    new_password: str = Field(min_length=6)


class CompleteProfileRequest(BaseModel):
    otp: str = Field(min_length=6, max_length=6)
    phone: Optional[str] = Field(default=None, min_length=10, max_length=10)
    name: Optional[str] = Field(default=None, min_length=2, max_length=60)


class TelegramRequest(BaseModel):
    telegram_id: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=60)
    phone: Optional[str] = Field(default=None, min_length=10, max_length=10)


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(min_length=6)
    new_password: str = Field(min_length=6)


class AdminUpdateRequest(BaseModel):
    role: Optional[str] = "user"
    is_active: Optional[int] = 0
    name: Optional[str] = Field(default=None, min_length=2, max_length=60)
    phone: Optional[str] = Field(default=None, min_length=10, max_length=10)


class AdminCreateUser(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    role: Optional[str] = "user"
    name: Optional[str] = Field(default=None, min_length=2, max_length=60)
    phone: Optional[str] = Field(default=None, min_length=10, max_length=10)
    is_active: Optional[int] = 0

class AIRequest(BaseModel):
    message: str