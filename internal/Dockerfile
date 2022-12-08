FROM golang:alpine as base

WORKDIR /app

EXPOSE 8888

COPY . .

RUN go mod download

RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init

RUN CGO_ENABLED=0 go build -o internal .

FROM scratch as prod

WORKDIR /app

ENV GIN_MODE=release

COPY --from=base /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=base /app /usr/bin/
CMD ["internal"]

FROM base as dev

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest
CMD air --build.cmd "swag init && go build -o ./tmp/main ." --build.exclude_dir "docs"
