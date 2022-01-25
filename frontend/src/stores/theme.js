import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const currentTheme = persist(writable("dark"), localStorage(), "currentTheme")
