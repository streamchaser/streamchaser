<script lang="ts">
  import { filters } from "../stores/filters.js"
  import { sorting } from "../stores/sorting.js"
  import { currentProviders } from "../stores/providers.js"

  const contentTypes = ["Filters", "Sorting"]

  export let search: () => void

  let currentTab = 0
  let isDropdownOpen = false
  let providerLabelText: string
  let descLabelText: string
  let ascLabelText: string

  $: sortingAmount =
    Object.values($sorting.by).filter(v => v === true).length + ($sorting.asc ? 1 : 0)
  $: filterAmount = Object.values($filters).filter(v => v === false).length

  $: totalAmount = sortingAmount + filterAmount

  $: {
    if ($sorting.by.popularity) {
      descLabelText = "Highest"
      ascLabelText = "Lowest"
    } else {
      descLabelText = "Newest"
      ascLabelText = "Oldest"
    }
  }

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
  {#if totalAmount}
    <span
      class="indicator-item indicator-top sm:indicator-end indicator-center badge badge-secondary"
      >{totalAmount}</span
    >
  {/if}
  <div class="dropdown dropdown-end" on:focusout={handleDropdownFocusLost}>
    <label
      tabindex="0"
      for=""
      class="btn btn-primary ml-2"
      on:click={handleDropdownClick}
    >
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
        <div class="tabs flex justify-center">
          {#each contentTypes as contentType, index}
            {#if index === currentTab}
              <div class="tab tab-bordered tab-active">{contentType}</div>
            {:else}
              <div class="tab tab-bordered" on:click={() => (currentTab = index)}>
                {contentType}
              </div>
            {/if}
          {/each}
        </div>
        <br />
        {#if contentTypes[currentTab] === "Filters"}
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
          <br />
          <button
            class="btn btn-xs {filterAmount ? 'btn-primary' : 'btn-disabled'}"
            on:click={() => {
              Object.keys($filters).forEach(k => ($filters[k] = true))
              search()
            }}>{filterAmount ? "Clear filters" : "No filters chosen"}</button
          >
        {:else}
          <h3 class="text-neutral-content"><b>Sort by</b></h3>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Popularity</span>
              <input
                type="checkbox"
                class="toggle"
                bind:checked={$sorting.by.popularity}
                on:change={() => {
                  if (!$sorting.by.popularity) {
                    //When disabled
                    $sorting.by.popularity = false
                  } else if ($sorting.by.popularity) {
                    //When enabled
                    for (const key in $sorting.by) {
                      $sorting.by[key] = false
                    }
                    $sorting.by.popularity = true
                  }

                  search()
                }}
              />
            </label>
            <label class="label cursor-pointer">
              <span class="label-text">Release date</span>
              <input
                type="checkbox"
                class="toggle"
                bind:checked={$sorting.by.releaseDate}
                on:change={() => {
                  if (!$sorting.by.releaseDate) {
                    //When disabled
                    $sorting.by.releaseDate = false
                  } else if ($sorting.by.releaseDate) {
                    //When enabled
                    for (const key in $sorting.by) {
                      $sorting.by[key] = false
                    }
                    $sorting.by.releaseDate = true
                  }

                  search()
                }}
              />
            </label>
            <div class="divider" />
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">{descLabelText}</span>
                <input
                  type="radio"
                  name="radio-6"
                  class="radio"
                  value={false}
                  bind:group={$sorting.asc}
                  on:change={() => search()}
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">{ascLabelText}</span>
                <input
                  type="radio"
                  name="radio-6"
                  class="radio"
                  value={true}
                  bind:group={$sorting.asc}
                  on:change={() => search()}
                />
              </label>
            </div>
          </div>
          <br />
          <button
            class="btn btn-xs {sortingAmount ? 'btn-primary' : 'btn-disabled'}"
            on:click={() => {
              for (const key in $sorting.by) {
                $sorting.by[key] = false
              }
              $sorting.asc = false
              search()
            }}>{sortingAmount ? "Clear sorting" : "No sorting chosen"}</button
          >
        {/if}
      </div>
    </div>
  </div>
</div>
