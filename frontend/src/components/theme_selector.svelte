<script lang="ts">
  import { themeChange } from "theme-change"
  import { onMount } from "svelte"
  import { chosenTheme } from "../stores/theme.js"
  import { THEMES } from "../variables.js"

  let isDropdownOpen = false

  const handleDropdownClick = () => {
    isDropdownOpen = !isDropdownOpen
  }

  const handleDropdownFocusLost = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget))
      return
    isDropdownOpen = false
  }

  onMount(() => {
    themeChange(false)
  })
</script>

<div class="dropdown dropdown-end" on:focusout={handleDropdownFocusLost}>
  <div
    tabindex="0"
    class="btn btn-ghost btn-sm rounded-btn text-xl"
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
        ><rect x="3" y="3" width="18" height="18" rx="2" /><circle
          cx="8.5"
          cy="8.5"
          r="1.5"
        /><path d="M20.4 14.5L16 10 4 20" /></svg
      >
    {/if}
  </div>
  <ul
    tabindex="0"
    class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
    style:visibility={isDropdownOpen ? "visible" : "hidden"}
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
