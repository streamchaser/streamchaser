import { writable } from "svelte/store"
import { browser } from "$app/environment"
import { setDefaultCountry } from "$lib/utils"

export const currentGenres = writable<string[]>(
  browser && sessionStorage.getItem("currentGenres") !== null
    ? JSON.parse(sessionStorage.getItem("currentGenres"))
    : []
)

currentGenres.subscribe(value => {
  if (browser) {
    sessionStorage.setItem("currentGenres", JSON.stringify(value))
  }
})

export const currentProviders = writable<string[]>(
  browser && localStorage.getItem("currentProviders") !== null
    ? JSON.parse(localStorage.getItem("currentProviders"))
    : []
)

currentProviders.subscribe(value => {
  if (browser) {
    localStorage.setItem("currentProviders", JSON.stringify(value))
  }
})

interface Sorting {
  by: {
    popularity: boolean
    releaseDate: boolean
  }
  asc: boolean
}

export const sorting = writable<Sorting>(
  browser && localStorage.getItem("sorting") !== null
    ? JSON.parse(localStorage.getItem("sorting"))
    : { by: { popularity: false, releaseDate: false }, asc: false }
)

sorting.subscribe(value => {
  if (browser) {
    localStorage.setItem("sorting", JSON.stringify(value))
  }
})

interface Filters {
  tvChecked: boolean
  movieChecked: boolean
}

export const filters = writable<Filters>(
  browser && sessionStorage.getItem("filters") !== null
    ? JSON.parse(sessionStorage.getItem("filters"))
    : { tvChecked: true, movieChecked: true }
)

filters.subscribe(value => {
  if (browser) {
    sessionStorage.setItem("filters", JSON.stringify(value))
  }
})

export const chosenTheme = writable<string>(
  (browser && localStorage.chosenTheme) || "dark"
)

chosenTheme.subscribe(value => {
  if (browser) {
    localStorage.chosenTheme = value
  }
})

export const currentCountry = writable<string>(setDefaultCountry())

currentCountry.subscribe(value => {
  if (browser) {
    localStorage.currentCountry = value
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

export const inputQuery = writable<string>((browser && sessionStorage.inputQuery) || "")

inputQuery.subscribe(value => {
  if (browser) {
    sessionStorage.inputQuery = value
  }
})
