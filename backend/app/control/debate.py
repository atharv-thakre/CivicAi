from fastapi import WebSocket
from datetime import datetime
from app.database.complaints import get_complaint
import asyncio , ollama , re


class ConnectionManager:
    def __init__(self):
        self.active: list[dict] = []

    async def connect(self, ws: WebSocket, username: str, user_id: int):
        await ws.accept()

        # prevent duplicate ws
        self.active = [c for c in self.active if c["ws"] is not ws]

        self.active.append({
            "ws": ws,
            "user": username,
            "user_id": user_id
        })

        await self.broadcast(f"🟢 {username} joined the chat", "system")

    def disconnect(self, ws: WebSocket):
        entry = next((c for c in self.active if c["ws"] is ws), None)
        if entry:
            self.active.remove(entry)
            return entry["user"]
        return "Unknown"

    async def broadcast(self, message: str, sender: str, user_id: int = None):
        ts = datetime.now().strftime("%H:%M")
        payload = {
            "sender": sender,
            "user_id": user_id,
            "message": message,
            "time": ts
        }

        for conn in self.active[:]:
            try:
                await conn["ws"].send_json(payload)
            except Exception:
                self.active.remove(conn)

    @property
    def users(self):
        return [c["user"] for c in self.active]


manager = ConnectionManager()



async def broadcast_users():
    participants = manager.users
    payload = {
    "type": "users",
    "count": len(manager.active),
    "users": ["Civic AI"] + participants
}
    for conn in manager.active[:]:
        try:
            await conn["ws"].send_json(payload)
        except:
            manager.active.remove(conn)



# 🔹 Global AI lock
ai_busy = False

# 🔹 In-memory history (optional)
ai_history = []
MAX_HISTORY = 10


# =========================
# 🔥 MAIN HANDLER
# =========================
async def handle_ai_response(user_text: str, username: str):
    global ai_busy

    # 🚫 prevent multiple AI calls
    if ai_busy:
        return

    ai_busy = True

    ai_name = "Civic AI"
    ai_id = -1

    # 🔹 clean trigger text
    clean_text , complaint_id = parse_ai_input(user_text)

    stop_event = asyncio.Event()
    typing_task = asyncio.create_task(ai_typing_loop(stop_event))

    try:
        ai_reply = await generate_ai_reply(clean_text, complaint_id)

    except Exception as e:
        print("AI ERROR:", e)
        ai_reply = "⚠️ AI failed to respond"

    finally:
        # 🔹 stop typing loop gracefully
        stop_event.set()
        try:
            await typing_task
        except asyncio.CancelledError:
            pass

        # 🔹 release lock
        ai_busy = False

    # 🔹 send AI message
    await manager.broadcast(ai_reply, ai_name, ai_id)


# =========================
# 💬 TYPING LOOP
# =========================
async def ai_typing_loop(stop_event):
    while not stop_event.is_set():
        for conn in manager.active:
            try:
                await conn["ws"].send_json({
                    "type": "typing",
                    "user": "AI"
                })
            except:
                pass

        await asyncio.sleep(0.7)


# =========================
# 🧠 AI RESPONSE
# =========================
async def generate_ai_reply(text: str, complaint_id: int = None) -> str:
    global ai_history

    context = ""

    # 🔹 Fetch complaint safely
    if complaint_id:
        complaint = get_complaint(complaint_id)

        if complaint:
            context = f"""
[Complaint Context]
Title: {complaint.title}
Tags: {complaint.tags}
Description: {complaint.cleaned_text}
"""
        else:
            context = "\n[Complaint Context]\nInvalid complaint ID\n"

    # 🔹 System prompt
    system_prompt = f"""
You are an intelligent debate assistant.

Instructions:
- Use the provided complaint context (if available) to generate accurate, logical, and relevant responses.
- If complaint context is missing, invalid, or incomplete, clearly mention this in your response.
- Do NOT assume missing details.
- Keep responses concise and argumentative when appropriate.

{context}
""".strip()
    
    messages = [
        {"role": "system", "content": system_prompt.strip()},
        *ai_history,
        {"role": "user", "content": text}
    ]

    reply = await llm_call(messages)

    # 🔹 store history (limit size)
    ai_history.append({"role": "user", "content": text})
    ai_history.append({"role": "assistant", "content": reply})
    ai_history[:] = ai_history[-MAX_HISTORY:]

    return reply


# =========================
# 🤖 LLM CALL (OLLAMA)
# =========================
async def llm_call(messages: list) -> str:
    loop = asyncio.get_event_loop()

    response = await loop.run_in_executor(
        None,
        lambda: ollama.chat(
            model="qwen2.5:7b",
            messages=messages
        )
    )

    return response["message"]["content"]


def parse_ai_input(user_text: str):
    complaint_id = None

    # 🔹 extract complaint id (numbers only)
    match = re.search(r"\?complaint=(\d+)", user_text)
    if match:
        complaint_id = int(match.group(1))

    # 🔹 remove @ai and query param cleanly
    clean_text = re.sub(r"@ai", "", user_text, flags=re.IGNORECASE)
    clean_text = re.sub(r"\?complaint=\d+", "", clean_text)

    clean_text = clean_text.strip()

    return clean_text, complaint_id