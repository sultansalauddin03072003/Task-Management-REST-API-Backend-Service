from fastapi import APIRouter
from app.models.user import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register(user: UserRegister):
    return await register_user(user.dict())

@router.post("/login")
async def login(user: UserLogin):
    return await login_user(user.email, user.password)
