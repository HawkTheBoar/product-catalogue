#!/bin/bash
curl -X POST http://localhost:3000/admin/product -H "Content-Type: application/json" -d '{"name": "Sample Product", "description": "This is a sample product description.", "price": 99}'

curl -X PATCH http://localhost:3000/admin/product -H "Content-Type: application/json" -d '{"id": 1, "name": "Updated Product Name", "description": "Updated description of the product.", "price": 79}'
curl -X DELETE http://localhost:3000/admin/product -H "Content-Type: application/json" -d '{"product_id": 1}'
# Test GET /categories
curl -X GET http://localhost:3000/categories

# Test GET /category/{id}
# Replace {id} with a valid category ID
curl -X GET http://localhost:3000/category/1

# Test GET /product/{id}
# Replace {id} with a valid product ID
curl -X GET http://localhost:3000/product/1

# Test GET /product/search/{query}/{page}
# Replace {query} with a product search term and {page} with a page number
curl -X GET "http://localhost:3000/product/search/product/0"

# Test GET /product/{page}
# Replace {page} with the desired page number
curl -X GET http://localhost:3000/product/1
# Test POST /admin/login (assuming you have an admin login setup)
# This needs a JSON body with username and password
curl -X POST http://localhost:3000/admin/login -H "Content-Type: application/json" -d '{"username": "your_username", "password": "your_password"}'

# Test POST /admin/category (create a new category)
# Example payload
curl -X POST http://localhost:3000/admin/category -H "Content-Type: application/json" -d '{"name": "New Category", "description": "Category description", "parent_id": null}'

# Test DELETE /admin/category
# Replace {category_id} with a valid category ID to delete
curl -X DELETE http://localhost:3000/admin/category -H "Content-Type: application/json" -d '{"category_id": 1}'

# Test PATCH /admin/category (update a category)
# Replace {id} with the category ID of the category you want to update
curl -X PATCH http://localhost:3000/admin/category -H "Content-Type: application/json" -d '{"id": 1, "name": "Updated Name", "description": "Updated Description", "parent_id": null}'
