from pydantic import BaseModel
from typing import Optional
from datetime import date

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"      # pending, in_progress, completed
    priority: Optional[str] = "medium"     # low, medium, high
    due_date: Optional[str] = None         # format: "2026-05-01"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[str]
    owner_id: str
