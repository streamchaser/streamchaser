import { test, expect } from "@playwright/test"
import { mockIndex } from "./request_mocks.js"

test("sry nullxdeadbeef", async () => {
  true === true
})

test("page loads", async ({ page }) => {
  await mockIndex(page)
  await page.goto("/")
  await expect(page.locator('[alt="streamchaser logo"]')).toBeVisible()
})
test("test go to movie", async ({ page }) => {
  await mockIndex(page)
  await page.route(/http:\/\/api.localhost\/search\/Harry%20p\?c=US&limit=.*/, route =>
    route.fulfill({
      status: 200,
      path: "tests/test_data/harry_p_hits.json",
    })
  )

  await page.goto("/")
  const searchbarPlaceholder = page.locator("#input-field")
  await expect(searchbarPlaceholder).toBeEmpty()
  await searchbarPlaceholder.fill("Harry p")
  const altTagExists = page.locator('[alt="Harry Potter and the Goblet of Fire"]')
  const altTagDoesNotExist = page.locator('[alt="Godzilla vs. Kong"]')
  await expect(altTagExists).toBeVisible()
  await expect(altTagDoesNotExist).not.toBeVisible()
})
