<script lang="ts">
  import { parseJwt } from "$lib/utils"
  import { auth } from "$lib/stores/stores"
  import { env } from "$env/dynamic/public"
  import type { User } from "$lib/types"
  import { page } from "$app/stores"

  export let icon = true

  let isDropdownOpen = false
  let user: User

  $: if ($auth) {
    user = parseJwt($auth)
  }

  globalThis.handleCredentialResponse = async (response: any) => {
    $auth = response.credential
  }

  const handleDropdownClick = () => {
    isDropdownOpen = !isDropdownOpen
  }

  const handleDropdownFocusLost = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget))
      return
    isDropdownOpen = false
  }
</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client"></script>
</svelte:head>

<div class="w-12">
  {#if $auth}
    <div class="dropdown dropdown-end" on:focusout={handleDropdownFocusLost}>
      <div
        tabindex="-1"
        class="btn btn-ghost btn-circle avatar"
        on:click={handleDropdownClick}
        on:keypress={handleDropdownClick}
      >
        <div class="w-10 rounded-full">
          <img src={user.picture} alt={user.name} />
        </div>
      </div>
      <ul
        tabindex="-1"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        style:visibility={isDropdownOpen ? "visible" : "hidden"}
      >
        <li>
          <a class="justify-between" href="/profile">
            Profile
            <span class="badge badge-primary">New</span>
          </a>
        </li>
        <li>
          <div
            on:keypress={() => {
              $auth = ""
              $page.url.pathname == "/profile"
                ? (window.location.href = "/")
                : location.reload()
            }}
            on:click={() => {
              $auth = ""
              $page.url.pathname == "/profile"
                ? (window.location.href = "/")
                : location.reload()
            }}
          >
            Logout
          </div>
        </li>
      </ul>
    </div>
  {:else}
    <div class="tooltip tooltip-bottom z-20" data-tip="Sign in">
      <div class="overflow-hidden rounded-lg">
        <div
          id="g_id_onload"
          data-client_id={env.PUBLIC_GOOGLE_CLIENT_ID}
          data-callback="handleCredentialResponse"
        />
        {#if icon}
          <div
            class="g_id_signin"
            data-type="icon"
            data-shape="square"
            data-size="large"
          />
        {:else}
          <div
            class="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
          />
        {/if}
      </div>
    </div>
  {/if}
</div>
