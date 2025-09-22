from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.models import CDTApplication
from app.schemas.schemas import CDTApplicationCreate, CDTApplicationUpdate
from datetime import datetime, timedelta

def get_cdt_application(db: Session, cdt_id: int) -> Optional[CDTApplication]:
    return db.query(CDTApplication).filter(CDTApplication.id == cdt_id).first()

def get_cdt_applications(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    owner_id: Optional[int] = None,
    status: Optional[str] = None
) -> List[CDTApplication]:
    query = db.query(CDTApplication)
    
    if owner_id:
        query = query.filter(CDTApplication.owner_id == owner_id)
    
    if status:
        query = query.filter(CDTApplication.status == status)
    
    return query.offset(skip).limit(limit).all()

def create_cdt_application(
    db: Session, 
    cdt: CDTApplicationCreate, 
    owner_id: int
) -> CDTApplication:
    db_cdt = CDTApplication(
        **cdt.dict(),
        owner_id=owner_id
    )
    db.add(db_cdt)
    db.commit()
    db.refresh(db_cdt)
    return db_cdt

def update_cdt_application(
    db: Session, 
    cdt_id: int, 
    cdt_update: CDTApplicationUpdate
) -> Optional[CDTApplication]:
    cdt = get_cdt_application(db, cdt_id)
    if cdt:
        update_data = cdt_update.dict(exclude_unset=True)
        
        # If status is being updated to approved, set approval_date and maturity_date
        if "status" in update_data and update_data["status"] == "approved":
            update_data["approval_date"] = datetime.utcnow()
            if cdt.term_days:
                update_data["maturity_date"] = datetime.utcnow() + timedelta(days=cdt.term_days)
        
        for field, value in update_data.items():
            setattr(cdt, field, value)
        
        db.commit()
        db.refresh(cdt)
    return cdt

def delete_cdt_application(db: Session, cdt_id: int) -> bool:
    cdt = get_cdt_application(db, cdt_id)
    if cdt:
        db.delete(cdt)
        db.commit()
        return True
    return False

def get_user_cdt_applications(
    db: Session, 
    owner_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[CDTApplication]:
    return db.query(CDTApplication).filter(
        CDTApplication.owner_id == owner_id
    ).offset(skip).limit(limit).all()