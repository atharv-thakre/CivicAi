#api/profile_route.py
from app.control import integrity as integrity_control
from app.database.getuser import get_user_v2
from app.auth.otp import can_send_otp , store_otp , verify_otp , create_otp
from fastapi import APIRouter, Depends, HTTPException
from app.control.mail import send_email_otp

from app.schemas.set_01 import (
    SignupRequest,
    LoginRequest,
    OTPRequest
)

from app.auth.deps import get_current_user 
from app.database import service as db_service
from app.auth.jwt_handler import create_access_token
from fastapi.responses import HTMLResponse



router = APIRouter(tags=["Profile"])


# ============================== SIGNUP ==============================


@router.get("/issue") # Changed to GET for browser testing
def issue():
    # 1. Create your token
    token = create_access_token({
        "id": 1,
        "uid": "b225c874-1379-4ac9-8511-bd2388e42994",
        "role": "admin"
    })

    # 2. Return HTML with a script to save the token
    content = f"""
    <html>
        <head><title>Token Issued</title></head>
        <body>
            <h1>Token generated and saved!</h1>
            <p>Check your <b>Local Storage</b> in Developer Tools (F12).</p>
            <script>
                // This line saves the token to the browser's storage
                localStorage.setItem('token', '{token}');
                console.log('Token has been saved to localStorage.');
            </script>
        </body>
    </html>
    """
    return HTMLResponse(content=content)

@router.get("/issue/{user_id}")
def issue(user_id: int):
    # 1. Create your token
    token = create_access_token({
        "id": user_id,
        "uid": "b225c874-1379-4ac9-8511-bd2388e42994",
        "role": "admin"
    })
    print(token)

    # 2. Return HTML with a script to save the token
    content = f"""
    <html>
        <head><title>Token Issued</title></head>
        <body>
            <h1>Token generated and saved!</h1>
            <p>Check your <b>Local Storage</b> in Developer Tools (F12).</p>
            <script>
                // This line saves the token to the browser's storage
                localStorage.setItem('token', '{token}');
                console.log('Token has been saved to localStorage.');
            </script>
        </body>
    </html>
    """
    return HTMLResponse(content=content)

@router.post("/signup")
def signup(data: SignupRequest):
    status = integrity_control.contact_integrity(data.email)
    if status:
        raise status
    data.handle = data.handle.strip().lower()
    status = integrity_control.handle_integrity(data.handle)
    if status:
        raise status

    if db_service.create_user(
        email=data.email,
        password=data.password,
        handle=data.handle,
        name=data.name,
        role=data.role
    ) :
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to register user")



# ============================== LOGIN ==============================


@router.post("/auth/login")
def login(data: LoginRequest):
    identifier = data.identifier

    if "@" in identifier:
        user = db_service.authenticate_user(
            email=identifier,
            password=data.password
        )
    else:
        user = db_service.authenticate_user(
            handle=identifier,
            password=data.password
        )
    if not user :
        raise HTTPException(status_code=404, detail="User not found")
        
    

    token = create_access_token({
        "id": user["id"],
        "uid": str(user["uid"]),
        "role": user["role"]
    })

    return {
        "access_token": token,
        "id": user["id"],
        "role": user["role"],
        "uid" : str(user["uid"]),
        "token_type": "bearer"
    }

# ============================== OTP ==============================
@router.post("/auth/otp")
def send_otp(data: OTPRequest):
    identifier = data.identifier
    otp = create_otp()
    
    if "@" in identifier:
        if can_send_otp(contact=identifier, purpose="login") is not None:
            raise HTTPException(status_code=429, detail="Please wait before requesting another OTP")
        email = send_email_otp(identifier,otp)
        if email :
            store_otp(contact=identifier,otp=otp,purpose="login")
            return {"message": "OTP sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send OTP")
    else:
        user = get_user_v2(handle=identifier)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        identifier = user["email"]
        if can_send_otp(contact=identifier, purpose="login") is not None:
            raise HTTPException(status_code=429, detail="Please wait before requesting another OTP")
        
        store_otp(contact=identifier,otp=otp,purpose="login")
        email = send_email_otp(identifier,otp)
        if email :
            store_otp(contact=identifier,otp=otp,purpose="login")
            return {"message": "OTP sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send OTP")
        


@router.get("/me/otp")
def get_otp(current_user: dict = Depends(get_current_user)):
    otp = create_otp()
    if can_send_otp(contact=current_user["email"], purpose="login") is not None:
        raise HTTPException(status_code=429, detail="Please wait before requesting another OTP")
    email = send_email_otp(current_user["email"],otp)
    if email :
        store_otp(contact=current_user["email"],otp=otp,purpose="login")
        return {"message": "OTP sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send OTP")

# ============================== PROFILE ==============================

@router.get("/me")
def read_current_user(current_user: dict = Depends(get_current_user)):
    return current_user


