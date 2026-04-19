import os 
from app.database.complaints import create_complaint, is_complete , get_nearby_complaints , get_complaint
from app.database.models import Complaint
from app.auth.deps import get_current_user , get_db
from app.schemas.set_03 import ComplaintCreate , NearbyComplaintResponse , ComplaintResponse
from fastapi import APIRouter, HTTPException , UploadFile, File,Form, Depends , Query 
from sqlalchemy.orm import Session


UPLOAD_DIR = "/data/complaints"
router = APIRouter(prefix="/complaint", tags=["Complaints"])


@router.get("/nearby", response_model=list[NearbyComplaintResponse])
def get_nearby_complaints_route(
    lat: float = Query(...),
    lng: float = Query(...)
):
    return get_nearby_complaints(lat, lng)


@router.get("/", response_model=ComplaintResponse)
def get_complaint_route(complaint_id: int = Query(...)):
    complaint = get_complaint(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return ComplaintResponse(
        ref=complaint.ref,
        title=complaint.title,
        description=complaint.description,

        language=complaint.language,
        translated_text=complaint.translated_text,
        cleaned_text=complaint.cleaned_text,

        category=complaint.category,
        ai_department=complaint.ai_department,
        ai_confidence=complaint.ai_confidence,
        ai_severity=complaint.ai_severity,

        is_urgent=complaint.is_urgent,
        status=complaint.status,
        assigned_department=complaint.assigned_department,
        assigned_to=complaint.assigned_to,

        lat=complaint.lat,
        lng=complaint.lng,
        address=complaint.address,
        pincode=complaint.pincode,

        tags=complaint.tags or [],

        image_count=complaint.image_count,

        panorama_url=complaint.panorama_url,

        # 🚨 NOT IN DB → set manually
        image_front_url=f"{UPLOAD_DIR}/{complaint_id}/img_front.jpg",
        image_back_url=f"{UPLOAD_DIR}/{complaint_id}/img_back.jpg", 
        image_right_url=f"{UPLOAD_DIR}/{complaint_id}/img_right.jpg",
        image_left_url=f"{UPLOAD_DIR}/{complaint_id}/img_left.jpg",

        report_url=complaint.report_url,
        action_plan=complaint.action_plan,

        internal_priority=complaint.internal_priority,
        upvotes=complaint.upvotes,

        created_at=complaint.created_at
    )


@router.post("/create")
def create_complaint_route(complaint: ComplaintCreate , user :dict = Depends(get_current_user)):
    db_complaints = create_complaint(complaint, user["id"])
    return db_complaints


@router.post("/image")
def upload_images(
    complaint_id: int = Form(...),
    label: str = Form(...),
    image: UploadFile = File(...),
    user :dict = Depends(get_current_user),
    db : Session = Depends(get_db)

):
    allowed = ["front", "left", "right", "back"]
    if label not in allowed:
        raise HTTPException(400, "Invalid label")

    folder_path = os.path.join(UPLOAD_DIR, str(complaint_id))
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, f"img_{label}.jpg")

    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(400, "Only JPG/PNG allowed")

    with open(file_path, "wb") as f:
        while chunk := image.file.read(1024 * 1024):
            f.write(chunk)

    url_path = file_path.replace("\\", "/")

    if is_complete(complaint_id):
        db_complaint = db.query(Complaint).filter(Complaint.ref == complaint_id).first()
        if db_complaint.status == "draft":
            db_complaint.status = "submitted"
            db.commit()

            # run_ai_async(complaint_id)

    return {
        "message": "Image uploaded",
        "complaint_id": complaint_id,
        "label": label,
        "path": url_path
    }
