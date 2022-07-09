import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const patron = persist(writable(false), localStorage(), "patron")
