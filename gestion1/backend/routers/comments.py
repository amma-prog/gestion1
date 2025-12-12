from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth, database

router = APIRouter(
    prefix="/tickets/{ticket_id}/comments",
    tags=["comments"]
)

@router.get("/", response_model=List[schemas.Comment])
def read_comments(ticket_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Verify ticket exists and user has access
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if current_user.role != "admin" and ticket.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view comments for this ticket")

    return db.query(models.Comment).filter(models.Comment.ticket_id == ticket_id).all()

@router.post("/", response_model=schemas.Comment)
def create_comment(ticket_id: int, comment: schemas.CommentCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Verify ticket exists and user has access
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if current_user.role != "admin" and ticket.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to comment on this ticket")

    db_comment = models.Comment(
        content=comment.content,
        ticket_id=ticket_id,
        author_id=current_user.id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
