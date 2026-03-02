import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * @Roles() decorator - requires user to have specific roles
 * 
 * Usage:
 * @Roles('SUPER_ADMIN', 'ADMIN')
 * @Get('users')
 * getUsers() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Predefined role constants
export const Role = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    CANTEEN_MANAGER: 'CANTEEN_MANAGER',
    HR_MANAGER: 'HR_MANAGER',
    FINANCE: 'FINANCE',
    VIEWER: 'VIEWER',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
