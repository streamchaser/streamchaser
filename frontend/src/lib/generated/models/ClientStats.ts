/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IndexStats } from "./IndexStats"

/**
 * A Pydantic model that provides a base configuration for conveting between camel and snake case.
 *
 * If another Pydantic model inherit from this class it will get the ability to do this conversion
 * between camel and snake case without having to add the configuration to the new model.
 */
export type ClientStats = {
  databaseSize: number
  lastUpdate?: string
  indexes?: Record<string, IndexStats>
}
