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

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime
    author_id: int
    ticket_id: int
    
    class Config:
        from_attributes = True

class Ticket(TicketBase):
    id: int
    status: str
    created_at: datetime
    owner_id: Optional[int] = None
    owner: Optional["UserBase"] = None
    comments: List[Comment] = []

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

class AuditLogBase(BaseModel):
    action: str
    target_type: str
    target_id: int
    details: Optional[str] = None

class AuditLogDisplay(AuditLogBase):
    id: int
    user_id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True
