import type { PlaywrightTestConfig } from "@playwright/test"

const config: PlaywrightTestConfig = {
  webServer: {
    command: "yarn build && yarn preview",
    port: 3000,
  },
  timeout: 5 * 1000,
}

export default config
