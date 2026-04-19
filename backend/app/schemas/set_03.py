from datetime import datetime
from pydantic import BaseModel, Field 

class ComplaintCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Detailed complaint (10–1000 characters)"
    )

    language: str = Field(default="en", max_length=30)
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    address: str  = Field(..., max_length=300)
    pincode: str = Field(..., min_length=6, max_length=6)
    category: str | None = None


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
    tags : list[str]
    upvotes: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ComplaintResponse(BaseModel):
    ref: int
    title: str

    description: str
    language: str | None = None
    translated_text: str | None = None
    cleaned_text: str | None = None

    category: str | None = None
    ai_department: str | None = None
    ai_confidence: float | None = None
    ai_severity: int | None = None

    is_urgent: bool | None = None
    status: str 
    assigned_department: str | None = None
    assigned_to: str | None = None

    lat: float | None = None
    lng: float | None = None
    address: str 
    pincode: str 

    tags : list[str]
    image_count: int | None = None

    panorama_url: str | None = None
    image_front_url: str | None = None
    image_back_url: str | None = None
    image_right_url: str | None = None
    image_left_url: str | None = None
    report_url: str | None = None
    action_plan: str | None = None

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
