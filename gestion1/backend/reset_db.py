from database import SessionLocal, engine
import models
from auth import get_password_hash

def reset_db():
    # Drop all tables
    models.Base.metadata.drop_all(bind=engine)
    # Create all tables
    models.Base.metadata.create_all(bind=engine)
    
    # Re-create admin
    db = SessionLocal()
    try:
        admin_user = models.User(
            email="admin@helpdesk.com",
            hashed_password=get_password_hash("admin123"),
            full_name="System Admin",
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Database reset and Admin user recreated.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_db()
