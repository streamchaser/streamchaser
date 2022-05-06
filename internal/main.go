package main

import (
	"encoding/json"
	"fmt"
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
	Id     string
	Genres pq.StringArray `gorm:"type:text ARRAY"`
	Movie
}

type Movie struct {
	Id            int    `json:"id"`
	Title         string `json:"title"`
	OriginalTitle string `json:"original_title"`
	Overview      string `json:"overview"`
	ReleaseDate   string `json:"release_date"`
	Genres        []struct {
		Name string `json:"name"`
	} `json:"genres" gorm:"-"`
	PosterPath    string  `json:"poster_path"`
	Popularity    float32 `json:"popularity"`
	WatchProvider struct {
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
	} `json:"watch/providers" gorm:"embedded"`
}

type TV struct {
	Id            int    `json:"id"`
	Name          string `json:"name"`
	OriginalTitle string `json:"original_title"`
	Overview      string `json:"overview"`
	FirstAirDate  string `json:"first_air_date"`
	Genres        []struct {
		Name string `json:"name" gorm:"type:text"`
	} `json:"genres" gorm:"embedded[];type:text[]"`
	PosterPath    string  `json:"poster_path"`
	Popularity    float32 `json:"popularity"`
	WatchProvider struct {
		Results map[string]struct {
			Flatrate []struct {
				DisplayPriority int    `json:"display_priority"`
				LogoPath        string `json:"logo_path"`
				Id              int    `json:"provider_id"`
				Name            string `json:"provider_name"`
			} `json:"flatrate"`
			Free []struct {
				DisplayPriority int    `json:"display_priority"`
				LogoPath        string `json:"logo_path"`
				Id              int    `json:"provider_id"`
				Name            string `json:"provider_name"`
			} `json:"free"`
		} `json:"results" gorm:"column:providers;type:json"`
	} `json:"watch/providers" gorm:"embedded"`
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
	guardCh := make(chan int, 100)
	dbMedia := []DBMedia{}
	for _, id := range media.Ids {
		guardCh <- 1
		wg.Add(1)
		switch string([]rune(id)[0]) {
		case "m":
			go func(id string, movieCh chan Movie) {
				fetchMovies(id[1:], movieCh)
				defer wg.Done()
				<-guardCh
			}(id, movieCh)
		case "t":
			return
		default:
			panic("This is not the movie type you seek")
		}
	}

	for i := 0; i <= len(media.Ids)-1; i++ {
		dbMedia = append(dbMedia, *mediaConverter(<-movieCh))
	}
	close(movieCh)

	e.db.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&dbMedia)

	wg.Wait()
}

// TODO: make it work with TV shows as well
func mediaConverter(movie Movie) *DBMedia {
	genres := []string{}
	for _, genre := range movie.Genres {
		genres = append(genres, genre.Name)
	}
	return &DBMedia{
		Id:     "m" + strconv.Itoa(movie.Id),
		Genres: genres,
		Movie:  movie,
	}
}

func fetchMovies(id string, movieCh chan Movie) {
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

	movieCh <- movie
}
