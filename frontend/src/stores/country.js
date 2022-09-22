import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const currentCountry = persist(
  writable("DK"),
  createLocalStorage(),
  "currentCountry"
)
export const confirmedCountry = persist(
  writable(false),
  createLocalStorage(),
  "confirmedCountry"
)
