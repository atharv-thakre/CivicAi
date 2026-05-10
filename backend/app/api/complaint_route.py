import os 
from bin.utils import to_dict
from blockchain.remote import push
from blockchain.chain import add_record
from app.control.execute import execute
from app.auth.deps import get_current_user 
from app.schemas.set_03 import ComplaintCreate , NearbyComplaintResponse , ComplaintResponse
from fastapi import APIRouter, HTTPException , UploadFile, File,Form, Depends , Query , BackgroundTasks
from app.database.complaints import create_complaint, get_nearby_complaints , get_complaint , update_complaint_status


UPLOAD_DIR = os.path.abspath("data/complaints")
UPLOAD_DIR_PATH = "/data/complaints"
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
        translated_text=complaint.translated_text,
        category=complaint.category,

        ai_department=complaint.ai_department,
        ai_confidence=complaint.ai_confidence,
        ai_severity=complaint.ai_severity,
        ai_tags=complaint.ai_tags or [],

        is_urgent=complaint.is_urgent,
        status=complaint.status,
        assigned_to=complaint.assigned_to,

        lat=complaint.lat,
        lng=complaint.lng,
        address=complaint.address,
        pincode=complaint.pincode,

        image_url=f"{UPLOAD_DIR_PATH}/{complaint_id}/img_main.jpg",
        report_url=f"/report/{complaint_id}",
        action_plan=complaint.action_plan or {},

        internal_priority=complaint.internal_priority,
        upvotes=complaint.upvotes,
        created_at=complaint.created_at
    )



@router.post("/create")
def create_complaint_route(
    bg : BackgroundTasks,
    complaint: ComplaintCreate = Depends(ComplaintCreate.as_form),
    image: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    db_complaints = create_complaint(complaint, user["id"])

    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(400, "Only JPG/PNG allowed")

    folder_path = os.path.join(UPLOAD_DIR, str(db_complaints.ref))
    os.makedirs(folder_path, exist_ok=True)

    ext = ".jpg" if image.content_type == "image/jpeg" else ".png"
    file_path = os.path.join(folder_path, f"img_main{ext}")

    with open(file_path, "wb") as f:
        while chunk := image.file.read(1024 * 1024):
            f.write(chunk)
    
    bg.add_task(execute, db_complaints.ref)
    complaint = to_dict(db_complaints)
    add_record(
        ref=complaint["ref"],
        user_id=complaint["user_id"],
        title=complaint["title"],
        lat=complaint["lat"],
        lng=complaint["lng"],
        address=complaint["address"],
        pincode=complaint["pincode"],
        category=complaint["category"],
        ai_department=complaint["ai_department"],
        ai_confidence=complaint["ai_confidence"],
        ai_severity=complaint["ai_severity"],
        ai_tags=complaint["ai_tags"],
        status=complaint["status"],
        is_urgent=complaint["is_urgent"],
        assigned_to=complaint["assigned_to"],
        internal_priority=complaint["internal_priority"],
        upvotes=complaint["upvotes"]
               )
    bg.add_task(push)
    return db_complaints



@router.post("/image")
def upload_images(
    complaint_id: int = Form(...),
    label: str = Form(...),
    image: UploadFile = File(...),
    user :dict = Depends(get_current_user)

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

    return {
        "message": "Image uploaded",
        "complaint_id": complaint_id,
        "label": label,
        "path": url_path
    }



@router.put("/status")
def update_complaint_status_route(
    bg : BackgroundTasks,
    complaint_id: int = Form(...),
    status: str = Form(...),
    user :dict = Depends(get_current_user)
):
    complaint = to_dict(get_complaint(complaint_id))
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    status = update_complaint_status(complaint_id=complaint_id, status=status)
    if not status:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    add_record(
        ref=complaint["ref"],
        user_id=complaint["user_id"],
        title=complaint["title"],
        lat=complaint["lat"],
        lng=complaint["lng"],
        address=complaint["address"],
        pincode=complaint["pincode"],
        category=complaint["category"],
        ai_department=complaint["ai_department"],
        ai_confidence=complaint["ai_confidence"],
        ai_severity=complaint["ai_severity"],
        ai_tags=complaint["ai_tags"],
        status=complaint["status"],
        is_urgent=complaint["is_urgent"],
        assigned_to=complaint["assigned_to"],
        internal_priority=complaint["internal_priority"],
        upvotes=complaint["upvotes"]
               )
    bg.add_task(push)
    return {"message": f"Complaint : {complaint_id} status updated to {status}"}
