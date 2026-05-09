from app.database.complaints import get_user_complaints
from app.database.getuser import get_user_v0
from bin.utils import to_dict_list

from fastapi import APIRouter , Depends
from app.auth.deps import get_current_user

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/complaints")
def list_complaints(current_user: dict = Depends(get_current_user)):
    return to_dict_list(get_user_complaints(current_user["id"]))


