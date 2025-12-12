from database import SessionLocal
import models
from auth import get_password_hash

def create_admin():
    db = SessionLocal()
    try:
        # Check if admin exists
        admin = db.query(models.User).filter(models.User.email == "admin@helpdesk.com").first()
        if admin:
            print("Admin user already exists")
            return

        # Create admin
        admin_user = models.User(
            email="admin@helpdesk.com",
            hashed_password=get_password_hash("admin123"),
            full_name="System Admin",
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully")
        print("Email: admin@helpdesk.com")
        print("Password: admin123")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
