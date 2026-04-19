# app/database/models.py

import uuid
from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Boolean,
    Text,
    TIMESTAMP,
    ForeignKey,
    Integer,
    Float,
    UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID , JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.db import Base



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(UUID(as_uuid=True), unique=True, index=True, default=uuid.uuid4)

    handle = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=True)

    email = Column(String(255), unique=True, nullable=True, index=True)
    phone = Column(String(20), unique=True, nullable=True, index=True)
    role = Column(String(20), default="user")

    password_hash = Column(Text, nullable=True)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 🔗 ADD THESE
    complaints = relationship("Complaint", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    votes = relationship("ComplaintVote", back_populates="user")



class OTPCode(Base):
    __tablename__ = "otp_codes"

    ref = Column(Integer, primary_key=True, autoincrement=True ,index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    contact = Column(String(255), nullable=False, index=True)

    code_hash = Column(Text, nullable=False)
    purpose = Column(String(50), nullable=False)
    # 'login', 'signup', 'reset'

    expires_at = Column(TIMESTAMP, nullable=False)
    is_used = Column(Boolean, default=False)
    attempt_count = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User")



class Complaint(Base):
    __tablename__ = "complaints"

    ref = Column(Integer, primary_key=True, autoincrement=True ,index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    title = Column(Text)
    description = Column(Text, nullable=False)
    language = Column(String, default="en")

    translated_text = Column(Text,nullable=True)
    cleaned_text = Column(Text, nullable=True)

    category = Column(String, nullable=True)
    ai_department = Column(String, nullable=True)
    ai_confidence = Column(Float, nullable=True)

    ai_severity = Column(Integer, nullable=True)
    is_urgent = Column(Boolean, default=False)

    status = Column(String, default="draft") # draft , submitted, rejected, approved, assigned, resolved

    assigned_department = Column(String, nullable=True)
    assigned_to = Column(String, nullable=True)

    lat = Column(Float)
    lng = Column(Float)
    address = Column(Text)
    pincode = Column(String(10))

    tags = Column(JSONB)  # store JSON as string OR use JSONB if using Postgres properly
    panorama_url = Column(Text, nullable=True)
    image_count = Column(Integer, default=0)

    report_url = Column(Text, nullable=True)
    action_plan = Column(Text, nullable=True)

    internal_priority = Column(Float, default=0)
    upvotes = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # 🔗 Relationships
    user = relationship("User", back_populates="complaints")   # ✅ FIXED
    votes = relationship("ComplaintVote", back_populates="complaint", cascade="all, delete")
    comments = relationship("Comment", back_populates="complaint")


class ComplaintVote(Base):
    __tablename__ = "complaint_votes"

    ref = Column(Integer, primary_key=True, autoincrement=True ,index=True)
    complaint_ref = Column(Integer, ForeignKey("complaints.ref", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("complaint_ref", "user_id", name="unique_vote"),)

    # 🔗 Relationship
    complaint = relationship("Complaint", back_populates="votes")
    user = relationship("User", back_populates="votes")   # ✅ FIXED
   
class Comment(Base):
    __tablename__ = "comments"

    ref = Column(Integer, primary_key=True, autoincrement=True ,index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.ref"), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    content = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # relationships
    complaint = relationship("Complaint", back_populates="comments")
    user = relationship("User", back_populates="comments")  # ✅ now valid