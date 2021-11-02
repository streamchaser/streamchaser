import { persist, localStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

export const cookieDisclaimer = persist(writable(false), localStorage(), 'cookieDisclaimer');
