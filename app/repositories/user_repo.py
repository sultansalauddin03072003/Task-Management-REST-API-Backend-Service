from app.core.config import MONGO_URL, DB_NAME
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def create_user(user_data: dict):
    result = await db.users.insert_one(user_data)
    return str(result.inserted_id)

async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email})
    return user

async def get_user_by_id(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return user