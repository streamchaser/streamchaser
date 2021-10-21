<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
    import {currentCountry} from '../stores/country.js';

    let selectedCountry = $currentCountry;

    const countries = [
        {name: 'Denmark', value: 'DK'},
        {name: 'Germany', value: 'DE'},
        {name: 'Sweden', value: 'SE'},
        {name: 'UK', value: 'GB'},
        {name: 'USA', value: 'US'}];

</script>
<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
    <div class="flex-none px-2 mx-2">
        <a href="/">
            <span class="text-lg font-bold"> streamchaser </span>
        </a>
    </div>
    <div class="flex-1 px-2 mx-2"></div>
    <div class="flex-none">
        <div class="items-stretch hidden sm:flex">
            <a class="btn btn-ghost btn-sm rounded-btn" href="/about"> About </a>
            <a class="btn btn-ghost btn-sm rounded-btn" href="/faq"> FAQ </a>
        </div>
    </div>
    <div class="sm:pl-4">
        <select bind:value={selectedCountry} on:change={currentCountry.set(selectedCountry)}
                class="select select-ghost select-bordered max-sm">
            <option disabled={false}>Choose country</option>
            {#each countries as country}
                <option value={country.value}>{country.name}</option>
            {/each}
        </select>
    </div>
</div>
