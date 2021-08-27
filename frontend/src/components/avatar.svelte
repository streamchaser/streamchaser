<script>
    export let href;
    export let img_src;
</script>

<div class="avatar">
    <div class="mb-8 rounded-full w-24 h-24">
        <a href={href}>
            <img src={img_src}
                 alt="Avatar">
        </a>
    </div>
</div>
