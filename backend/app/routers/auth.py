from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import UserRegisterRequest, UserLoginRequest, AuthResponse, UserResponse
from app.services.auth_service import auth_service
from app.database import db_manager
from app.auth_deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
async def register(req: UserRegisterRequest):
    email = req.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
    
    existing = db_manager.get_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    password_hash = auth_service.hash_password(req.password)
    user = db_manager.create_user(
        email=email,
        name=req.name.strip() or email.split("@")[0].capitalize(),
        password_hash=password_hash
    )
    
    token = auth_service.create_access_token({"sub": user["id"], "email": user["email"]})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            avatar_url=user.get("avatar_url"),
            created_at=user["created_at"],
            project_count=0
        )
    )

@router.post("/login", response_model=AuthResponse)
async def login(req: UserLoginRequest):
    email = req.email.strip().lower()
    user = db_manager.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not auth_service.verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = auth_service.create_access_token({"sub": user["id"], "email": user["email"]})
    project_count = db_manager.get_user_project_count(user["id"])
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            avatar_url=user.get("avatar_url"),
            created_at=user["created_at"],
            project_count=project_count
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    count = db_manager.get_user_project_count(user["id"])
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        avatar_url=user.get("avatar_url"),
        created_at=user["created_at"],
        project_count=count
    )
