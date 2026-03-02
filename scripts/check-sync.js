#!/usr/bin/env node
/**
 * Gate 1 & 2: Sync Check Utilities
 * 
 * Local development helpers to check sync status before commit.
 * Run: node scripts/check-sync.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SPEC_DIR = path.join(__dirname, '../SPEC');
const SHARED_TYPES_DIR = path.join(__dirname, '../shared/api-types');
const MIGRATIONS_DIR = path.join(__dirname, '../prisma/migrations');

function getFileModTime(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.getTime();
    } catch {
        return 0;
    }
}

function getLatestMigrationTime() {
    try {
        if (!fs.existsSync(MIGRATIONS_DIR)) return 0;
        const dirs = fs.readdirSync(MIGRATIONS_DIR);
        let latest = 0;
        for (const dir of dirs) {
            const migrationPath = path.join(MIGRATIONS_DIR, dir);
            const stats = fs.statSync(migrationPath);
            if (stats.mtime.getTime() > latest) {
                latest = stats.mtime.getTime();
            }
        }
        return latest;
    } catch {
        return 0;
    }
}

function getLatestTypesTime() {
    try {
        if (!fs.existsSync(SHARED_TYPES_DIR)) return 0;
        const files = fs.readdirSync(SHARED_TYPES_DIR);
        let latest = 0;
        for (const file of files) {
            const filePath = path.join(SHARED_TYPES_DIR, file);
            const stats = fs.statSync(filePath);
            if (stats.mtime.getTime() > latest) {
                latest = stats.mtime.getTime();
            }
        }
        return latest;
    } catch {
        return 0;
    }
}

function checkOpenAPITypesSync() {
    console.log('\n📋 Gate 1: OpenAPI ↔ Shared Types Sync');
    console.log('─'.repeat(50));

    const openApiPath = path.join(SPEC_DIR, '03_API_CONTRACT.openapi.yaml');
    const openApiTime = getFileModTime(openApiPath);
    const typesTime = getLatestTypesTime();

    if (openApiTime === 0) {
        console.log('⚠️  OpenAPI file not found');
        return false;
    }

    if (typesTime === 0) {
        console.log('❌ Shared types not generated');
        console.log('   Run: npm run generate:types');
        return false;
    }

    if (openApiTime > typesTime) {
        console.log('❌ OpenAPI is newer than shared types');
        console.log(`   OpenAPI: ${new Date(openApiTime).toISOString()}`);
        console.log(`   Types:   ${new Date(typesTime).toISOString()}`);
        console.log('   Run: npm run generate:types');
        return false;
    }

    console.log('✅ Shared types are up to date');
    return true;
}

function checkDBMigrationSync() {
    console.log('\n📋 Gate 2: DB Schema ↔ Migration Sync');
    console.log('─'.repeat(50));

    const schemaPath = path.join(SPEC_DIR, '02_DB_SCHEMA.prisma');
    const schemaTime = getFileModTime(schemaPath);
    const migrationTime = getLatestMigrationTime();

    if (schemaTime === 0) {
        console.log('⚠️  Prisma schema not found');
        return false;
    }

    if (migrationTime === 0) {
        console.log('❌ No migrations found');
        console.log('   Run: npx prisma migrate dev --name init');
        return false;
    }

    if (schemaTime > migrationTime) {
        console.log('❌ Schema is newer than latest migration');
        console.log(`   Schema:    ${new Date(schemaTime).toISOString()}`);
        console.log(`   Migration: ${new Date(migrationTime).toISOString()}`);
        console.log('   Run: npx prisma migrate dev --name <description>');
        return false;
    }

    console.log('✅ Migrations are up to date');
    return true;
}

function main() {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║        CONTRACT LOCKDOWN GATES - LOCAL CHECK     ║');
    console.log('╚══════════════════════════════════════════════════╝');

    const gate1 = checkOpenAPITypesSync();
    const gate2 = checkDBMigrationSync();

    console.log('\n' + '═'.repeat(50));

    if (gate1 && gate2) {
        console.log('✅ All sync checks passed!\n');
        process.exit(0);
    } else {
        console.log('❌ Some sync checks failed. Please fix before committing.\n');
        process.exit(1);
    }
}

main();
