<script lang="ts">
  import {
    cookieDisclaimer,
    allowedCookies,
    allowNecessaryCookies,
  } from "$lib/stores/cookies"
  import type { CookieSelection } from "$lib/stores/cookies"
  import { fade, fly } from "svelte/transition"
  import { onMount } from "svelte"
  import { browser } from "$app/environment"

  const cookieDisclaimerTabs = ["Consent", "Options"]

  let currentTab = 0
  let loadDisclaimer: boolean = true
  let allowSelection: boolean
  let cookieSelection: CookieSelection = {
    allowMarketing: true,
    allowPreference: true,
    allowAnalytical: true,
  }

  $: allowSelection = Object.values(cookieSelection).some(value => value === false)
  $: if (browser && !$allowedCookies) {
    localStorage.clear()
  }

  const setCookieConsent = () => {
    $cookieDisclaimer = true
    if (Object.values(cookieSelection).some(value => value === true)) {
      allowedCookies.subscribe(value => {
        if (browser) {
          localStorage.setItem("allowedCookies", JSON.stringify(value))
        }
      })
      $allowedCookies = cookieSelection
    } else {
      $allowNecessaryCookies = true
    }
  }

  onMount(async () => {
    setTimeout(() => (loadDisclaimer = true), 100)
  })
</script>

{#if loadDisclaimer}
  {#if !$cookieDisclaimer}
    <div class="flex justify-center z-50" in:fade out:fly={{ y: 200, duration: 1000 }}>
      <div class="alert flex-col shadow fixed sm:bottom-2 bottom-0 max-w-2xl">
        <div class="flex flex-col">
          <h4 class="flex justify-center">
            <b>🍪 Cookies on Streamchaser</b>
          </h4>
          <div class="tabs flex justify-center">
            {#each cookieDisclaimerTabs as tab, index}
              {#if index === currentTab}
                <div class="tab tab-bordered tab-active">{tab}</div>
              {:else}
                <div
                  class="tab tab-bordered"
                  on:click={() => (currentTab = index)}
                  on:keypress={() => (currentTab = index)}
                >
                  {tab}
                </div>
              {/if}
            {/each}
          </div>
          {#if cookieDisclaimerTabs[currentTab] === "Consent"}
            <div class="flex flex-col mb-4">
              <p class="pb-2">
                We use cookies to improve your experience. We save your country and
                chosen providers, and store this data for your next visit. For
                convenience during your session we keep your genres and input. We use
                third-party cookies to enhance the experience and our service, and to
                analyse the use of our site. By clicking 'Allow All' you consent to our
                use of cookies. In the 'Options'-tab above you can manage the types of
                data you will allow us to store.
              </p>
            </div>
          {:else}
            <div class="flex flex-col mb-4">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text text-xl">Statistics</span>
                  <input
                    type="checkbox"
                    class="toggle"
                    bind:checked={cookieSelection.allowAnalytical}
                    on:change={!cookieSelection.allowAnalytical}
                  />
                </label>
                <div class="pl-2">
                  Statistical cookies give us insight into how you interact with our
                  site - which pages you visit and the functionality you make use of.
                </div>
                <label class="label cursor-pointer">
                  <span class="label-text text-xl">Preferences</span>
                  <input
                    type="checkbox"
                    class="toggle"
                    bind:checked={cookieSelection.allowPreference}
                    on:change={!cookieSelection.allowPreference}
                  />
                </label>
                <div class="pl-2">
                  Preference cookies are used to remember your selected providers,
                  country and the theme you have chosen.
                </div>
                <label class="label cursor-pointer">
                  <span class="label-text text-xl">Marketing</span>
                  <input
                    type="checkbox"
                    class="toggle"
                    bind:checked={cookieSelection.allowMarketing}
                    on:change={!cookieSelection.allowMarketing}
                  />
                </label>
                <div class="pl-2">
                  Marketing cookies are used to track you across websites. The intent is
                  to provide you with ads that are relevant to you specifically.
                </div>
                <label class="label cursor-pointer">
                  <span class="label-text text-xl">Necessary</span>
                  <input type="checkbox" class="toggle" disabled checked />
                </label>
                <div class="pl-2">
                  Necessary cookies are used in order to make the site function
                  properly, and enable navigation and access to areas of the website.
                </div>
              </div>
            </div>
          {/if}
          <div class="flex justify-center">
            <a href="https://www.cookiesandyou.com/about-cookies/" target="_blank">
              <button class="btn btn-sm btn-ghost mr-2">About</button>
            </a>
            <button class="btn btn-sm btn-primary" on:click={setCookieConsent}
              >{allowSelection ? "Allow Selected Cookies" : "Allow Cookies"}</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}
