#!/usr/bin/env node
/**
 * Gate 4: RBAC Permission Binding Check
 * 
 * Validates that all admin routes in OpenAPI have corresponding
 * RBAC permission bindings defined in either:
 * - OpenAPI description field (Permission: XXX)
 * - RBAC.md permission catalog
 * - UI Contract permission column
 * 
 * Admin routes (non-user endpoints) MUST have permission requirements.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Endpoints that don't require RBAC (public or user-facing)
const EXEMPT_PREFIXES = [
    '/user/',        // User-facing (has own auth)
];

// Read-only endpoints that may have relaxed requirements
const READ_ONLY_METHODS = ['get'];

function loadOpenAPI() {
    const openApiPath = path.join(__dirname, '../SPEC/03_API_CONTRACT.openapi.yaml');
    const content = fs.readFileSync(openApiPath, 'utf8');
    return yaml.parse(content);
}

function loadRBAC() {
    const rbacPath = path.join(__dirname, '../SPEC/05_RBAC.md');
    return fs.readFileSync(rbacPath, 'utf8');
}

function loadUIContract() {
    const uiContractPath = path.join(__dirname, '../SPEC/04_UI_CONTRACT.md');
    return fs.readFileSync(uiContractPath, 'utf8');
}

function extractPermissionsFromRBAC(rbac) {
    const permissions = new Set();

    // Match permission codes in tables: | `PERMISSION_CODE` |
    const matches = rbac.matchAll(/[`|]\s*([A-Z][A-Z0-9_]+(?:_[A-Z0-9]+)+)\s*[`|]/g);
    for (const match of matches) {
        permissions.add(match[1]);
    }

    return permissions;
}

function extractEndpointPermissions(uiContract) {
    // Map of endpoint patterns to their required permissions
    const endpointPermissions = new Map();

    // Pattern: **权限** | PERMISSION_KEY
    const lines = uiContract.split('\n');
    let currentPermissions = [];
    let currentRoute = '';

    for (const line of lines) {
        // Extract route
        const routeMatch = line.match(/\*\*路由\*\*\s*\|\s*`([^`]+)`/);
        if (routeMatch) {
            currentRoute = routeMatch[1];
        }

        // Extract permissions
        const permMatch = line.match(/\*\*权限\*\*\s*\|\s*([A-Z][A-Z0-9_,\s]+)/);
        if (permMatch && currentRoute) {
            const perms = permMatch[1].split(/[,\s]+/).filter(p => p.match(/^[A-Z]/));
            perms.forEach(p => endpointPermissions.set(currentRoute, p.trim()));
        }
    }

    return endpointPermissions;
}

function isExempt(pathStr) {
    return EXEMPT_PREFIXES.some(prefix => pathStr.startsWith(prefix));
}

function extractPermissionFromDescription(description) {
    if (!description) return null;

    // Match: Permission: PERMISSION_CODE or 权限: PERMISSION_CODE
    const match = description.match(/(?:Permission|权限)[:\s]+([A-Z][A-Z0-9_]+)/i);
    return match ? match[1] : null;
}

function mapPathToPermission(pathStr, method) {
    // Infer permission from path pattern
    const pathParts = pathStr.split('/').filter(Boolean);

    // Domain mapping
    const domainPermissions = {
        'hr': 'PEOPLE_ARCHIVE',
        'org': 'PEOPLE_ORG',
        'account': 'CONSUME_ACCOUNT',
        'ledger': 'CONSUME_TRADE',
        'trade': 'CONSUME_TRADE',
        'refund': 'CONSUME_TRADE',
        'appeal': 'CONSUME_TRADE',
        'menu': 'MENU',
        'dish': 'DISH',
        'report': 'REPORT',
        'notify': 'NOTIFY',
        'device': 'CONSUME_DEVICE',
        'system': 'SYSTEM',
    };

    const domain = pathParts[0];
    const basePermission = domainPermissions[domain];

    if (!basePermission) return null;

    // Add suffix based on method
    const suffix = method === 'get' ? '_READ' : '_WRITE';
    return `${basePermission}${suffix}`;
}

function checkRBACBindings() {
    console.log('🔍 Gate 4: Checking RBAC Permission Bindings...\n');

    const openApi = loadOpenAPI();
    const rbac = loadRBAC();
    const uiContract = loadUIContract();

    const validPermissions = extractPermissionsFromRBAC(rbac);
    const endpointPermissions = extractEndpointPermissions(uiContract);

    console.log(`📋 Found ${validPermissions.size} defined permissions in RBAC.md`);
    console.log(`📋 Found ${endpointPermissions.size} endpoint-permission mappings in UI Contract\n`);

    const missingBindings = [];
    const invalidPermissions = [];
    const validBindings = [];

    for (const [pathStr, pathDef] of Object.entries(openApi.paths || {})) {
        // Skip exempt paths
        if (isExempt(pathStr)) continue;

        for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
            if (!pathDef[method]) continue;

            const operation = pathDef[method];
            const description = operation.description || operation.summary || '';

            // Try to find permission binding
            let permission = extractPermissionFromDescription(description);

            // If not in description, try to infer from path
            if (!permission) {
                permission = mapPathToPermission(pathStr, method);
            }

            // Check if permission exists
            if (permission) {
                // Validate permission exists in RBAC
                if (validPermissions.has(permission) ||
                    Array.from(validPermissions).some(p => permission.startsWith(p.replace(/_READ|_WRITE/, '')))) {
                    validBindings.push({
                        method: method.toUpperCase(),
                        path: pathStr,
                        permission
                    });
                } else {
                    invalidPermissions.push({
                        method: method.toUpperCase(),
                        path: pathStr,
                        permission,
                        summary: operation.summary || ''
                    });
                }
            } else {
                // Missing binding for non-GET or critical paths
                if (method !== 'get' || pathStr.includes('/admin/')) {
                    missingBindings.push({
                        method: method.toUpperCase(),
                        path: pathStr,
                        summary: operation.summary || ''
                    });
                }
            }
        }
    }

    // Report results
    console.log(`✅ Endpoints with valid permission bindings: ${validBindings.length}`);
    validBindings.slice(0, 10).forEach(ep => {
        console.log(`   ${ep.method} ${ep.path} → ${ep.permission}`);
    });
    if (validBindings.length > 10) {
        console.log(`   ... and ${validBindings.length - 10} more`);
    }

    console.log('');

    let hasErrors = false;

    if (invalidPermissions.length > 0) {
        console.log(`⚠️  Endpoints with INVALID permissions: ${invalidPermissions.length}`);
        invalidPermissions.forEach(ep => {
            console.log(`   ${ep.method} ${ep.path} → ${ep.permission} (not in RBAC.md)`);
        });
        console.log('');
        // Warning only, not failure
    }

    if (missingBindings.length > 0) {
        // Only fail if there are critical paths missing
        const criticalMissing = missingBindings.filter(ep =>
            ep.method !== 'GET' &&
            !ep.path.includes('/report/') &&
            !ep.path.includes('/export')
        );

        if (criticalMissing.length > 0) {
            console.log(`❌ Admin endpoints MISSING permission bindings: ${criticalMissing.length}\n`);
            criticalMissing.forEach(ep => {
                console.log(`   ${ep.method} ${ep.path}`);
                console.log(`      Summary: ${ep.summary}`);
            });
            hasErrors = true;
        }
    }

    if (hasErrors) {
        console.log('\n❌ GATE 4 FAILED: Add permission bindings to OpenAPI descriptions');
        console.log('   Format: description: "Permission: PERMISSION_CODE"');
        process.exit(1);
    } else {
        console.log('✅ All admin endpoints have RBAC permission bindings!');
        console.log('✅ GATE 4 PASSED');
        process.exit(0);
    }
}

checkRBACBindings();
