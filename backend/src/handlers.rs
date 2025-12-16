use axum::http::StatusCode;

pub mod admin;
pub mod common;
pub type HandlerResult<T> = Result<(StatusCode, T), (StatusCode, String)>;
pub fn internal_error<E>(err: E) -> (StatusCode, String)
where
    E: std::error::Error,
{
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
