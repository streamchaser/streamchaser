<script lang="ts">
  import { currentCountry } from "$lib/stores/preferences"
  import type { Meilisearch, Hit } from "$lib/generated"
  import { offset, flip, shift } from "@floating-ui/dom"
  import { createFloatingActions } from "svelte-floating-ui"
  import { IMG_ORIGINAL, PYTHON_API } from "$lib/variables"
  import { hitProviderAmounts, uniqueProviders } from "$lib/utils"

  export let placeholder = "Search"
  export let list = []

  const SHOWN_PROVIDERS: number = 5

  let isFocused = false
  let input = ""
  let providerAmounts: number[] = []
  let meilisearch: Meilisearch

  const combineProviders = (media: Hit) => {
    const providers = []
    if (media.providers) {
      if ("flatrate" in media.providers.results[$currentCountry]) {
        // TODO: We dont want to do this, but due to a tmdb issue we need to remove HBO manually
        // https://github.com/streamchaser/streamchaser/issues/286
        for (let provider of media.providers.results[$currentCountry]["flatrate"]) {
          if (provider.provider_name !== "HBO") {
            providers.push(provider)
          }
        }
        // providers.push(...media.providers.results[$currentCountry]["flatrate"])
      }
      if ("free" in media.providers.results[$currentCountry]) {
        providers.push(...media.providers.results[$currentCountry]["free"])
      }
    }
    return uniqueProviders(providers)
  }

  const delayedUnfocus = () => {
    // Stupid hack to make the floatingContent be clickable before it disappears
    setTimeout(() => (isFocused = false), 250)
  }

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: "absolute",
    placement: "bottom",
    middleware: [offset(6), flip(), shift()],
  })
  const SEARCH_URL = `${PYTHON_API}/search/`

  const search = async () => {
    const res = await fetch(SEARCH_URL + input + "?limit=10")

    meilisearch = await res.json()
    providerAmounts = hitProviderAmounts(meilisearch.hits, $currentCountry)
  }

  // TODO: Make async
  $: if (input != "") {
    search()
  }
</script>

<div use:floatingRef class="form-control">
  <input
    type="text"
    {placeholder}
    class="input input-bordered"
    bind:value={input}
    on:blur={delayedUnfocus}
    on:focus={() => (isFocused = true)}
  />

  {#if meilisearch && meilisearch.hits.length && input && isFocused}
    <div class="dropdown-content pt-2">
      <div use:floatingContent class="overflow-x-auto shadow-lg max-h-96 z-50">
        <table class="table table-compact w-full text-neutral">
          <tbody>
            {#each meilisearch.hits as media, mediaIndex}
              <tr
                class="hover cursor-pointer"
                on:click={() => {
                  list.media = [...list.media, media]
                }}
              >
                <th class="text-neutral h-20">
                  <div class="grid grid-cols-2 gap-4 grid-col-row">
                    <div class="text-base text-neutral-content">
                      {media.title}
                    </div>
                    <div class="items-end">
                      {#if providerAmounts[mediaIndex] === 0}
                        {#if media.id.charAt(0) == "p"}
                          <p class="text-center text-neutral-content">
                            <strong>{media.title}</strong>
                          </p>
                        {:else}
                          <p class="text-neutral-content">
                            <strong>No providers in {$currentCountry}</strong>
                          </p>
                        {/if}
                      {:else if providerAmounts[mediaIndex] <= SHOWN_PROVIDERS}
                        <div class="-space-x-4 avatar-group">
                          {#each combineProviders(media) as provider}
                            <div class="avatar border-neutral">
                              <div class="w-12 h-12">
                                <img
                                  src="{IMG_ORIGINAL}{provider.logo_path}"
                                  alt={provider.provider_name}
                                />
                              </div>
                            </div>
                          {/each}
                        </div>
                      {:else}
                        <div class="-space-x-4 avatar-group">
                          {#each combineProviders(media).slice(0, 5 - 1) as provider}
                            <div class="avatar border-neutral">
                              <div class="w-12 h-12">
                                <img
                                  src="{IMG_ORIGINAL}{provider.logo_path}"
                                  alt={provider.provider_name}
                                />
                              </div>
                            </div>
                          {/each}
                          <div class="avatar placeholder border-neutral">
                            <div
                              class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content"
                            >
                              <span>
                                +{providerAmounts[mediaIndex] - SHOWN_PROVIDERS + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      {/if}
                    </div>
                  </div>
                </th>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
