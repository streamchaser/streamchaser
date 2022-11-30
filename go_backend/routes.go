package main

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Health struct {
  Data string
}

type Genre struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type Country struct {
		Iso311661   string `json:"iso_3166_1"`
    Name string `json:"name"`
}

// HealthCheck godoc
//	@Summary	Show the status of server.
//	@Accept		*/*
//	@Produce	json
//	@Success	200	{object}	Health
//	@Router		/ [get]
func HealthCheck(c *gin.Context) {
   res := map[string]interface{}{
      "data": "Server is up and running",
   }

   c.JSON(http.StatusOK, res)
}

// GetGenres godoc
//	@Summary	Gets the genres used by TMDB
//	@Accept		*/*
//	@Produce	json
//	@Success	200	{object}	[]Genre
//	@Router		/genres [get]
func GetGenres(c *gin.Context) {
	genreJson, err := Rdb.Get(ctx, "genres").Result()
	if err != nil {
		panic(err)
	}

	var genres []Genre

	json.Unmarshal([]byte(genreJson), &genres)

	c.JSON(http.StatusOK, genres)
}

// GetCountries godoc
//	@Summary	Gets the countries used by TMDB
//	@Accept		*/*
//	@Produce	json
//	@Success	200	{object}	[]Country
//	@Router		/countries [get]
func GetCountries(c *gin.Context) {
  countryJson, err := Rdb.Get(ctx, "countries").Result()
  if err != nil {
    panic(err)
  }

  var countries []Country

  json.Unmarshal([]byte(countryJson), &countries)

  c.JSON(http.StatusOK, countries)
}
