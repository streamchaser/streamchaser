/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Genre } from "./Genre"

export type TV = {
  id: number
  name: string
  first_air_date?: string
  overview: string
  imdb_id?: string
  genres?: Array<Genre>
  episode_run_time: Array<number>
  flatrate_providers?: Array<any>
  free_providers?: Array<any>
  recommendations?: Array<any>
  poster_path?: string
  popularity: number
  number_of_seasons: number
  seasons: Array<any>
  backdrop_path?: string
  cast: Array<any>
}
