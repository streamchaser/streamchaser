/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SelectCountryProvidersResultProvidersItem } from "./SelectCountryProvidersResultProvidersItem"

/**
 * SelectCountryProvidersResult(id: 'uuid.UUID', label: 'str', value: 'str', providers: 'list[SelectCountryProvidersResultProvidersItem]')
 */
export type SelectCountryProvidersResult = {
  id: string
  label: string
  value: string
  providers: Array<SelectCountryProvidersResultProvidersItem>
}
