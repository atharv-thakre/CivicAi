import json
import hashlib
import os
from datetime import datetime

FILE_NAME = "blockchain/records.json"


def calculate_hash(data):
    return hashlib.sha256(data.encode()).hexdigest()


def load_chain():
    if not os.path.exists(FILE_NAME):
        return []

    try:
        with open(FILE_NAME, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []


def save_chain(chain):
    with open(FILE_NAME, "w", encoding="utf-8") as f:
        json.dump(chain, f, indent=4)


def get_previous_hash(chain):
    if not chain:
        return "GENESIS_BLOCK"
    return chain[-1]["current_hash"]


def add_record(
    ref,
    title,
    lat,
    lng,
    address,
    pincode,
    user_id=None,
    category=None,
    ai_department=None,
    ai_confidence=None,
    ai_severity=None,
    ai_tags=None,
    is_urgent=False,
    status="draft",
    assigned_to=None,
    internal_priority=0,
    upvotes=0
):
    chain = load_chain()

    created_at = str(datetime.utcnow())
    previous_hash = get_previous_hash(chain)

    block_data = (
        f"{ref}{user_id}{title}{category}{ai_department}"
        f"{ai_confidence}{ai_severity}{ai_tags}{is_urgent}"
        f"{status}{assigned_to}{lat}{lng}{address}"
        f"{pincode}{internal_priority}{upvotes}"
        f"{created_at}{previous_hash}"
    )

    current_hash = calculate_hash(block_data)

    block = {
        "ref": ref,
        "user_id": user_id,
        "title": title,

        "category": category,

        "ai_department": ai_department,
        "ai_confidence": ai_confidence,
        "ai_severity": ai_severity,
        "ai_tags": ai_tags or [],

        "is_urgent": is_urgent,
        "status": status,

        "assigned_to": assigned_to,

        "lat": lat,
        "lng": lng,
        "address": address,
        "pincode": pincode,

        "internal_priority": internal_priority,
        "upvotes": upvotes,

        "created_at": created_at,

        "previous_hash": previous_hash,
        "current_hash": current_hash
    }

    chain.append(block)
    save_chain(chain)

    print("Block Added Successfully")
    print(json.dumps(block, indent=4))


def verify_chain():
    chain = load_chain()

    if not chain:
        print("No blockchain records found")
        return False

    for i, block in enumerate(chain):
        recalculated_data = (
            f"{block['ref']}{block['user_id']}{block['title']}"
            f"{block['category']}{block['ai_department']}"
            f"{block['ai_confidence']}{block['ai_severity']}"
            f"{block['ai_tags']}{block['is_urgent']}"
            f"{block['status']}{block['assigned_to']}"
            f"{block['lat']}{block['lng']}{block['address']}"
            f"{block['pincode']}{block['internal_priority']}"
            f"{block['upvotes']}{block['created_at']}"
            f"{block['previous_hash']}"
        )

        recalculated_hash = calculate_hash(recalculated_data)

        if block["current_hash"] != recalculated_hash:
            print(f"❌ Hash mismatch at Block {i + 1}")
            return False

        if i > 0:
            if block["previous_hash"] != chain[i - 1]["current_hash"]:
                print(f"❌ Broken chain at Block {i + 1}")
                return False

    print("✅ No tampering detected")
    return True


if __name__ == "__main__":
    add_record(
        ref=1002,
        user_id=76,
        title="Pothole issue near MP Nagar",
        category="Road Maintenance",
        ai_department="Municipal Corporation",
        ai_confidence=0.94,
        ai_severity="High",
        ai_tags=["road", "pothole", "public safety"],
        is_urgent=True,
        status="open",
        assigned_to="Officer_101",
        lat=23.2599,
        lng=77.4126,
        address="MP Nagar Zone 1, Bhopal",
        pincode="462011",
        internal_priority=8.7,
        upvotes=34
    )