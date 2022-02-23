<script lang="ts">
  import { mediaIdToUrlConverter } from "../../utils"
  import type { Recommendation } from "../types"

  const IMG_URL = "https://image.tmdb.org/t/p/original/"

  export let recommendations: Recommendation[]
  export let mediaType: string
</script>

{#if recommendations.length}
  <h1 class="text-center text-3xl pt-5">Recommendations</h1>
  <div class="pt-5">
    <div
      class="p-4 space-x-4 carousel carousel-center bg-neutral-focus sm:shadow-md sm:rounded-box"
    >
      {#each recommendations as recommendation}
        {#if recommendation.poster_path}
          <a
            href={mediaIdToUrlConverter(recommendation.id, mediaType)}
            target="_self"
            class="carousel-item h-96 w-64 p-1"
          >
            <img
              src="{IMG_URL}{recommendation.poster_path}"
              class="rounded-lg hover:contrast-75 hover:ring-2 ring-primary"
              alt={recommendation.title}
            />
          </a>
        {/if}
      {/each}
    </div>
  </div>
{/if}
