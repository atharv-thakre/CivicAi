# app/api/__init__.py

from fastapi import APIRouter

from app.api.ai_route import router as ai_router
from app.api.login_route import router as login_router
from app.api.complaint_route import router as complaint_router
from app.api.vote_comment_route import router as vote_comment_router
from app.api.debate_route import router as debate_router




api_router = APIRouter()

# Include routers
api_router.include_router(ai_router)
api_router.include_router(login_router)
api_router.include_router(complaint_router)
api_router.include_router(vote_comment_router)
api_router.include_router(debate_router)
