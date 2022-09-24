import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const currentProviders = persist(
  writable([]),
  createLocalStorage(),
  "currentProviders"
)