package main

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Genre struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

func GetGenres(c *gin.Context) {
	genreJson, err := Rdb.Get(ctx, "genres").Result()
	if err != nil {
		panic(err)
	}

	var genres []Genre

	json.Unmarshal([]byte(genreJson), &genres)

	c.IndentedJSON(http.StatusOK, genres)
}
