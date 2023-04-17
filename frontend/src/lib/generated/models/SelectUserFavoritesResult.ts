/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SelectUserCustomListsResultCustomListsItemMediaItem } from "./SelectUserCustomListsResultCustomListsItemMediaItem"

/**
 * SelectUserFavoritesResult(id: 'uuid.UUID', favorites: 'list[SelectUserCustomListsResultCustomListsItemMediaItem]')
 */
export type SelectUserFavoritesResult = {
  id: string
  favorites: Array<SelectUserCustomListsResultCustomListsItemMediaItem>
}
