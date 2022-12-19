import { browser } from "$app/environment"
import { writable } from "svelte/store"

export interface CookieSelection {
  allowPreference: boolean
}

export interface CookieType {
  name: string
  type?: string
  description: string
}

export const allowNecessaryCookies = writable<boolean>(
  (browser && sessionStorage.allowNecessaryCookies) || false
)

allowNecessaryCookies.subscribe(value => {
  if (browser) {
    sessionStorage.allowNecessaryCookies = String(value)
  }
})

export const allowedCookies = writable<CookieSelection>(
  browser &&
    localStorage.getItem("allowedCookies") &&
    JSON.parse(localStorage.getItem("allowedCookies"))
)

// true if user has allowed cookies or allowed necessary, false if not
export const cookieDisclaimer = writable<boolean>(
  (browser && localStorage.allowedCookies != null) ||
    (browser && sessionStorage.allowNecessaryCookies === "true")
)

cookieDisclaimer.subscribe(value => {
  if (browser) {
    sessionStorage.cookieDisclaimer = String(value)
  }
})
