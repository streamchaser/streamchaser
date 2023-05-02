package main

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

type Media struct {
	Id                         string    `json:"id"`
	ImdbId                     string    `json:"imdb_id"`
	Type                       string    `json:"type"`
	Title                      string    `json:"title"`
	OriginalTitle              string    `json:"original_title"`
	Overview                   string    `json:"overview"`
	ReleaseDate                string    `json:"release_date"`
	Genres                     []string  `json:"genres"`
	PosterPath                 string    `json:"poster_path"`
	Popularity                 float32   `json:"popularity"`
	SupportedProviderCountries []string  `json:"supported_provider_countries"`
	Providers                  Provider  `json:"providers"`
	TitleTranslations          string    `json:"title_translations"`
	UpdatedAt                  time.Time `json:"updated_at"`
	UpdatedAtUnix              int64     `json:"updated_at_unix"`
}

type Movie struct {
	Id            int         `json:"id"`
	ExternalIds   ExternalIds `json:"external_ids"`
	Title         string      `json:"title"`
	OriginalTitle string      `json:"original_title"`
	Overview      string      `json:"overview"`
	ReleaseDate   string      `json:"release_date"`
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
		ImdbId:                     movie.ExternalIds.ImdbId,
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
		TitleTranslations:          concatenateTranslatedTitles(movie.Translations, "movie"),
		UpdatedAt:                  time.Now(),
		UpdatedAtUnix:              time.Now().Unix(),
	}
}

type Person struct {
	Id                 int     `json:"id"`
	Name               string  `json:"name"`
	Gender             int     `json:"gender"`
	ImdbId             string  `json:"imdb_id"`
	ProfilePath        string  `json:"profile_path"`
	Popularity         float32 `json:"popularity"`
	Birthday           string  `json:"birthday"`
	KnownForDepartment string  `json:"known_for_department"`
	PlaceOfBirth       string  `json:"place_of_birth"`
	Biography          string  `json:"biography"`
	// TODO: Add rest of person items when we migrate to edgeDB
}

func (person *Person) toMedia() *Media {
	personId := "p" + strconv.Itoa(person.Id)
	return &Media{
		Id:            personId,
		ImdbId:        person.ImdbId,
		Type:          getMediaType(personId),
		Title:         person.Name,
		Overview:      person.Biography,
		PosterPath:    person.ProfilePath,
		Popularity:    person.Popularity,
		UpdatedAt:     time.Now(),
		UpdatedAtUnix: time.Now().Unix(),
	}
}

type TV struct {
	Id           int         `json:"id"`
	ExternalIds  ExternalIds `json:"external_ids"`
	Name         string      `json:"name"`
	OriginalName string      `json:"original_name"`
	Overview     string      `json:"overview"`
	FirstAirDate string      `json:"first_air_date"`
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
		ImdbId:                     tv.ExternalIds.ImdbId,
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
		TitleTranslations:          concatenateTranslatedTitles(tv.Translations, "tv"),
		UpdatedAt:                  time.Now(),
		UpdatedAtUnix:              time.Now().Unix(),
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
		Title       string `json:"title"`
		Name        string `json:"name"`
		EnglishName string `json:"english_name"`
		Data        struct {
			Homepage string `json:"homepage"`
			Overview string `json:"overview"`
			Runtime  int    `json:"runtime"`
			Name     string `json:"name"`
			Tagline  string `json:"tagline"`
			Title    string `json:"title"`
		} `json:"data"`
	} `json:"translations"`
}

type FinalTranslations map[string]struct {
	Title    string `json:"title"`
	Overview string `json:"overview"`
}

type MediaIds struct {
	Ids []string `json:"ids"`
}

type ExternalIds struct {
	ImdbId string `json:"imdb_id"`
}

func getMediaType(id string) string {
	switch id[0:1] {
	case "m":
		return "movie"
	case "t":
		return "tv"
	case "p":
		return "person"
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

func concatenateTranslatedTitles(translations Translations, mediaType string) string {
	var translatedTitles strings.Builder

	if mediaType == "movie" {
		for _, translation := range translations.InnerTranslations {
			if translation.Data.Title != "" {
				translatedTitles.WriteString(translation.Data.Title + ", ")
			}
		}
	} else {
		for _, translation := range translations.InnerTranslations {
			if translation.Data.Name != "" {
				translatedTitles.WriteString(translation.Data.Name + ", ")
			}
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
