<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import MediaQuery from "svelte-media-query"
  import { onMount } from "svelte"

  export let seasons

  const INITIAL_OVERVIEW_LENGTH: number = 600

  const LOW_RES_IMG_URL: string = "https://image.tmdb.org/t/p/w500/"

  let currentTab: number = 0
  let currentOverviewLength: number = INITIAL_OVERVIEW_LENGTH
  //let seasonsElementCoordinates = document.getElementById("seasons-card").getBoundingClientRect()
  //let m = {x: seasonsElementCoordinates.x}
  let moving = false
  let slider

  const onMouseDown = () => {
    moving = true
  }

  let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0

  const onMouseUp = () => {
    moving = false
  }

  const onMouseMove = (e) => {
    if (moving) {
    }
  }

  const changeActiveTab = (index) => {
    currentTab = index
  }

  onMount(async () => {
    const slides = document.querySelectorAll("div")
    slides.forEach((slide, index) => {
      // Listeners for touch
      slide.addEventListener("touchstart", touchStart(index))
      slide.addEventListener("touchend", touchEnd)
      slide.addEventListener("touchmove", touchMove)
      // Listeners for mouse
      // TODO: Is it necessary to be able to slide with mouse?
      slide.addEventListener("mousedown", touchStart(index))
      slide.addEventListener("mouseup", touchEnd)
      slide.addEventListener("mouseleave", touchEnd)
      slide.addEventListener("mousemove", touchMove)
    })

    function touchStart(index) {
      return function (event) {
        currentIndex = index
        startPos = getPositionX(event)
        isDragging = true
        animationID = requestAnimationFrame(animation)
        slider.classList.add("grabbing")
      }
    }

    function touchEnd() {
      isDragging = false
      cancelAnimationFrame(animationID)
      const movedBy = currentTranslate - prevTranslate
      if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1
      if (movedBy > 100 && currentIndex > 0) currentIndex -= 1
      setPositionByIndex()
      slider.classList.remove("grabbing")
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event)
        currentTranslate = prevTranslate + currentPosition - startPos
      }
    }

    function animation() {
      setSliderPosition()
      isDragging && requestAnimationFrame(animation)
    }

    function setSliderPosition() {
      slider.style.transform = `translateX(${currentTranslate}px)`
    }

    function setPositionByIndex() {
      currentTranslate = currentIndex * -window.innerWidth
      prevTranslate = currentTranslate
      setSliderPosition()
    }

    //TODO: Should be moved to external file?
    function getPositionX(event) {
      return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX
    }
  })
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />
<div class="container px-2">
  <div class="text-3xl p-4 flex justify-center">Seasons</div>
  <div class="tabs md:flex sm:justify-center m-mx">
    {#each seasons as season, index}
      {#if index === currentTab}
        <div class="tab tab-bordered tab-lg tab-active">
          {season.name === "Specials"
            ? "S"
            : season.name.substr(season.name.indexOf(" ") + 1)}
        </div>
      {:else}
        <div on:click={() => changeActiveTab(index)} class="tab tab-lg tab-bordered">
          {season.name === "Specials"
            ? "S"
            : season.name.substr(season.name.indexOf(" ") + 1)}
        </div>
      {/if}
    {/each}
  </div>

  <article bind:this={slider}>
    <div
      id="seasons-card"
      on:mousedown={onMouseDown}
      class="my-4 flex justify-center"
      style="cursor: move; user-select: none"
    >
      {#each seasons as season, index}
        <MediaQuery query="(max-width: 1024px)" let:matches>
          {#if matches}
            {#if index === currentTab}
              <div class="card shadow-lg image-full w-auto sm:w-4/6 md:w-3/5 ">
                {#if season.poster_path}
                  <figure>
                    <img
                      src="{LOW_RES_IMG_URL}{season.poster_path}"
                      class="object-fit rounded-lg"
                      alt={season.name}
                    />
                  </figure>
                {:else}
                  <figure>
                    <img
                      src="../static/no_image_available.jpg"
                      class="object-fit rounded-lg"
                      alt="No poster available"
                    />
                  </figure>
                {/if}
                <div class="card-body">
                  <div class="card-title">{season.name}</div>
                  <div class="text-xl text-netural-content">
                    {season.air_date ? season.air_date.split("-")[0] : "No air date"}
                    | {season.episode_count} episodes
                  </div>
                  <div class="text-lg text-netural-content">
                    {season.air_date
                      ? `Premiered on ${season.air_date}`
                      : "Hasn't aired"}
                  </div>
                  &nbsp
                  <div class="text-netural-content">
                    {season.overview
                      ? season.overview
                      : "No season overview available."}
                  </div>
                </div>
              </div>
            {/if}
          {/if}
        </MediaQuery>
        <MediaQuery query="(min-width: 1025px)" let:matches>
          {#if matches}
            {#if index === currentTab}
              <div class="card card-side bg-neutral bordered lg:w-5/6 xl:w-3/5">
                {#if season.poster_path}
                  <figure>
                    <img
                      src="{LOW_RES_IMG_URL}{season.poster_path}"
                      class="object-fit rounded-lg h-96"
                      alt={season.name}
                    />
                  </figure>
                {:else}
                  <figure>
                    <img
                      src="../static/no_image_available.jpg"
                      class="object-fit rounded-lg h-86"
                      alt="No poster available"
                    />
                  </figure>
                {/if}
                <div class="mx-4 my-2">
                  <div class="text-xl text-netural-content">
                    {season.air_date ? season.air_date.split("-")[0] : "No air date"}
                    | {season.episode_count} episodes
                  </div>
                  &nbsp
                  <div class="text-lg text-netural-content">
                    {season.air_date
                      ? `Premiered on ${season.air_date}`
                      : "Hasn't aired"}
                  </div>
                  &nbsp
                  <ReadMore
                    currentDescriptionLength={currentOverviewLength}
                    mediaDescription={season.overview
                      ? season.overview
                      : "No season overview available."}
                    initialDescriptionLength={INITIAL_OVERVIEW_LENGTH}
                  />
                </div>
              </div>
            {/if}
          {/if}
        </MediaQuery>
      {/each}
    </div>
  </article>
</div>
