<script lang="ts">
  import { auth } from "$lib/stores/stores"
  import { IMG_ORIGINAL, PYTHON_API } from "$lib/variables"
  import Select from "svelte-select"
  import SvelteSelectCss from "$lib/components/svelte_select_css.svelte"
  import { currentCountry } from "$lib/stores/preferences"
  import type { Provider } from "$lib/generated"

  export let placeholder: string = "Select providers..."
  export let providerList = undefined

  const itemId = "id"

  const addProviderToList = async (provider: Provider) => {
    const res = await fetch(
      PYTHON_API +
        "/providers?provider_id=" +
        provider.provider_id +
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
      providerList = [...providerList, provider]
    }
  }

  const getProviders = async (filterText: string) => {
    if (!filterText.length) {
      return Promise.resolve([])
    }

    const res = await fetch(PYTHON_API + "/providers/" + $currentCountry)
    const json = await res.json()

    return json[0].providers.filter((i: Provider) =>
      i.provider_name.toLowerCase().includes(filterText.toLowerCase())
    )
  }
</script>

<div>
  <SvelteSelectCss tailwind="w-80 sm:w-96">
    <Select
      class="z-50"
      loadOptions={getProviders}
      {itemId}
      {placeholder}
      clearable={false}
      on:input={e => {
        if (!providerList.some(i => i.id == e.detail.id)) {
          addProviderToList(e.detail)
        }
      }}
    >
      <div class="cursor-pointer" slot="item" let:item>
        <div class="flex flex-1 items-center truncate">
          <div class="avatar justify-center mr-2 w-8">
            <div class="w-24 rounded-full">
              <img src="{IMG_ORIGINAL}{item.logo_path}" alt={item.provider_name} />
            </div>
          </div>
          <div class="truncate">
            <p class="truncate">{item.provider_name}</p>
          </div>
        </div>
      </div>

      <div slot="selection" let:selection>
        <div class="customItem">
          <div class="customItem_title">
            <div class="text-sm">{selection.provider_name}</div>
          </div>
        </div>
      </div>
    </Select>
  </SvelteSelectCss>
</div>
