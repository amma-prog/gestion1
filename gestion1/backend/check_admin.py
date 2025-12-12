from database import SessionLocal
import models
from auth import verify_password

def check_admin():
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == "admin@helpdesk.com").first()
        if user:
            print(f"User found: {user.email}")
            print(f"Role: {user.role}")
            print(f"Hashed Password: {user.hashed_password}")
            
            is_valid = verify_password("admin123", user.hashed_password)
            print(f"Password 'admin123' valid? {is_valid}")
        else:
            print("User admin@helpdesk.com NOT found")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()
