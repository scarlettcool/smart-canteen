import { test as base, expect, Page, APIRequestContext } from '@playwright/test';
import path from 'path';

/**
 * E2E Test Fixtures
 * Provides common utilities for all smoke tests
 */

// Test data
export interface TestUser {
    username: string;
    password: string;
    name: string;
}

export interface TestArchive {
    name: string;
    staffId: string;
    phone: string;
    deptId?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
    traceId: string;
}

export interface AuditLogRecord {
    id: string;
    module: string;
    action: string;
    targetType: string;
    targetId: string;
    operatorName: string;
    createdAt: string;
}

// Extended test fixture
export const test = base.extend<{
    adminPage: Page;
    apiContext: APIRequestContext;
    testData: {
        admin: TestUser;
        archive: TestArchive;
    };
    auditHelper: AuditHelper;
}>({
    // Test data fixture
    testData: async ({ }, use) => {
        const timestamp = Date.now();
        await use({
            admin: {
                username: 'admin',
                password: 'admin123',
                name: '超级管理员',
            },
            archive: {
                name: `测试员工_${timestamp}`,
                staffId: `E${timestamp.toString().slice(-8)}`,
                phone: `138${timestamp.toString().slice(-8)}`,
            },
        });
    },

    // API context for direct API calls
    apiContext: async ({ playwright, baseURL }, use) => {
        const context = await playwright.request.newContext({
            baseURL: baseURL,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
            },
        });
        await use(context);
        await context.dispose();
    },

    // Audit helper for verifying audit logs
    auditHelper: async ({ apiContext }, use) => {
        await use(new AuditHelper(apiContext));
    },

    // Admin page with logged-in state
    adminPage: async ({ page }, use) => {
        await use(page);
    },
});

/**
 * Audit Log Helper
 * Verifies that audit logs are properly recorded
 */
export class AuditHelper {
    private context: APIRequestContext;
    private token: string = '';

    constructor(context: APIRequestContext) {
        this.context = context;
    }

    setToken(token: string) {
        this.token = token;
    }

    async getRecentLogs(params: {
        module?: string;
        action?: string;
        targetId?: string;
        limit?: number;
    } = {}): Promise<AuditLogRecord[]> {
        const response = await this.context.get('/api/system/audit-logs', {
            params: {
                page: 1,
                pageSize: params.limit || 10,
                module: params.module,
                action: params.action,
            },
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        const data: ApiResponse<{ list: AuditLogRecord[] }> = await response.json();
        return data.data?.list || [];
    }

    async assertAuditLogExists(params: {
        module: string;
        action: string;
        targetId?: string;
        within?: number; // seconds
    }): Promise<AuditLogRecord | null> {
        const logs = await this.getRecentLogs({
            module: params.module,
            action: params.action,
            limit: 20,
        });

        const withinMs = (params.within || 60) * 1000;
        const now = Date.now();

        const matchingLog = logs.find(log => {
            const logTime = new Date(log.createdAt).getTime();
            const isRecent = (now - logTime) < withinMs;
            const moduleMatch = log.module === params.module;
            const actionMatch = log.action === params.action;
            const targetMatch = !params.targetId || log.targetId === params.targetId;

            return isRecent && moduleMatch && actionMatch && targetMatch;
        });

        return matchingLog || null;
    }
}

/**
 * API Helper Functions
 */
export async function waitForApiResponse(
    page: Page,
    urlPattern: string | RegExp,
    options: { status?: number; timeout?: number } = {}
): Promise<{ status: number; body: unknown }> {
    const response = await page.waitForResponse(
        resp => {
            const matches = typeof urlPattern === 'string'
                ? resp.url().includes(urlPattern)
                : urlPattern.test(resp.url());
            return matches && resp.request().method() !== 'OPTIONS';
        },
        { timeout: options.timeout || 10000 }
    );

    const status = response.status();
    let body: unknown = null;

    try {
        body = await response.json();
    } catch {
        body = await response.text();
    }

    if (options.status) {
        expect(status).toBe(options.status);
    }

    return { status, body };
}

/**
 * UI Helper Functions
 */
export async function waitForTableRefresh(page: Page, tableSelector: string = '.ant-table') {
    // Wait for loading to appear and disappear
    const loading = page.locator(`${tableSelector} .ant-spin`);

    try {
        await loading.waitFor({ state: 'visible', timeout: 2000 });
        await loading.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
        // Loading might have already completed
    }

    // Ensure table has rows
    await page.locator(`${tableSelector} .ant-table-row`).first().waitFor({
        state: 'visible',
        timeout: 5000
    }).catch(() => {
        // Table might be empty, that's ok
    });
}

export async function waitForToast(page: Page, message?: string) {
    const toast = page.locator('.ant-message-notice, .ant-notification');
    await toast.waitFor({ state: 'visible', timeout: 5000 });

    if (message) {
        await expect(toast).toContainText(message);
    }

    return toast;
}

export async function clickAndWaitForNavigation(page: Page, selector: string) {
    await Promise.all([
        page.waitForLoadState('networkidle'),
        page.click(selector),
    ]);
}

export async function fillForm(page: Page, fields: Record<string, string>) {
    for (const [selector, value] of Object.entries(fields)) {
        await page.fill(selector, value);
    }
}

export async function confirmDialog(page: Page) {
    await page.locator('.ant-modal-confirm-btns .ant-btn-primary, .ant-popconfirm-buttons .ant-btn-primary').click();
}

/**
 * File helpers
 */
export function getFixturePath(filename: string): string {
    return path.join(__dirname, '..', 'fixtures', filename);
}

export { expect };
