/**
 * 智慧食堂 - 完整集成测试套件
 * 
 * 测试覆盖：
 * 1. Admin + H5 + Backend 集成
 * 2. RBAC 权限验证
 * 3. 审计日志验证
 * 4. E2E 用户流程
 */

import { test, expect, Page } from '@playwright/test';

// ============================================================
// 测试配置
// ============================================================
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3001';
const H5_URL = process.env.H5_URL || 'http://localhost:3002';

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
};

// ============================================================
// 辅助函数
// ============================================================

async function adminLogin(page: Page): Promise<string> {
    const response = await page.request.post(`${API_BASE_URL}/auth/login`, {
        data: ADMIN_CREDENTIALS,
    });
    const data = await response.json();
    expect(response.ok()).toBeTruthy();
    expect(data.data.accessToken).toBeTruthy();
    return data.data.accessToken;
}

async function fetchWithAuth<T>(page: Page, token: string, endpoint: string): Promise<T> {
    const response = await page.request.get(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.data || data;
}

// ============================================================
// 1. 认证测试
// ============================================================
test.describe('Authentication', () => {
    test('Admin login with valid credentials', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.code).toBe(0);
        expect(data.data.accessToken).toBeTruthy();
        expect(data.data.user.username).toBe('admin');
        expect(data.data.user.roles).toContain('SUPER_ADMIN');
    });

    test('Admin login with invalid credentials', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: { username: 'admin', password: 'wrong' },
        });

        expect(response.status()).toBe(401);
    });

    test('Protected endpoint without token returns 401', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/hr/archives`);
        expect(response.status()).toBe(401);
    });

    test('Token refresh works', async ({ request }) => {
        // First login
        const loginRes = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        const { accessToken } = (await loginRes.json()).data;

        // Then refresh
        const refreshRes = await request.post(`${API_BASE_URL}/auth/refresh`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        expect(refreshRes.ok()).toBeTruthy();
        const refreshData = await refreshRes.json();
        expect(refreshData.data.accessToken).toBeTruthy();
    });
});

// ============================================================
// 2. RBAC 权限测试
// ============================================================
test.describe('RBAC & Permissions', () => {
    let adminToken: string;

    test.beforeAll(async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        adminToken = (await response.json()).data.accessToken;
    });

    test('Super admin can access all endpoints', async ({ request }) => {
        const endpoints = [
            '/hr/archives',
            '/hr/approvals',
            '/hr/blacklist',
            '/org/tree',
            '/account',
            '/system/audit-logs',
            '/system/roles',
            '/system/admins',
        ];

        for (const endpoint of endpoints) {
            const response = await request.get(`${API_BASE_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            expect(response.ok(), `Failed to access ${endpoint}`).toBeTruthy();
        }
    });

    test('Get all roles', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/system/roles`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        const roles = data.data;

        expect(roles.some((r: any) => r.code === 'SUPER_ADMIN')).toBeTruthy();
        expect(roles.some((r: any) => r.code === 'ADMIN')).toBeTruthy();
    });

    test('Get all permissions', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/system/permissions`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        const permissions = data.data;

        expect(permissions.length).toBeGreaterThan(0);
        expect(permissions.some((p: any) => p.code === 'PEOPLE_ARCHIVE_READ')).toBeTruthy();
        expect(permissions.some((p: any) => p.code === 'SYSTEM_LOG_READ')).toBeTruthy();
    });
});

// ============================================================
// 3. HR 人员管理测试
// ============================================================
test.describe('HR Module', () => {
    let adminToken: string;
    let createdArchiveId: string;

    test.beforeAll(async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        adminToken = (await response.json()).data.accessToken;
    });

    test('Create archive', async ({ request }) => {
        const archiveData = {
            name: `测试员工_${Date.now()}`,
            staffId: `E${Date.now().toString().slice(-8)}`,
            phone: `138${Date.now().toString().slice(-8)}`,
        };

        const response = await request.post(`${API_BASE_URL}/hr/archives`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: archiveData,
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.id).toBeTruthy();
        expect(data.data.name).toBe(archiveData.name);

        createdArchiveId = data.data.id;
    });

    test('Get archives list', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/hr/archives`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.list).toBeDefined();
        expect(data.data.total).toBeGreaterThanOrEqual(0);
    });

    test('Update archive', async ({ request }) => {
        const response = await request.put(`${API_BASE_URL}/hr/archives/${createdArchiveId}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: { name: '更新后的名字' },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.name).toBe('更新后的名字');
    });

    test('Delete archive', async ({ request }) => {
        const response = await request.delete(`${API_BASE_URL}/hr/archives/${createdArchiveId}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.success).toBe(true);
    });

    test('Validate phone format', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/hr/archives`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: {
                name: '测试',
                staffId: 'E99999999',
                phone: '12345', // Invalid format
            },
        });

        expect(response.status()).toBe(400);
    });
});

// ============================================================
// 4. 审计日志测试
// ============================================================
test.describe('Audit Logs', () => {
    let adminToken: string;

    test.beforeAll(async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        adminToken = (await response.json()).data.accessToken;
    });

    test('Login creates audit log', async ({ request }) => {
        // Create a new login to generate audit log
        await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });

        // Check audit logs
        const response = await request.get(`${API_BASE_URL}/system/audit-logs?module=auth&action=LOGIN`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.list.length).toBeGreaterThan(0);
        expect(data.data.list[0].module).toBe('auth');
        expect(data.data.list[0].action).toBe('LOGIN');
    });

    test('CRUD operations are logged', async ({ request }) => {
        // Create an archive first
        const createRes = await request.post(`${API_BASE_URL}/hr/archives`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: {
                name: `审计测试_${Date.now()}`,
                staffId: `A${Date.now().toString().slice(-8)}`,
                phone: `139${Date.now().toString().slice(-8)}`,
            },
        });
        const archiveId = (await createRes.json()).data.id;

        // Check for CREATE audit log
        const auditRes = await request.get(`${API_BASE_URL}/system/audit-logs?targetId=${archiveId}&action=CREATE`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(auditRes.ok()).toBeTruthy();
        const auditData = await auditRes.json();
        expect(auditData.data.list.length).toBeGreaterThan(0);

        // Cleanup
        await request.delete(`${API_BASE_URL}/hr/archives/${archiveId}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
    });

    test('Audit log contains required fields', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/system/audit-logs?page=1&pageSize=1`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();

        if (data.data.list.length > 0) {
            const log = data.data.list[0];
            expect(log.id).toBeTruthy();
            expect(log.module).toBeTruthy();
            expect(log.action).toBeTruthy();
            expect(log.operatorId).toBeTruthy();
            expect(log.createdAt).toBeTruthy();
        }
    });
});

// ============================================================
// 5. 组织架构测试
// ============================================================
test.describe('Organization', () => {
    let adminToken: string;

    test.beforeAll(async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        adminToken = (await response.json()).data.accessToken;
    });

    test('Get organization tree', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/org/tree`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(Array.isArray(data.data)).toBeTruthy();
    });
});

// ============================================================
// 6. 账户管理测试
// ============================================================
test.describe('Account Management', () => {
    let adminToken: string;

    test.beforeAll(async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        adminToken = (await response.json()).data.accessToken;
    });

    test('Get accounts list', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/account`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data).toBeDefined();
    });
});

// ============================================================
// 7. 安全测试
// ============================================================
test.describe('Security', () => {
    test('Password is not returned in user data', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });

        const data = await response.json();
        expect(data.data.user.password).toBeUndefined();
    });

    test('SQL injection attempt is blocked', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: {
                username: "admin'; DROP TABLE users; --",
                password: 'test',
            },
        });

        // Should return 401 (invalid credentials), not 500 (server error)
        expect(response.status()).toBe(401);
    });

    test('XSS payload is sanitized', async ({ request }) => {
        const loginRes = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        const token = (await loginRes.json()).data.accessToken;

        const response = await request.post(`${API_BASE_URL}/hr/archives`, {
            headers: { Authorization: `Bearer ${token}` },
            data: {
                name: '<script>alert("xss")</script>',
                staffId: `X${Date.now().toString().slice(-8)}`,
                phone: `131${Date.now().toString().slice(-8)}`,
            },
        });

        if (response.ok()) {
            const data = await response.json();
            // Name should be stored/escaped properly
            expect(data.data.name).not.toContain('<script>');
        }
    });

    test('Request without Content-Type is handled', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: JSON.stringify(ADMIN_CREDENTIALS),
            headers: {},
        });

        // Should handle gracefully
        expect([200, 400, 415].includes(response.status())).toBeTruthy();
    });
});

// ============================================================
// 8. 响应格式验证
// ============================================================
test.describe('API Response Format', () => {
    test('Success response has standard format', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });

        const data = await response.json();
        expect(data.code).toBe(0);
        expect(data.message).toBeDefined();
        expect(data.data).toBeDefined();
        expect(data.traceId).toBeDefined();
    });

    test('Error response has standard format', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: { username: 'wrong', password: 'wrong' },
        });

        const data = await response.json();
        expect(data.message).toBeDefined();
        expect(data.traceId).toBeDefined();
    });

    test('Pagination response has required fields', async ({ request }) => {
        const loginRes = await request.post(`${API_BASE_URL}/auth/login`, {
            data: ADMIN_CREDENTIALS,
        });
        const token = (await loginRes.json()).data.accessToken;

        const response = await request.get(`${API_BASE_URL}/hr/archives?page=1&pageSize=10`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.list).toBeDefined();
        expect(typeof data.data.total).toBe('number');
        expect(typeof data.data.page).toBe('number');
        expect(typeof data.data.pageSize).toBe('number');
    });
});
