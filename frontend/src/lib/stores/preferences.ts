import { writable } from "svelte/store"
import { browser } from "$app/environment"
import type { Genre } from "$lib/generated"

export const currentGenres = writable<Genre[]>(
  browser && sessionStorage.getItem("currentGenres") !== null
    ? JSON.parse(sessionStorage.getItem("currentGenres"))
    : []
)

currentGenres.subscribe(value => {
  if (browser) {
    sessionStorage.setItem("currentGenres", JSON.stringify(value))
  }
})

interface Provider {
  index: number
  value: string
  label: string
}

export const currentProviders = writable<Provider[]>(
  browser && localStorage.getItem("currentProviders") !== null
    ? JSON.parse(localStorage.getItem("currentProviders"))
    : []
)

interface Sorting {
  by: {
    popularity: boolean
    releaseDate: boolean
    imdbRating: boolean
  }
  asc: boolean
}

export const sorting = writable<Sorting>(
  browser && localStorage.getItem("sorting") !== null
    ? JSON.parse(localStorage.getItem("sorting"))
    : {
        by: { popularity: false, releaseDate: false, imdbRating: false },
        asc: false,
      }
)

interface Filters {
  checked: {
    tv: boolean
    movie: boolean
    person: boolean
  }
  minImdb: number
}

export const filters = writable<Filters>(
  browser && sessionStorage.getItem("filters") !== null
    ? JSON.parse(sessionStorage.getItem("filters"))
    : { checked: { tv: false, movie: false, person: false }, minImdb: 0 }
)

filters.subscribe(value => {
  if (browser) {
    sessionStorage.setItem("filters", JSON.stringify(value))
  }
})

export const chosenTheme = writable<string>(
  (browser && localStorage.chosenTheme) || "dark"
)

export const currentCountry = writable<string>(
  (browser && localStorage.currentCountry) ||
    (browser && sessionStorage.currentCountry) ||
    "DK"
)

currentCountry.subscribe(value => {
  if (browser) {
    sessionStorage.currentCountry = value
  }
})

export const confirmedCountry = writable<boolean>(
  (browser && localStorage.confirmedCountry) || false
)

confirmedCountry.subscribe(value => {
  if (browser) {
    localStorage.confirmedCountry = String(value)
  }
})
