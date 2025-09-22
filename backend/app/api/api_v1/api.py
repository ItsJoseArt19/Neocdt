from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, cdt, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(cdt.router, prefix="/cdt", tags=["cdt"])
api_router.include_router(users.router, prefix="/users", tags=["users"])