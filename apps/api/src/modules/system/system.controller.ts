import { Controller, Get, Post, Put, Delete, Query, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';

@ApiTags('system')
@ApiBearerAuth('JWT-auth')
@Controller('system')
export class SystemController {
    constructor(private systemService: SystemService) { }

    // Audit Logs
    @Get('audit-logs')
    @Permissions(Permission.SYSTEM_LOG_READ)
    @ApiOperation({ summary: 'Get audit logs' })
    async getAuditLogs(@Query() query: any) {
        return this.systemService.getAuditLogs(query);
    }

    @Get('audit-logs/:id')
    @Permissions(Permission.SYSTEM_LOG_READ)
    @ApiOperation({ summary: 'Get audit log by ID' })
    async getAuditLog(@Param('id') id: string) {
        return this.systemService.getAuditLogById(id);
    }

    // Roles
    @Get('roles')
    @Permissions(Permission.SYSTEM_ROLE_READ)
    @ApiOperation({ summary: 'Get roles' })
    async getRoles() {
        return this.systemService.getRoles();
    }

    @Post('roles')
    @Permissions(Permission.SYSTEM_ROLE_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: AuditAction.CREATE, targetType: 'Role' })
    @ApiOperation({ summary: 'Create role' })
    async createRole(@Body() dto: any) {
        return this.systemService.createRole(dto);
    }

    @Put('roles/:id')
    @Permissions(Permission.SYSTEM_ROLE_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: AuditAction.UPDATE, targetType: 'Role' })
    @ApiOperation({ summary: 'Update role' })
    async updateRole(@Param('id') id: string, @Body() dto: any) {
        return this.systemService.updateRole(id, dto);
    }

    @Delete('roles/:id')
    @Permissions(Permission.SYSTEM_ROLE_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: AuditAction.DELETE, targetType: 'Role' })
    @ApiOperation({ summary: 'Delete role' })
    async deleteRole(@Param('id') id: string) {
        return this.systemService.deleteRole(id);
    }

    @Put('roles/:id/permissions')
    @Permissions(Permission.SYSTEM_ROLE_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: 'ASSIGN_PERMISSIONS', targetType: 'Role' })
    @ApiOperation({ summary: 'Assign permissions to role' })
    async assignPermissions(
        @Param('id') id: string,
        @Body() dto: { permissionIds: string[] },
    ) {
        return this.systemService.assignPermissions(id, dto.permissionIds);
    }

    // Permissions
    @Get('permissions')
    @Permissions(Permission.SYSTEM_ROLE_READ)
    @ApiOperation({ summary: 'Get all permissions' })
    async getPermissions() {
        return this.systemService.getPermissions();
    }

    // Admin Users
    @Get('admins')
    @Permissions(Permission.SYSTEM_ADMIN_READ)
    @ApiOperation({ summary: 'Get admin users' })
    async getAdminUsers(@Query() query: any) {
        return this.systemService.getAdminUsers(query);
    }

    @Post('admins')
    @Permissions(Permission.SYSTEM_ADMIN_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: AuditAction.CREATE, targetType: 'AdminUser' })
    @ApiOperation({ summary: 'Create admin user' })
    async createAdminUser(@Body() dto: any) {
        return this.systemService.createAdminUser(dto);
    }

    @Put('admins/:id')
    @Permissions(Permission.SYSTEM_ADMIN_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: AuditAction.UPDATE, targetType: 'AdminUser' })
    @ApiOperation({ summary: 'Update admin user' })
    async updateAdminUser(@Param('id') id: string, @Body() dto: any) {
        return this.systemService.updateAdminUser(id, dto);
    }

    @Delete('admins/:id')
    @Permissions(Permission.SYSTEM_ADMIN_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: AuditAction.DELETE, targetType: 'AdminUser' })
    @ApiOperation({ summary: 'Delete admin user' })
    async deleteAdminUser(@Param('id') id: string) {
        return this.systemService.deleteAdminUser(id);
    }

    @Put('admins/:id/roles')
    @Permissions(Permission.SYSTEM_ADMIN_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: 'ASSIGN_ROLES', targetType: 'AdminUser' })
    @ApiOperation({ summary: 'Assign roles to admin user' })
    async assignRoles(
        @Param('id') id: string,
        @Body() dto: { roleIds: string[] },
    ) {
        return this.systemService.assignRoles(id, dto.roleIds);
    }

    // System Config
    @Get('configs')
    @Permissions(Permission.SYSTEM_CONFIG_READ)
    @ApiOperation({ summary: 'Get system configs' })
    async getConfigs(@Query('module') module?: string) {
        return this.systemService.getConfigs(module);
    }

    @Put('configs/:key')
    @Permissions(Permission.SYSTEM_CONFIG_WRITE)
    @Audit({ module: AuditModule.SYSTEM, action: AuditAction.UPDATE, targetType: 'SystemConfig' })
    @ApiOperation({ summary: 'Update system config' })
    async updateConfig(
        @Param('key') key: string,
        @Body() dto: { value: string },
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.systemService.updateConfig(key, dto.value, user.id);
    }
}
