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

    complaints = relationship("Complaint", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    votes = relationship("ComplaintVote", back_populates="user")
    officer = relationship("Officer", back_populates="user", uselist=False)
    otp_codes = relationship("OTPCode", back_populates="user")
    audits = relationship("Audit", back_populates="user")



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

    user = relationship("User", back_populates="otp_codes")


class Complaint(Base):
    __tablename__ = "complaints"

    ref = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    title = Column(Text)
    description = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=True)

    category = Column(String, nullable=True)

    ai_department = Column(String, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    ai_severity = Column(String, nullable=True)
    ai_tags = Column(JSONB)

    is_urgent = Column(Boolean, default=False)
    status = Column(String, default="draft")

    assigned_to = Column(Integer, ForeignKey("officers.ref"), nullable=True)
    action_plan = Column(JSONB, nullable=True)

    lat = Column(Float)
    lng = Column(Float)
    address = Column(Text)
    pincode = Column(String(10))

    internal_priority = Column(Float, default=0)
    upvotes = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="complaints")
    votes = relationship(
        "ComplaintVote",
        back_populates="complaint",
        cascade="all, delete-orphan"
    )
    comments = relationship(
        "Comment",
        back_populates="complaint",
        cascade="all, delete-orphan"
    )

    officer = relationship("Officer", back_populates="complaints")


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
    user = relationship("User", back_populates="comments")


class Officer(Base):
    __tablename__ = "officers"

    ref = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    wallet = Column(String, unique=True, nullable=False)

    position = Column(String, nullable=True)
    department = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    complaints = relationship("Complaint", back_populates="officer")
    user = relationship("User", back_populates="officer")
    mainchain_records = relationship("Mainchain", back_populates="officer")


class Audit(Base):
    __tablename__ = "audits"

    ref = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    commit_id = Column(String, unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="audits")
    mainchain_records = relationship("Mainchain", back_populates="audit")


class Mainchain(Base):
    __tablename__ = "mainchain"

    record_id = Column(Integer, primary_key=True, nullable=False)
    hash_token = Column(String, nullable=False)
    commit_id = Column(String, ForeignKey("audits.commit_id"), nullable=False)
    wallet = Column(String, ForeignKey("officers.wallet"), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    audit = relationship("Audit", back_populates="mainchain_records")
    officer = relationship("Officer", back_populates="mainchain_records")
    