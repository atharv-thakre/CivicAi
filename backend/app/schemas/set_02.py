from pydantic import BaseModel
from typing import List, Dict


class AIRequest(BaseModel):
    message: str
    complaint_id: int

class SentimentRequest(BaseModel):
    question_1: str
    question_2: str
    question_3: str
    question_4: str
    question_5: str
    question_6: str
