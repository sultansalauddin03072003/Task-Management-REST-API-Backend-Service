from app.repositories.task_repo import (
    create_task, get_all_tasks,
    get_task_by_id, update_task, delete_task
)
from fastapi import HTTPException

async def create_new_task(task_data: dict, owner_id: str):
    task_data["owner_id"] = owner_id
    task_id = await create_task(task_data)
    return {"message": "Task created successfully", "id": task_id}

async def get_tasks(status=None, priority=None, due_date=None):
    filters = {}
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority
    if due_date:
        filters["due_date"] = due_date
    return await get_all_tasks(filters)

async def get_single_task(task_id: str):
    task = await get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task["id"] = str(task["_id"])
    return task

async def update_existing_task(task_id: str, update_data: dict, current_user: dict):
    task = await get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Only owner or admin can update
    if str(task["owner_id"]) != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    clean_data = {k: v for k, v in update_data.items() if v is not None}
    await update_task(task_id, clean_data)
    return {"message": "Task updated successfully"}

async def delete_existing_task(task_id: str, current_user: dict):
    task = await get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Only admin can delete
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete tasks")

    await delete_task(task_id)
    return {"message": "Task deleted successfully"}