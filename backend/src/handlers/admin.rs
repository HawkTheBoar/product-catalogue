use std::sync::Arc;

use crate::handlers::{internal_error, HandlerResult};
use crate::{
    generate_token,
    models::{Admin, Category, Product},
    AppState,
};
use axum::http::{HeaderMap, Request};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use axum::{
    extract::{Path, State},
    http::{header, HeaderName, StatusCode},
    Json,
};
use bcrypt::{hash, hash_with_salt, DEFAULT_COST};
use serde::Deserialize;
use sqlx::{Pool, SqlitePool};
use tokio::task::spawn_blocking;
use tracing::info;

const SALT_SIZE: usize = 16;

#[derive(Deserialize)]
pub struct LoginPayload {
    username: String,
    password: String,
}
// admin middleware
pub mod middleware {
    use std::sync::Arc;

    use crate::AppState;
    use axum::http::Request;
    use axum::middleware::Next;
    use axum::response::{IntoResponse, Response};
    use axum::{
        extract::State,
        http::{header, StatusCode},
        Json,
    };
    use tracing::info;
    pub async fn test<B>(request: Request<B>, next: Next<B>) -> Response {
        info!("processing request: {}", request.uri());
        next.run(request).await
    }
    pub async fn admin_auth<B>(
        State(app_state): State<Arc<AppState>>,
        request: Request<B>,
        next: Next<B>,
    ) -> Response {
        let name = "auth_token";
        let token = request
            .headers()
            .get(header::COOKIE)
            .and_then(|h| h.to_str().ok())
            .and_then(|cookies| {
                cookies.split("; ").find_map(|cookie| {
                    let (k, v) = cookie.split_once('=')?;
                    (k == name).then(|| v.to_string())
                })
            });
        if let Some(token) = token {
            if token_exists(token, app_state.clone())
                .await
                .is_ok_and(|x| x)
            {
                return next.run(request).await;
            } else {
                return (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response();
            }
        } else {
            (StatusCode::UNAUTHORIZED, "Unauthorized access").into_response()
        }
    }
    async fn token_exists(token: String, app_state: Arc<AppState>) -> anyhow::Result<bool> {
        let t = sqlx::query!("SELECT * FROM tokens WHERE token = ?", token)
            .fetch_optional(&app_state.pg)
            .await?;
        Ok(t.is_some())
    }
}
// POST /admin/login { username, password } -> 200 { SET_COOKIE: session_token }, 400
pub async fn login(
    State(app_state): State<Arc<AppState>>,
    Json(req): Json<LoginPayload>,
) -> HandlerResult<HeaderMap> {
    // first check if username & password are valid
    let res = sqlx::query_as!(
        Admin,
        "SELECT username, password, id FROM admins WHERE username = ?",
        req.username
    )
    .fetch_optional(&app_state.pg)
    .await
    .map_err(internal_error)?;

    let Some(found) = res else {
        return Err((StatusCode::BAD_REQUEST, "Invalid credentials".to_string()));
    };
    let authenticated = spawn_blocking(async move || bcrypt::verify(req.password, &found.password))
        .await
        .map_err(internal_error)?
        .await
        .map_err(internal_error)?;
    // compare
    if !authenticated {
        return Err((StatusCode::BAD_REQUEST, "Invalid credentials".to_string()));
    }
    // If auth is successful
    let token = generate_token();
    sqlx::query!(
        "INSERT INTO tokens (token, admin_id) VALUES(?, ?)",
        token,
        found.id
    )
    .execute(&app_state.pg)
    .await
    .map_err(internal_error)?;
    let mut headers = HeaderMap::new();
    if let Ok(cookie) = format!("auth_token={token}").parse() {
        headers.insert(header::SET_COOKIE, cookie);
    } else {
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            "failed to parse cookie with auth token".to_string(),
        ));
    }
    Ok((StatusCode::OK, headers))
}
pub async fn create_admin(
    db_pool: SqlitePool,
    username: String,
    password: String,
) -> anyhow::Result<()> {
    let salt = rand::random::<[u8; SALT_SIZE]>();
    let pass = password;
    let hashed = spawn_blocking(async move || hash_with_salt(pass, DEFAULT_COST, salt))
        .await?
        .await?
        .to_string();
    sqlx::query!(
        "INSERT INTO admins (username, password) VALUES(?, ?)",
        username,
        hashed
    )
    .execute(&db_pool)
    .await?;
    Ok(())
}
// POST /admin/category { category } -> 200, 400, 401
pub async fn create_category(
    State(app_state): State<Arc<AppState>>,
    Json(category): Json<crate::models::request::create::Category>,
) -> HandlerResult<()> {
    sqlx::query!(
        "INSERT INTO categories (name, description, parent_id) VALUES(?, ?, ?)",
        category.name,
        category.description,
        category.parent_id
    )
    .execute(&app_state.pg)
    .await
    .map_err(internal_error)?;
    Ok((StatusCode::OK, ()))
}
// DELETE /admin/category { category_id } -> 200, 400, 401
pub async fn delete_category(
    State(app_state): State<Arc<AppState>>,
    Json(category): Json<crate::models::request::delete::Category>,
) -> HandlerResult<String> {
    sqlx::query!("DELETE FROM categories WHERE id = ?", category.category_id)
        .execute(&app_state.pg)
        .await
        .map_err(internal_error)?;
    Ok((StatusCode::OK, "ok".to_string()))
}
// PATCH /admin/category { category } -> 200, 400, 401
pub async fn update_category(
    State(app_state): State<Arc<AppState>>,
    Json(category): Json<Category>,
) -> HandlerResult<()> {
    sqlx::query!(
        "UPDATE categories SET name = ?, description = ?, parent_id = ? WHERE id = ?",
        category.name,
        category.description,
        category.parent_id,
        category.id
    )
    .execute(&app_state.pg)
    .await
    .map_err(internal_error)?;
    Ok((StatusCode::OK, ()))
}
// POST /admin/product { product } -> 200, 400, 401
pub async fn create_product(
    State(app_state): State<Arc<AppState>>,
    Json(product): Json<crate::models::request::create::Product>,
) -> HandlerResult<()> {
    sqlx::query!(
        "INSERT INTO products (name, description, price) VALUES(?, ?, ?)",
        product.name,
        product.description,
        product.price
    )
    .execute(&app_state.pg)
    .await
    .map_err(internal_error)?;
    Ok((StatusCode::OK, ()))
}
// DELETE /admin/product/:product_id -> 200, 400, 401
pub async fn delete_product(
    State(app_state): State<Arc<AppState>>,
    Json(product): Json<crate::models::request::delete::Product>,
) -> HandlerResult<()> {
    sqlx::query!("DELETE FROM products WHERE id = ?", product.product_id)
        .execute(&app_state.pg)
        .await
        .map_err(internal_error)?;
    Ok((StatusCode::OK, ()))
}
// PATCH /admin/product { product } -> 200, 400, 401
pub async fn update_product(
    State(app_state): State<Arc<AppState>>,
    Json(product): Json<Product>,
) -> HandlerResult<()> {
    sqlx::query!(
        "UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?",
        product.name,
        product.description,
        product.price,
        product.id
    )
    .execute(&app_state.pg)
    .await
    .map_err(internal_error)?;
    Ok((StatusCode::OK, ()))
}
