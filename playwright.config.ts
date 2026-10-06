import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:5174",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  webServer: {
    command: "npx vite --config tests/browser/vite.config.ts",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false,
  },
});
