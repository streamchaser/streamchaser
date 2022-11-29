package main

import (
	"fmt"
	"strconv"
	"strings"
)

type Media struct {
	Id                         string   `json:"id"`
	Type                       string   `json:"type"`
	Title                      string   `json:"title"`
	OriginalTitle              string   `json:"original_title"`
	Overview                   string   `json:"overview"`
	ReleaseDate                string   `json:"release_date"`
	Genres                     []string `json:"genres"`
	PosterPath                 string   `json:"poster_path"`
	Popularity                 float32  `json:"popularity"`
	SupportedProviderCountries []string `json:"supported_provider_countries"`
	Providers                  Provider `json:"providers"`
	TitleTranslations          string   `json:"title_translations"`
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
	PosterPath   string       `json:"poster_path"`
	Popularity   float32      `json:"popularity"`
	Providers    Provider     `json:"watch/providers"`
	Translations Translations `json:"translations"`
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
		TitleTranslations:          concatenateTranslatedTitles(movie.Translations),
	}
}

type TV struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	OriginalName string `json:"original_name"`
	Overview     string `json:"overview"`
	FirstAirDate string `json:"first_air_date"`
	Genres       []struct {
		Name string `json:"name"`
	} `json:"genres"`
	PosterPath   string       `json:"poster_path"`
	Popularity   float32      `json:"popularity"`
	Providers    Provider     `json:"watch/providers"`
	Translations Translations `json:"translations"`
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
		TitleTranslations:          concatenateTranslatedTitles(tv.Translations),
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
	} `json:"results"`
}

type Translations struct {
	InnerTranslations []struct {
		Iso311661   string `json:"iso_3166_1"`
		Iso6391     string `json:"iso_639_1"`
		Name        string `json:"name"`
		EnglishName string `json:"english_name"`
		Data        struct {
			Homepage string `json:"homepage"`
			Overview string `json:"overview"`
			Runtime  int    `json:"runtime"`
			Tagline  string `json:"tagline"`
			Title    string `json:"title"`
		} `json:"data"`
	} `json:"translations"`
}

type FinalTranslations map[string]struct {
	Title    string `json:title`
	Overview string `json:overview`
}

type MediaIds struct {
	Ids []string `json:"ids"`
}

func getMediaType(id string) string {
	switch id[0:1] {
	case "m":
		return "movie"
	case "t":
		return "tv"
	default:
		panic(fmt.Sprintf("Received unexpected media type, got: %s", id))
	}
}

func getSupportedProviderCountries(providers Provider) []string {
	supportedProviderCountries := []string{}
	for _, countryCode := range getCountryCodeKeys(providers) {
		if _, ok := providers.Results[countryCode]; ok {
			if len(providers.Results[countryCode].Flatrate) > 0 || len(providers.Results[countryCode].Free) > 0 {
				supportedProviderCountries = append(supportedProviderCountries, countryCode)
			}

		}
	}

	return supportedProviderCountries
}

func concatenateTranslatedTitles(translations Translations) string {
	var translatedTitles strings.Builder

	for _, translation := range translations.InnerTranslations {
		if translation.Data.Title != "" {
			translatedTitles.WriteString(translation.Data.Title + ", ")
		}
	}

	return translatedTitles.String()
}

func getCountryCodeKeys(providers Provider) []string {
	keys := []string{}
	for k := range providers.Results {
		keys = append(keys, k)
	}

	return keys
}
