import { persist, sessionStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const limit = persist(writable(21), sessionStorage(), "limit")
