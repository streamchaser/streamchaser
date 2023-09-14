<script lang="ts">
  import { currentProviders, filters, sorting } from "$lib/stores/preferences"
  import { auth } from "$lib/stores/stores"
  import { PYTHON_API } from "$lib/variables"

  const contentTypes = ["Filters", "Sorting"]

  export let search: () => void

  let currentTab = 0
  let isDropdownOpen = false
  let descLabelText = "Highest"
  let ascLabelText = "Lowest"

  $: sortingAmount = Object.values($sorting.by).filter(v => v === true).length
  $: imdbAmount = $filters.minImdb != 0 ? 1 : 0
  $: filterAmount =
    Object.values($filters.checked).filter(v => v === true).length + imdbAmount
  $: totalAmount =
    sortingAmount + filterAmount + (sortingAmount ? ($sorting.asc ? 1 : 0) : 0)

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
      tabindex="-1"
      for=""
      class="btn btn-primary ml-2"
      on:click={handleDropdownClick}
      on:keypress={handleDropdownClick}
    >
      <div class="swap swap-rotate">
        <svg
          class="{isDropdownOpen ? 'swap-off' : 'swap-on'} fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
          ><polygon
            points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
          /></svg
        >
        <svg
          class="{isDropdownOpen ? 'swap-on' : 'swap-off'} fill-current"
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
      </div>
    </label>
    <div
      tabindex="-1"
      class="dropdown-content card card-compact w-64 p-2 shadow bg-base-100 text-primary-content mt-1"
      style:visibility={isDropdownOpen ? "visible" : "hidden"}
    >
      <div class="card-body">
        <div class="tabs flex justify-center">
          {#each contentTypes as contentType, index}
            {#if index === currentTab}
              <div class="tab tab-bordered tab-active">{contentType}</div>
            {:else}
              <div
                class="tab tab-bordered"
                on:click={() => (currentTab = index)}
                on:keypress={() => (currentTab = index)}
              >
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
                bind:checked={$filters.checked.movie}
                on:change={() => {
                  $filters.checked.person = false
                  search()
                }}
              />
            </label>
            <label class="label cursor-pointer">
              <span class="label-text">TV Shows</span>
              <input
                type="checkbox"
                class="toggle"
                bind:checked={$filters.checked.tv}
                on:change={() => {
                  $filters.checked.person = false
                  search()
                }}
              />
            </label>
            <label class="label cursor-pointer">
              <span class="label-text">People</span>
              <input
                type="checkbox"
                class="toggle"
                bind:checked={$filters.checked.person}
                on:change={() => {
                  if ($filters.checked.person) {
                    $filters.checked.tv = false
                    $filters.checked.movie = false
                    $filters.minImdb = 0
                  }
                  search()
                }}
              />
            </label>
          </div>

          <div class="divider" />
          <h3 class="text-neutral-content"><b>IMDb rating</b></h3>
          <p class="text-neutral-content">Minimum: {$filters.minImdb}</p>
          <input
            type="range"
            min="0.0"
            max="10.0"
            step="0.1"
            on:change={() => {
              $filters.checked.person = false
              search()
            }}
            bind:value={$filters.minImdb}
            class="range"
          />
          <br />
          {#if $auth}
            <button
              class="btn btn-xs btn-outline"
              on:click={async () => {
                const res = await fetch(PYTHON_API + "/providers?encoded_jwt=" + $auth)
                const json = await res.json()

                if (res.status == 498) {
                  $auth = ""
                } else if (res.ok) {
                  $currentProviders = []
                  for (let i = 0; i < json.providers.length; i++) {
                    const item = {
                      index: i,
                      value: json.providers[i].provider_name,
                      label: json.providers[i].provider_name,
                    }
                    $currentProviders = [...new Set([...$currentProviders, item])]
                  }
                }
              }}>Apply my providers</button
            >
            <br />
          {/if}
          <button
            class="btn btn-xs {filterAmount ? 'btn-primary' : 'btn-disabled'}"
            on:click={() => {
              $filters.minImdb = 0
              for (const key in $filters.checked) {
                $filters.checked[key] = false
              }
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
                    descLabelText = "Highest"
                    ascLabelText = "Lowest"
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
                    descLabelText = "Newest"
                    ascLabelText = "Oldest"
                  }

                  search()
                }}
              />
            </label>
            <label class="label cursor-pointer">
              <span class="label-text">IMDb rating</span>
              <input
                type="checkbox"
                class="toggle"
                bind:checked={$sorting.by.imdbRating}
                on:change={() => {
                  if (!$sorting.by.imdbRating) {
                    //When disabled
                    $sorting.by.imdbRating = false
                  } else if ($sorting.by.imdbRating) {
                    //When enabled
                    for (const key in $sorting.by) {
                      $sorting.by[key] = false
                    }
                    $sorting.by.imdbRating = true
                    descLabelText = "Higest"
                    ascLabelText = "Lowest"
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
                  disabled={sortingAmount ? false : true}
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
                  disabled={sortingAmount ? false : true}
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
              search()
            }}>{sortingAmount ? "Clear sorting" : "No sorting chosen"}</button
          >
        {/if}
      </div>
    </div>
  </div>
</div>
