<script lang="ts">
  export let tailwind: string
</script>

<div
  class={tailwind}
  style="
       --border-radius: var(--rounded-btn, .5rem);
       --background: hsl(var(--b1));
       --spinner-color: hsl(var(--p));
       --border: 1px solid hsl(var(--p));
       --border-focused: 1px solid hsl(var(--p));
       --border-hover: 1px solid hsl(var(--p));
       --multi-item-outline: 1px solid hsl(var(--p));
       --multi-item-border-radius: var(--rounded-btn, .5rem);
       --multi-item-bg: hsl(var(--p));
       --multi-item-color: hsl(var(--pc));
       --multi-item-active-bg: hsl(var(--pf));
       --multi-item-active-color: hsl(var(--bc));
       --multi-item-clear-icon-color: hsl(var(--pc));
       --clear-select-hover-color: hsl(var(--pf));
       --itemIsActiveBG: hsl(var(--pc));
       --item-color: hsl(var(--nc));
       --list-background: hsl(var(--n));
       --item-hover-bg: hsl(var(--p));
       --item-hover-color: hsl(var(--pc));
       --input-color: hsl(var(--bc));
       --clear-select-focus-color: hsl(var(--p));
       --placeholder-opacity: 100%;
        "
>
  <slot />
</div>
