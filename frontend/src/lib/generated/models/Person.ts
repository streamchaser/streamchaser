/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Person = {
  id: number
  name: string
  imdb_id?: string
  birthdate?: string
  deathday?: string
  biography: string
  place_of_birth?: string
  also_known_as?: Array<string>
  profile_path?: string
  movie_credits?: Array<any>
  tv_credits?: Array<any>
  gender: number
}
