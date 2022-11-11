import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const sorting = persist(
  writable({
    by: {
      popularity: false,
      releaseDate: false,
    },
    asc: false,
  }),
  createLocalStorage(),
  "sorting"
)
