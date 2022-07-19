import { persist, sessionStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const sorting = persist(
  writable({
    byPopularity: { active: true, asc: false },
    byReleaseDate: { active: false, asc: false },
  }),
  sessionStorage(),
  "sorting"
)
