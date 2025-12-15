from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, AuditLog, User
import os
import datetime

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/helpdesk")

print(f"Connecting to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    # 1. Find a valid user first!
    print("Searching for a valid user...")
    user = session.query(User).first()
    
    if not user:
        print("❌ ERROR: No users found in the database! Please register a user first.")
    else:
        print(f"✅ Found User: ID={user.id} ({user.email})")

        # 2. Create the log entry with this valid ID
        log_entry = AuditLog(
            user_id=user.id,
            action="TEST_LOG_ENTRY",
            target_type="system",
            target_id=0,
            details="Debug test entry success!",
            timestamp=datetime.datetime.utcnow()
        )

        print("Attempting to add test log entry...")
        session.add(log_entry)
        session.commit()
        print("✅ SUCCESS: Test log entry added to DB!")

        # 3. Verify count
        count = session.query(AuditLog).count()
        print(f"📊 Total logs in DB: {count}")
    
    session.close()

except Exception as e:
    print(f"❌ ERROR: {e}")
