from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import Base, AuditLog
import os
import time

# Use localhost for running outside docker, or db inside docker
# Trying localhost first for manual run, but user likely runs this in container? 
# Actually user runs locally with python usually or inside docker.
# Let's try to be smart.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/helpdesk")

print(f"Connecting to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    
    print("Checking tables...")
    tables = inspector.get_table_names()
    print(f"Found tables: {tables}")
    
    if "audit_logs" in tables:
        print("✅ SUCCESS: 'audit_logs' table EXISTS.")
        
        # Check count
        Session = sessionmaker(bind=engine)
        session = Session()
        count = session.query(AuditLog).count()
        print(f"📊 Current Audit Logs count: {count}")
        session.close()
    else:
        print("❌ ERROR: 'audit_logs' table is MISSING!")
        print("Attempting to create it now...")
        Base.metadata.create_all(bind=engine)
        print("✅ Table created successfully.")

except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("Tip: If you are running this from Windows (not inside Docker), make sure port 5432 is exposed.")
