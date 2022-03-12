ARG APP_ENVIRONMENT=dev

FROM lukemathwalker/cargo-chef:latest-rust-1.59.0 AS chef
WORKDIR /app

EXPOSE 9000

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS debug
RUN echo "Starting Rust backend as development"

COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - takes advantage of Docker's caching
RUN cargo chef cook --recipe-path recipe.json
COPY . .
# Build application
RUN cargo build --bin rust_backend

FROM chef AS release
RUN echo "Starting Rust backend as production"

COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - takes advantage of Docker's caching
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo build --release --bin rust_backend


# Development runtime
FROM debian:bullseye-slim AS dev
WORKDIR /app
COPY --from=debug /app/target/debug/rust_backend /usr/local/bin
CMD /usr/local/bin/rust_backend

# Production runtime
FROM debian:bullseye-slim as prod
WORKDIR /app
COPY --from=release /app/target/release/rust_backend /usr/local/bin
CMD /usr/local/bin/rust_backend
