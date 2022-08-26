<script lang="ts">
  import { filters } from "../../stores/filters.js"
  import { currentProviders } from "../../stores/providers.js"

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
</script>

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
      />
    </label>
  </div>
  <br />
  <button
    class="btn btn-xs btn-primary"
    on:click={() => {
      Object.keys($filters).forEach(k => ($filters[k] = true))
    }}>{filterAmount ? "Clear filters" : "No filters chosen"}</button
  >
</div>
