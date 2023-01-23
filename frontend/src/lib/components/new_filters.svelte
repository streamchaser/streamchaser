<script lang="ts">
  import { filters, sorting } from "$lib/stores/preferences"
  import { totalFilterAmount } from "$lib/stores/stores"

  let descLabelText = "Highest"
  let ascLabelText = "Lowest"

  $: sortingAmount =
    Object.values($sorting.by).filter(v => v === true).length +
    (sortingAmount ? ($sorting.asc ? 1 : 0) : 0)
  $: imdbAmount = $filters.minImdb != 0 ? 1 : 0
  $: filterAmount = Object.values($filters).filter(v => v === false).length + imdbAmount
  $: $totalFilterAmount = sortingAmount + filterAmount
</script>

<div class="flex justify-center pt-2">
  <div class="indicator">
    {#if filterAmount}
      <span class="indicator-item indicator-top indicator-start badge badge-secondary"
        >{filterAmount}</span
      >
    {/if}
    <div class="badge badge-primary badge-lg"><b>Filters</b></div>
  </div>
</div>
<br />
<h3 class="text-neutral-content"><b>Media types</b></h3>
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Movies</span>
    <input
      type="checkbox"
      class="checkbox"
      bind:checked={$filters.movieChecked}
      on:change={() => {
        if (!$filters.movieChecked) {
          $filters.tvChecked = true
        }
      }}
    />
  </label>
  <label class="label cursor-pointer">
    <span class="label-text">TV Shows</span>
    <input
      type="checkbox"
      class="checkbox"
      bind:checked={$filters.tvChecked}
      on:change={() => {
        if (!$filters.tvChecked) {
          $filters.movieChecked = true
        }
      }}
    />
  </label>
</div>
<br />
<h3 class="text-neutral-content"><b>IMDb rating</b></h3>
<p class="text-neutral-content">Minimum: {$filters.minImdb}</p>
<br />
<input
  type="range"
  min="0.0"
  max="10.0"
  step="0.1"
  bind:value={$filters.minImdb}
  class="range"
/>
<br />

<button
  class="btn btn-xs {filterAmount ? 'btn-primary' : 'btn-disabled'}"
  on:click={() => {
    $filters.minImdb = 0
    $filters.tvChecked = true
    $filters.movieChecked = true
  }}>{filterAmount ? "Clear filters" : "No filters chosen"}</button
>
<div class="divider" />

<div class="flex justify-center pt-2">
  <div class="indicator">
    {#if sortingAmount}
      <span class="indicator-item indicator-top indicator-start badge badge-secondary"
        >{sortingAmount}</span
      >
    {/if}
    <div class="badge badge-primary badge-lg"><b>Sorting</b></div>
  </div>
</div>
<br />
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
      }}
    />
  </label>
  <br />
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
  }}>{sortingAmount ? "Clear sorting" : "No sorting chosen"}</button
>
