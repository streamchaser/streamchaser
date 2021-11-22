import { persist, sessionStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const inputQuery = persist(writable(""), sessionStorage(), "inputQuery")
