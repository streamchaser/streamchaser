package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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

var TMDB_KEY = os.Getenv("TMDB_KEY")

func main() {
	dsn := "host=db user=postgres password=postgres dbname=streamchaser port=5432 sslmode=disable"
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
	if len(media.Ids) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"info": "Please provide id's to fetch"})
		return
	}

	var wg sync.WaitGroup
	movieCh := make(chan Movie, len(media.Ids))
	tvCh := make(chan TV, len(media.Ids))
	guardCh := make(chan int, 100)
	dbMedia := []DBMedia{}
	for _, id := range media.Ids {
		guardCh <- 1
		wg.Add(1)
		switch string([]rune(id)[0]) {
		case "m":
			go func(id string, movieCh chan Movie) {
				defer wg.Done()
				fetchMovie(id[1:], movieCh)
				<-guardCh
			}(id, movieCh)
		case "t":
			go func(id string, TVCh chan TV) {
				defer wg.Done()
				fetchTV(id[1:], TVCh)
				<-guardCh
			}(id, tvCh)
		default:
			log.Fatal("This is not the movie type you seek")
		}
	}
	wg.Wait()
	close(movieCh)
	close(tvCh)

	// TODO: make popularity an optional query parameter and default to 0
	for tv := range tvCh {
		if tv.Popularity > 1 {
			dbMedia = append(dbMedia, *tv.toMedia())
		}
	}
	// TODO: make popularity an optional query parameter and default to 0
	for movie := range movieCh {
		if movie.Popularity > 1 {
			dbMedia = append(dbMedia, *movie.toMedia())
		}
	}

	e.db.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&dbMedia)

	c.JSON(http.StatusOK, gin.H{"info": fmt.Sprintf("Fetched and inserted %d media", len(dbMedia))})
}

func fetchMovie(id string, movieCh chan Movie) {
	res, err := http.Get(
		fmt.Sprintf(
			"https://api.themoviedb.org/3/movie/%s?api_key=%s&append_to_response=watch/providers", id, TMDB_KEY,
		),
	)
	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()

	movie := Movie{}
	errDecode := json.NewDecoder(res.Body).Decode(&movie)
	if errDecode != nil {
		log.Fatal(errDecode)
	}

	movieCh <- movie
}

func fetchTV(id string, TVCh chan TV) {
	res, err := http.Get(
		fmt.Sprintf(
			"https://api.themoviedb.org/3/tv/%s?api_key=%s&append_to_response=watch/providers", id, TMDB_KEY,
		),
	)
	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()

	tv := TV{}
	errDecode := json.NewDecoder(res.Body).Decode(&tv)
	if errDecode != nil {
		log.Fatal(errDecode)
	}

	TVCh <- tv
}
