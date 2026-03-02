import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';

@Injectable()
export class SystemService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    // Audit Logs
    async getAuditLogs(query: any) {
        return this.auditService.findMany({
            page: query.page,
            pageSize: query.pageSize,
            module: query.module,
            action: query.action,
            operatorId: query.operatorId,
            targetId: query.targetId,
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
        });
    }

    async getAuditLogById(id: string) {
        return this.auditService.findById(id);
    }

    // Roles
    async getRoles() {
        return this.prisma.role.findMany({
            where: { isDeleted: false },
            include: {
                permissions: {
                    include: { permission: true },
                },
            },
        });
    }

    async createRole(data: any) {
        return this.prisma.role.create({
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
            },
        });
    }

    async updateRole(id: string, data: any) {
        return this.prisma.role.update({
            where: { id },
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
            },
        });
    }

    async deleteRole(id: string) {
        return this.prisma.role.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    async assignPermissions(roleId: string, permissionIds: string[]) {
        await this.prisma.rolePermission.deleteMany({
            where: { roleId },
        });

        await this.prisma.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            })),
        });

        return this.prisma.role.findUnique({
            where: { id: roleId },
            include: {
                permissions: {
                    include: { permission: true },
                },
            },
        });
    }

    // Permissions
    async getPermissions() {
        return this.prisma.permission.findMany({
            orderBy: { module: 'asc' },
        });
    }

    // Admin Users
    async getAdminUsers(query: any) {
        return this.prisma.paginate('adminUser', {
            where: { isDeleted: false },
            page: query.page,
            pageSize: query.pageSize,
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });
    }

    async createAdminUser(data: any) {
        return this.prisma.adminUser.create({
            data: {
                username: data.username,
                password: data.password,
                name: data.name,
                phone: data.phone,
                email: data.email,
                status: data.status || 'ACTIVE',
            },
        });
    }

    async updateAdminUser(id: string, data: any) {
        return this.prisma.adminUser.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                status: data.status,
            },
        });
    }

    async deleteAdminUser(id: string) {
        return this.prisma.adminUser.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    async assignRoles(adminId: string, roleIds: string[]) {
        await this.prisma.adminUserRole.deleteMany({
            where: { adminId },
        });

        await this.prisma.adminUserRole.createMany({
            data: roleIds.map((roleId) => ({
                adminId,
                roleId,
            })),
        });

        return this.prisma.adminUser.findUnique({
            where: { id: adminId },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });
    }

    // System Config
    async getConfigs(module?: string) {
        return this.prisma.systemConfig.findMany({
            where: module ? { module } : undefined,
            orderBy: { key: 'asc' },
        });
    }

    async updateConfig(key: string, value: any, operatorId: string) {
        return this.prisma.systemConfig.upsert({
            where: { key },
            update: { value, updatedBy: operatorId },
            create: { key, value, module: 'default', updatedBy: operatorId },
        });
    }
}
