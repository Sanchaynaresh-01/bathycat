from fastapi.testclient import TestClient

def test_configurator_flow(client: TestClient):
    # 1. Create an admin user to add products
    client.post(
        "/api/v1/auth/register",
        json={"email": "admin@example.com", "password": "password", "full_name": "Admin User", "role": "Admin"}
    )
    
    # Login admin
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@example.com", "password": "password"}
    )
    admin_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 2. Add a product
    prod_resp = client.post(
        "/api/v1/products/",
        json={"name": "Bathycat Professional", "description": "Pro survey boat", "base_price": 250000},
        headers=headers
    )
    assert prod_resp.status_code == 200
    product_id = prod_resp.json()["id"]
    
    # 3. Add a Component Category
    cat_resp = client.post(
        "/api/v1/components/categories",
        json={"name": "Battery", "step_order": 1, "is_multiple_allowed": False},
        headers=headers
    )
    assert cat_resp.status_code == 200
    category_id = cat_resp.json()["id"]
    
    # 4. Add a Component
    comp_resp = client.post(
        "/api/v1/components/",
        json={
            "category_id": category_id,
            "name": "48V 60Ah Lithium Battery",
            "price_modifier": 30000,
            "weight": 25.0
        },
        headers=headers
    )
    assert comp_resp.status_code == 200
    component_id = comp_resp.json()["id"]
    
    # 5. Get categories with components (Configurator View)
    cats_resp = client.get("/api/v1/components/categories")
    assert cats_resp.status_code == 200
    cats = cats_resp.json()
    assert len(cats) >= 1
    assert len(cats[0]["components"]) >= 1
    
    # 6. Save a configuration
    config_resp = client.post(
        "/api/v1/configurations/",
        json={
            "product_id": product_id,
            "selected_components": [
                {"category_id": category_id, "component_id": component_id}
            ]
        },
        headers=headers # Reusing admin token for simplicity
    )
    assert config_resp.status_code == 200
    config_data = config_resp.json()
    assert config_data["total_price"] == 250000 + 30000 # Product base + Component
    config_id = config_data["id"]
    
    # 7. Request a quote
    quote_resp = client.post(
        "/api/v1/quotes/",
        json={
            "configuration_id": config_id,
            "customer_name": "John Doe",
            "customer_email": "john@example.com"
        }
    )
    assert quote_resp.status_code == 200
    assert quote_resp.json()["status"] == "Pending"
