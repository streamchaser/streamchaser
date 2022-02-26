export interface Genre {
  label: string
  value: string
}
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
  providers: Provider[]
  provider_names: string[]
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

export interface Recommendation {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  media_type: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string // yyyy-mm-dd
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Cast {
  adult: boolean
  cast_id: number
  character: string
  credit_id: string
  gender: number
  id: number
  known_for_department: string
  name: string
  order: number
  original_name: string
  popularity: number
  profile_path: string
}