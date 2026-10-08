import { defineConfig, devices } from '@playwright/test';

/**
 * Live browser tests against the built site.
 *
 *   VITE_WEB3FORMS_KEY=e2e npm run build   (any value; the form endpoint is mocked)
 *   node scripts/serve.mjs 8092      (clean URLs + real 404.html, like production)
 *   E2E_ORIGIN=http://127.0.0.1:8092 npm run test:e2e
 *
 * A plain directory server (python -m http.server) also works but serves its
 * own 404 page and redirects /route to /route/, so the 404 test will fail there.
 *
 * Runs in real time in a real Chromium — no virtual-time budget — so
 * animation, hover and rAF all behave as they do for a visitor.
 *
 * The home page runs two WebGL scenes. Headless Chromium falls back to
 * SwiftShader (software GL) unless told to use the GPU, and software GL is
 * slow enough to time tests out — so on Windows the real GPU is requested
 * through ANGLE/D3D11, and the suite runs in one worker so the scenes are
 * not competing for the CPU.
 */
const gpuArgs = process.platform === 'win32' ? ['--use-angle=d3d11', '--ignore-gpu-blocklist'] : ['--ignore-gpu-blocklist'];

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_ORIGIN || 'http://127.0.0.1:8091',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1440, height: 900 },
    launchOptions: { args: gpuArgs }
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } }
  ]
});
