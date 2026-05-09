from pydantic import BaseModel
from typing import Optional


class AIRequest(BaseModel):
    message: str
    complaint_id: Optional[int] = 1

class ImproveRequest(BaseModel):
    message: str
