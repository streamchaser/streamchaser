import { writable } from "svelte/store"
import { browser } from "$app/environment"

export const isBurgerMenuOpen = writable(false)

export const auth = writable<string>(
  browser && localStorage.getItem("auth") !== null ? localStorage.getItem("auth") : ""
)

auth.subscribe(value => {
  if (browser) {
    localStorage.setItem("auth", value)
  }
})
