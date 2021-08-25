import {writable} from 'svelte-local-storage-store'

export const currentCountry = writable('currentCountry', 'DK')
