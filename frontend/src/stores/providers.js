import {writable} from 'svelte-local-storage-store'

export const currentProviders = writable('currentProviders', [])
