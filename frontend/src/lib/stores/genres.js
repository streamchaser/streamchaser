import { persist, createSessionStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const currentGenres = persist(
  writable([]),
  createSessionStorage(),
  "currentGenres"
)