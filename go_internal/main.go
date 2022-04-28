package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DBMedia struct {
	gorm.Model
	Id            string
	Title         string
	OriginalTitle string
	Overview      string
	ReleaseDate   string
	// 	Genres        []Genre TODO: Should just be names of the genres
	PosterPath string
	Popularity int
	//	Flatrate      Results // TODO: look at the python version
	//	Free          Results // TODO: look at the python version
}

type Provider struct {
	DisplayPriority int    `json:"display_priority"`
	LogoPath        string `json:"logo_path"`
	Id              int    `json:"provider_id"`
	Name            string `json:"provider_name"`
}

type WatchProvider struct {
	Results
}

type Results struct {
	Results map[string]ProviderType `json:"results"`
}

type ProviderType struct {
	Flatrate []Provider `json:"flatrate"`
	Free     []Provider `json:"free"`
}

type Genre struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Movie struct {
	Id            int     `json:"id"`
	Title         string  `json:"title"`
	OriginalTitle string  `json:"original_title"`
	Overview      string  `json:"overview"`
	ReleaseDate   string  `json:"release_date"`
	Genres        []Genre `json:"genres"`
	PosterPath    string  `json:"poster_path"`
	Popularity    float32 `json:"popularity"`
	WatchProvider `json:"watch/providers"`
}

type TV struct {
}

type MediaIds struct {
	Ids []string `json:"ids"`
}

type Env struct {
	db *gorm.DB
}

var TMDB_KEY = os.Getenv("TMDB_KEY")

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=streamchaser port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Could not connect to DB!")
	}
	db.AutoMigrate(&DBMedia{})

	if TMDB_KEY == "" {
		panic("No TMDB key provided")
	}

	env := &Env{db: db}

	router := gin.Default()
	router.POST("/update-media", env.processIds)
	router.Run(":8888")
}

func (e *Env) processIds(c *gin.Context) {
	media := MediaIds{}
	c.Bind(&media)

	var wg sync.WaitGroup

	for _, id := range media.Ids {
		wg.Add(1)
		switch string([]rune(id)[0]) {
		case "m":
			go fetchMovies(&wg, e.db, id[1:])
		case "t":
			return
		default:
			panic("This is not the movie type you seek")
		}
	}

	wg.Wait()
}

// TODO: make it work with TV shows as well
func mediaConverter(movie Movie) *DBMedia {

	media := &DBMedia{
		Id:            "m" + strconv.Itoa(movie.Id),
		Title:         movie.Title,
		OriginalTitle: movie.OriginalTitle,
		Overview:      movie.Overview,
		ReleaseDate:   movie.ReleaseDate,
		PosterPath:    movie.PosterPath,
		Popularity:    int(movie.Popularity),
	}
	return media
}

func fetchMovies(wg *sync.WaitGroup, db *gorm.DB, id string) Movie {
	defer wg.Done()
	res, err := http.Get(
		fmt.Sprintf(
			"https://api.themoviedb.org/3/movie/%s?api_key=%s&append_to_response=watch/providers", id, TMDB_KEY,
		),
	)
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	movie := Movie{}

	errDecode := json.NewDecoder(res.Body).Decode(&movie)
	if errDecode != nil {
		panic(errDecode)
	}

	db.Create(mediaConverter(movie))

	return movie
}
