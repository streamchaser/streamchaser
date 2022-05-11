package main

import (
	"strconv"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type DBMedia struct {
	gorm.Model
	Id            string
	Title         string
	OriginalTitle string
	Overview      string
	ReleaseDate   string
	Genres        pq.StringArray `gorm:"type:text ARRAY"`
	PosterPath    string
	Popularity    float32
	Providers     Provider `gorm:"embedded"`
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

func (movie *Movie) toMedia() *DBMedia {
	genres := []string{}
	for _, genre := range movie.Genres {
		genres = append(genres, genre.Name)
	}
	return &DBMedia{
		Id:            "m" + strconv.Itoa(movie.Id),
		Title:         movie.Title,
		OriginalTitle: movie.OriginalTitle,
		Overview:      movie.Overview,
		ReleaseDate:   movie.ReleaseDate,
		Genres:        genres,
		PosterPath:    movie.PosterPath,
		Popularity:    movie.Popularity,
		Providers:     movie.Providers,
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

func (tv *TV) toMedia() *DBMedia {
	genres := []string{}
	for _, genre := range tv.Genres {
		genres = append(genres, genre.Name)
	}
	return &DBMedia{
		Id:            "t" + strconv.Itoa(tv.Id),
		Title:         tv.Name,
		OriginalTitle: tv.OriginalName,
		Overview:      tv.Overview,
		ReleaseDate:   tv.FirstAirDate,
		Genres:        genres,
		PosterPath:    tv.PosterPath,
		Popularity:    tv.Popularity,
		Providers:     tv.Providers,
	}
}

type Provider struct {
	Results map[string]struct {
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
