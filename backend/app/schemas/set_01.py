from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=60)
    handle: str = Field(min_length=2, max_length=16)
    name: str = Field(min_length=2, max_length=60)
    role: str = Field(min_length=2, max_length=60)


class LoginRequest(BaseModel):
    identifier: str   # email OR handle
    password: str = Field(min_length=6, max_length=60)


class OTPRequest(BaseModel):
    identifier: str   # email OR handle
   
