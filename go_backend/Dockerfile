ARG APP_ENVIRONMENT=dev

FROM golang:alpine as base

WORKDIR /app

EXPOSE 9001

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 go build .

FROM scratch as dev

WORKDIR /app

COPY --from=base /app/go_backend /usr/bin/
CMD ["go_backend"]

FROM scratch as prod

WORKDIR /app

ENV GIN_MODE=release

COPY --from=base /app/go_backend /usr/bin/
CMD ["go_backend"]
