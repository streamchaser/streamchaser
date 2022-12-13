/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TV = {
  id: number
  name: string
  first_air_date?: string
  overview: string
  imdb_id?: string
  genres?: Array<string>
  episode_run_time: Array<number>
  flatrate_providers?: Array<any>
  free_providers?: Array<any>
  rent_providers?: Array<any>
  buy_providers?: Array<any>
  recommendations?: Array<any>
  poster_path?: string
  popularity: number
  number_of_seasons: number
  seasons: Array<any>
  backdrop_path?: string
  cast: Array<any>
}
