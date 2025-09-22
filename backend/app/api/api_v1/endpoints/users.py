from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.auth import get_current_active_user
from app.models.models import User
from app.schemas.schemas import User as UserSchema

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user
    """
    return current_user