

from fastapi import WebSocket , WebSocketDisconnect , APIRouter 
from fastapi.responses import  FileResponse
from app.auth.deps import verify_token
from app.database.getuser import get_user_v0
from app.control.debate import manager , broadcast_users , handle_ai_response
import asyncio 


router = APIRouter(tags=["debates"])

@router.get("/debates/{complaint_id}")
async def debate_page(complaint_id: int):
    return FileResponse("debate_room.html")

@router.websocket("/ws/debate/{complaint_id}")
async def websocket_endpoint(ws: WebSocket, complaint_id: int):

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

    await manager.connect(ws, username, user_id, complaint_id)
    await broadcast_users(complaint_id)

    try:
        while True:
            data = await ws.receive_json()

            if data.get("type") == "typing":
                await manager.broadcast_typing(complaint_id, ws, username)

            elif data.get("type") == "message":
                text = data.get("text", "").strip()

                if not text:
                    continue

                if len(text) > 200:
                    continue

                await manager.broadcast(complaint_id, text, username, user_id)

                if "@ai" in text.lower():
                    asyncio.create_task(
                        handle_ai_response(text, username, complaint_id)
                    )

    except WebSocketDisconnect:
        user_left, cid = manager.disconnect(ws)

        if cid is not None:
            await manager.broadcast(
                cid,
                f"🔴 {user_left} left the chat",
                "system"
            )
            await broadcast_users(cid)