ARG APP_ENVIRONMENT=dev

FROM golang:alpine as base

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build .

FROM scratch as dev

WORKDIR /app

COPY --from=base /app/go_backend /usr/bin/
CMD ["go_backend"]
