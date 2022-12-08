package main

import (
	"context"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"

	docs "github.com/streamchaser/go_backend/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
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
	r := gin.Default()
	docs.SwaggerInfo.BasePath = "/"

	r.Use(func(c *gin.Context) {})
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
	}))

	r.GET("/", DocsRedirect)
	r.GET("/genres", GetGenres)
	r.GET("/countries", GetCountries)
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.Run(":9001")
}
