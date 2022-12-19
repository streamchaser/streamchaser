<script lang="ts">
  import ErrorButtons from "./error_buttons.svelte"

  export let error: string

  console.error(error)
</script>

<div class="mt-20">
  <h1 class="flex justify-center text-3xl">┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻</h1>
  <br />
  <h2 class="flex justify-center">The requested site could not be reached</h2>
  <br />
  <div class="flex justify-center">
    <div class="px-2">
      <ErrorButtons />
    </div>
  </div>
</div>
