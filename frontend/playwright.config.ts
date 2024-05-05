import type { PlaywrightTestConfig } from "@playwright/test"

const config: PlaywrightTestConfig = {
  webServer: {
    command: "bun build && bun preview",
    port: 4173,
  },
  expect: {
    // timeout: 1000 * 30,  // Longer timeout for testing
  },
}

export default config
