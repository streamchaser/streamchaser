package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Media struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
}

type DBMedia struct {
	gorm.Model
	Id    int
	Title string
}

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=streamchaser port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Could not connect to DB!")
	}

	// For testing
	// db.Exec("DELETE FROM db_media")

	db.AutoMigrate(&DBMedia{})
	db.Create(&DBMedia{Id: 123, Title: "Not LOTR"})

	var wg sync.WaitGroup

	// TODO: going to receive ids from python
	ids := []string{"120", "122"}
	for _, id := range ids {
		wg.Add(1)
		go fetchMovies(&wg, db, id)
	}

	wg.Wait()
}

func fetchMovies(wg *sync.WaitGroup, db *gorm.DB, id string) Media {
	defer wg.Done()
	res, err := http.Get(fmt.Sprintf("https://api.themoviedb.org/3/movie/%s?api_key=<TMDB_KEY>&language=en-US", id))
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

	// For testing
	var dbMedia DBMedia
	db.First(&dbMedia, 120)
	a, err := json.Marshal(dbMedia)
	fmt.Println(string(a))

	return media
}
