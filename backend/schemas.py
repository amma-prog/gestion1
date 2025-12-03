from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class TicketBase(BaseModel):
    title: str
    description: str
    priority: str = "medium"
    category: str

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id: int
    status: str
    created_at: datetime
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str = "student"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    tickets: List[Ticket] = []

    class Config:
        from_attributes = True
