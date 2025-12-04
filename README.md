### ENDPOINTS

GET /products/:page
GET /categories/:page

GET /product/search/:query -> 200 { product[] }, 404

GET /product/:id -> 200 { product }, 404

GET /category/:id -> 200 { category }, 404

-- ADMINISTRATION

POST /admin/category { category } -> 200, 400, 401
DELETE /admin/category { category_id } -> 200, 400, 401
PATCH /admin/category { category } -> 200, 400, 401

POST /admin/product { product } -> 200, 400, 401
DELETE /admin/product { product_id } -> 200, 400, 401
PATCH /admin/product { product } -> 200, 400, 401

POST /admin/login { username, password } -> 200 { session_token }, 400
