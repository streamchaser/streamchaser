import { test, expect } from "@playwright/test"

test("test go to movie", async ({ page }) => {
  await page.goto("/")
  const searchbarPlaceholder = page.locator("#input-field")
  await expect(searchbarPlaceholder).toHaveText("")
  await searchbarPlaceholder.fill("Harry p")
  await page.locator("a[href^='/movie/674']").click()
  await expect(page).toHaveURL("/movie/674")
})
