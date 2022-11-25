package main

import (
  "os"

	"github.com/gin-gonic/gin"
)

var TMDB_KEY = os.Getenv("TMDB_KEY")

func main() {
	if TMDB_KEY == "" {
		panic("No TMDB key provided")
	}

	router := gin.Default()
	router.POST("/update-media", processIds)
	router.Run(":8888")
}
