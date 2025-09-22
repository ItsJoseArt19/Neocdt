from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.auth.auth import get_current_active_user
from app.models.models import User
from app.schemas.schemas import CDTApplication, CDTApplicationCreate, CDTApplicationUpdate, Msg
from app.crud.crud_cdt import (
    create_cdt_application,
    get_cdt_application,
    get_cdt_applications,
    get_user_cdt_applications,
    update_cdt_application,
    delete_cdt_application
)

router = APIRouter()

@router.post("/", response_model=CDTApplication)
def create_cdt(
    cdt_in: CDTApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new CDT application
    """
    return create_cdt_application(db=db, cdt=cdt_in, owner_id=current_user.id)

@router.get("/", response_model=List[CDTApplication])
def read_cdts(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get CDT applications for the current user
    """
    return get_user_cdt_applications(
        db=db, 
        owner_id=current_user.id, 
        skip=skip, 
        limit=limit
    )

@router.get("/{cdt_id}", response_model=CDTApplication)
def read_cdt(
    cdt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific CDT application by ID
    """
    cdt = get_cdt_application(db=db, cdt_id=cdt_id)
    if not cdt:
        raise HTTPException(status_code=404, detail="CDT application not found")
    
    # Check if the CDT belongs to the current user
    if cdt.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return cdt

@router.put("/{cdt_id}", response_model=CDTApplication)
def update_cdt(
    cdt_id: int,
    cdt_update: CDTApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a CDT application
    """
    cdt = get_cdt_application(db=db, cdt_id=cdt_id)
    if not cdt:
        raise HTTPException(status_code=404, detail="CDT application not found")
    
    # Check if the CDT belongs to the current user
    if cdt.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return update_cdt_application(db=db, cdt_id=cdt_id, cdt_update=cdt_update)

@router.delete("/{cdt_id}", response_model=Msg)
def delete_cdt(
    cdt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a CDT application
    """
    cdt = get_cdt_application(db=db, cdt_id=cdt_id)
    if not cdt:
        raise HTTPException(status_code=404, detail="CDT application not found")
    
    # Check if the CDT belongs to the current user
    if cdt.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    if delete_cdt_application(db=db, cdt_id=cdt_id):
        return {"msg": "CDT application deleted successfully"}
    else:
        raise HTTPException(status_code=400, detail="Error deleting CDT application")