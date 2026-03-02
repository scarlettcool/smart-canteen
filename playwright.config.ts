import { defineConfig, devices } from '@playwright/test';

/**
 * 智慧食堂 E2E Smoke Tests Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e/tests',
    fullyParallel: false, // Run tests sequentially for smoke tests
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Single worker for smoke tests
    timeout: 120000,
    reporter: [
        ['html', { outputFolder: 'e2e/reports/html' }],
        ['json', { outputFile: 'e2e/reports/results.json' }],
        ['list'],
    ],

    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3039',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        actionTimeout: 15000,
        navigationTimeout: 60000,
    },

    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        {
            name: 'admin-chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'e2e/.auth/admin.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'smoke',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'e2e/.auth/admin.json',
            },
            dependencies: ['setup'],
        },
    ],

    // Local dev server
    webServer: process.env.CI ? undefined : {
        command: 'npm run dev',
        cwd: 'apps/admin-frontend',
        url: 'http://localhost:3039',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
