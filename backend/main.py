from fastapi import FastAPI, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, auth
from routers import auth as auth_router
from routers import comments as comments_router
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Create tables
models.Base.metadata.create_all(bind=database.engine)

# Rate limiting configuration
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

app = FastAPI(title="Help Desk API", version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(auth_router.router)
app.include_router(comments_router.router)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Help Desk API with PostgreSQL"}

@app.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/tickets", response_model=List[schemas.Ticket])
def get_tickets(skip: int = 0, limit: int = 100, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Admin voit tous les tickets
    if current_user.role == "admin":
        tickets = db.query(models.Ticket).offset(skip).limit(limit).all()
    else:
        # Utilisateur normal voit seulement ses tickets
        tickets = db.query(models.Ticket).filter(models.Ticket.owner_id == current_user.id).offset(skip).limit(limit).all()
    return tickets

@app.post("/tickets", response_model=schemas.Ticket)
def create_ticket(ticket: schemas.TicketCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_ticket = models.Ticket(**ticket.model_dump(), owner_id=current_user.id)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@app.get("/tickets/{ticket_id}", response_model=schemas.Ticket)
def read_ticket(ticket_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Vérifier que l'utilisateur peut voir ce ticket
    if current_user.role != "admin" and db_ticket.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this ticket")
    
    return db_ticket

@app.patch("/tickets/{ticket_id}", response_model=schemas.Ticket)
def update_ticket_status(ticket_id: int, status: str, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Seul l'admin peut modifier les tickets
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update tickets")
    
    db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db_ticket.status = status
    db.commit()
    db.refresh(db_ticket)
    return db_ticket
