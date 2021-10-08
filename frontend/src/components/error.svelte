<script>
    export let error;

    function goBack() {
        window.history.back();
    }
</script>
<div>
    <h1 class="flex justify-center text-3xl">┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻</h1><br>
    <h2 class="flex justify-center">The requested site could not be reached</h2><br>
    <div class="flex justify-center">
        <button
            on:click={() => goBack()}
            id="goback"
            type="button"
            class="btn">
            Back to safety
        </button>
    </div>
</div>
