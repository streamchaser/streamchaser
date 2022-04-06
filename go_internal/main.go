package main

import (
	"fmt"
	"net/http"
	"sync"
)

func main() {
	// A slice of sample websites
	urls := []string{
		"https://www.easyjet.com/",
		"https://www.skyscanner.de/",
		"https://www.ryanair.com",
		"https://wizzair.com/",
		"https://www.swiss.com/",
	}

	var wg sync.WaitGroup

	for _, u := range urls {
		wg.Add(1)

		go func(url string) {
			defer wg.Done()
			checkUrl(url)
		}(u)
	}

	wg.Wait()
}

func doneNoget(wg sync.WaitGroup) {
	wg.Done()
}

//checks and prints a message if a website is up or down
func checkUrl(url string) {
	_, err := http.Get(url)
	if err != nil {
		fmt.Println(url, "is down !!!")
		return
	}
	fmt.Println(url, "is up and running.")
}
