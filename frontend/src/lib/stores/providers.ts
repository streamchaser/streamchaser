import { writable } from "svelte/store"

const currentProvidersItemName = "currentProviders"
const parsed = JSON.parse(localStorage.getItem(currentProvidersItemName))
export const currentProviders = writable<string[]>(parsed === null ? [] : parsed)

currentProviders.subscribe(value =>
  localStorage.setItem(currentProvidersItemName, JSON.stringify(value))
)
