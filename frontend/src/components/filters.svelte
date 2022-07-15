<script lang="ts">
  export let movieChecked = true
  export let tvChecked = true
  export let search
</script>

<div class="dropdown dropdown-end">
  <label tabindex="0" class="btn btn-primary ml-2">
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
      ><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line
        x1="12"
        y1="21"
        x2="12"
        y2="12"
      /><line x1="12" y1="8" x2="12" y2="3" /><line
        x1="20"
        y1="21"
        x2="20"
        y2="16"
      /><line x1="20" y1="12" x2="20" y2="3" /><line
        x1="1"
        y1="14"
        x2="7"
        y2="14"
      /><line x1="9" y1="8" x2="15" y2="8" /><line
        x1="17"
        y1="16"
        x2="23"
        y2="16"
      /></svg
    >
  </label>
  <div
    tabindex="0"
    class="dropdown-content card card-compact w-64 p-2 shadow bg-base-100 text-primary-content mt-1"
  >
    <div class="card-body">
      <h3 class="card-title text-neutral-content">Filters</h3>
      <div class="divider" />
      <h3 class="text-neutral-content"><b>Content types</b></h3>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Movies</span>
          <input
            type="checkbox"
            class="checkbox"
            bind:checked={movieChecked}
            disabled={!tvChecked}
            on:change={() => search()}
          />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text">TV shows</span>
          <input
            type="checkbox"
            class="checkbox"
            bind:checked={tvChecked}
            disabled={!movieChecked}
            on:change={() => search()}
          />
        </label>
      </div>
    </div>
  </div>
</div>
