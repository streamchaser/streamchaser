<script lang="ts">
  export let showOnPx = 150
  let hidden = true

  function goTop() {
    document.body.scrollIntoView({ behavior: "smooth" })
  }

  function scrollContainer() {
    return document.documentElement || document.body
  }

  function handleOnScroll() {
    if (!scrollContainer()) {
      return
    }

    if (scrollContainer().scrollTop > showOnPx) {
      hidden = false
    } else {
      hidden = true
    }
  }
</script>

<svelte:window on:scroll={handleOnScroll} />

<div class="fixed top-0 left-0 p-5 transition-all">
  <button class="btn btn-secondary shadow-md" on:click={goTop} class:hidden>▲</button>
</div>
