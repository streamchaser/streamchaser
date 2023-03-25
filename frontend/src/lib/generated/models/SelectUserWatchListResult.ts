/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SelectUserWatchListResultWatchListItem } from "./SelectUserWatchListResultWatchListItem"

/**
 * SelectUserWatchListResult(id: 'uuid.UUID', watch_list: 'list[SelectUserWatchListResultWatchListItem]')
 */
export type SelectUserWatchListResult = {
  id: string
  watch_list: Array<SelectUserWatchListResultWatchListItem>
}
