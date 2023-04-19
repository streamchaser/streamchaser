/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Genre } from "./Genre"

export type Movie = {
  id: number
  title: string
  release_date: string
  overview: string
  genres?: Array<Genre>
  imdb_id?: string
  runtime?: number
  flatrate_providers?: Array<any>
  free_providers?: Array<any>
  recommendations: Array<any>
  poster_path?: string
  popularity: number
  backdrop_path?: string
  cast: Array<any>
}
