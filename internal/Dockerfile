ARG APP_ENVIRONMENT=dev

FROM golang:alpine as base

WORKDIR /app

EXPOSE 8888

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 go build -o internal .

FROM base as dev

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest
CMD air

FROM scratch as prod

WORKDIR /app

ENV GIN_MODE=release

COPY --from=base /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=base /app /usr/bin/
CMD ["internal"]
