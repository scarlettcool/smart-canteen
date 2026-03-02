import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * RBAC Guard - Role-Based Access Control
 * 
 * Checks if user has required roles or permissions for the route.
 * Works with @Roles() and @Permissions() decorators.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Skip for public routes
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        // Get required roles/permissions from decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If no specific roles/permissions required, allow access
        if (!requiredRoles?.length && !requiredPermissions?.length) {
            return true;
        }

        // Get user from request
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Check roles
        if (requiredRoles?.length) {
            const hasRole = requiredRoles.some((role) =>
                user.roles?.includes(role) || user.role === role,
            );
            if (!hasRole) {
                throw new ForbiddenException(
                    `Insufficient role. Required: ${requiredRoles.join(' or ')}`,
                );
            }
        }

        // Check permissions
        if (requiredPermissions?.length) {
            const userPermissions = user.permissions || [];
            const hasPermission = requiredPermissions.some((perm) =>
                userPermissions.includes(perm),
            );
            if (!hasPermission) {
                throw new ForbiddenException(
                    `Insufficient permission. Required: ${requiredPermissions.join(' or ')}`,
                );
            }
        }

        return true;
    }
}
