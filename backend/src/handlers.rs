use std::sync::Arc;

use axum::http::StatusCode;
use redis::AsyncCommands;
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::AppState;

pub mod admin;
pub mod common;
pub type HandlerResult<T> = Result<(StatusCode, T), (StatusCode, String)>;
pub fn internal_error<E>(err: E) -> (StatusCode, String)
where
    E: std::error::Error,
{
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}

pub async fn redis_get<T>(
    key: &String,
    app_state: &Arc<AppState>,
) -> Result<Option<T>, (StatusCode, String)>
where
    T: DeserializeOwned,
{
    let mut redis_conn = app_state.redis.get().await.map_err(internal_error)?;

    let json: Option<String> = redis_conn.get(key).await.map_err(internal_error)?;

    match json {
        Some(value) => {
            let parsed = serde_json::from_str(&value).map_err(internal_error)?;
            Ok(Some(parsed))
        }
        None => Ok(None),
    }
}
pub async fn redis_set<T>(
    key: String,
    value: &T,
    app_state: &Arc<AppState>,
) -> Result<(), (StatusCode, String)>
where
    T: Serialize,
{
    let mut redis_conn = app_state.redis.get().await.map_err(internal_error)?;

    let json = serde_json::to_string(value).map_err(internal_error)?;

    redis_conn
        .set_ex::<_, _, ()>(key, json, 300)
        .await
        .map_err(internal_error)?;

    Ok(())
}
