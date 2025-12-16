use std::os::unix::process::parent_id;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};

use crate::{
    handlers::{internal_error, HandlerResult},
    models::{Category, Product, SubCategory},
    AppState,
};
const PAGE_SIZE: i64 = 50;
// GET /products/:page -> 200 { product[] }, 404
async fn product_page(
    app_state: State<AppState>,
    Path(page): Path<i64>,
) -> HandlerResult<Json<Vec<Product>>> {
    let offset = PAGE_SIZE * page;
    let products = sqlx::query_as!(
        Product,
        r#"
        SELECT
            id,
            name,
            description,
            price,
            category_id
        FROM products
        ORDER BY id
        LIMIT ? OFFSET ?
        "#,
        PAGE_SIZE,
        offset
    )
    .fetch_all(&app_state.pg)
    .await
    .map_err(internal_error)?;
    Ok((StatusCode::OK, Json(products)))
}
// GET /product/search/:query/:page -> 200 { product[] }, 404
async fn product_search(
    app_state: State<AppState>,
    Path(query): Path<String>,
    Path(page): Path<i64>,
) -> HandlerResult<Json<Vec<Product>>> {
    let offset = PAGE_SIZE * page;
    let products = sqlx::query_as!(
        Product,
        r#"
    SELECT
        id,
        name,
        description,
        price,
        category_id
    FROM products
    WHERE name LIKE '%' || ? || '%'
    ORDER BY id
    LIMIT ? OFFSET ?
    "#,
        query,
        PAGE_SIZE,
        offset
    )
    .fetch_all(&app_state.pg)
    .await
    .map_err(internal_error)?;
    Ok((StatusCode::OK, Json(products)))
}
// GET /product/:id -> 200 { product }, 404
async fn product_get(
    app_state: State<AppState>,
    Path(product_id): Path<i64>,
) -> HandlerResult<Json<Product>> {
    let product = sqlx::query_as!(Product, "SELECT * from products WHERE id = ?", product_id)
        .fetch_optional(&app_state.pg)
        .await
        .map_err(internal_error)?;
    if let Some(product) = product {
        Ok((StatusCode::OK, Json(product)))
    } else {
        Err((StatusCode::NOT_FOUND, "Product not found".to_string()))
    }
}
// GET /categories -> 200 { parent_categories[] }
async fn categories_get(app_state: State<AppState>) -> HandlerResult<Json<Vec<Category>>> {
    let categories = sqlx::query_as!(Category, "SELECT * from categories WHERE parent_id = NULL")
        .fetch_all(&app_state.pg)
        .await
        .map_err(internal_error)?;
    Ok((StatusCode::OK, Json(categories)))
}
// GET /category/:id -> 200 { product[], sub_categories[], parent_categories[] }, 404
struct GetCategoryResponse {
    products: Vec<Product>,
    sub_categories: Vec<Category>,
    parent_categories: Vec<Category>,
}
async fn category_get(
    app_state: State<AppState>,
    Path(category_id): Path<i64>,
    Path(page): Path<i64>,
) -> HandlerResult<Json<GetCategoryResponse>> {
    let products = sqlx::query_as!(
        Product,
        r#"
    WITH RECURSIVE subcategories AS (
        SELECT id
        FROM categories
        WHERE id = ?

        UNION ALL

        SELECT c.id
        FROM categories c
        JOIN subcategories sc ON c.parent_id = sc.id
    )
    SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id
    FROM products p
    JOIN subcategories sc ON p.category_id = sc.id
    ORDER BY p.id
    "#,
        category_id
    )
    .fetch_all(&app_state.pg)
    .await
    .map_err(internal_error)?;

    let sub_categories = sqlx::query_as!(
        SubCategory,
        r#"
    WITH RECURSIVE subcategories AS (
        SELECT id, name, description, parent_id
        FROM categories
        WHERE parent_id = ?

        UNION ALL

        SELECT c.id, c.name, c.description, c.parent_id
        FROM categories c
        JOIN subcategories sc ON c.parent_id = sc.id
    )
    SELECT id, name, description, parent_id
    FROM subcategories
    ORDER BY id
    "#,
        category_id
    )
    .fetch_all(&app_state.pg)
    .await
    .map_err(internal_error)?
    .iter()
    .filter_map(|sc| sc.try_into().ok())
    .collect();
    let parent_categories: Vec<Category> = sqlx::query_as!(
        SubCategory,
        r#"
    WITH RECURSIVE parent_categories AS (
        SELECT id, name, description, parent_id
        FROM categories
        WHERE id = ?

        UNION ALL

        SELECT c.id, c.name, c.description, c.parent_id
        FROM categories c
        JOIN parent_categories pc ON pc.parent_id = c.id
    )
    SELECT
        id,
        name,
        description,
        parent_id
    FROM parent_categories
    WHERE id != ?
    ORDER BY id
    "#,
        category_id,
        category_id
    )
    .fetch_all(&app_state.pg)
    .await
    .map_err(internal_error)?
    .iter()
    .filter_map(|sc| sc.try_into().ok())
    .collect();

    // I want all products that are present in this category and its sub categories
    Ok((
        StatusCode::OK,
        Json(GetCategoryResponse {
            products,
            sub_categories,
            parent_categories,
        }),
    ))
}
