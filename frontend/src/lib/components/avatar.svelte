<script lang="ts">
  export let href: string
  export let img_src: string
</script>

<div class="avatar">
  <div class="mb-8 rounded-full md:w-32 md:h-32 sm:w-24 sm:h-24 w-16 h-16">
    <a {href}>
      <img src={img_src} alt="Avatar" />
    </a>
  </div>
</div>
