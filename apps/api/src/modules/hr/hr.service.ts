import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditAction, AuditModule } from '../../decorators/audit.decorator';
import {
    registrationStateMachine,
    RegistrationStatus,
    RegistrationAction,
} from '../../common/state-machine';
import {
    CreateArchiveDto,
    UpdateArchiveDto,
    QueryArchiveDto,
    ApprovalBatchDto,
    AddToBlacklistDto,
} from './hr.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HrService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    // ==========================================================================
    // Archives (人员档案)
    // ==========================================================================

    async findArchives(query: QueryArchiveDto, operatorDeptId?: string) {
        const where: any = {
            isDeleted: false,
        };

        if (query.keyword) {
            where.OR = [
                { name: { contains: query.keyword } },
                { staffId: { contains: query.keyword } },
                { phone: { contains: query.keyword } },
            ];
        }
        if (query.deptId) where.deptId = query.deptId;
        if (query.status) where.status = query.status;
        if (query.regStatus) where.regStatus = query.regStatus;

        // Data permission: filter by operator's dept if not super admin
        if (operatorDeptId) {
            where.deptId = operatorDeptId;
        }

        return this.prisma.paginate('user', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            include: {
                dept: true,
            },
        });
    }

    async findArchiveById(id: string) {
        const archive = await this.prisma.user.findFirst({
            where: { id, isDeleted: false },
            include: { dept: true },
        });

        if (!archive) {
            throw new NotFoundException('Archive not found');
        }

        return archive;
    }

    async createArchive(dto: CreateArchiveDto, operatorId: string, traceId: string) {
        // Check for duplicate staffId
        const existing = await this.prisma.user.findFirst({
            where: { staffId: dto.staffId, isDeleted: false },
        });

        if (existing) {
            throw new BadRequestException('Staff ID already exists');
        }

        const archive = await this.prisma.user.create({
            data: {
                name: dto.name,
                staffId: dto.staffId,
                phone: dto.phone,
                deptId: dto.deptId,
                birthday: dto.birthday ? new Date(dto.birthday) : null,
                regStatus: 'APPROVED', // Admin-created archives are pre-approved
                status: 'ACTIVE',
                balance: 0,
                createdBy: operatorId,
            },
            include: { dept: true },
        });

        // Audit log
        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.HR,
            action: AuditAction.CREATE,
            targetType: 'User',
            targetId: archive.id,
            targetName: archive.name,
            afterValue: archive,
        });

        return archive;
    }

    async updateArchive(id: string, dto: UpdateArchiveDto, operatorId: string, traceId: string) {
        const existing = await this.findArchiveById(id);

        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                ...dto,
                birthday: dto.birthday ? new Date(dto.birthday) : undefined,
                updatedBy: operatorId,
            },
            include: { dept: true },
        });

        // Audit log
        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.HR,
            action: AuditAction.UPDATE,
            targetType: 'User',
            targetId: id,
            targetName: updated.name,
            beforeValue: existing,
            afterValue: updated,
        });

        return updated;
    }

    async deleteArchive(id: string, operatorId: string, traceId: string) {
        const existing = await this.findArchiveById(id);

        // Soft delete
        await this.prisma.softDelete('User', { id }, operatorId);

        // Audit log
        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.HR,
            action: AuditAction.DELETE,
            targetType: 'User',
            targetId: id,
            targetName: existing.name,
            beforeValue: existing,
        });

        return { success: true };
    }

    // ==========================================================================
    // Approvals (注册审批)
    // ==========================================================================

    async findApprovals(query: QueryArchiveDto) {
        const where: any = {
            isDeleted: false,
        };

        if (query.status) where.status = query.status;
        if (query.keyword) {
            where.OR = [
                { name: { contains: query.keyword } },
                { phone: { contains: query.keyword } },
            ];
        }

        return this.prisma.paginate('registration', {
            where,
            page: query.page,
            pageSize: query.pageSize,
        });
    }

    async passApproval(id: string, operatorId: string, operatorName: string, traceId: string) {
        const registration = await this.prisma.registration.findUnique({
            where: { id },
        });

        if (!registration) {
            throw new NotFoundException('Registration not found');
        }

        // Check state machine
        const currentStatus = registration.status as RegistrationStatus;
        const nextStatus = registrationStateMachine.getNextState(currentStatus, 'PASS');

        // Update registration and create user
        const result = await this.prisma.$transaction(async (tx) => {
            // Update registration
            const updated = await tx.registration.update({
                where: { id },
                data: {
                    status: nextStatus,
                    approvedBy: operatorId,
                    approvedAt: new Date(),
                },
            });

            // Create or update user
            let user = await tx.user.findFirst({
                where: { phone: registration.phone, isDeleted: false },
            });

            if (user) {
                user = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        name: registration.name,
                        staffId: registration.staffId,
                        deptId: registration.deptId,
                        regStatus: 'APPROVED',
                        status: 'ACTIVE',
                    },
                });
            } else {
                user = await tx.user.create({
                    data: {
                        name: registration.name,
                        phone: registration.phone,
                        staffId: registration.staffId || `S${Date.now()}`,
                        deptId: registration.deptId,
                        regStatus: 'APPROVED',
                        status: 'ACTIVE',
                        balance: 0,
                    },
                });
            }

            // Log state transition
            await tx.registrationStateLog.create({
                data: {
                    registrationId: id,
                    fromStatus: currentStatus,
                    toStatus: nextStatus,
                    operatorId,
                    operatorName,
                    reason: 'PASS',
                },
            });

            return { registration: updated, user };
        });

        // Audit log
        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.HR,
            action: AuditAction.PASS,
            targetType: 'Registration',
            targetId: id,
            afterValue: result,
        });

        return result;
    }

    async rejectApproval(
        id: string,
        rejectReason: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const registration = await this.prisma.registration.findUnique({
            where: { id },
        });

        if (!registration) {
            throw new NotFoundException('Registration not found');
        }

        const currentStatus = registration.status as RegistrationStatus;
        const nextStatus = registrationStateMachine.getNextState(currentStatus, 'REJECT');

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.registration.update({
                where: { id },
                data: {
                    status: nextStatus,
                    rejectReason,
                    approvedBy: operatorId,
                    approvedAt: new Date(),
                },
            });

            // Log state transition
            await tx.registrationStateLog.create({
                data: {
                    registrationId: id,
                    fromStatus: currentStatus,
                    toStatus: nextStatus,
                    operatorId,
                    operatorName,
                    reason: rejectReason,
                },
            });

            return updated;
        });

        // Audit log
        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.HR,
            action: AuditAction.REJECT,
            targetType: 'Registration',
            targetId: id,
            afterValue: result,
        });

        return result;
    }

    async batchApproval(dto: ApprovalBatchDto, operatorId: string, operatorName: string, traceId: string) {
        const results = { success: 0, failed: 0, errors: [] as any[] };

        for (const id of dto.ids) {
            try {
                if (dto.action === 'pass') {
                    await this.passApproval(id, operatorId, operatorName, traceId);
                } else {
                    await this.rejectApproval(id, dto.rejectReason || '批量驳回', operatorId, operatorName, traceId);
                }
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({ id, message: error.message });
            }
        }

        return results;
    }

    // ==========================================================================
    // Blacklist (黑名单)
    // ==========================================================================

    async findBlacklist(query: QueryArchiveDto) {
        const where: any = {};

        if (query.status) where.status = query.status;
        if (query.keyword) {
            where.user = {
                OR: [
                    { name: { contains: query.keyword } },
                    { phone: { contains: query.keyword } },
                ],
            };
        }

        return this.prisma.paginate('blacklistRecord', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            include: { user: true },
        });
    }

    async addToBlacklist(dto: AddToBlacklistDto, operatorId: string, operatorName: string, traceId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const record = await this.prisma.blacklistRecord.create({
            data: {
                userId: dto.userId,
                type: dto.type as 'TEMPORARY' | 'PERMANENT',
                reason: dto.reason,
                deadline: dto.deadline ? new Date(dto.deadline) : null,
                status: 'ACTIVE',
                createdBy: operatorId,
            },
            include: { user: true },
        });

        // Update user status
        await this.prisma.user.update({
            where: { id: dto.userId },
            data: { status: 'SUSPENDED' },
        });

        // Audit log
        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.HR,
            action: AuditAction.CREATE,
            targetType: 'BlacklistRecord',
            targetId: record.id,
            targetName: user.name,
            afterValue: record,
        });

        return record;
    }

    async liftBlacklist(id: string, liftReason: string, operatorId: string, operatorName: string, traceId: string) {
        const record = await this.prisma.blacklistRecord.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!record) {
            throw new NotFoundException('Blacklist record not found');
        }

        const updated = await this.prisma.$transaction(async (tx) => {
            const result = await tx.blacklistRecord.update({
                where: { id },
                data: {
                    status: 'LIFTED',
                    liftReason,
                    liftedBy: operatorId,
                    liftedAt: new Date(),
                },
            });

            // Restore user status
            await tx.user.update({
                where: { id: record.userId },
                data: { status: 'ACTIVE' },
            });

            return result;
        });

        // Audit log
        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.HR,
            action: AuditAction.LIFT,
            targetType: 'BlacklistRecord',
            targetId: id,
            targetName: record.user.name,
            beforeValue: record,
            afterValue: updated,
        });

        return updated;
    }

    // ==========================================================================
    // Import/Export
    // ==========================================================================

    async importArchives(
        data: CreateArchiveDto[],
        operatorId: string,
        traceId: string,
        duplicatePolicy: 'skip' | 'overwrite' | 'merge' = 'skip',
    ) {
        const results = {
            total: data.length,
            success: 0,
            failed: 0,
            errors: [] as { row: number; field?: string; message: string }[],
        };

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
                // Validate
                if (!row.name) {
                    throw new Error('姓名必填');
                }
                if (!row.staffId) {
                    throw new Error('工号必填');
                }
                if (!row.phone || !/^1\d{10}$/.test(row.phone)) {
                    throw new Error('手机号格式错误');
                }

                // Check duplicate
                const existing = await this.prisma.user.findFirst({
                    where: { staffId: row.staffId, isDeleted: false },
                });

                if (existing) {
                    if (duplicatePolicy === 'skip') {
                        results.failed++;
                        results.errors.push({ row: i + 1, message: '工号已存在，跳过' });
                        continue;
                    } else if (duplicatePolicy === 'overwrite') {
                        await this.prisma.user.update({
                            where: { id: existing.id },
                            data: {
                                name: row.name,
                                phone: row.phone,
                                deptId: row.deptId,
                                updatedBy: operatorId,
                            },
                        });
                        results.success++;
                        continue;
                    }
                }

                await this.createArchive(row, operatorId, traceId);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({ row: i + 1, message: error.message });
            }
        }

        // Audit log for import
        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.HR,
            action: AuditAction.IMPORT,
            targetType: 'User',
            afterValue: results,
        });

        return results;
    }
}
