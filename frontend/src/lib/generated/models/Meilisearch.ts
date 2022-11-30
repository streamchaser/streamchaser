/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Hit } from "./Hit"

export type Meilisearch = {
  hits: Array<Hit>
  offset: number
  limit: number
  query: string
  estimatedTotalHits: number
  processingTimeMs: number
  facetDistribution?: boolean
}
