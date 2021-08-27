<script>
    export let title;
    export let description;
</script>

<div tabindex="0"
     class="collapse max-w-screen-lg min-w-full border rounded-box border-base-300 collapse-arrow my-4">
    <div class="collapse-title text-xl font-medium">
        {title}
    </div>
    <div class="collapse-content">
        <p>{description}</p>
    </div>
</div>
