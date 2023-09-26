<script async lang="ts" src="https://widget.justwatch.com/justwatch_widget.js">
  import { env } from "$env/dynamic/public"

  let justWatchUrlPath = "/us/movie/the-matrix"
</script>

<h1>Please work</h1>

<input
  bind:value={justWatchUrlPath}
  type="text"
  placeholder="Type here"
  class="w-full max-w-xs input input-bordered"
/>

<div
  data-jw-widget
  data-api-key={env.PUBLIC_JUSTWATCH_API_KEY}
  data-url-path={justWatchUrlPath}
  data-theme="dark"
/>
<div>
  <a
    style="font-size: 11px; font-family: sans-serif; color: black; text-decoration: none;"
    target="_blank"
    data-original="https://www.justwatch.com"
    href="https://www.justwatch.com/us"
  >
    Powered by
    <span
      style="display: -moz-inline-box; display: inline-block; width: 66px; height: 10px; margin-left: 3px; background: url(https://widget.justwatch.com/assets/JW_logo_black_10px.svg); overflow: hidden; text-indent: -3000px;"
      >JustWatch</span
    >
  </a>
</div>
