import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const currentProviders = persist(
  writable([]),
  localStorage(),
  "currentProviders"
)
