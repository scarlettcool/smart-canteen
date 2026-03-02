import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/admin.json';

/**
 * Authentication Setup
 * Logs in as admin and saves the session state
 */
setup('authenticate as admin', async ({ page }) => {
    // Navigate to login page
    await page.goto('/#/login');

    // Wait for login form
    await page.waitForSelector('input[name="username"], #username, input[placeholder*="用户名"]', { timeout: 30000 });

    // Fill login form
    await page.fill('input[name="username"], #username', 'admin');
    await page.fill('input[name="password"], #password', 'admin123');

    // Click login button
    await page.click('button[type="submit"], .login-button');

    // Wait for navigation to dashboard
    await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 30000 });

    // Verify login success
    await expect(page.locator('.user-info, .avatar, [data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });

    // Save authentication state
    await page.context().storageState({ path: authFile });
});

setup('create auth directory', async ({ }) => {
    const fs = require('fs');
    const path = require('path');

    const authDir = path.join(process.cwd(), 'e2e', '.auth');
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }
});
