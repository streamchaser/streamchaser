import { browser } from "$app/environment"
import { writable } from "svelte/store"

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
