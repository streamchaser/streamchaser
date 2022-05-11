package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

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
