import {
    test,
    expect,
    waitForApiResponse,
    waitForTableRefresh,
    waitForToast,
    confirmDialog,
} from '../utils/fixtures';

/**
 * Smoke Test 01: Admin Login
 * 
 * Verifies:
 * - Login page loads
 * - Login API returns 200
 * - Redirect to dashboard
 * - User info displayed
 */
test.describe('01. Admin Login', () => {
    test.use({ storageState: { cookies: [], origins: [] } }); // Clear auth for this test

    test('should login successfully and navigate to dashboard', async ({ page, testData }) => {
        // Navigate to login
        await page.goto('/#/login');
        await expect(page).toHaveURL(/login/);
        await expect(page.locator('input[name="username"], #username')).toBeVisible();

        // Fill credentials
        await page.fill('input[name="username"], #username', testData.admin.username);
        await page.fill('input[name="password"], #password', testData.admin.password);

        // Click login and wait for API
        const [response] = await Promise.all([
            waitForApiResponse(page, /api\/(v1\/)?auth\/login/, { status: 200 }),
            page.click('button[type="submit"], .login-button'),
        ]);

        // Assert API success
        expect(response.status).toBe(200);
        expect((response.body as any).code).toBe(0);

        // Assert navigation
        await page.waitForURL(/\/(dashboard|home|$)/, { timeout: 10000 });

        // Assert UI shows user info
        await expect(page.locator('.user-info, .user-name, [data-testid="user-menu"]')).toBeVisible();

        console.log('✅ Admin login successful');
    });
});
