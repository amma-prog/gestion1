from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    EMPLOYEE = "employee"
    ADMIN = "admin"

class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"

class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.STUDENT)
    
    tickets = relationship("Ticket", back_populates="owner")
    comments = relationship("Comment", back_populates="author")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default=TicketStatus.OPEN)
    priority = Column(String, default=TicketPriority.MEDIUM)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="tickets")
    comments = relationship("Comment", back_populates="ticket")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    author_id = Column(Integer, ForeignKey("users.id"))

    ticket = relationship("Ticket", back_populates="comments")
    author = relationship("User", back_populates="comments")
