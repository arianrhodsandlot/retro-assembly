import process from 'node:process'
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  snapshotDir: 'snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{testName}-{arg}{ext}',
  timeout: 5 * 60 * 1000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: Boolean(process.env.CI),
  },
  webServer: { command: 'pnpm dev', url: 'http://localhost:5173', reuseExistingServer: true },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.05 } },
})
