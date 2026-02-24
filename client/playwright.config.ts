import { defineConfig, devices } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };
const isCI = process.env.CI === 'true';
/** Use 5173 for npm run dev, 4173 for npm run preview (default) */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4173';

/**
 * E2E tests for the full app (client + API).
 * Prereqs: docker compose up -d mongodb; poetry run uvicorn app.main:app --port 8000 (in another terminal)
 * This config builds the client and serves it via vite preview (faster than dev server).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1,
  timeout: 15_000,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 10_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
