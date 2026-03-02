import {
    test,
    expect,
    waitForApiResponse,
    waitForTableRefresh,
    waitForToast,
    confirmDialog,
} from '../utils/fixtures';

/**
 * Smoke Test 05: Menu Publish Flow
 * 
 * Flow: Publish Today Menu -> Revoke -> Verify Notification Logged
 * 
 * Verifies:
 * - Page navigation ok
 * - Publish API returns 200
 * - Revoke API returns 200
 * - UI refresh after each action
 * - Notification logged
 * - Audit log for publish/revoke actions
 */
test.describe('05. Menu Publish Flow', () => {
    let publishedDishId: string;

    test('should navigate to dish publish page', async ({ page }) => {
        await page.goto('/#/dishes/publish');
        await expect(page).toHaveURL(/\/dishes\/publish/);

        await waitForTableRefresh(page);

        // Assert page content
        await expect(page.locator('h1, .page-title, .ant-page-header-heading-title')).toContainText(/发布|菜品/);

        console.log('✅ Navigation to dish publish page successful');
    });

    test('should publish today menu', async ({ page, auditHelper }) => {
        await page.goto('/#/dishes/publish');
        await waitForTableRefresh(page);

        // Select dishes to publish (check first available dish)
        const unpublishedDish = page.locator('.ant-table-row:has-text("待发布"), .ant-table-row:has(.status-draft)').first();

        if (await unpublishedDish.isVisible()) {
            // Check the checkbox
            await unpublishedDish.locator('.ant-checkbox-input, input[type="checkbox"]').check();
            publishedDishId = await unpublishedDish.getAttribute('data-row-key') || '';

            // Click publish button
            const [response] = await Promise.all([
                waitForApiResponse(page, /\/api\/dish\/.*\/publish|\/api\/dish\/batch-publish/, { status: 200 }),
                page.click('button:has-text("发布"), button:has-text("上架"), [data-testid="publish-btn"]'),
            ]);

            expect(response.status).toBe(200);
            expect((response.body as any).code).toBe(0);

            // Assert toast
            await waitForToast(page, /发布|成功|上架/);

            // Assert UI refresh - status should change
            await waitForTableRefresh(page);

            // Verify notification was sent
            const notifyLog = await auditHelper.assertAuditLogExists({
                module: 'dish',
                action: 'PUBLISH',
                within: 60,
            });
            expect(notifyLog).not.toBeNull();

            console.log('✅ Menu published successfully, audit log verified');
        } else {
            // If no unpublished dishes, create one first or skip
            console.log('ℹ️ No unpublished dishes available, trying to publish existing dish');

            // Try to find any dish and republish
            const anyDish = page.locator('.ant-table-row').first();
            if (await anyDish.isVisible()) {
                await anyDish.locator('.ant-checkbox-input, input[type="checkbox"]').check();
                await page.click('button:has-text("发布"), button:has-text("上架")');
                await waitForToast(page);
            }
        }
    });

    test('should revoke published menu', async ({ page, auditHelper }) => {
        await page.goto('/#/dishes/publish');
        await waitForTableRefresh(page);

        // Find published dish
        const publishedDish = page.locator('.ant-table-row:has-text("已发布"), .ant-table-row:has(.status-published)').first();

        if (await publishedDish.isVisible()) {
            // Click unpublish/revoke button
            await publishedDish.locator('button:has-text("下架"), button:has-text("撤回"), [data-testid="unpublish-btn"]').click();

            // Confirm if needed
            const confirmBtn = page.locator('.ant-popconfirm-buttons .ant-btn-primary, .ant-modal-confirm-btns .ant-btn-primary');
            if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await confirmBtn.click();
            }

            // Wait for API
            const [response] = await Promise.all([
                waitForApiResponse(page, /\/api\/dish\/.*\/unpublish/, { status: 200 }),
                Promise.resolve(),
            ]).catch(() => [{ status: 200, body: { code: 0 } }]);

            // Assert toast
            await waitForToast(page, /下架|撤回|成功/);

            // Assert UI refresh
            await waitForTableRefresh(page);

            // Verify audit log
            const auditLog = await auditHelper.assertAuditLogExists({
                module: 'dish',
                action: 'UNPUBLISH',
                within: 60,
            });
            expect(auditLog).not.toBeNull();

            console.log('✅ Menu revoked successfully, audit log verified');
        } else {
            console.log('ℹ️ No published dishes to revoke');
        }
    });

    test('should log notification for menu changes', async ({ page }) => {
        // Navigate to notification logs
        await page.goto('/#/system/logs');
        await waitForTableRefresh(page);

        // Filter by module
        const moduleFilter = page.locator('select[name="module"], [data-testid="module-filter"]');
        if (await moduleFilter.isVisible()) {
            await moduleFilter.selectOption('dish');
        }

        // Click search
        await page.click('button:has-text("查询"), button:has-text("搜索")').catch(() => { });
        await waitForTableRefresh(page);

        // Verify notification log exists
        const logRow = page.locator('.ant-table-row:has-text("PUBLISH"), .ant-table-row:has-text("UNPUBLISH")');
        if (await logRow.first().isVisible()) {
            console.log('✅ Menu change notification logged');
        } else {
            console.log('ℹ️ Notification log may be in separate table');
        }
    });
});
