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
  runtime?: number
  flatrate_providers?: Array<any>
  free_providers?: Array<any>
  rent_providers?: Array<any>
  buy_providers?: Array<any>
  recommendations: Array<any>
  poster_path?: string
  popularity: number
  backdrop_path?: string
  cast: Array<any>
}
