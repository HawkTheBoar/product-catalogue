mod handlers;
mod models;
use axum::{
    extract::{Extension, Json, Path},
    http::{Response, StatusCode},
    response::{IntoResponse, Redirect},
    routing::{self, get, post},
    Router,
};
use base64::Engine;
use rand::RngCore;
use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::{collections::HashMap, env, net::SocketAddr, sync::Arc};
use tracing::info;

use crate::handlers::admin::{delete_category, login};
struct AppState {
    pg: SqlitePool,
    redis: deadpool_redis::Pool,
}
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    // Read DB URL and domain from env (provide defaults).
    let database_url =
        env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:catalogue.db".to_string());
    // Create a Redis pool
    let cfg = deadpool_redis::Config::from_url("redis://127.0.0.1");
    let redis = cfg
        .create_pool(Some(deadpool_redis::Runtime::Tokio1))
        .expect("failed to create redis pool");
    // Create pool
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;
    // Ensure table exists
    let state = Arc::new(AppState { pg: pool, redis });
    let protected = Router::new().route("/category/:category_id", routing::delete(delete_category));
    let admin_routes = Router::new();
    let category_routes = Router::new();
    let product_routes = Router::new();
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    // merge routers
    let app = Router::new()
        .nest("/admin", admin_routes)
        .nest("/categories", category_routes)
        .nest("/product", product_routes)
        .layer(Extension(state));
    info!("listening on http://{}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}
pub fn generate_token() -> String {
    let mut bytes = [0u8; 32]; // 256-bit token
    let mut rng = rand::rngs::OsRng;
    rng.fill_bytes(&mut bytes);
    base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(bytes)
}
