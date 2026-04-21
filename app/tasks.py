from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.models.task import TaskCreate, TaskUpdate
from app.services.task_service import (
    create_new_task, get_tasks,
    get_single_task, update_existing_task, delete_existing_task
)
from app.core.security import decode_token
from app.repositories.user_repo import get_user_by_id

router = APIRouter(prefix="/tasks", tags=["Tasks"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---- Helper: get current logged in user ----
async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = await get_user_by_id(payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": str(user["_id"]), "role": user["role"]}

# ---- Endpoints ----

@router.post("/")
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    return await create_new_task(task.dict(), current_user["id"])

@router.get("/")
async def list_tasks(
    status: str = None,
    priority: str = None,
    due_date: str = None,
    current_user: dict = Depends(get_current_user)
):
    return await get_tasks(status, priority, due_date)

@router.get("/{task_id}")
async def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    return await get_single_task(task_id)

@router.put("/{task_id}")
async def update_task(
    task_id: str,
    task: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    return await update_existing_task(task_id, task.dict(), current_user)

@router.delete("/{task_id}")
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    return await delete_existing_task(task_id, current_user)