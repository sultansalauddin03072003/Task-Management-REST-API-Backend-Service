from app.repositories.user_repo import create_user, get_user_by_email
from app.core.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException

async def register_user(user_data: dict):
    # Check if email already exists
    existing = await get_user_by_email(user_data["email"])
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password before saving
    user_data["password"] = hash_password(user_data["password"])
    user_id = await create_user(user_data)
    return {"message": "User registered successfully", "id": user_id}

async def login_user(email: str, password: str):
    # Find user by email
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify password
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Create JWT token
    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}
