<script lang="ts">
  import type { Meilisearch } from "$lib/generated"
  import { PYTHON_API } from "$lib/variables"
  import Select from "svelte-select"
  import { mediaIdToUrlConverter } from "$lib/utils"
  import SvelteSelectCss from "./svelte_select_css.svelte"

  let meilisearch: Meilisearch

  const SEARCH_URL = `${PYTHON_API}/search/`

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
  <SvelteSelectCss tailwind="w-96">
    <Select loadOptions={search} placeholder="Seach..." clearable={false}>
      <a slot="item" let:item href={mediaIdToUrlConverter(item.id)}>
        <div class="customItem">
          <div class="customItem_title">
            <div class="">{item.title}</div>
            <!-- <div class="customItem_tagline">{item.}</div> -->
          </div>
        </div>
      </a>

      <div slot="selection" let:selection>
        <div class="customItem">
          <div class="customItem_title">
            <div class="text-sm">{selection.title}</div>
            <!-- <div class="customItem_tagline">{item.}</div> -->
          </div>
        </div>
      </div>
    </Select>
  </SvelteSelectCss>
</div>
