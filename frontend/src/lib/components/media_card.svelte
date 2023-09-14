<script lang="ts">
  import { fade } from "svelte/transition"
  import { mediaIdToUrlConverter, uniqueProviders } from "$lib/utils"
  import { currentCountry } from "$lib/stores/preferences"
  import { IMG_ORIGINAL, IMG_W342, PYTHON_API } from "$lib/variables"
  import type { Hit } from "$lib/generated"
  import { auth } from "$lib/stores/stores"

  const SHOWN_PROVIDERS: number = 5

  export let providerAmounts: number[]
  export let mediaIndex: number
  export let media: Hit

  export let deleteButton = false
  export let mediaList: Hit[] = undefined
  export let listId: number = undefined
  export let listType = ""

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

  const deleteMediaFromList = async () => {
    let url = PYTHON_API + "/" + listType

    if (listType == "custom_lists") {
      url += "/" + listId + "?streamchaser_id=" + media.id + "&encoded_jwt=" + $auth
    } else {
      url += "?streamchaser_id=" + media.id + "&encoded_jwt=" + $auth
    }

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (res.status == 498) {
      $auth = ""
    } else if (res.ok) {
      mediaList = mediaList.filter((i: Hit) => i.id != media.id)
    }
  }
</script>

{#if deleteButton}
  <button
    class="absolute -mt-2 -ml-2 btn btn-circle btn-xs btn-error z-10"
    on:click={async () => {
      await deleteMediaFromList()
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      /></svg
    >
  </button>
{/if}

<a
  in:fade
  out:fade|local={{ duration: 200 }}
  href={mediaIdToUrlConverter(media.id)}
  target="_self"
  data-sveltekit-preload-data
  class="card compact w-auto bordered bg-neutral m-1 overflow-x-hidden
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
  {#if media.imdb_rating}
    <div class="absolute top-0 left-0 mx-1 -ml-1 opacity-85">
      <div class="badge badge-sm rounded-l-none"><b>★&nbsp;</b>{media.imdb_rating}</div>
    </div>
  {/if}
  {#if media.id.charAt(0) == "t"}
    <div
      class="absolute top-0 left-0 mx-1 -ml-1 opacity-85 {media.imdb_rating
        ? 'mt-5'
        : 'mt-1'}"
    >
      <div class="badge badge-sm rounded-l-none">TV</div>
    </div>
  {/if}
  {#if providerAmounts[mediaIndex] === 0}
    <div class="card-body h-14">
      {#if media.id.charAt(0) == "p"}
        <p class="text-center text-neutral-content">
          <strong>{media.title}</strong>
        </p>
      {:else}
        <p class="text-center text-neutral-content">
          <strong>No providers in {$currentCountry}</strong>
        </p>
      {/if}
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
