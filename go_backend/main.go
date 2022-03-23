package main

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

var Rdb = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
	DB:   0,
})

func main() {
	app := gin.Default()
	go app.GET("/genres", GetGenres)
	app.Run("0.0.0.0:9001")
}
