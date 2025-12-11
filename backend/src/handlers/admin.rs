use crate::{
    generate_token,
    models::{Admin, Category, Product},
    AppState,
};
use axum::{
    extract::{Path, State},
    http::{header, HeaderName, StatusCode},
    Json,
};
use bcrypt::{hash, hash_with_salt, DEFAULT_COST};
use sqlx::{Pool, SqlitePool};
use tokio::task::spawn_blocking;
const SALT_SIZE: usize = 16;
type HandlerResult<T> = Result<(StatusCode, T), (StatusCode, String)>;
fn internal_error<E>(err: E) -> (StatusCode, String)
where
    E: std::error::Error,
{
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
struct LoginPayload {
    username: String,
    password: String,
}
async fn admin_auth() {}
// POST /admin/login { username, password } -> 200 { SET-AUTH-TOKEN: session_token }, 400
async fn login(
    State(app_state): State<AppState>,
    Json(req): Json<LoginPayload>,
) -> HandlerResult<(HeaderName, String)> {
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
    sqlx::query!("INSERT INTO tokens (token) VALUES(?)", token)
        .execute(&app_state.pg)
        .await
        .map_err(internal_error)?;

    Ok((
        StatusCode::OK,
        (header::SET_COOKIE, format!("auth_token={token}")),
    ))
}
async fn create_admin(
    db_pool: SqlitePool,
    username: String,
    password: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let salt = rand::random::<[u8; SALT_SIZE]>();
    let pass = password.clone();
    let hashed = spawn_blocking(async move || hash_with_salt(pass, DEFAULT_COST, salt))
        .await?
        .await?;
    sqlx::query!(
        "INSERT INTO admins (username, password) VALUES(?, ?)",
        username,
        password
    )
    .execute(&db_pool)
    .await?;
    Ok(())
}
// POST /admin/category { category } -> 200, 400, 401
async fn create_category(
    State(app_state): State<AppState>,
    Json(category): Json<Category>,
) -> HandlerResult<()> {
    sqlx::query!(
        "INSERT INTO categories (name, description, parent_id) VALUES(?, ?, ?)",
        category.name,
        category.description,
        category.parent_id
    );
    Ok((StatusCode::OK, ()))
}
// DELETE /admin/category { category_id } -> 200, 400, 401
async fn delete_category(
    State(app_state): State<AppState>,
    Path(category_id): Path<i32>,
) -> HandlerResult<()> {
    todo!();
}
// PATCH /admin/category { category } -> 200, 400, 401
async fn update_category(
    State(app_state): State<AppState>,
    Json(category): Json<Category>,
) -> HandlerResult<()> {
    todo!();
}
// POST /admin/product { product } -> 200, 400, 401
async fn create_product(
    State(app_state): State<AppState>,
    Json(product): Json<Product>,
) -> HandlerResult<()> {
    todo!();
}
// DELETE /admin/product/:product_id -> 200, 400, 401
async fn delete_product(
    State(app_state): State<AppState>,
    Path(product_id): Path<i32>,
) -> HandlerResult<()> {
    todo!();
}
// PATCH /admin/product { product } -> 200, 400, 401
async fn update_product(
    State(app_state): State<AppState>,
    Json(product): Json<Product>,
) -> HandlerResult<()> {
    todo!();
}
