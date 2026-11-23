import { defineConfig } from '@playwright/test'

const selectedProjects = process.argv.filter(arg => arg.startsWith('--project='))
const unitOnly = selectedProjects.length === 1 && selectedProjects[0] === '--project=unit'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 90000,
  expect: { timeout: 10000 },
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', actionTimeout: 15000 },
  projects: [
    { name: 'unit', testMatch: '**/*.unit.spec.ts', outputDir: 'test-results/unit' },
    { name: 'desktop', testMatch: '**/*.browser.spec.ts', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', testMatch: '**/*.browser.spec.ts', use: { browserName: 'chromium', viewport: { width: 320, height: 812 }, isMobile: true, hasTouch: true } },
  ],
  webServer: unitOnly ? undefined : {
    command: 'python tests/serve-static.py',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'ignore',
  },
})
