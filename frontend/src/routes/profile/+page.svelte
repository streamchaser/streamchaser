<script lang="ts">
  import { auth } from "$lib/stores/stores"
  import { parseJwt } from "$lib/utils"
  import type { User } from "$lib/types"

  let user: User

  $: if ($auth) {
    user = parseJwt($auth)
  }
</script>

<div class="card w-96 bg-neutral shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Hi there, {user.given_name} 👋</h2>
    <p>
      This page is your's, and you will be able to create personal lists, choose your
      providers, and more.
    </p>
  </div>
</div>
