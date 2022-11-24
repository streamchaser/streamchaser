import { browser } from "$app/environment"
import { writable } from "svelte/store"

export interface CookieSelection {
  allowMarketing: boolean
  allowPreference: boolean
  allowAnalytical: boolean
}

export const allowNecessaryCookies = writable<boolean>(
  (browser && sessionStorage.allowNecessaryCookies) || false
)

allowNecessaryCookies.subscribe(value => {
  if (browser) {
    sessionStorage.allowNecessaryCookies = String(value)
  }
})

export const allowedCookies = writable<CookieSelection>()

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
