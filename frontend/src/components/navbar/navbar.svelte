<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
  import CountrySelector from "../country_selector.svelte"
  import ThemeSelector from "../theme_selector.svelte"
</script>

<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content max-h-16">
  <div class="flex-none sm:px-2 sm:mx-2">
    <a href="/">
      <img src="../../navbar_logo_with_image.png" class="w-48" />
    </a>
  </div>
  <div class="flex-1 px-2 mx-2" />
  <div class="flex-none">
    <div class="items-stretch hidden sm:flex">
      <a class="btn btn-ghost btn-sm rounded-btn" href="/about"> About </a>
      <a class="btn btn-ghost btn-sm rounded-btn" href="/faq"> FAQ </a>
    </div>
    <ThemeSelector />
  </div>
  <div class="sm:pl-4">
    <CountrySelector />
  </div>
</div>
