import { persist, createSessionStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const filters = persist(
  writable({ tvChecked: true, movieChecked: true, showNoProviders: true }),
  createSessionStorage(),
  "filters"
)
