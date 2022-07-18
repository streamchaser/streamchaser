<script lang="ts">
  import { filters } from "../stores/filters.js"
  import { currentProviders } from "../stores/providers.js"

  export let search: () => void
  let isDropdownOpen = false
  let providerLabelText: string

  $: filterAmount = Object.values($filters).filter(v => v === false).length

  $: {
    if ($currentProviders.length) {
      $filters.showNoProviders = true
      if ($currentProviders.length > 1) {
        providerLabelText = "Providers selected"
      } else {
        providerLabelText = "Provider selected"
      }
    } else if ($filters.showNoProviders) {
      providerLabelText = "Showing"
    } else {
      providerLabelText = "Hiding"
    }
  }

  const handleDropdownClick = () => {
    isDropdownOpen = !isDropdownOpen
  }

  const handleDropdownFocusLost = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget))
      return
    isDropdownOpen = false
  }
</script>

<div class="indicator">
  {#if filterAmount}
    <span
      class="indicator-item indicator-top sm:indicator-end indicator-center badge badge-secondary"
      >{filterAmount}</span
    >
  {/if}
  <div class="dropdown dropdown-end" on:focusout={handleDropdownFocusLost}>
    <label tabindex="0" class="btn btn-primary ml-2" on:click={handleDropdownClick}>
      {#if isDropdownOpen}
        <svg
          class="swap-on fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
          ><polygon
            points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
          /></svg
        >
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><line x1="4" y1="21" x2="4" y2="14" /><line
            x1="4"
            y1="10"
            x2="4"
            y2="3"
          /><line x1="12" y1="21" x2="12" y2="12" /><line
            x1="12"
            y1="8"
            x2="12"
            y2="3"
          /><line x1="20" y1="21" x2="20" y2="16" /><line
            x1="20"
            y1="12"
            x2="20"
            y2="3"
          /><line x1="1" y1="14" x2="7" y2="14" /><line
            x1="9"
            y1="8"
            x2="15"
            y2="8"
          /><line x1="17" y1="16" x2="23" y2="16" /></svg
        >
      {/if}
    </label>
    <div
      tabindex="0"
      class="dropdown-content card card-compact w-64 p-2 shadow bg-base-100 text-primary-content mt-1"
      style:visibility={isDropdownOpen ? "visible" : "hidden"}
    >
      <div class="card-body">
        <h3 class="card-title text-neutral-content">Filters</h3>
        <div class="divider" />
        <h3 class="text-neutral-content"><b>Media types</b></h3>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Movies</span>
            <input
              type="checkbox"
              class="toggle"
              bind:checked={$filters.movieChecked}
              on:change={() => {
                if (!$filters.movieChecked) {
                  $filters.tvChecked = true
                }
                search()
              }}
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">TV Shows</span>
            <input
              type="checkbox"
              class="toggle"
              bind:checked={$filters.tvChecked}
              on:change={() => {
                if (!$filters.tvChecked) {
                  $filters.movieChecked = true
                }
                search()
              }}
            />
          </label>
        </div>
        <div class="divider" />
        <h3 class="text-neutral-content"><b>No providers</b></h3>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">{providerLabelText}</span>
            <input
              type="checkbox"
              class="toggle"
              bind:checked={$filters.showNoProviders}
              disabled={$currentProviders.length ? true : false}
              on:change={() => search()}
            />
          </label>
        </div>
        <br />
        <button
          class="btn btn-xs btn-primary"
          on:click={() => {
            Object.keys($filters).forEach(k => ($filters[k] = true))
            search()
          }}>{filterAmount ? "Clear filters" : "No filters chosen"}</button
        >
      </div>
    </div>
  </div>
</div>
