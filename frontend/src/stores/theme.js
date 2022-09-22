import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const chosenTheme = persist(
  writable("dark"),
  createLocalStorage(),
  "chosenTheme"
)
