/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SelectUserCustomListsResultCustomListsItem } from "./SelectUserCustomListsResultCustomListsItem"

/**
 * SelectUserCustomListsResult(id: 'uuid.UUID', custom_lists: 'list[SelectUserCustomListsResultCustomListsItem]')
 */
export type SelectUserCustomListsResult = {
  id: string
  custom_lists: Array<SelectUserCustomListsResultCustomListsItem>
}
