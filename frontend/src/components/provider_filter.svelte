<script lang="ts">
  import { PYTHON_API } from "../variables.js"
  import { onMount } from "svelte"
  import { calculateAmountOfShownItems } from "../utils"
  import { currentCountry } from "../stores/country.js"
  import { IMG_ORIGINAL } from "../variables"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import { Mousewheel, FreeMode } from "swiper"
  import "swiper/css"
  import "swiper/css/free-mode"

  const PROVIDER_URL = `${PYTHON_API}/providers/`
  let activeProviders = []

  let slidesPerView = 0

  const fetchProviders = async () => {
    const res = await fetch(PROVIDER_URL + $currentCountry)
    activeProviders = await res.json()
  }

  onMount(async () => {
    fetchProviders()

    slidesPerView = calculateAmountOfShownItems({
      width: window.visualViewport.width,
      xxl: 22,
      xl: 20,
      lg: 12,
      md: 10,
      sm: 8,
      mobile: 7,
    })
  })
</script>

<div class="bg-neutral rounded-lg swiper-container pt-3">
  <Swiper
    spaceBetween={2}
    {slidesPerView}
    loop={true}
    mousewheel={true}
    modules={[FreeMode, Mousewheel]}
    touchEventsTarget={{ touchEventsTarget: "container" }}
  >
    {#each activeProviders as provider}
      <SwiperSlide>
        <img
          src="{IMG_ORIGINAL}{provider.logo_path}"
          class="h-12 rounded-lg hover:contrast-75 hover:ring-2 ring-primary"
          alt={provider.name}
        />
      </SwiperSlide>
    {/each}
  </Swiper>
</div>
