package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)

type Media struct {
	Title string `json:"title"`
}

func main() {
	var wg sync.WaitGroup

	// TODO: going to receive ids from python
	ids := []string{"120", "122"}
	for _, id := range ids {
		wg.Add(1)
		go fetchMovies(&wg, id)
	}

	wg.Wait()
}

func fetchMovies(wg *sync.WaitGroup, id string) Media {
	defer wg.Done()
	res, err := http.Get(fmt.Sprintf("https://api.themoviedb.org/3/movie/%s?api_key=THE_KEY&language=en-US", id))
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	media := Media{}

	errDecode := json.NewDecoder(res.Body).Decode(&media)
	if errDecode != nil {
		panic(err)
	}

	fmt.Println(media)

	return media
}
