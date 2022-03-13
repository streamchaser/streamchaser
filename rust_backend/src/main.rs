use std::net::SocketAddr;

use redis::{Commands, FromRedisValue};
use serde::{Deserialize, Serialize};

use axum::{routing::get, Json, Router};

use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[derive(Debug, Deserialize, Serialize)]
pub struct Genre {
    label: String,
    value: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter("tower=trace")
        .pretty()
        .init();
    // TODO: add environment to handle origins so we dont just permit anything in production
    let cors = CorsLayer::permissive();
    let app = Router::new()
        .route("/genres/", get(get_genres))
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], 9000));
    println!("Listening on {addr}");
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;
    Ok(())
}

async fn get_genres() -> Json<Vec<Genre>> {
    let client = redis::Client::open("redis://redis/").unwrap();
    let mut connection = client.get_connection().unwrap();

    let redis_genres = connection.get("genres").unwrap();
    let json_values: String = FromRedisValue::from_redis_value(&redis_genres)
        .map_err(|e| e)
        .unwrap();
    let genres: Vec<Genre> = serde_json::from_str(&json_values).unwrap();
    genres.into()
}
