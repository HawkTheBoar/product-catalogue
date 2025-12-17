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
use std::{
    collections::HashMap,
    env,
    net::{Ipv4Addr, SocketAddr, SocketAddrV4},
    sync::Arc,
};
use tokio::io::{AsyncBufReadExt, AsyncReadExt, BufReader};
use tower_http::trace::TraceLayer;
use tracing::info;

use crate::handlers::{
    admin::{
        create_admin, create_category, create_product, delete_category, delete_product, login,
        update_category, update_product,
    },
    common::{
        category_get, parent_categories_get, product_get, product_page, product_search, test,
    },
};
struct AppState {
    pg: SqlitePool,
    redis: deadpool_redis::Pool,
}
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Read DB URL and domain from env (provide defaults).
    let database_url =
        env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:catalogue.db".to_string());
    // Create SQLite pool
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
    let args = std::env::args().collect::<Vec<String>>();
    if args.get(1).is_some() {
        let stdin = tokio::io::stdin();
        let mut reader = BufReader::new(stdin);

        let mut username = String::new();
        let mut password = String::new();

        println!("Input username:");
        reader.read_line(&mut username).await?;
        let username = username.trim().to_string();

        println!("Input password:");
        reader.read_line(&mut password).await?;
        let password = password.trim().to_string();

        println!("creating admin: {}, {}", &username, &password);
        create_admin(pool, username, password).await?;

        println!("admin created!");
        return Ok(());
    }

    tracing_subscriber::fmt::init();
    sqlx::migrate!("./migrations").run(&pool).await?;
    // Create a Redis pool
    let cfg = deadpool_redis::Config::from_url("redis://127.0.0.1");
    let redis = cfg
        .create_pool(Some(deadpool_redis::Runtime::Tokio1))
        .expect("failed to create redis pool");
    // Ensure table exists
    let state = Arc::new(AppState { pg: pool, redis });
    // let protected = Router::new().route("/category/:category_id", routing::delete(delete_category));
    // let admin_routes = Router::new();
    // let category_routes = Router::new();
    // let product_routes = Router::new();
    let port: u16 = env::var("AXUM_PORT")
        .unwrap_or("3000".to_string())
        .parse()?;
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let admin_router = Router::new()
        .route(
            "/category",
            routing::delete(delete_category)
                .patch(update_category)
                .post(create_category),
        )
        .route(
            "/product",
            routing::delete(delete_product)
                .patch(update_product)
                .post(create_product),
        )
        .route("/login", post(login));
    // merge routers
    let app = Router::new()
        // .route("/", post(test))
        .route("/category/{id}", get(category_get))
        .route("/categories", get(parent_categories_get))
        .route("/product/{id}", get(product_get))
        .route("/product/search/{query}/{page}", get(product_search))
        .route("/products/{page}", get(product_page))
        .route("/test/{test}", get(test))
        .nest("/admin", admin_router)
        // .nest("/categories", category_routes)
        // .nest("/product", product_routes)
        //
        .with_state(state);
    // let app = Router::new()
    //     .route("/test/{test}", get(test))
    //     .with_state(state.clone());
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
