<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import { currentCountry } from './store.js';

  currentCountry.useLocalStorage();
</script>

<style  global>
  @import "../assets/global.css";
</style>

<Router {routes} />