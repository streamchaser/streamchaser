<script lang="ts">
  import { STATIC_FILES } from "$lib/variables.js"
  import { page } from "$app/stores"

  export let title: string
  export let description =
    "Tired of not knowing where to watch that one movie? Streamchaser helps you keep track of where you can watch your favorite movies and TV series, through our optimized search engine. Search by streaming service or genre for even quicker results!"
  export let images: string[] = [`${STATIC_FILES}/main_logo_light_bg.png`]
  export let type = "video.other"

  let isFrontOrFaq = title == "streamchaser" || "Faq"
  let descriptionContent = `Where to watch and stream ${title} - streamchaser`
</script>

<svelte:head>
  <!-- HTML tags -->
  <title>{title == "streamchaser" ? title : title + " - streamchaser"}</title>
  <meta name="description" content={isFrontOrFaq ? description : descriptionContent} />

  <!-- Facebook OG tags -->
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content="streamchaser" />
  <meta property="og:title" content={title} />
  <meta
    property="og:description"
    content={isFrontOrFaq ? description : descriptionContent}
  />
  {#each images as image}
    <meta property="og:image" content={image} />
  {/each}
  <meta property="og:url" content={$page.url.href} />

  <!-- Twitter tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="streamchaser.tv" />
  <meta property="twitter:url" content={$page.url.href} />
  <meta name="twitter:title" content={title} />
  <meta
    name="twitter:description"
    content={isFrontOrFaq ? description : descriptionContent}
  />
  {#each images as image}
    <meta name="twitter:image" content={image} />
  {/each}
</svelte:head>
