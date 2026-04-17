"""
Backend API Tests for Experimental Elaichi Food Blog
Tests: Auth endpoints, Recipe CRUD, Categories
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@experimentalelaichi.com"
ADMIN_PASSWORD = "elaichi2026"


class TestHealthAndBasicEndpoints:
    """Basic API health and endpoint tests"""
    
    def test_api_recipes_endpoint_returns_200(self):
        """GET /api/recipes should return 200 and list of recipes"""
        response = requests.get(f"{BASE_URL}/api/recipes")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Expected list of recipes"
        print(f"✓ GET /api/recipes returned {len(data)} recipes")
    
    def test_api_categories_endpoint_returns_200(self):
        """GET /api/categories should return 200 and categories list"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "categories" in data, "Expected 'categories' key in response"
        assert isinstance(data["categories"], list), "Expected categories to be a list"
        print(f"✓ GET /api/categories returned: {data['categories']}")
    
    def test_api_single_recipe_endpoint(self):
        """GET /api/recipes/:id should return recipe details"""
        # First get list of recipes
        response = requests.get(f"{BASE_URL}/api/recipes")
        recipes = response.json()
        
        if len(recipes) > 0:
            recipe_id = recipes[0]["id"]
            response = requests.get(f"{BASE_URL}/api/recipes/{recipe_id}")
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            data = response.json()
            assert data["id"] == recipe_id, "Recipe ID should match"
            assert "title" in data, "Recipe should have title"
            assert "ingredients" in data, "Recipe should have ingredients"
            assert "instructions" in data, "Recipe should have instructions"
            print(f"✓ GET /api/recipes/{recipe_id} returned recipe: {data['title']}")
        else:
            pytest.skip("No recipes available to test")
    
    def test_api_nonexistent_recipe_returns_404(self):
        """GET /api/recipes/:id with invalid ID should return 404"""
        response = requests.get(f"{BASE_URL}/api/recipes/nonexistent-id-12345")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ GET /api/recipes/nonexistent-id returns 404")


class TestAuthEndpoints:
    """Authentication endpoint tests"""
    
    def test_login_with_valid_credentials(self):
        """POST /api/auth/login with valid admin credentials"""
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "id" in data, "Response should contain user id"
        assert "email" in data, "Response should contain email"
        assert "name" in data, "Response should contain name"
        assert "role" in data, "Response should contain role"
        assert data["email"] == ADMIN_EMAIL, f"Email should match: {data['email']}"
        assert data["role"] == "admin", f"Role should be admin: {data['role']}"
        
        # Check cookies are set
        cookies = session.cookies.get_dict()
        assert "access_token" in cookies, "access_token cookie should be set"
        assert "refresh_token" in cookies, "refresh_token cookie should be set"
        
        print(f"✓ Login successful for {ADMIN_EMAIL}, role: {data['role']}")
        print(f"✓ Cookies set: access_token, refresh_token")
    
    def test_login_with_invalid_credentials(self):
        """POST /api/auth/login with invalid credentials should return 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@email.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Login with invalid credentials returns 401")
    
    def test_auth_me_without_token(self):
        """GET /api/auth/me without token should return 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ GET /api/auth/me without token returns 401")
    
    def test_auth_me_with_valid_session(self):
        """GET /api/auth/me with valid session should return user data"""
        session = requests.Session()
        # Login first
        login_response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200, "Login should succeed"
        
        # Now check /auth/me
        me_response = session.get(f"{BASE_URL}/api/auth/me")
        assert me_response.status_code == 200, f"Expected 200, got {me_response.status_code}"
        data = me_response.json()
        assert data["email"] == ADMIN_EMAIL, "Email should match"
        print(f"✓ GET /api/auth/me returns user: {data['email']}")
    
    def test_logout(self):
        """POST /api/auth/logout should clear cookies"""
        session = requests.Session()
        # Login first
        session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        
        # Logout
        logout_response = session.post(f"{BASE_URL}/api/auth/logout")
        assert logout_response.status_code == 200, f"Expected 200, got {logout_response.status_code}"
        data = logout_response.json()
        assert "message" in data, "Response should contain message"
        print("✓ Logout successful")


class TestRecipeCRUD:
    """Recipe CRUD operations (admin only)"""
    
    @pytest.fixture
    def admin_session(self):
        """Create authenticated admin session"""
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Admin login failed - skipping CRUD tests")
        return session
    
    def test_create_recipe_as_admin(self, admin_session):
        """POST /api/recipes should create a new recipe (admin only)"""
        test_recipe = {
            "title": "TEST_Experimental Chai Latte",
            "description": "A fusion chai latte with cardamom and vanilla",
            "category": "Dessert",
            "cooking_time": 15,
            "servings": 2,
            "ingredients": ["2 cups milk", "1 tbsp tea leaves", "4 cardamom pods", "1 tsp vanilla"],
            "instructions": ["Boil milk with cardamom", "Add tea leaves and simmer", "Strain and add vanilla"],
            "image_url": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f"
        }
        
        response = admin_session.post(f"{BASE_URL}/api/recipes", json=test_recipe)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Response should contain recipe id"
        assert data["title"] == test_recipe["title"], "Title should match"
        assert data["category"] == test_recipe["category"], "Category should match"
        assert data["cooking_time"] == test_recipe["cooking_time"], "Cooking time should match"
        assert data["servings"] == test_recipe["servings"], "Servings should match"
        assert len(data["ingredients"]) == len(test_recipe["ingredients"]), "Ingredients count should match"
        assert len(data["instructions"]) == len(test_recipe["instructions"]), "Instructions count should match"
        
        # Verify persistence with GET
        recipe_id = data["id"]
        get_response = admin_session.get(f"{BASE_URL}/api/recipes/{recipe_id}")
        assert get_response.status_code == 200, "Should be able to fetch created recipe"
        fetched = get_response.json()
        assert fetched["title"] == test_recipe["title"], "Fetched title should match"
        
        print(f"✓ Created recipe: {data['title']} (ID: {recipe_id})")
        
        # Cleanup - delete the test recipe
        admin_session.delete(f"{BASE_URL}/api/recipes/{recipe_id}")
    
    def test_create_recipe_without_auth(self):
        """POST /api/recipes without auth should return 401"""
        test_recipe = {
            "title": "TEST_Unauthorized Recipe",
            "description": "This should fail",
            "category": "Test",
            "cooking_time": 10,
            "servings": 1,
            "ingredients": ["test"],
            "instructions": ["test"]
        }
        
        response = requests.post(f"{BASE_URL}/api/recipes", json=test_recipe)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Create recipe without auth returns 401")
    
    def test_update_recipe_as_admin(self, admin_session):
        """PUT /api/recipes/:id should update recipe (admin only)"""
        # First create a recipe
        test_recipe = {
            "title": "TEST_Recipe to Update",
            "description": "Original description",
            "category": "Appetizer",
            "cooking_time": 20,
            "servings": 4,
            "ingredients": ["ingredient 1"],
            "instructions": ["step 1"]
        }
        
        create_response = admin_session.post(f"{BASE_URL}/api/recipes", json=test_recipe)
        assert create_response.status_code == 200, "Create should succeed"
        recipe_id = create_response.json()["id"]
        
        # Update the recipe
        update_data = {
            "title": "TEST_Updated Recipe Title",
            "description": "Updated description"
        }
        
        update_response = admin_session.put(f"{BASE_URL}/api/recipes/{recipe_id}", json=update_data)
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}"
        
        updated = update_response.json()
        assert updated["title"] == update_data["title"], "Title should be updated"
        assert updated["description"] == update_data["description"], "Description should be updated"
        
        # Verify persistence
        get_response = admin_session.get(f"{BASE_URL}/api/recipes/{recipe_id}")
        fetched = get_response.json()
        assert fetched["title"] == update_data["title"], "Fetched title should be updated"
        
        print(f"✓ Updated recipe: {updated['title']}")
        
        # Cleanup
        admin_session.delete(f"{BASE_URL}/api/recipes/{recipe_id}")
    
    def test_delete_recipe_as_admin(self, admin_session):
        """DELETE /api/recipes/:id should delete recipe (admin only)"""
        # First create a recipe
        test_recipe = {
            "title": "TEST_Recipe to Delete",
            "description": "This will be deleted",
            "category": "Main Course",
            "cooking_time": 30,
            "servings": 2,
            "ingredients": ["ingredient"],
            "instructions": ["step"]
        }
        
        create_response = admin_session.post(f"{BASE_URL}/api/recipes", json=test_recipe)
        assert create_response.status_code == 200, "Create should succeed"
        recipe_id = create_response.json()["id"]
        
        # Delete the recipe
        delete_response = admin_session.delete(f"{BASE_URL}/api/recipes/{recipe_id}")
        assert delete_response.status_code == 200, f"Expected 200, got {delete_response.status_code}"
        
        # Verify deletion
        get_response = admin_session.get(f"{BASE_URL}/api/recipes/{recipe_id}")
        assert get_response.status_code == 404, "Deleted recipe should return 404"
        
        print(f"✓ Deleted recipe: {recipe_id}")


class TestRecipeSearch:
    """Recipe search and filter tests"""
    
    def test_search_recipes_by_title(self):
        """GET /api/recipes?search=term should filter by title"""
        # First get all recipes
        all_response = requests.get(f"{BASE_URL}/api/recipes")
        all_recipes = all_response.json()
        
        if len(all_recipes) > 0:
            # Search for a term from the first recipe's title
            search_term = all_recipes[0]["title"].split()[0]
            search_response = requests.get(f"{BASE_URL}/api/recipes?search={search_term}")
            assert search_response.status_code == 200
            
            results = search_response.json()
            # All results should contain the search term in title or description
            for recipe in results:
                assert search_term.lower() in recipe["title"].lower() or search_term.lower() in recipe["description"].lower(), \
                    f"Recipe should match search term: {recipe['title']}"
            
            print(f"✓ Search for '{search_term}' returned {len(results)} results")
        else:
            pytest.skip("No recipes available to test search")
    
    def test_filter_recipes_by_category(self):
        """GET /api/recipes?category=X should filter by category"""
        # Get categories first
        cat_response = requests.get(f"{BASE_URL}/api/categories")
        categories = cat_response.json()["categories"]
        
        if len(categories) > 0:
            category = categories[0]
            filter_response = requests.get(f"{BASE_URL}/api/recipes?category={category}")
            assert filter_response.status_code == 200
            
            results = filter_response.json()
            for recipe in results:
                assert recipe["category"] == category, f"Recipe category should be {category}"
            
            print(f"✓ Filter by category '{category}' returned {len(results)} results")
        else:
            pytest.skip("No categories available to test filter")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
