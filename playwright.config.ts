import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 600000,
  expect: {
    timeout: 30000,
  },
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 600000,
    navigationTimeout: 600000,
    // Add these for CI stability
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: process.env.CI ? 100 : 0, // Add slight delays in CI
      args: [
        '--disable-dev-shm-usage', // Important for CI!
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    }
  },
  outputDir: './test-results/',
  reportSlowTests: null,

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        contextOptions: {
          reducedMotion: 'reduce',
          forcedColors: 'active'
        }
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
}); 