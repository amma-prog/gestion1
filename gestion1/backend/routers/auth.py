from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Annotated
from slowapi import Limiter
from slowapi.util import get_remote_address
import models, schemas, auth, database

router = APIRouter(tags=["Authentication"])
limiter = Limiter(key_func=get_remote_address)

@router.post("/register", response_model=schemas.User)
@limiter.limit("3/minute")
def register_user(request: Request, user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token", response_model=schemas.Token)
@limiter.limit("5/minute")
def login_for_access_token(request: Request, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(database.get_db)):
    print(f"Login attempt for username: '{form_data.username}'")
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if user:
        print(f"User found: {user.email}, Role: {user.role}")
        is_valid = auth.verify_password(form_data.password, user.hashed_password)
        print(f"Password valid: {is_valid}")
    else:
        print("User not found")

    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
