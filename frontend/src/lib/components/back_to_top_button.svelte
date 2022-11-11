<script lang="ts">
  import { fade } from "svelte/transition"

  export let showOnPx = 150

  let visible = false

  const goTop = () => {
    document.body.scrollIntoView({ behavior: "smooth" })
  }

  const scrollContainer = () => {
    return document.documentElement || document.body
  }
</script>

<svelte:window
  on:scroll={() =>
    scrollContainer().scrollTop > showOnPx ? (visible = true) : (visible = false)}
/>

{#if visible}
  <div transition:fade class="fixed z-50 top-0 left-0 p-5 transition-all opacity-80">
    <button class="btn btn-primary shadow-md" on:click={goTop}>▲</button>
  </div>
{/if}
