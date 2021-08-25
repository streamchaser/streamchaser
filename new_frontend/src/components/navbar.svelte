<!-- https://daisyui.com/components/navbar -->
<script>
    import {currentCountry} from '../store.js';

    let value = $currentCountry;

    const countries = [
        {name: 'Denmark', value: 'DK'},
        {name: 'Germany', value: 'DE'},
        {name: 'Sweden', value: 'SE'},
        {name: 'UK', value: 'GB'},
        {name: 'USA', value: 'US'}];


</script>

<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
    <div class="flex-none px-2 mx-2">
        <a href="/">
            <span class="text-lg font-bold"> streamchaser </span>
        </a>
    </div>
    <div class="flex-1 px-2 mx-2"></div>
    <div class="flex-none">
        <div class="items-stretch hidden lg:flex">
            <a class="btn btn-ghost btn-sm rounded-btn" href="/"> Home </a>
            <a class="btn btn-ghost btn-sm rounded-btn" href="/about"> About </a>
            <a class="btn btn-ghost btn-sm rounded-btn" href="/faq"> FAQ </a>
        </div>
    </div>
    <select bind:value on:change={currentCountry.set(value)} class="select select-bordered select-sm w-full max-w-max">
        <option disabled="disabled">Choose country</option>
        {#each countries as country}
            <option value={country.value}>{country.name}</option>
        {/each}
    </select>
</div>
