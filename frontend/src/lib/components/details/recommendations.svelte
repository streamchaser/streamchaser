<script lang="ts">
  import type { Recommendation } from "$lib/types"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import { Navigation, Lazy } from "swiper"
  import MediaCard from "$lib/components/media_card.svelte"
  import "swiper/css"
  import "swiper/css/free-mode"
  import { PYTHON_API } from "$lib/variables"
  import { onMount } from "svelte"
  import { currentCountry } from "$lib/stores/country"
  import type { Meilisearch, Hit } from "$lib/generated"
  import Spinner from "../loading/spinner.svelte"

  export let recommendations: Recommendation[]
  export let mediaType: string

  let loadedPage: boolean
  let providerAmounts: number[]

  const hitProviderAmounts = (searchHits: Hit[]) => {
    providerAmounts = []
    searchHits.forEach(hit => {
      let combinedAmount = 0
      if (hit.providers) {
        if ("flatrate" in hit.providers.results[$currentCountry]) {
          combinedAmount += hit.providers.results[$currentCountry]["flatrate"].length
        }
        if ("free" in hit.providers.results[$currentCountry]) {
          combinedAmount += hit.providers.results[$currentCountry]["free"].length
        }
      }
      providerAmounts.push(combinedAmount)
    })
  }

  const lookupRecommendations = async (): Promise<Meilisearch> => {
    const ids = recommendations.map(v => mediaType[0] + v.id)
    const res = await fetch(
      `${PYTHON_API}/media?c=${$currentCountry}&ids=${ids.join("&ids=")}`
    )
    const json: Meilisearch = await res.json()

    hitProviderAmounts(json.hits)

    return json
  }

  onMount(() => {
    loadedPage = true
  })
</script>

{#if recommendations.length && loadedPage}
  <h1 class="text-center text-3xl pt-5 pb-5">Recommendations</h1>
  {#await lookupRecommendations()}
    <Spinner timeout={false} />
  {:then meilisearch}
    <div class="swiper-container px-2 mx-2">
      <Swiper
        style="
        --swiper-navigation-color: text-blue-500;
        --swiper-navigation-size: 25px;
      "
        grabCursor={true}
        resistance={false}
        preloadImages={false}
        lazy={{
          enabled: true,
          checkInView: true,
          loadPrevNext: true,
        }}
        watchSlidesProgress={true}
        breakpoints={{
          0: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
          640: { slidesPerView: 3.3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
          1536: { slidesPerView: 7 },
        }}
        modules={[Navigation, Lazy]}
        loop={true}
        navigation={true}
        freeMode={true}
        touchEventsTarget={{ touchEventsTarget: "container" }}
      >
        {#each meilisearch.hits as hit, index}
          {#if hit.poster_path}
            <SwiperSlide>
              <div class="p-1 swiper-lazy">
                <MediaCard media={hit} mediaIndex={index} {providerAmounts} />
              </div>
            </SwiperSlide>
          {/if}
        {/each}
      </Swiper>
    </div>
  {/await}
{/if}
