from pydantic import BaseModel
from datetime import datetime


class CreateMainchainRecord(BaseModel):
    record_id: int
    hash_token: str
    commit_id: str
    wallet: str