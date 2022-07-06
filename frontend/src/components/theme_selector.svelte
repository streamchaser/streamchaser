<script lang="ts">
  import { themeChange } from "theme-change"
  import { onMount } from "svelte"
  import { chosenTheme } from "../stores/theme.js"
  import { THEMES } from "../variables.js"

  onMount(() => {
    themeChange(false)
  })
</script>

<div class="dropdown dropdown-end">
  <div tabindex="0" class="btn btn-ghost btn-sm rounded-btn text-xl">🎨</div>
  <ul
    tabindex="0"
    class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
  >
    {#each THEMES as theme}
      <li
        data-set-theme={theme.value}
        data-act-class="ACTIVECLASS"
        on:click={() => ($chosenTheme = theme.value)}
      >
        {#if $chosenTheme == theme.value}
          <a class="bg-primary hover:bg-primary" href="">
            <p class="text-primary-content">{theme.icon} {theme.value}</p>
          </a>
        {:else}
          <a href="">{theme.icon} {theme.value}</a>
        {/if}
      </li>
    {/each}
  </ul>
</div>
