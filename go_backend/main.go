package main

import (
	"context"
	"fmt"
	"os"
	"regexp"

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
	environment := os.Getenv("APP_ENVIRONMENT")
	streamchaserUrl := os.Getenv("HOST_NAME")

	var origins []string

	if environment == PRODUCTION {
		origins = []string{fmt.Sprintf("http://%s", streamchaserUrl),
			fmt.Sprintf("https://%s", streamchaserUrl)}
	} else {
		origins = []string{"*"}
	}

	app := gin.Default()
	app.Use(func(c *gin.Context) {
		originRegex, err := regexp.Compile("https://streamchaser.*.vercel.app")
		if err != nil {
			panic(err)
		}

		if originRegex.Match([]byte(c.Request.Host)) {
			origins = append(origins, c.Request.Host)
		}

	})
	app.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowCredentials: true,
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
	}))
	go app.GET("/genres/", GetGenres)
	app.Run("0.0.0.0:9001")
}
