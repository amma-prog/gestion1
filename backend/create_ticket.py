from database import SessionLocal
import models
from passlib.context import CryptContext

db = SessionLocal()

# Get student user
student = db.query(models.User).filter(models.User.email == "student@helpdesk.com").first()
if not student:
    print("Student user not found! Run create_user.py first.")
    exit(1)

# Create ticket
ticket = models.Ticket(
    title="Test Ticket for Eye Button",
    description="This is a test ticket to verify the UI.",
    status="open",
    priority="high",
    category="student",
    owner_id=student.id
)

db.add(ticket)
db.commit()
print("Test ticket created successfully!")
db.close()
