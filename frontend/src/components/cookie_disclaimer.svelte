<script lang="ts">
  import { fade, fly } from "svelte/transition"
  import { cookieDisclaimer } from "../stores/cookie_disclaimer.js"
  import { onMount } from "svelte"

  let loadDisclaimer = false

  onMount(async () => {
    setTimeout(() => (loadDisclaimer = true), 100)
  })
</script>

{#if loadDisclaimer}
  {#if !$cookieDisclaimer}
    <div class="flex justify-center" in:fade out:fly={{ y: 200, duration: 1000 }}>
      <div class="alert shadow fixed sm:bottom-2 bottom-0 max-w-2xl">
        <div class="flex flex-col">
          <h4 class="flex justify-center pb-1">
            <b>🍪 Cookies on Streamchaser</b>
          </h4>
          <p class="pb-2">
            We use cookies to improve your experience. We save your country and chosen
            providers, and store this data for your next visit. For convenience during
            your session we keep your genres and input. We use third-party cookies to
            enhance the experience and our service, and to analyse the use of our site.
            Your continued browsing means that you have understood and accepted this.
          </p>
          <div class="flex justify-center">
            <a href="https://www.cookiesandyou.com/about-cookies/" target="_blank">
              <button class="btn btn-sm btn-ghost mr-2">About cookies</button>
            </a>
            <button
              class="btn btn-sm btn-primary"
              on:click={() => ($cookieDisclaimer = true)}>Accept</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}
