import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const currentCountry = persist(
  writable("DK"),
  localStorage(),
  "currentCountry"
)
