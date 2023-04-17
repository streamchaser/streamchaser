/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SelectUserCustomListsResultCustomListsItemMediaItem } from "./SelectUserCustomListsResultCustomListsItemMediaItem"

/**
 * SelectUserWatchListResult(id: 'uuid.UUID', watch_list: 'list[SelectUserCustomListsResultCustomListsItemMediaItem]')
 */
export type SelectUserWatchListResult = {
  id: string
  watch_list: Array<SelectUserCustomListsResultCustomListsItemMediaItem>
}
