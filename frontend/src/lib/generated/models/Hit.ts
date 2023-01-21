/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Providers } from "./Providers"

export type Hit = {
  id: string
  imdb_rating: string
  title: string
  poster_path: string
  providers?: Providers
}
