package main

import (
	"io"
	"log"
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

	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// permission mode 0666 -> all users can read and write but cannot execute file
	logFile, err := os.OpenFile("logs.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Println("there was an error with logs.txt: ", err)
	}
	defer logFile.Close()

	mw := io.MultiWriter(os.Stdout, logFile)
	log.SetOutput(mw)

	router := gin.Default()
	docs.SwaggerInfo.BasePath = "/"

	router.GET("/", DocsRedirect)
	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.POST("/update-media", processMedia)
	router.Run(":8888")
}
