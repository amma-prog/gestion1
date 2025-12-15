from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, database, auth
from datetime import datetime

router = APIRouter(
    prefix="/audit",
    tags=["audit"]
)

def log_action(db: Session, user_id: int, action: str, target_type: str, target_id: int, details: str = None):
    """
    Helper function to create an audit log entry.
    """
    try:
        log_entry = models.AuditLog(
            user_id=user_id,
            action=action,
            target_type=target_type,
            target_id=target_id,
            details=details,
            timestamp=datetime.utcnow()
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        print(f"Failed to create audit log: {e}")
        # Don't raise exception to avoid blocking the main action

@router.get("/", response_model=List[schemas.AuditLogDisplay] if hasattr(schemas, "AuditLogDisplay") else List[dict])
def get_audit_logs(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(database.get_db)
):
    # Only admin can view audit logs
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized to view audit logs"
        )
    
    logs = db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs
