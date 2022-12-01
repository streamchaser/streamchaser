<script lang="ts">
  import { fade } from "svelte/transition"
  import { mediaIdToUrlConverter, uniqueProviders } from "$lib/utils"
  import { currentCountry } from "$lib/stores/country"
  import { IMG_ORIGINAL, IMG_W342 } from "$lib/variables"
  import type { Hit } from "$lib/generated"

  const SHOWN_PROVIDERS: number = 5

  export let providerAmounts: number[]
  export let mediaIndex: number
  export let media: Hit

  // console.log(media)
  // console.log(providerAmounts)

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
</script>

<a
  in:fade
  out:fade|local={{ duration: 200 }}
  href={mediaIdToUrlConverter(media.id)}
  target="_self"
  data-sveltekit-prefetch
  class="card compact w-auto bordered bg-neutral m-1
                           shadow-md hover:contrast-75 hover:ring-2 ring-primary"
>
  {#if media.poster_path}
    <figure class="aspect-[342/513]">
      <img
        class="aspect-[342/513]"
        src="{IMG_W342}{media.poster_path}"
        alt={media.title}
      />
    </figure>
  {:else}
    <figure class="grid place-items-center bg-slate-100 aspect-[342/513]">
      <h2 class="text-center text-lg text-gray-900">
        <strong>{media.title}</strong>
      </h2>
    </figure>
  {/if}
  {#if media.id.charAt(0) == "t"}
    <div class="absolute top-0 right-0 mx-1 -mt-1 opacity-85">
      <div class="badge badge-sm">TV</div>
    </div>
  {/if}
  {#if providerAmounts[mediaIndex] === 0}
    <div class="card-body h-14">
      <p class="text-center text-neutral-content">
        <strong>No providers in {$currentCountry}</strong>
      </p>
    </div>
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
      {#each combineProviders(media).slice(0, SHOWN_PROVIDERS - 1) as provider}
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
        <div class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
          <span>
            +{providerAmounts[mediaIndex] - SHOWN_PROVIDERS + 1}
          </span>
        </div>
      </div>
    </div>
  {/if}
</a>
