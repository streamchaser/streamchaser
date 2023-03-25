<script lang="ts">
  import { auth } from "$lib/stores/stores"
  import { hitProviderAmounts, parseJwt } from "$lib/utils"
  import type { User } from "$lib/types"
  import MediaCard from "$lib/components/media_card.svelte"
  import { currentCountry } from "$lib/stores/preferences"
  import { IMG_ORIGINAL } from "$lib/variables"
  import SearchDropdown from "$lib/components/search_dropdown.svelte"

  let user: User

  $: if ($auth) {
    user = parseJwt($auth)
  }

  //TODO: This is temp data mocking what backend will return
  const providers = [
    {
      provider_name: "Acorn TV",
      display_priority: 16,
      provider_id: 87,
      logo_path: "/5P99DkK1jVs95KcE8bYG9MBtGQ.jpg",
    },
    {
      provider_name: "C More",
      display_priority: 5,
      provider_id: 77,
      logo_path: "/pCIkSBek0aZfPQzOn9gfazuYaLV.jpg",
    },
    {
      provider_name: "Netflix",
      display_priority: 0,
      provider_id: 8,
      logo_path: "/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg",
    },
  ]

  const data = [
    {
      id: "m120",
      title: "The Lord of the Rings: The Fellowship of the Ring",
      poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
      imdb_rating: "8.8",
      providers: {
        results: {
          DK: {
            flatrate: [
              {
                provider_name: "Amazon Prime Video",
                display_priority: 2,
                provider_id: 119,
                logo_path: "/emthp39XA2YScoYL1p0sdbAH2WA.jpg",
              },
              {
                provider_name: "HBO Max",
                display_priority: 3,
                provider_id: 384,
                logo_path: "/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg",
              },
            ],
          },
        },
      },
    },
    {
      id: "m122",
      title: "The Lord of the Rings: The Return of the King",
      poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      imdb_rating: "9.0",
      providers: {
        results: {
          DK: {
            flatrate: [
              {
                provider_name: "Amazon Prime Video",
                display_priority: 2,
                provider_id: 119,
                logo_path: "/emthp39XA2YScoYL1p0sdbAH2WA.jpg",
              },
              {
                provider_name: "HBO Max",
                display_priority: 3,
                provider_id: 384,
                logo_path: "/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg",
              },
            ],
          },
        },
      },
    },
    {
      id: "m140",
      title: "Bad Education",
      poster_path: "/du716YH0PKiL2kZgIPLkEblgHLX.jpg",
      imdb_rating: "7.4",
      providers: {
        results: {
          DK: {
            flatrate: [
              {
                provider_name: "Filmstriben",
                display_priority: 19,
                provider_id: 443,
                logo_path: "/vqybB1exnaQ3UOlKaw4t6OgzFIu.jpg",
              },
              {
                provider_name: "HBO",
                display_priority: 1000,
                provider_id: 118,
                logo_path: "/fWqVPYArdFwBc6vYqoyQB6XUl85.jpg",
              },
            ],
          },
        },
      },
    },
  ]

  let lists = [
    { name: "My favorite movies", media: data },
    { name: "Cry movies", media: data },
    { name: "Action!!!!", media: data },
    { name: "Watch soon", media: data },
    { name: "Things to watch with girlfriend", media: data },
  ]
</script>

<div class="flex justify-center pb-5">
  <div class="card w-96 bg-neutral shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Hi there, {user.given_name} 👋</h2>
      <p>
        This page is your's, and you will be able to create personal lists, choose your
        providers, and more.
      </p>
    </div>
  </div>
</div>

<h1 class="text-center text-3xl pt-5 pb-5">My providers</h1>
<div class="flex justify-center">
  {#each providers as provider}
    <img src="{IMG_ORIGINAL}{provider.logo_path}" alt={provider.provider_name} />
  {/each}
</div>

<h1 class="text-center text-3xl pt-5 pb-5">My watch lists</h1>
{#each lists as list, index}
  <div class="collapse collapse-arrow border border-neutral rounded-box bg-base-300">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">{list.name}</div>
    <div class="collapse-content">
      <div class="pt-2" />
      <SearchDropdown placeholder="Add media to list" bind:list />
      <div
        class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5
                    md:grid-cols-4 sm:grid-cols-3 gap-2 pt-2 pb-4"
      >
        {#each list.media as hit, index}
          <div class="p-1">
            <MediaCard
              media={hit}
              mediaIndex={index}
              providerAmounts={hitProviderAmounts(list.media, $currentCountry)}
            />
          </div>
        {/each}
      </div>
      <div class="flex justify-center">
        <button
          class="btn btn-error"
          on:click={() => {
            lists = lists.slice(0, index).concat(lists.slice(index + 1))
          }}>Delete list</button
        >
      </div>
    </div>
  </div>
  <br />
{/each}

<div class="flex justify-center pb-5">
  <button
    class="btn btn-primary btn-md"
    on:click={() => {
      lists = [...lists, { name: "New list", media: [] }]
    }}><p class="text-xl">+</p></button
  >
</div>
