from database import SessionLocal
import models
from auth import get_password_hash
import random

def create_users_and_assign_tickets():
    db = SessionLocal()
    try:
        # 1. Create Teacher User
        teacher = db.query(models.User).filter(models.User.email == "teacher@helpdesk.com").first()
        if not teacher:
            teacher = models.User(
                email="teacher@helpdesk.com",
                hashed_password=get_password_hash("teacher123"),
                full_name="Professor X",
                role="teacher"
            )
            db.add(teacher)
            db.commit()
            db.refresh(teacher)
            print("Teacher user created (teacher@helpdesk.com)")
        else:
            print("Teacher user already exists")

        # 2. Create Employee User
        employee = db.query(models.User).filter(models.User.email == "employee@helpdesk.com").first()
        if not employee:
            employee = models.User(
                email="employee@helpdesk.com",
                hashed_password=get_password_hash("employee123"),
                full_name="John Doe",
                role="employee"
            )
            db.add(employee)
            db.commit()
            db.refresh(employee)
            print("Employee user created (employee@helpdesk.com)")
        else:
            print("Employee user already exists")

        # Get Student ID (assuming it exists from previous steps, typically ID 2)
        student = db.query(models.User).filter(models.User.role == "student").first()
        
        # 3. Distribute Orphaned Tickets
        orphaned_tickets = db.query(models.Ticket).filter(models.Ticket.owner_id == None).all()
        
        print(f"\nFound {len(orphaned_tickets)} orphaned tickets.")
        
        users_map = {
            "student": student,
            "teacher": teacher,
            "employee": employee
        }

        for ticket in orphaned_tickets:
            # Try to match ticket category to user role
            target_user = users_map.get(ticket.category)
            
            # If no match or category is different, assign based on category name matching role name
            if not target_user:
                 # Fallback: Assign randomly if category doesn't match a user role directly
                 target_user = random.choice([student, teacher, employee])
            
            if target_user:
                ticket.owner_id = target_user.id
                print(f"Assigning Ticket '{ticket.title}' (Category: {ticket.category}) -> {target_user.full_name} ({target_user.role})")
            
        db.commit()
        print("\nAll tickets have been assigned!")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_users_and_assign_tickets()
