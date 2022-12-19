<script lang="ts">
  import {
    cookieDisclaimer,
    allowedCookies,
    allowNecessaryCookies,
  } from "$lib/stores/cookies"
  import type { CookieType } from "$lib/stores/cookies"
  import { fade, fly } from "svelte/transition"
  import { onMount } from "svelte"
  import { browser } from "$app/environment"
  import { cookieSelection, necessary, preferences } from "$lib/cookies"

  const cookieDisclaimerTabs = ["Consent", "Options"]

  let currentTab = 0
  let loadDisclaimer = true
  let allowSelection: boolean
  let cookieTypes: CookieType[] = [necessary, preferences]

  $: allowSelection = Object.values(cookieSelection).some(value => value === false)

  $: if (browser && !localStorage.getItem("allowedCookies")) {
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
    <div
      class="flex justify-center z-50"
      in:fade={{ duration: 500 }}
      out:fly={{ y: 200, duration: 1000 }}
    >
      <div class="alert flex-col shadow fixed sm:bottom-2 bottom-0 max-w-2xl ">
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
                analyse the use of our site. Your continued browsing means you have
                accepted any cookies necessary for our site to function properly. By
                clicking 'Allow All' you consent to any other types of cookies we make
                use of. In the 'Options'-tab above you can configure which types of data
                you will allow us to store. Click 'About' to learn more about cookies.
              </p>
            </div>
          {:else}
            <div class="flex flex-col mb-4">
              <div class="form-control">
                {#each cookieTypes as cookieType}
                  <label class="label cursor-pointer">
                    <span class="label-text text-xl">{cookieType.name}</span>
                    {#if cookieType.type != null}
                      <input
                        type="checkbox"
                        class="toggle"
                        bind:checked={cookieSelection[cookieType.type]}
                      />
                    {:else}
                      <input type="checkbox" class="toggle" disabled checked />
                    {/if}
                  </label>
                  <div class="pl-2">
                    {cookieType.description}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          <div class="flex justify-center">
            <a
              href="https://www.cookiesandyou.com/about-cookies/"
              target="_blank"
              rel="noreferrer"
            >
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
