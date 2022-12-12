import type { CookieSelection, CookieType } from "$lib/stores/cookies"

export const cookieSelection: CookieSelection = {
  allowPreference: true,
  allowStatistical: true,
}
export const statistical: CookieType = {
  name: "Statistical",
  type: "allowStatistical",
  description:
    "Statistical cookies give us insight into how you interact with our site - which pages you visit and the functionality you make use of.",
  cookieAmount: 1,
}
export const preferences: CookieType = {
  name: "Preferences",
  type: "allowPreference",
  description:
    "Preference cookies are used to remember your selected providers, country and the theme you have chosen.",
  cookieAmount: 6,
}
export const marketing: CookieType = {
  name: "Marketing",
  type: "allowMarketing",
  description:
    "Marketing cookies are used to track you across websites. The intent is to provide you with ads that are relevant to you specifically.",
  cookieAmount: 0,
}
export const necessary: CookieType = {
  name: "Necessary",
  description:
    "Necessary cookies are used in order to make the site function properly, and enable navigation and access to areas of the website.",
  cookieAmount: 4,
}
