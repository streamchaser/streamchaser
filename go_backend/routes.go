package main

import (
	"encoding/json"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type Genre struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type Country struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

// DocsRedirect godoc
//	@Summary	Redirects to the docs
//	@Accept		*/*
//	@Success	301
//	@Router		/ [get]
func DocsRedirect(c *gin.Context) {

	location := url.URL{Path: "/docs/index.html"}
	c.Redirect(http.StatusFound, location.RequestURI())

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
