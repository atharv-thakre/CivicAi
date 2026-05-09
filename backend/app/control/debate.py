from fastapi import WebSocket
from datetime import datetime
from app.database.complaints import get_complaint
import asyncio , ollama , re


from datetime import datetime
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.rooms: dict[int, list[dict]] = {}

    async def connect(self, ws: WebSocket, username: str, user_id: int, complaint_id: int):
        await ws.accept()

        if complaint_id not in self.rooms:
            self.rooms[complaint_id] = []

        # remove duplicate ws if exists
        self.rooms[complaint_id] = [
            c for c in self.rooms[complaint_id] if c["ws"] is not ws
        ]

        self.rooms[complaint_id].append({
            "ws": ws,
            "user": username,
            "user_id": user_id
        })

        await self.broadcast(
            complaint_id,
            f"🟢 {username} joined the chat",
            "system"
        )

    def disconnect(self, ws: WebSocket):
        for complaint_id, connections in self.rooms.items():
            entry = next((c for c in connections if c["ws"] is ws), None)

            if entry:
                connections.remove(entry)

                # cleanup empty room
                if not connections:
                    del self.rooms[complaint_id]

                return entry["user"], complaint_id

        return "Unknown", None

    async def broadcast(self, complaint_id: int, message: str, sender: str, user_id: int = None):
        ts = datetime.now().strftime("%H:%M")

        for conn in self.rooms.get(complaint_id, [])[:]:
            try:
                await conn["ws"].send_json({
                    "type": "message",
                    "sender": sender,
                    "user_id": user_id,
                    "message": message,
                    "time": ts,
                    "is_mine": conn["user_id"] == user_id  # ✅ True only for the sender's connection
                })
            except:
                self.rooms[complaint_id].remove(conn)

    async def broadcast_typing(self, complaint_id: int, ws: WebSocket, username: str):
        for conn in self.rooms.get(complaint_id, []):
            if conn["ws"] is not ws:
                try:
                    await conn["ws"].send_json({
                        "type": "typing",
                        "user": username
                    })
                except:
                    pass

    def get_users(self, complaint_id: int):
        return [c["user"] for c in self.rooms.get(complaint_id, [])]


manager = ConnectionManager()



async def broadcast_users(complaint_id: int):
    participants = manager.get_users(complaint_id)

    payload = {
        "type": "users",
        "count": len(participants),
        "users": ["Civic AI"] + participants
    }

    for conn in manager.rooms.get(complaint_id, [])[:]:
        try:
            await conn["ws"].send_json(payload)
        except:
            manager.rooms[complaint_id].remove(conn)


ai_locks: dict[int, bool] = {}
ai_history: dict[int, list] = {}

MAX_HISTORY = 10


async def handle_ai_response(user_text: str, username: str, complaint_id: int):
    
    if not complaint_id:
        return

    # 🔒 per-room lock
    if ai_locks.get(complaint_id):
        return

    ai_locks[complaint_id] = True

    ai_name = "Civic AI"
    ai_id = -1

    # 🔹 clean text (no need to parse complaint anymore)
    clean_text = parse_ai_input(user_text)

    stop_event = asyncio.Event()
    typing_task = asyncio.create_task(
        ai_typing_loop(stop_event, complaint_id)
    )

    try:
        ai_reply = await generate_ai_reply(clean_text, complaint_id)

    except Exception as e:
        print("AI ERROR:", e)
        ai_reply = "⚠️ AI failed to respond"

    finally:
        stop_event.set()
        try:
            await typing_task
        except asyncio.CancelledError:
            pass

        ai_locks[complaint_id] = False

    # 🔥 broadcast ONLY to that room
    await manager.broadcast(complaint_id, ai_reply, ai_name, ai_id)

async def ai_typing_loop(stop_event, complaint_id: int):
    while not stop_event.is_set():
        for conn in manager.rooms.get(complaint_id, []):
            try:
                await conn["ws"].send_json({
                    "type": "typing",
                    "user": "Civic AI"
                })
            except:
                pass

        await asyncio.sleep(0.7)

async def generate_ai_reply(text: str, complaint_id: int) -> str:
    
    if complaint_id not in ai_history:
        ai_history[complaint_id] = []

    history = ai_history[complaint_id]

    context = ""

    complaint = get_complaint(complaint_id)

    if complaint:
        context = f"""
[Complaint Context]
Title: {complaint.title}
Tags: {complaint.tags}
Description: {complaint.cleaned_text}
"""
    else:
        context = "[Complaint Context]\nInvalid complaint ID\n"

    system_prompt = f"""
You are an intelligent civic debate assistant.

Rules:
- Use complaint context STRICTLY
- Do not hallucinate missing data
- Be logical, concise, and helpful
- If context is weak → say it clearly

{context}
""".strip()

    messages = [
        {"role": "system", "content": system_prompt},
        *history,
        {"role": "user", "content": text}
    ]

    reply = await llm_call(messages)

    # 🔹 store per-room history
    history.append({"role": "user", "content": text})
    history.append({"role": "assistant", "content": reply})
    ai_history[complaint_id] = history[-MAX_HISTORY:]

    return reply

async def llm_call(messages: list) -> str:
    loop = asyncio.get_event_loop()

    try:
        response = await asyncio.wait_for(
            loop.run_in_executor(
                None,
                lambda: ollama.chat(
                    model="qwen2.5:7b",
                    messages=messages
                )
            ),
            timeout=20  # ⏱️ prevent hanging
        )

        return response["message"]["content"]

    except asyncio.TimeoutError:
        return "⚠️ AI timeout — try again"

    except Exception as e:
        print("LLM ERROR:", e)
        return "⚠️ AI failed to respond"

def parse_ai_input(user_text: str):
    clean_text = re.sub(r"@ai", "", user_text, flags=re.IGNORECASE)
    return clean_text.strip()