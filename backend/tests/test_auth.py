def test_register_user(client, test_user):
    response = client.post("/api/v1/auth/register", json=test_user)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["username"] == test_user["username"]
    assert data["full_name"] == test_user["full_name"]
    assert "id" in data

def test_register_duplicate_user(client, test_user):
    # Register user first time
    client.post("/api/v1/auth/register", json=test_user)
    
    # Try to register same user again
    response = client.post("/api/v1/auth/register", json=test_user)
    assert response.status_code == 400

def test_login_user(client, test_user):
    # Register user first
    client.post("/api/v1/auth/register", json=test_user)
    
    # Login
    login_data = {
        "username": test_user["username"],
        "password": test_user["password"]
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client, test_user):
    # Register user first
    client.post("/api/v1/auth/register", json=test_user)
    
    # Login with wrong password
    login_data = {
        "username": test_user["username"],
        "password": "wrongpassword"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 401