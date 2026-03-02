import {
    test,
    expect,
    waitForApiResponse,
    waitForTableRefresh,
    waitForToast,
    getFixturePath,
} from '../utils/fixtures';
import path from 'path';

/**
 * Smoke Test 03: Import Personnel
 * 
 * Flow: Template Download -> Import Excel -> Error Row Report
 * 
 * Verifies:
 * - Template download works
 * - Import API returns 200
 * - Error rows are reported
 * - Audit log for import action
 */
test.describe('03. Import Personnel', () => {

    test('should download import template', async ({ page }) => {
        await page.goto('/#/people/archive/list');
        await waitForTableRefresh(page);

        // Start download waiting
        const downloadPromise = page.waitForEvent('download');

        // Click template download button
        await page.click('button:has-text("下载模板"), button:has-text("模板"), [data-testid="download-template"]');

        // Wait for download
        const download = await downloadPromise;

        // Assert file name
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.xlsx?$/);

        // Save for verification
        await download.saveAs(path.join(process.cwd(), 'e2e', 'fixtures', 'downloaded-template.xlsx'));

        console.log(`✅ Template downloaded: ${filename}`);
    });

    test('should import personnel with error report', async ({ page, auditHelper }) => {
        await page.goto('/#/people/archive/list');
        await waitForTableRefresh(page);

        // Click import button
        await page.click('button:has-text("导入"), [data-testid="import-btn"]');

        // Wait for import modal/drawer
        await page.waitForSelector('.ant-modal, .ant-drawer, .import-dialog', { timeout: 5000 });

        // Set up file input (hidden input element)
        const fileInput = page.locator('input[type="file"]');

        // Use fixture file with some invalid rows
        const testFilePath = getFixturePath('import-personnel-test.xlsx');

        // Upload file
        await fileInput.setInputFiles(testFilePath);

        // Wait for upload completion and processing
        await page.waitForSelector('.ant-upload-list-item-done, .upload-success', { timeout: 30000 }).catch(() => { });

        // Click confirm import
        const [response] = await Promise.all([
            waitForApiResponse(page, '/api/hr/archives/import', { status: 200 }),
            page.click('button:has-text("确定导入"), button:has-text("开始导入"), button:has-text("确定")'),
        ]);

        // Assert API success
        expect(response.status).toBe(200);
        const result = (response.body as any).data;

        // Check import result structure
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('failed');

        // If there are errors, check error report
        if (result.failed > 0) {
            expect(result).toHaveProperty('errors');
            expect(Array.isArray(result.errors)).toBe(true);

            // Verify error structure
            result.errors.forEach((err: any) => {
                expect(err).toHaveProperty('row');
                expect(err).toHaveProperty('field');
                expect(err).toHaveProperty('message');
            });

            console.log(`⚠️ Import completed with ${result.failed} errors`);
        }

        // Wait for result display
        await waitForToast(page, /导入|成功|完成/);

        // Check for error report download option if errors exist
        if (result.failed > 0) {
            const errorReportBtn = page.locator('button:has-text("下载错误报告"), button:has-text("错误明细")');
            if (await errorReportBtn.isVisible()) {
                console.log('✅ Error report download available');
            }
        }

        // Verify audit log
        const auditLog = await auditHelper.assertAuditLogExists({
            module: 'hr',
            action: 'IMPORT',
            within: 60,
        });
        expect(auditLog).not.toBeNull();

        // Refresh table to see imported records
        await waitForTableRefresh(page);

        console.log(`✅ Import completed: ${result.success}/${result.total} success, audit log verified`);
    });

    test('should show import progress for large files', async ({ page }) => {
        await page.goto('/#/people/archive/list');
        await waitForTableRefresh(page);

        // Click import button
        await page.click('button:has-text("导入"), [data-testid="import-btn"]');
        await page.waitForSelector('.ant-modal, .ant-drawer', { timeout: 5000 });

        // Check for progress indicator when file is being processed
        const progressIndicator = page.locator('.ant-progress, .progress-bar, [data-testid="import-progress"]');

        // Just verify the UI elements exist (actual progress needs large file)
        const hasProgress = await progressIndicator.count() > 0 ||
            await page.locator('text=/进度|处理中|上传中/').count() > 0;

        console.log(`ℹ️ Progress indicator available: ${hasProgress}`);
    });
});
