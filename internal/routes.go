package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/meilisearch/meilisearch-go"
)

var meilisearchClient = meilisearch.NewClient(meilisearch.ClientConfig{
	Host:   "http://search:7700",
	APIKey: "masterKey",
})

// DocsRedirect godoc
//
//	@Summary	Redirects to the docs
//	@Accept		*/*
//	@Success	301
//	@Router		/ [get]
func DocsRedirect(c *gin.Context) {
	location := url.URL{Path: "/docs/index.html"}
	c.Redirect(http.StatusFound, location.RequestURI())
}

// processIds godoc
//
//	@Summary	Takes list of ids, fetch from TMDB, and put into Meilisearch
//	@Accept		json
//	@Produce  json
//	@Param    Ids body MediaIds true "ids to fetch"
//	@Success	200
//	@Router		/update-media [post]
func fetchMedia(c *gin.Context) (chan Movie, chan TV, chan Person) {
	media := MediaIds{}

	c.Bind(&media)
	if len(media.Ids) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"info": "Please provide ids to fetch"})
		log.Fatal("No ids provided")
	}

	var wg sync.WaitGroup
	movieCh := make(chan Movie, len(media.Ids))
	tvCh := make(chan TV, len(media.Ids))
	personCh := make(chan Person, len(media.Ids))
	guardCh := make(chan int, 1000)
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
		case "p":
			go func(id string, personCh chan Person) {
				defer wg.Done()
				fetchPerson(id[1:], personCh)
				<-guardCh
			}(id, personCh)
		default:
			log.Fatal("This is not the movie type you seek")
		}
	}
	wg.Wait()
	close(movieCh)
	close(tvCh)
	close(personCh)

	return movieCh, tvCh, personCh
}

func processMedia(c *gin.Context) {
	movieCh, tvCh, personCh := fetchMedia(c)
	failedMedia := 0
	medias := []Media{}
	// TODO: make popularity an optional query parameter and default to 0
	for movie := range movieCh {
		if movie.Id == -1 {
			failedMedia++
			continue
		}
		if movie.Popularity > 1 {
			medias = append(medias, *movie.toMedia())
		}
	}
	// TODO: make popularity an optional query parameter and default to 0
	for tv := range tvCh {
		if tv.Id == -1 {
			failedMedia++
			continue
		}
		if tv.Popularity > 1 {
			medias = append(medias, *tv.toMedia())
		}
	}
	// TODO: make popularity an optional query parameter and default to 0
	for person := range personCh {
		if person.Id == -1 {
			failedMedia++
			continue
		}
		if person.Popularity > 1 {
			medias = append(medias, *person.toMedia())
		}
	}
	// manually setting `id` to be the primary key as meilisearch cant infer it
	// since we have two fields ending with `id`
	task, err := meilisearchClient.Index("media").AddDocuments(&medias, "id")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"info": fmt.Sprint(task.TaskUID) + ": " + err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"info": fmt.Sprintf("Fetched and inserted %d media into meilisearch and skipped %d", len(medias), failedMedia)})
}

func fetchMovie(id string, movieCh chan Movie) {
	res, err := http.Get(
		fmt.Sprintf(
			"https://api.themoviedb.org/3/movie/%s?api_key=%s&append_to_response=watch/providers,translations,external_ids", id, TMDB_KEY,
		),
	)
	if err != nil {
		log.Fatal("Ran into an issue while fetching the movie: ", id, err)
	}

	defer res.Body.Close()

	movie := Movie{}
	errDecode := json.NewDecoder(res.Body).Decode(&movie)
	if errDecode != nil {
		fmt.Println("Failed to decode movie:", id, errDecode)
		// Adds a dummy movie that will be filtered out when exhasting the channel
		movieCh <- Movie{Id: -1}
		return
	}

	movieCh <- movie
}

func fetchTV(id string, TVCh chan TV) {
	res, err := http.Get(
		fmt.Sprintf(
			"https://api.themoviedb.org/3/tv/%s?api_key=%s&append_to_response=watch/providers,translations,external_ids", id, TMDB_KEY,
		),
	)
	if err != nil {
		log.Fatal("Ran into an issue while fetching the tv-series: ", id, err)
	}

	defer res.Body.Close()

	tv := TV{}
	errDecode := json.NewDecoder(res.Body).Decode(&tv)
	if errDecode != nil {
		fmt.Println("Failed to decode tv-series: ", id, errDecode)
		// Adds a dummy tv that will be filtered out when exhasting the channel
		TVCh <- TV{Id: -1}
		return
	}

	TVCh <- tv
}

func fetchPerson(id string, personCh chan Person) {
	res, err := http.Get(
		fmt.Sprintf(
			"https://api.themoviedb.org/3/person/%s?api_key=%s&append_to_response=movie_credits,tv_credits,external_ids", id, TMDB_KEY,
		),
	)
	if err != nil {
		log.Fatal("Ran into an issue while fetching the person: ", id, err)
	}

	defer res.Body.Close()

	person := Person{}
	errDecode := json.NewDecoder(res.Body).Decode(&person)
	if errDecode != nil {
		fmt.Println("Failed to decode person: ", id, errDecode)
		// Adds a dummy tv that will be filtered out when exhasting the channel
		personCh <- Person{Id: -1}
		return
	}

	personCh <- person
}
