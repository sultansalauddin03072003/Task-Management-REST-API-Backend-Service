from app.core.config import MONGO_URL, DB_NAME
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def create_task(task_data: dict):
    result = await db.tasks.insert_one(task_data)
    return str(result.inserted_id)

async def get_all_tasks(filters: dict = {}):
    tasks = []
    async for task in db.tasks.find(filters):
        task["id"] = str(task["_id"])
        del task["_id"]
        tasks.append(task)
    return tasks

async def get_task_by_id(task_id: str):
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    return task

async def update_task(task_id: str, update_data: dict):
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )

async def delete_task(task_id: str):
    await db.tasks.delete_one({"_id": ObjectId(task_id)})
