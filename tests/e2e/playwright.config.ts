import { defineConfig } from '@playwright/test'
import isCi from 'is-ci'

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    reuseExistingServer: !isCi,
  },
})
