import { persist, sessionStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const sorting = persist(
  writable({
    byPopularity: true,
    byReleaseDate: false,
    asc: false,
  }),
  sessionStorage(),
  "sorting"
)
