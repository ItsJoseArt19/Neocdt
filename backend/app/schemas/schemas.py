from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str

# CDT Application schemas
class CDTApplicationBase(BaseModel):
    amount: Decimal
    term_days: int
    interest_rate: Decimal
    notes: Optional[str] = None

class CDTApplicationCreate(CDTApplicationBase):
    pass

class CDTApplicationUpdate(BaseModel):
    amount: Optional[Decimal] = None
    term_days: Optional[int] = None
    interest_rate: Optional[Decimal] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class CDTApplicationInDBBase(CDTApplicationBase):
    id: Optional[int] = None
    owner_id: int
    status: str
    application_date: Optional[datetime] = None
    approval_date: Optional[datetime] = None
    maturity_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class CDTApplication(CDTApplicationInDBBase):
    owner: Optional[User] = None

class CDTApplicationInDB(CDTApplicationInDBBase):
    pass

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# Message schema
class Msg(BaseModel):
    msg: str