<script>
  import "../app.css"
  import Navbar from "../components/navbar.svelte"
  import Footer from "../components/footer.svelte"
  import BackToTopButton from "../components/back_to_top_button.svelte"
  import CookieDisclaimer from "../components/cookie_disclaimer.svelte"
</script>

<div class="flex flex-col h-screen justify-between">
  <Navbar />
  <div class="container mb-auto mx-auto">
    <slot />
  </div>
  <BackToTopButton />
  <Footer />
</div>
<CookieDisclaimer />
