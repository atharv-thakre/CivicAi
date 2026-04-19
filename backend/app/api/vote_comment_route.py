
from app.auth.deps import get_current_user , get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.database.vote_comment import set_vote, drop_vote , get_comments , create_comment
from app.schemas.set_03 import Vote , CommentRequest

router = APIRouter(tags=["Votes & Comments"])

#============================Votes============================

@router.post("/vote")
def create_vote_route(
    data: Vote,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    return set_vote(db, data.complaint_id, user["id"])


@router.delete("/vote")
def drop_vote_route(
    data: Vote,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    return drop_vote(db, data.complaint_id, user["id"])

#============================Comments============================

@router.get("/comment")
def get_comments_route(
    complaint_id: int,
    user: dict = Depends(get_current_user)
):
    return get_comments(complaint_id)

@router.post("/comment")
def create_comment_route(
    data: CommentRequest,
    user: dict = Depends(get_current_user)
):
    return create_comment(complaint_id=data.complaint_id,content=data.content,user_id=user["id"])