export interface Provider {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
}

export interface Media {
  genres: string[]
  id: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  providers: string[]
  release_date: string
  specific_provider_names: string[]
  specific_providers: Provider[]
  title: string
}

export interface Meilisearch {
  hits: Media[]
  exhaustiveNbHits: boolean
  limit: number
  nbHits: number
  offset: number
  processingTimeMs: number
  query: string
}
