<script lang="ts">
    export let error;

    console.error(error)
</script>
<div>
    <h1 class="flex justify-center text-3xl">┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻</h1><br>
    <h2 class="flex justify-center">The requested site could not be reached</h2><br>
    <div class="flex justify-center">
        <button
            on:click={() => window.history.back()}
            id="goback"
            type="button"
            class="btn">
            Back to safety
        </button>
    </div>
</div>
