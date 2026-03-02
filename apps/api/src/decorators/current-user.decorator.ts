import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
    id: string;
    username: string;
    name: string;
    roles: string[];
    permissions: string[];
    deptId?: string;
    canteenId?: string;
    siteId?: string;
    isAdmin: boolean;
}

/**
 * @CurrentUser() decorator - extracts user from JWT payload
 * 
 * Usage:
 * @Get('profile')
 * getProfile(@CurrentUser() user: CurrentUserPayload) { ... }
 * 
 * @Get('id')
 * getId(@CurrentUser('id') userId: string) { ... }
 */
export const CurrentUser = createParamDecorator(
    (data: keyof CurrentUserPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as CurrentUserPayload;

        if (!user) {
            return null;
        }

        return data ? user[data] : user;
    },
);
