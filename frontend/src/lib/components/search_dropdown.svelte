<script lang="ts">
  import type { Hit, Meilisearch } from "$lib/generated"
  import { auth } from "$lib/stores/stores"
  import { PYTHON_API } from "$lib/variables"
  import Select from "svelte-select"
  import { mediaIdToUrlConverter } from "$lib/utils"
  import SvelteSelectCss from "./svelte_select_css.svelte"

  export let placeholder: string = "Search..."
  export let listId: string = undefined
  export let listType: string = undefined
  export let mediaList: Hit[] = undefined

  let meilisearch: Meilisearch

  const itemId = "id"
  const SEARCH_URL = `${PYTHON_API}/search/`

  const addMediaToList = async (media: Hit, listId: string, listType: string) => {
    const res = await fetch(
      PYTHON_API +
        `/${listType}${listType == "custom_lists" ? "/" + listId : ""}` +
        "?streamchaser_id=" +
        media.id +
        "&encoded_jwt=" +
        $auth,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (res.status == 498) {
      $auth = ""
    } else if (res.ok) {
      mediaList = [...mediaList, media]
    }
  }

  const search = async (filterText: string) => {
    if (!filterText.length) {
      return Promise.resolve([])
    }
    const res = await fetch(SEARCH_URL + filterText + "?limit=10")
    meilisearch = await res.json()
    return meilisearch.hits
  }
</script>

<div>
  <SvelteSelectCss tailwind="w-80 sm:w-96">
    <Select
      class="z-50"
      {placeholder}
      {itemId}
      loadOptions={search}
      clearable={false}
      on:input={e => {
        if (listId && listType) {
          addMediaToList(e.detail, listId, listType)
        } else {
          window.location.href = mediaIdToUrlConverter(e.detail.id)
        }
      }}
    >
      <a
        class="cursor-pointer"
        slot="item"
        let:item
        href={listId && listType ? null : mediaIdToUrlConverter(item.id)}
      >
        <div class="flex flex-1 items-center truncate">
          <div class="badge badge-secondary justify-center mr-2 w-8">
            {#if item.id.startsWith("p")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                height="1em"
                width="1em"
                viewBox="0 0 448 512"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                /></svg
              >
            {:else if item.id.startsWith("m")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                height="1em"
                width="1em"
                viewBox="0 0 576 512"
                ><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                  d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"
                /></svg
              >
            {:else}
              <p class="text-sm">TV</p>
            {/if}
          </div>
          <div class="truncate">
            <p class="truncate">{item.title}</p>
          </div>
        </div>
      </a>

      <div slot="selection" let:selection>
        <div class="customItem">
          <div class="customItem_title">
            <div class="text-sm">{selection.title}</div>
          </div>
        </div>
      </div>
    </Select>
  </SvelteSelectCss>
</div>
