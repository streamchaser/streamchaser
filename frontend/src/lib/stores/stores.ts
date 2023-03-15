import { writable } from "svelte/store"
import { browser } from "$app/environment"

export const isBurgerMenuOpen = writable(false)

export const auth = writable<string>(
  browser && sessionStorage.getItem("auth") !== null
    ? sessionStorage.getItem("auth")
    : undefined
)

auth.subscribe(value => {
  if (browser) {
    sessionStorage.setItem("auth", value)
  }
})
