# api/ai_route.py

import asyncio
from app.auth.deps import get_current_user
from fastapi import APIRouter, Depends
from app.schemas.set_02 import AIRequest, ImproveRequest 
from app.ai.memory_store import get_history, add_message
from app.ai.prompt import SYSTEM_PROMPT_02
from app.ai.context import context_prompt_01 
from app.ai.llm.core import groq_call


router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/chat")
def ai_execute(req: AIRequest, user: dict = Depends(get_current_user)):
    uid = user["uid"]

    history = get_history(uid)

    messages = [
        {"role": "system", "content": context_prompt_01(req.complaint_id)},
        *history,
        {"role": "user", "content": req.message}
    ]

    output = asyncio.run(groq_call(messages))

    add_message(uid, "user", req.message)
    add_message(uid, "assistant", output)

    return {
        "response": output
    }


@router.post("/improve")
def ai_improve(req: ImproveRequest, user: dict = Depends(get_current_user)):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT_02},
        {"role": "user", "content": req.message}
    ]
    response = asyncio.run(groq_call(messages))
    return {"response": response}

