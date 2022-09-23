import type { PlaywrightTestConfig } from "@playwright/test"

const config: PlaywrightTestConfig = {
  webServer: {
    command: "yarn build && yarn preview",
    port: 3000,
    timeout: 90000,
  },
  expect: {
    // timeout: 1000 * 30,  // Longer timeout for testing
  },
}

export default config
