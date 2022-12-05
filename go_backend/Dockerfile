FROM golang:alpine as base

WORKDIR /app

EXPOSE 9001

COPY . .

RUN go mod download

RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init

RUN CGO_ENABLED=0 go build -o go_backend .

FROM scratch as prod

WORKDIR /app

ENV GIN_MODE=release

COPY --from=base /app /usr/bin/
CMD ["go_backend"]

FROM base as dev

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest
CMD air --build.cmd "swag init && go build -o ./tmp/main ." --build.exclude_dir "docs"
