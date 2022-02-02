<script>
  import "../app.css"
  import Navbar from "../components/navbar.svelte"
  import Footer from "../components/footer.svelte"
  import BackToTopButton from "../components/back_to_top_button.svelte"
  import CookieDisclaimer from "../components/cookie_disclaimer.svelte"
</script>

<div class="flex flex-col h-screen">
  <Navbar />
  <div class="flex-grow">
    <slot />
  </div>
  <BackToTopButton />
  <Footer />
  <CookieDisclaimer />
</div>
