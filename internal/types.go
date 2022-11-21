package main

import (
	"strconv"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type DBMedia struct {
	gorm.Model
	Id                         string
	Type                       string
	Title                      string
	OriginalTitle              string
	Overview                   string
	ReleaseDate                string
	Genres                     pq.StringArray `gorm:"type:text ARRAY"`
	PosterPath                 string
	Popularity                 float32
	SupportedProviderCountries pq.StringArray `gorm:"type:text ARRAY"`
	Providers                  Provider       `gorm:"embedded"`
}

func (DBMedia) TableName() string {
	return "media"
}

type Media struct {
	Id                         string         `json:"id"`
	Type                       string         `json:"type"`
	Title                      string         `json:"title"`
	OriginalTitle              string         `json:"original_title"`
	Overview                   string         `json:"overview"`
	ReleaseDate                string         `json:"release_date"`
	Genres                     pq.StringArray `json:"genres"`
	PosterPath                 string         `json:"poster_path"`
	Popularity                 float32        `json:"popularity"`
	SupportedProviderCountries pq.StringArray `json:"supported_provider_countries"`
	Providers                  Provider       `json:"providers"`
}

type Movie struct {
	Id            int    `json:"id"`
	Title         string `json:"title"`
	OriginalTitle string `json:"original_title"`
	Overview      string `json:"overview"`
	ReleaseDate   string `json:"release_date"`
	Genres        []struct {
		Name string `json:"name"`
	} `json:"genres"`
	PosterPath string   `json:"poster_path"`
	Popularity float32  `json:"popularity"`
	Providers  Provider `json:"watch/providers"`
}

func (movie *Movie) toDBMedia() *DBMedia {
	genres := []string{}
	for _, genre := range movie.Genres {
		genres = append(genres, genre.Name)
	}
	movieId := "m" + strconv.Itoa(movie.Id)
	mediaType := getMediaType(movieId)
	return &DBMedia{
		Id:                         movieId,
		Type:                       mediaType,
		Title:                      movie.Title,
		OriginalTitle:              movie.OriginalTitle,
		Overview:                   movie.Overview,
		ReleaseDate:                movie.ReleaseDate,
		Genres:                     genres,
		PosterPath:                 movie.PosterPath,
		Popularity:                 movie.Popularity,
		SupportedProviderCountries: getSupportedProviderCountries(movie.Providers),
		Providers:                  movie.Providers,
	}
}

func (movie *Movie) toMedia() *Media {
	genres := []string{}
	for _, genre := range movie.Genres {
		genres = append(genres, genre.Name)
	}
	movieId := "m" + strconv.Itoa(movie.Id)

	return &Media{
		Id:                         movieId,
		Type:                       getMediaType(movieId),
		Title:                      movie.Title,
		OriginalTitle:              movie.OriginalTitle,
		Overview:                   movie.Overview,
		ReleaseDate:                movie.ReleaseDate,
		Genres:                     genres,
		PosterPath:                 movie.PosterPath,
		Popularity:                 movie.Popularity,
		SupportedProviderCountries: getSupportedProviderCountries(movie.Providers),
		Providers:                  movie.Providers,
	}
}

type TV struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	OriginalName string `json:"original_name"`
	Overview     string `json:"overview"`
	FirstAirDate string `json:"first_air_date"`
	Genres       []struct {
		Name string `json:"name" gorm:"type:text"`
	} `json:"genres" gorm:"-"`
	PosterPath string   `json:"poster_path"`
	Popularity float32  `json:"popularity"`
	Providers  Provider `json:"watch/providers"`
}

func (tv *TV) toDBMedia() *DBMedia {
	genres := []string{}
	for _, genre := range tv.Genres {
		genres = append(genres, genre.Name)
	}

	tvId := "t" + strconv.Itoa(tv.Id)
	mediaType := getMediaType(tvId)

	return &DBMedia{
		Id:                         tvId,
		Type:                       mediaType,
		Title:                      tv.Name,
		OriginalTitle:              tv.OriginalName,
		Overview:                   tv.Overview,
		ReleaseDate:                tv.FirstAirDate,
		Genres:                     genres,
		PosterPath:                 tv.PosterPath,
		Popularity:                 tv.Popularity,
		SupportedProviderCountries: getSupportedProviderCountries(tv.Providers),
		Providers:                  tv.Providers,
	}
}

func (tv *TV) toMedia() *Media {
	genres := []string{}
	for _, genre := range tv.Genres {
		genres = append(genres, genre.Name)
	}
	tvId := "t" + strconv.Itoa(tv.Id)

	return &Media{
		Id:                         tvId,
		Type:                       getMediaType(tvId),
		Title:                      tv.Name,
		OriginalTitle:              tv.OriginalName,
		Overview:                   tv.Overview,
		ReleaseDate:                tv.FirstAirDate,
		Genres:                     genres,
		PosterPath:                 tv.PosterPath,
		Popularity:                 tv.Popularity,
		SupportedProviderCountries: getSupportedProviderCountries(tv.Providers),
		Providers:                  tv.Providers,
	}
}

type Provider struct {
	Country map[string]struct {
		Flatrate []struct {
			DisplayPriority int    `json:"display_priority"`
			LogoPath        string `json:"logo_path"`
			Id              int    `json:"provider_id"`
			Name            string `json:"provider_name"`
		} `json:"flatrate,omitempty"`
		Free []struct {
			DisplayPriority int    `json:"display_priority"`
			LogoPath        string `json:"logo_path"`
			Id              int    `json:"provider_id"`
			Name            string `json:"provider_name"`
		} `json:"free,omitempty"`
	} `json:"results" gorm:"column:providers;type:json"`
}

type MediaIds struct {
	Ids []string `json:"ids"`
}

type Env struct {
	db *gorm.DB
}

func getMediaType(id string) string {
	if id[0:1] == "m" {
		return "movie"
	}
	return "tv"
}

func getSupportedProviderCountries(providers Provider) []string {
	supportedProviderCountries := []string{}
	for _, countryCode := range getCountryCodeKeys(providers) {
		if _, ok := providers.Country[countryCode]; ok {
			if len(providers.Country[countryCode].Flatrate) > 0 || len(providers.Country[countryCode].Free) > 0 {
				supportedProviderCountries = append(supportedProviderCountries, countryCode)
			}

		}
	}

	return supportedProviderCountries
}

func getCountryCodeKeys(providers Provider) []string {
	keys := []string{}
	for k := range providers.Country {
		keys = append(keys, k)
	}

	return keys
}
