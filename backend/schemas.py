from pydantic import BaseModel
from datetime import datetime

class TodoCreate(BaseModel):
    title: str

class TodoResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True