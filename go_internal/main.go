package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Media struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
}

type MediaIds struct {
	Ids []string `json:"ids"`
}

type Env struct {
	db *gorm.DB
}

type DBMedia struct {
	gorm.Model
	Id    int
	Title string
}

var TMDB_KEY = os.Getenv("TMDB_KEY")

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=streamchaser port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Could not connect to DB!")
	}
	db.AutoMigrate(&DBMedia{})
	db.Create(&DBMedia{Id: 123, Title: "Not LOTR"})

	env := &Env{db: db}

	router := gin.Default()
	router.POST("/hest", env.processIds)
	router.Run(":8888")

	// For testing
	db.Exec("DELETE FROM db_media")
}

func (e *Env) processIds(c *gin.Context) {
	media := MediaIds{}
	c.Bind(&media)

	var wg sync.WaitGroup

	for _, id := range media.Ids {
		wg.Add(1)
		go fetchMovies(&wg, e.db, id)
	}

	wg.Wait()
}

func fetchMovies(wg *sync.WaitGroup, db *gorm.DB, id string) Media {
	defer wg.Done()
	res, err := http.Get(fmt.Sprintf("https://api.themoviedb.org/3/movie/%s?api_key=%s&language=en-US", id, TMDB_KEY))
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	media := Media{}

	errDecode := json.NewDecoder(res.Body).Decode(&media)
	if errDecode != nil {
		panic(err)
	}

	db.Create(&DBMedia{Id: media.Id, Title: media.Title})

	fmt.Println(media)

	return media
}
