from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Ticket, Comment
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/helpdesk")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

print("--- DEBUGGING COMMENTS ---")

# 1. Find Teachers and Employees
special_users = session.query(User).filter(User.role.in_(['teacher', 'employee'])).all()
print(f"Found {len(special_users)} Teachers/Employees.")

for user in special_users:
    print(f"\nUser: {user.full_name} ({user.email}) - ID: {user.id} - Role: {user.role}")
    
    # 2. Find their tickets
    tickets = session.query(Ticket).filter(Ticket.owner_id == user.id).all()
    print(f"  Has {len(tickets)} tickets.")
    
    for ticket in tickets:
        print(f"    Ticket #{ticket.id}: {ticket.title}")
        
        # 3. Find comments on this ticket
        comments = session.query(Comment).filter(Comment.ticket_id == ticket.id).all()
        print(f"      Comments: {len(comments)}")
        for c in comments:
            author = session.query(User).get(c.author_id)
            print(f"        - [{c.created_at}] {author.full_name} ({author.role}): {c.content}")

session.close()
