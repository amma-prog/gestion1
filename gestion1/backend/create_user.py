from database import SessionLocal
import models
from auth import get_password_hash

def create_user():
    db = SessionLocal()
    try:
        # Check if user exists
        user = db.query(models.User).filter(models.User.email == "student@helpdesk.com").first()
        if user:
            print("User already exists")
            return

        # Create user
        new_user = models.User(
            email="student@helpdesk.com",
            hashed_password=get_password_hash("student123"),
            full_name="Test Student",
            role="student"
        )
        db.add(new_user)
        db.commit()
        print("Student user created successfully")
        print("Email: student@helpdesk.com")
        print("Password: student123")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_user()
