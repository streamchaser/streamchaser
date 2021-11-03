<script lang="ts">
  import { cookieDisclaimer } from "../stores/cookie_disclaimer.js";
  import { onMount } from "svelte";

  let loadDisclaimer = false;

  onMount(async () => {
    setTimeout(() => (loadDisclaimer = true), 100);
  });
</script>

{#if loadDisclaimer}
  {#if !$cookieDisclaimer}
    <div class="flex justify-center">
      <div class="alert fixed sm:bottom-2 bottom-0 max-w-2xl">
        <div class="flex flex-col">
          <label class="pb-2">
            <h4 class="flex justify-center pb-1">
              <b>🍪 Cookies on Streamchaser</b>
            </h4>
            <p>
              We use cookies to improve your experience. We save your country
              and chosen providers, and store this data for your next visit. For
              convenience during your session we keep your genres and input. We
              use third-party cookies to enhance the experience and our service,
              and to analyse the use of our site. Your continued browsing means
              that you have understood and accepted this.
            </p>
          </label>
          <div class="flex justify-center">
            <a
              href="https://www.cookiesandyou.com/about-cookies/"
              target="_blank"
            >
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
