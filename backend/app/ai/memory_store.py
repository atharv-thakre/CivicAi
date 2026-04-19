from collections import defaultdict
user_sessions = defaultdict(list)

MAX_HISTORY = 10

def get_history(uid: str):
    return user_sessions[uid][-MAX_HISTORY:]


def add_message(uid: str, role: str, content: str):
    user_sessions[uid].append({
        "role": role,
        "content": content
    })

    if len(user_sessions[uid]) > MAX_HISTORY:
        user_sessions[uid] = user_sessions[uid][-MAX_HISTORY:]