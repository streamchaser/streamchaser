FROM golang:alpine as base

WORKDIR /app

EXPOSE 9001

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

RUN CGO_ENABLED=0 go build -o go_backend .

FROM scratch as prod

WORKDIR /app

ENV GIN_MODE=release

COPY --from=base /app /usr/bin/
CMD ["go_backend"]

FROM base as dev

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest
CMD air
