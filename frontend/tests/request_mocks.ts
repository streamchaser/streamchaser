export const mockIndex = async page => {
  await page.route("http://api.localhost/search/*?c=DK&limit=30", route =>
    route.fulfill({
      status: 200,
      path: "tests/test_data/harry_p_hits.json",
    })
  )
  await page.route("http://api.localhost/providers/DK/", route =>
    route.fulfill({
      status: 200,
      path: "tests/test_data/providers.json",
    })
  )
  await page.route("http://apiv2.localhost/genres/ ", route =>
    route.fulfill({
      status: 200,
      path: "tests/test_data/genres.json",
    })
  )
}
