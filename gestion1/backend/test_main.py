from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Help Desk API"}

def test_create_ticket():
    response = client.post(
        "/tickets",
        json={"title": "Test Ticket", "description": "This is a test ticket"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Ticket"
    assert "id" in data
    assert data["status"] == "open"

def test_get_tickets():
    # Ensure we have at least one ticket from previous test (order matters in simple script, but better to be independent)
    # For simplicity here, we just check status code
    response = client.get("/tickets")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
