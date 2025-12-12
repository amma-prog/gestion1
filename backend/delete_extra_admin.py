from database import SessionLocal
import models

def cleanup_admin():
    db = SessionLocal()
    try:
        # Check for the extra admin
        extra_admin = db.query(models.User).filter(models.User.email == "admin@gestion.com").first()
        if extra_admin:
            print(f"Deleting duplicate admin: {extra_admin.email} (ID: {extra_admin.id})")
            db.delete(extra_admin)
            db.commit()
            print("Cleanup successful.")
        else:
            print("No duplicate admin found.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_admin()
