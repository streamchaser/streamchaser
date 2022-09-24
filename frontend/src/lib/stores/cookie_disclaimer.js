import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const cookieDisclaimer = persist(
  writable(false),
  createLocalStorage(),
  "cookieDisclaimer"
)
