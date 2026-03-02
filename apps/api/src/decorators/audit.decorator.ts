import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export interface AuditMetadata {
    module: string;
    action: string;
    targetType?: string;
}

/**
 * @Audit() decorator - marks a route for audit logging
 * 
 * Usage:
 * @Audit({ module: 'hr', action: 'CREATE', targetType: 'User' })
 * @Post('archives')
 * createArchive() { ... }
 */
export const Audit = (metadata: AuditMetadata) =>
    SetMetadata(AUDIT_KEY, metadata);

// Predefined audit actions
export const AuditAction = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    IMPORT: 'IMPORT',
    EXPORT: 'EXPORT',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    PASS: 'PASS',
    FREEZE: 'FREEZE',
    UNFREEZE: 'UNFREEZE',
    ADJUST: 'ADJUST',
    CORRECT: 'CORRECT',
    PUBLISH: 'PUBLISH',
    UNPUBLISH: 'UNPUBLISH',
    REPLY: 'REPLY',
    CLOSE: 'CLOSE',
    ACCEPT: 'ACCEPT',
    RESOLVE: 'RESOLVE',
    PROCESS: 'PROCESS',
    LIFT: 'LIFT',
    BIND: 'BIND',
    UNBIND: 'UNBIND',
    COMMAND: 'COMMAND',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER',
    CLAIM: 'CLAIM',
    CANCEL: 'CANCEL',
} as const;

// Predefined audit modules
export const AuditModule = {
    HR: 'hr',
    ORG: 'org',
    ACCOUNT: 'account',
    TRADE: 'trade',
    REFUND: 'refund',
    APPEAL: 'appeal',
    DISH: 'dish',
    MENU: 'menu',
    DEVICE: 'device',
    NOTIFY: 'notify',
    SYSTEM: 'system',
    AUTH: 'auth',
    USER: 'user',
} as const;
