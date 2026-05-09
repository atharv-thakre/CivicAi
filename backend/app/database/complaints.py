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

def get_user_complaints(user_id: int):
    db = SessionLocal()
    complaints = db.query(Complaint).filter(Complaint.user_id == user_id).all()
    db.close()
    return complaints


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


def upsert_img_analysis(complaint_id: int, analysis: dict):
    db = SessionLocal()
    if analysis.get("priority") >= 8 :
        urgent = True
    else:
        urgent = False
    try:
        result = (
            db.query(Complaint)
            .filter(Complaint.ref == complaint_id)
            .update({
                Complaint.ai_department: analysis.get("department"),
                Complaint.ai_severity: analysis.get("severity"),
                Complaint.ai_confidence: analysis.get("confidence"),
                Complaint.ai_tags: analysis.get("tags", []),
                Complaint.internal_priority: analysis.get("priority", None),
                Complaint.is_urgent: urgent
            })
        )
        if result == 0:
            raise HTTPException(status_code=404, detail="Complaint not found")

        db.commit()

    except Exception as e:
        db.rollback()
        raise e
    
    finally:
        db.close()

def upsert_translation(complaint_id: int, text :str):
    db = SessionLocal()
    try:
        result = (
            db.query(Complaint)
            .filter(Complaint.ref == complaint_id)
            .update({
                Complaint.translated_text: text
            })
        )
        if result == 0:
            raise HTTPException(status_code=404, detail="Complaint not found")

        db.commit()

    except Exception as e:
        db.rollback()
        raise e

    finally:
        db.close()

def upsert_action_plan(complaint_id: int, analysis: dict):
    db = SessionLocal()
    try:
        result = (
            db.query(Complaint)
            .filter(Complaint.ref == complaint_id)
            .update({
                Complaint.action_plan: {
                    "root_cause": analysis.get("root_cause"),
                    "impact": analysis.get("impact"),
                    "action_plan": analysis.get("action_plan", []),
                    "eta": analysis.get("eta"),
                    "resources": analysis.get("resources", [])
                }
            })
        )

        if result == 0:
            raise HTTPException(status_code=404, detail="Complaint not found")

        db.commit()

    except Exception as e:
        db.rollback()
        raise e

    finally:
        db.close()


def update_complaint_status(complaint_id: int, status: str):
    db = SessionLocal()
    try:
        result = (
            db.query(Complaint)
            .filter(Complaint.ref == complaint_id)
            .update({
                Complaint.status: status
            })
        )

        if result == 0:
            raise HTTPException(status_code=404, detail="Complaint not found")

        db.commit()

    except Exception as e:
        db.rollback()
        raise e

    finally:
        db.close()



