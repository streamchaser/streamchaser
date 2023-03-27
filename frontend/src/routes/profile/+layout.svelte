<script lang="ts">
  import Auth from "$lib/components/sign_in/auth.svelte"
  import { auth } from "$lib/stores/stores"
</script>

<div class="flex justify-center">
  {#if $auth}
    <slot />
  {:else}
    <div class="pt-5">
      <h1 class="pb-5">Please sign in to use profile page</h1>
      <Auth icon={false} />
    </div>
  {/if}
</div>
