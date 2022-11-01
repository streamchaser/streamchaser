/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Movie = {
  id: number
  title: string
  release_date: string
  overview: string
  genres?: Array<string>
  imdb_id?: string
  runtime?: string
  flatrate_providers?: Array<any>
  free_providers?: Array<any>
  recommendations: Array<any>
  poster_path?: string
  popularity: number
  backdrop_path?: string
  cast: Array<any>
}
