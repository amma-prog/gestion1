from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="Help Desk API", version="0.1.0")

class Ticket(BaseModel):
    id: str
    title: str
    description: str
    status: str = "open"

class TicketCreate(BaseModel):
    title: str
    description: str

# In-memory storage for demo purposes
tickets: List[Ticket] = []

@app.get("/")
def read_root():
    return {"message": "Welcome to Help Desk API"}

@app.get("/tickets", response_model=List[Ticket])
def get_tickets():
    return tickets

@app.post("/tickets", response_model=Ticket)
def create_ticket(ticket: TicketCreate):
    new_ticket = Ticket(
        id=str(uuid.uuid4()),
        title=ticket.title,
        description=ticket.description,
        status="open"
    )
    tickets.append(new_ticket)
    return new_ticket
