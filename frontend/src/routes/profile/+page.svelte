<script lang="ts">
  import { auth } from "$lib/stores/stores"
  import { hitProviderAmounts, parseJwt, sleep } from "$lib/utils"
  import type { User } from "$lib/types"
  import MediaCard from "$lib/components/media_card.svelte"
  import { currentCountry } from "$lib/stores/preferences"
  import { IMG_ORIGINAL, PYTHON_API } from "$lib/variables"
  import SearchDropdown from "$lib/components/search_dropdown.svelte"

  let user: User
  let newListName: string

  // TODO: Type theese
  let favoriteList: any
  let watchList: any
  let customLists: any

  $: if ($auth) {
    user = parseJwt($auth)
  }

  const getList = async (listType: string) => {
    const res = await fetch(PYTHON_API + "/" + listType + "?encoded_jwt=" + $auth)

    const json = await res.json()

    if (res.status == 498) {
      $auth = ""
    } else if (res.ok) {
      if (listType == "favorites") {
        favoriteList = json
      } else if (listType == "watch_list") {
        watchList = json
      } else if (listType == "custom_lists") {
        customLists = json
      }
    }
    return json
  }

  const deleteCustomList = async (listId: string) => {
    const res = await fetch(
      PYTHON_API + "/custom_lists" + "?id=" + listId + "&encoded_jwt=" + $auth,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (res.status == 498) {
      $auth = ""
    }
    return await res.json()
  }

  const createCustomList = async (listName: string) => {
    const res = await fetch(
      PYTHON_API + "/custom_lists" + "?list_name=" + listName + "&encoded_jwt=" + $auth,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const json = await res.json()

    if (res.status == 498) {
      $auth = ""
    }
    return json
  }

  const getMedia = async (idArray: any[], listType: string, listName: string = "") => {
    let idString = ""

    for (let i = 0; i < idArray.length; i++) {
      idString += "&ids=" + idArray[i].streamchaser_id
    }

    const res = await fetch(PYTHON_API + "/media?c=" + $currentCountry + idString)
    const media = await res.json()

    if (res.status == 498) {
      $auth = ""
    } else if (res.ok) {
      if (listType == "favorites") {
        favoriteList.favorites = media.hits
      } else if (listType == "watch_list") {
        watchList.watch_list = media.hits
      } else if (listType == "custom_lists") {
        for (let i = 0; i < customLists.custom_lists.length; i++) {
          if (listName == customLists.custom_lists[i].name) {
            customLists.custom_lists[i].media = media.hits
          }
        }
      }
    }

    return media.hits
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

<h1 class="text-center text-3xl pt-5 pb-5">Lists</h1>
{#await getList("favorites") then list}
  {#await getMedia(list.favorites, "favorites") then _}
    <div class="collapse collapse-arrow border border-neutral rounded-box bg-base-300">
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">Favorites</div>
      <div class="collapse-content">
        <div class="pt-2" />
        <SearchDropdown
          placeholder="Add media to Favorites"
          listId={list.id}
          listType={"favorites"}
          bind:mediaList={favoriteList.favorites}
        />
        <div
          class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5
                    md:grid-cols-4 sm:grid-cols-3 gap-2 pt-2 pb-4"
        >
          {#if favoriteList.favorites.length}
            {#each favoriteList.favorites as hit, index}
              <div class="p-1">
                <MediaCard
                  media={hit}
                  mediaIndex={index}
                  providerAmounts={hitProviderAmounts(
                    favoriteList.favorites,
                    $currentCountry
                  )}
                />
              </div>
            {/each}
          {:else}
            <div class="h-64" />
          {/if}
        </div>

        <div class="flex justify-center">
          <button class="btn btn-disabled">Favorites cant be deleted </button>
        </div>
      </div>
    </div>
    <br />
  {/await}
{/await}

{#await getList("watch_list") then list}
  {#await getMedia(list.watch_list, "watch_list") then _}
    <div class="collapse collapse-arrow border border-neutral rounded-box bg-base-300">
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">Watch list</div>
      <div class="collapse-content">
        <div class="pt-2" />
        <SearchDropdown
          placeholder="Add media to Watch list"
          listId={list.id}
          listType={"watch_list"}
          bind:mediaList={watchList.watch_list}
        />
        <div
          class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5
                    md:grid-cols-4 sm:grid-cols-3 gap-2 pt-2 pb-4"
        >
          {#if watchList.watch_list.length}
            {#each watchList.watch_list as hit, index}
              <div class="p-1">
                <MediaCard
                  media={hit}
                  mediaIndex={index}
                  providerAmounts={hitProviderAmounts(
                    watchList.watch_list,
                    $currentCountry
                  )}
                />
              </div>
            {/each}
          {:else}
            <div class="h-64" />
          {/if}
        </div>

        <div class="flex justify-center">
          <button class="btn btn-disabled">Watch list cant be deleted </button>
        </div>
      </div>
    </div>
    <br />
  {/await}
{/await}

{#await getList("custom_lists") then lists}
  {#each lists.custom_lists as list, index (list.id)}
    {#await getMedia(list.media, "custom_lists", list.name) then _}
      <div
        class="collapse collapse-arrow border border-neutral rounded-box bg-base-300"
      >
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">{list.name}</div>
        <div class="collapse-content">
          <div class="pt-2" />
          <SearchDropdown
            placeholder="Add media to {list.name}"
            listId={list.id}
            listType={"custom_lists"}
            bind:mediaList={customLists.custom_lists[index].media}
          />
          <div
            class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5
                    md:grid-cols-4 sm:grid-cols-3 gap-2 pt-2 pb-4"
          >
            {#if customLists.custom_lists[index].media.length}
              {#each customLists.custom_lists[index].media as hit, mediaIndex}
                <div class="p-1">
                  <MediaCard
                    media={hit}
                    {mediaIndex}
                    providerAmounts={hitProviderAmounts(
                      customLists.custom_lists[index].media,
                      $currentCountry
                    )}
                  />
                </div>
              {/each}
            {:else}
              <div class="h-64" />
            {/if}
          </div>

          <div class="flex justify-center">
            <button
              class="btn btn-error"
              on:click={async () => {
                await deleteCustomList(list.id)
                for (let i = 0; i < customLists.custom_lists.length; i++) {
                  if (list.id == customLists.custom_lists[i].id) {
                    customLists.custom_lists = customLists.custom_lists
                      .slice(0, i)
                      .concat(customLists.custom_lists.slice(i + 1))
                  }
                }
              }}>Delete {list.name}</button
            >
          </div>
        </div>
      </div>
      <br />
    {/await}
  {/each}

  <div class="flex justify-center pb-5">
    <div class="form-control">
      <div class="input-group">
        <input
          type="text"
          placeholder="New list name"
          bind:value={newListName}
          class="input input-bordered"
        />
        <button
          class="btn btn-primary"
          disabled={newListName ? false : true}
          on:click={async () => {
            const res = await createCustomList(newListName)
            customLists.custom_lists = [
              ...customLists.custom_lists,
              {
                name: newListName,
                media: [],
                id: res[0].custom_lists[res[0].custom_lists.length - 1].id,
              },
            ]
            newListName = ""
          }}
          >+
        </button>
      </div>
    </div>
  </div>
{/await}
