from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
import models

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkeychangeinproduction")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def decode_token(token: str):
    logger.info(f"DEBUG: decode_token called with: {token[:20]}...")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            logger.info("DEBUG: email is None in payload")
            return None
        return {"email": email, "role": role}
    except JWTError as e:
        logger.info(f"DEBUG: JWTError: {e}")
        return None

from sqlalchemy.orm import Session
from database import get_db

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    logger.info(f"DEBUG: get_current_user called")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = decode_token(token)
    if token_data is None:
        logger.info("Token decoding failed")
        raise credentials_exception
    
    logger.info(f"Token decoded: {token_data}")
    user = db.query(models.User).filter(models.User.email == token_data["email"]).first()
    if user is None:
        logger.info(f"User not found for email: {token_data['email']}")
        raise credentials_exception
    return user
