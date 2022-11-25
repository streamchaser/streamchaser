/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Media = {
  id: string
  type: string
  title?: string
  original_title: string
  overview?: string
  release_date?: string
  genres: Array<string>
  poster_path?: string
  popularity?: number
  supported_provider_countries: Array<string>
  providers: Record<string, Record<string, Array<any>>>
}
