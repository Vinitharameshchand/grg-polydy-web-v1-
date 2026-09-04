import { defineConfig, devices } from '@playwright/test';

/**
 * Live browser tests against the built site.
 *
 *   npm run build
 *   node scripts/serve.mjs 8092      (clean URLs + real 404.html, like production)
 *   E2E_ORIGIN=http://127.0.0.1:8092 npm run test:e2e
 *
 * A plain directory server (python -m http.server) also works but serves its
 * own 404 page and redirects /route to /route/, so the 404 test will fail there.
 *
 * Runs in real time in a real Chromium — no virtual-time budget — so
 * animation, hover and rAF all behave as they do for a visitor.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_ORIGIN || 'http://127.0.0.1:8091',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1440, height: 900 }
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } }
  ]
});
