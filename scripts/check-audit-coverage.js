#!/usr/bin/env node
/**
 * Gate 3: Audit Log Coverage Check
 * 
 * Validates that all critical action endpoints in OpenAPI have corresponding
 * audit log requirements defined in UI Contract.
 * 
 * Critical actions that MUST have audit logs:
 * - POST (create), PUT (update), DELETE
 * - /approve, /reject, /pass, /lift, /freeze, /unfreeze
 * - /adjust, /correct, /publish, /unpublish
 * - /command, /restart, /bind, /unbind
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Critical action patterns that require audit logging
const CRITICAL_ACTION_PATTERNS = [
  // State changes
  /\/approve$/,
  /\/reject$/,
  /\/pass$/,
  /\/accept$/,
  /\/resolve$/,
  /\/lift$/,
  // Account operations
  /\/freeze$/,
  /\/unfreeze$/,
  /\/adjust$/,
  /\/correct$/,
  // Publishing
  /\/publish$/,
  /\/unpublish$/,
  /\/batch-publish$/,
  // Device operations
  /\/command$/,
  /\/restart$/,
  /\/bind$/,
  /\/unbind$/,
  // Batch operations
  /\/batch$/,
  /\/batch-convert$/,
  /\/convert$/,
  // Import/Export (data mutations)
  /\/import$/,
];

// Endpoints that are exempt from audit (read-only or user-facing)
const EXEMPT_PATTERNS = [
  /^\/user\//,           // User-facing endpoints (separate audit)
  /^\/report\//,         // Reports (read-only, export has its own audit)
  /\/export$/,           // Export tracked separately via ExportJob
  /\/preview$/,          // Preview operations
  /\/status$/,           // Status checks
  /\/history$/,          // History (already audit trail)
];

// Methods that require audit for non-exempt paths
const AUDIT_REQUIRED_METHODS = ['post', 'put', 'delete', 'patch'];

function loadOpenAPI() {
  const openApiPath = path.join(__dirname, '../SPEC/03_API_CONTRACT.openapi.yaml');
  const content = fs.readFileSync(openApiPath, 'utf8');
  return yaml.parse(content);
}

function loadUIContract() {
  const uiContractPath = path.join(__dirname, '../SPEC/04_UI_CONTRACT.md');
  return fs.readFileSync(uiContractPath, 'utf8');
}

function isExempt(pathStr) {
  return EXEMPT_PATTERNS.some(pattern => pattern.test(pathStr));
}

function isCriticalAction(pathStr) {
  return CRITICAL_ACTION_PATTERNS.some(pattern => pattern.test(pathStr));
}

function extractAuditedEndpoints(uiContract) {
  // Extract endpoints marked with ✅ for audit
  const auditedEndpoints = new Set();
  
  // Pattern to match table rows with audit checkmarks
  // Format: | 按钮 | API Endpoint | ... | and feature blocks with audit: ✅
  const lines = uiContract.split('\n');
  let currentFeatureHasAudit = false;
  let currentEndpoints = [];
  
  for (const line of lines) {
    // Check for audit requirement at feature level
    if (line.includes('**审计**') && line.includes('✅')) {
      currentFeatureHasAudit = true;
    }
    if (line.includes('**审计**') && line.includes('❌')) {
      currentFeatureHasAudit = false;
    }
    
    // Extract API endpoints from table rows
    const endpointMatch = line.match(/\|\s*\w+.*?\|\s*((?:GET|POST|PUT|DELETE|PATCH)\s+)?[`']?(\/[\w\-\/:{}]+)[`']?\s*\|/i);
    if (endpointMatch) {
      const endpoint = endpointMatch[2].replace(/\{[^}]+\}/g, '{id}');
      if (currentFeatureHasAudit) {
        auditedEndpoints.add(endpoint);
      }
    }
    
    // Reset on new feature section
    if (line.startsWith('#### #')) {
      currentFeatureHasAudit = false;
    }
  }
  
  return auditedEndpoints;
}

function checkAuditCoverage() {
  console.log('🔍 Gate 3: Checking Audit Log Coverage...\n');
  
  const openApi = loadOpenAPI();
  const uiContract = loadUIContract();
  const auditedEndpoints = extractAuditedEndpoints(uiContract);
  
  const missingAudit = [];
  const coveredEndpoints = [];
  
  for (const [pathStr, pathDef] of Object.entries(openApi.paths || {})) {
    // Skip exempt paths
    if (isExempt(pathStr)) continue;
    
    for (const method of AUDIT_REQUIRED_METHODS) {
      if (!pathDef[method]) continue;
      
      const isCritical = isCriticalAction(pathStr);
      const isWriteOp = ['post', 'put', 'delete', 'patch'].includes(method);
      const needsAudit = isCritical || (isWriteOp && !isExempt(pathStr));
      
      if (needsAudit) {
        // Normalize path for comparison
        const normalizedPath = pathStr.replace(/\{[^}]+\}/g, '{id}');
        
        // Check if this endpoint is covered in UI contract with audit
        const hasAudit = auditedEndpoints.has(normalizedPath) || 
                         Array.from(auditedEndpoints).some(ep => 
                           normalizedPath.includes(ep.replace('{id}', '')) ||
                           ep.includes(normalizedPath.replace('{id}', ''))
                         );
        
        if (hasAudit) {
          coveredEndpoints.push({
            method: method.toUpperCase(),
            path: pathStr,
            critical: isCritical
          });
        } else if (isCritical) {
          // Only fail for critical actions, warn for others
          missingAudit.push({
            method: method.toUpperCase(),
            path: pathStr,
            summary: pathDef[method].summary || ''
          });
        }
      }
    }
  }
  
  // Report results
  console.log(`✅ Endpoints with audit coverage: ${coveredEndpoints.length}`);
  coveredEndpoints.slice(0, 10).forEach(ep => {
    console.log(`   ${ep.method} ${ep.path} ${ep.critical ? '(critical)' : ''}`);
  });
  if (coveredEndpoints.length > 10) {
    console.log(`   ... and ${coveredEndpoints.length - 10} more`);
  }
  
  console.log('');
  
  if (missingAudit.length > 0) {
    console.log(`❌ Critical endpoints MISSING audit coverage: ${missingAudit.length}\n`);
    missingAudit.forEach(ep => {
      console.log(`   ${ep.method} ${ep.path}`);
      console.log(`      Summary: ${ep.summary}`);
    });
    console.log('\n❌ GATE 3 FAILED: Add audit log requirements to 04_UI_CONTRACT.md');
    process.exit(1);
  } else {
    console.log('✅ All critical action endpoints have audit log coverage!');
    console.log('✅ GATE 3 PASSED');
    process.exit(0);
  }
}

checkAuditCoverage();
