import os 
from sqlalchemy import func
from concurrent.futures import ThreadPoolExecutor
from app.database.db import SessionLocal
from app.schemas.set_03 import ComplaintCreate
from app.database.models import Complaint
from fastapi import HTTPException


executor = ThreadPoolExecutor(max_workers=4)
UPLOAD_DIR = "data/complaints"
REQUIRED_LABELS = ["front", "left", "right", "back"]


def create_complaint(complaint: ComplaintCreate, id: int):
    db = SessionLocal()
    db_complaint = Complaint(
        **complaint.model_dump(),
        user_id=id   
    )

    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint


def get_complaint(complaint_id: int):
    db = SessionLocal()
    complaint = db.query(Complaint).filter(Complaint.ref == complaint_id).first()
    db.close()
    if not complaint:
        raise HTTPException(404, "Complaint not found")
    return complaint


def get_nearby_complaints(lat: float, lng: float, radius_km: float = 1):
    db = SessionLocal()
    distance_expr = 6371 * func.acos(
        func.cos(func.radians(lat)) *
        func.cos(func.radians(Complaint.lat)) *
        func.cos(func.radians(Complaint.lng) - func.radians(lng)) +
        func.sin(func.radians(lat)) *
        func.sin(func.radians(Complaint.lat))
    )

    results = (
        db.query(Complaint)
        .filter(Complaint.status != "rejected")
        .filter(Complaint.lat.isnot(None), Complaint.lng.isnot(None))
        .filter(distance_expr < radius_km)
        .order_by(distance_expr)
        .limit(10)
        .all()
    )
    db.close()
    return results


def is_complete(complaint_id: int):
    base = os.path.join(UPLOAD_DIR, str(complaint_id))
    return all(
        os.path.exists(os.path.join(base, f"img_{label}.jpg"))
        for label in REQUIRED_LABELS
    )




# def run_ai_async(complaint_id: int):
#     thread = threading.Thread(
#         target=ai_process_complaint,
#         args=(complaint_id,),
#         daemon=True   # 🔥 important
#     )
#     thread.start()



