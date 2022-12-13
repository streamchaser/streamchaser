import { expect, test } from "@playwright/test"

// TODO: Fix with new load() data mocking - issue #313
test("test movie detail", async ({ page }) => {
  await page.route("http://api.localhost/movie/DK/674", route =>
    route.fulfill({
      status: 200,
      path: "tests/test_data/m674_moviedetail.json",
    })
  )
  await page.goto("/movie/674")
  const pageTitle = page.locator("h2")
  setTimeout(() => {
    console.log("World!")
  }, 10000)
  await expect(pageTitle).toHaveText("Harry Potter and the Goblet of Fire")
})
