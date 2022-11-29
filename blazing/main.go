package main

import (
	"context"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

var Rdb = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
	DB:   0,
})

const (
	PRODUCTION  = "prod"
	DEVELOPMENT = "dev"
)

func main() {
	app := gin.Default()

	// FIXME: The regex isn't working
	// The streamchaser-xxx-vercel.app path isn't being let through
	app.Use(func(c *gin.Context) {})
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
	}))
	go app.GET("/genres/", GetGenres)
	app.Run("0.0.0.0:9001")
}
