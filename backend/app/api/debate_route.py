

from fastapi import WebSocket , WebSocketDisconnect , APIRouter 
from fastapi.responses import  FileResponse
from app.auth.deps import verify_token
from app.database.getuser import get_user_v0
from app.control.debate import manager , broadcast_users , handle_ai_response
import asyncio 


router = APIRouter(tags=["debates"])

@router.get("/debates")
async def home():
    return FileResponse("test.html")

@router.websocket("/ws/debate")
async def websocket_endpoint(ws: WebSocket):
    
    token = ws.query_params.get("token")

    if not token:
        await ws.close(code=1008)
        return

    payload = verify_token(token)
    if not payload:
        await ws.close(code=1008)
        return

    user = get_user_v0(payload.get("id"))
    if not user:
        await ws.close(code=1008)
        return

    username = user["name"]
    user_id = user["id"]

    await manager.connect(ws, username , user_id)
    await broadcast_users()

    try:
        while True:
            data = await ws.receive_json()

            if data.get("type") == "typing":
                for conn in manager.active:
                    if conn["ws"] is not ws:
                        try:
                            await conn["ws"].send_json({
                                "type": "typing",
                                "user": username
                            })
                        except:
                            pass

            elif data.get("type") == "message":
                text = data.get("text", "").strip()

                if not text:
                    continue

                if len(text) > 200:  # basic spam protection
                    continue

                await manager.broadcast(text, username , user_id)

                if "@ai" in text.lower():
                    asyncio.create_task(handle_ai_response(text, username))

    except WebSocketDisconnect:
        user_left = manager.disconnect(ws)
        await manager.broadcast(f"🔴 {user_left} left the chat", "system")
        await broadcast_users()