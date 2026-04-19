#app/main.py

from fastapi import FastAPI, Depends
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from api import api_router
from auth import service as auth_service
from app.auth.dependencies import verify_docs


app = FastAPI(docs_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(api_router)
# ========================= DATABASE INIT =========================

@app.on_event("startup")
def startup_event():
    auth_service.init_user_db()


# ========================= DOCS =========================

@app.get("/docs", include_in_schema=False)
def docs(credentials=Depends(verify_docs)):
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="API Docs"
    )


@app.get("/openapi.json", include_in_schema=False)
def openapi(credentials=Depends(verify_docs)):
    return get_openapi(
        title="API",
        version="1.0.0",
        routes=app.routes
    )


# ========================= FRONTEND =========================
@app.get("/")
def login_page():
    return FileResponse("templates/index.html")

@app.get("/dashboard")
def dashboard():
    return FileResponse("templates/dashboard.html")

@app.get("/admin")
def admin_panel():
    return FileResponse("templates/admin.html")

@app.get("/complete-profile")
def complete_profile_page():
    return FileResponse("templates/complete_profile.html")

@app.get("/forgot-password")
def forgot_page():
    return FileResponse("templates/forgot-password.html")

@app.get("/health")
def health():
    return {"status": "ok"}