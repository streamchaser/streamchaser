package main

import (
	"os"

	"github.com/gin-gonic/gin"

	docs "github.com/streamchaser/internal/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var TMDB_KEY = os.Getenv("TMDB_KEY")

func main() {
	if TMDB_KEY == "" {
		panic("No TMDB key provided")
	}

	router := gin.Default()
	docs.SwaggerInfo.BasePath = "/"

	router.GET("/", DocsRedirect)
	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.POST("/update-media", processMedia)
	router.Run(":8888")
}
