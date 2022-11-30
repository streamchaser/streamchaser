import { browser } from "$app/environment"
import { writable } from "svelte/store"

export const cookieDisclaimer = writable<boolean>(
  (browser && localStorage.cookieDisclaimer) || false
)

cookieDisclaimer.subscribe(value => {
  if (browser) {
    localStorage.cookieDisclaimer = String(value)
  }
})
