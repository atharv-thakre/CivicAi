
from sqlalchemy import func
from sqlalchemy.orm import Session , joinedload
from app.database.db import SessionLocal
from app.database.models import Complaint , ComplaintVote , Comment
from fastapi import HTTPException



# ===================== COUNT =====================
def get_vote_count(db: Session, complaint_id: int):
    return db.query(func.count(ComplaintVote.ref))\
        .filter(ComplaintVote.complaint_ref == complaint_id)\
        .scalar()


# ===================== UPDATE COUNT =====================
def update_vote_count(db: Session, complaint_id: int):
    count = get_vote_count(db, complaint_id)

    db.query(Complaint).filter(Complaint.ref == complaint_id).update({
        Complaint.upvotes: count
    })

    db.commit()
    return count


# ===================== SET VOTE =====================
def set_vote(db: Session, complaint_id: int, user_id: int):

    # 🚫 prevent duplicate vote
    existing = db.query(ComplaintVote).filter(
        ComplaintVote.complaint_ref == complaint_id,
        ComplaintVote.user_id == user_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already voted")

    db_vote = ComplaintVote(
        complaint_ref=complaint_id,
        user_id=user_id,
    )

    db.add(db_vote)
    db.commit()

    count = update_vote_count(db, complaint_id)

    return {
        "message": "Vote added",
        "vote_count": count
    }


# ===================== DROP VOTE =====================
def drop_vote(db: Session, complaint_id: int, user_id: int):

    db_vote = db.query(ComplaintVote).filter(
        ComplaintVote.complaint_ref == complaint_id,
        ComplaintVote.user_id == user_id
    ).first()

    if not db_vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    db.delete(db_vote)
    db.commit()

    count = update_vote_count(db, complaint_id)

    return {
        "message": "Vote removed",
        "vote_count": count
    }

# ===================== COMMENT =====================
def create_comment(complaint_id: int, content: str, user_id: int):
    db = SessionLocal()
    db_comment = Comment(
        complaint_id=complaint_id,
        user_id=user_id,
        content=content,
    )

    db.add(db_comment)
    db.commit()
    return {
        "message": "Comment added",
        "complaint_id": complaint_id,
        "user_name": db_comment.user.name if db_comment.user else "Anonymous",
        "comment_id": db_comment.ref,
        "content": content
    }


def get_comments(complaint_id: int):
    db = SessionLocal()

    comments = db.query(Comment)\
        .options(joinedload(Comment.user))\
        .filter(Comment.complaint_id == complaint_id)\
        .all()

    db.close()

    return [
        {
            "id": c.id,
            "content": c.content,
            "user_name": c.user.name if c.user else "Anonymous",
            "created_at": c.created_at
        }
        for c in comments
    ]
