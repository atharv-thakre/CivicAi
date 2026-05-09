from datetime import datetime
from pydantic import BaseModel, Field 

from fastapi import Form

class ComplaintCreate(BaseModel):
    title: str
    description: str
    lat: float
    lng: float
    address: str
    pincode: str
    category: str

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        description: str = Form(...),
        lat: float = Form(...),
        lng: float = Form(...),
        address: str = Form(...),
        pincode: str = Form(...),
        category: str = Form(...),
    ):
        return cls(
            title=title,
            description=description,
            lat=lat,
            lng=lng,
            address=address,
            pincode=pincode,
            category=category,
        )


class Coordinates(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class NearbyComplaintResponse(BaseModel):
    ref: int
    title: str
    description: str
    status: str 
    category: str | None = None
    address: str 
    pincode: str 
    ai_tags : list[str]
    upvotes: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ComplaintResponse(BaseModel):
    ref: int
    title: str

    description: str
    translated_text: str | None = None

    category: str | None = None
    ai_department: str | None = None
    ai_confidence: float | None = None
    ai_severity: str | None = None
    ai_tags : list[str]

    is_urgent: bool | None = None
    status: str 
    assigned_to: str | None = None

    lat: float | None = None
    lng: float | None = None
    address: str 
    pincode: str 

    image_url: str | None = None

    report_url: str | None = None
    action_plan: dict | None = None

    internal_priority: float | None = None
    upvotes: int
    created_at: datetime
    class Config:
        from_attributes = True

class Vote(BaseModel):
    complaint_id: int

class CommentRequest(BaseModel):
    complaint_id: int
    content: str = Field(..., min_length=10, max_length=1000)
