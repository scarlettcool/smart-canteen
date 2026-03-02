import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditLogInput {
    traceId: string;
    operatorId: string;
    operatorName?: string;
    module: string;
    action: string;
    targetType?: string;
    targetId?: string;
    targetName?: string;
    beforeValue?: any;
    afterValue?: any;
    ip?: string;
    userAgent?: string;
    duration?: number;
    success?: boolean;
    errorMessage?: string;
    deptId?: string;
    canteenId?: string;
    siteId?: string;
}

@Injectable()
export class AuditService {
    private readonly logger = new Logger(AuditService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Log an audit record
     */
    async log(input: AuditLogInput): Promise<void> {
        try {
            await this.prisma.auditLog.create({
                data: {
                    traceId: input.traceId,
                    operatorId: input.operatorId,
                    operatorName: input.operatorName,
                    module: input.module,
                    action: input.action,
                    targetType: input.targetType,
                    targetId: input.targetId,
                    targetName: input.targetName,
                    beforeValue: input.beforeValue ? input.beforeValue : undefined,
                    afterValue: input.afterValue ? input.afterValue : undefined,
                    ip: input.ip,
                    userAgent: input.userAgent,
                    deptId: input.deptId,
                    canteenId: input.canteenId,
                    siteId: input.siteId,
                },
            });

            this.logger.debug(
                `Audit: ${input.module}.${input.action} by ${input.operatorName || input.operatorId}`,
            );
        } catch (error) {
            this.logger.error(`Failed to create audit log: ${error.message}`);
            // Don't throw - audit logging should not break the main flow
        }
    }

    /**
     * Query audit logs with pagination
     */
    async findMany(params: {
        page?: number;
        pageSize?: number;
        module?: string;
        action?: string;
        operatorId?: string;
        targetId?: string;
        startDate?: Date;
        endDate?: Date;
        deptId?: string;
        canteenId?: string;
    }) {
        const page = params.page || 1;
        const pageSize = params.pageSize || 20;
        const skip = (page - 1) * pageSize;

        const where: any = {};

        if (params.module) where.module = params.module;
        if (params.action) where.action = params.action;
        if (params.operatorId) where.operatorId = params.operatorId;
        if (params.targetId) where.targetId = params.targetId;
        if (params.deptId) where.deptId = params.deptId;
        if (params.canteenId) where.canteenId = params.canteenId;

        if (params.startDate || params.endDate) {
            where.createdAt = {};
            if (params.startDate) where.createdAt.gte = params.startDate;
            if (params.endDate) where.createdAt.lte = params.endDate;
        }

        const [list, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            this.prisma.auditLog.count({ where }),
        ]);

        return { list, total, page, pageSize };
    }

    /**
     * Get audit log by ID
     */
    async findById(id: string) {
        return this.prisma.auditLog.findUnique({
            where: { id },
        });
    }

    /**
     * Get audit logs for a specific target
     */
    async findByTarget(targetType: string, targetId: string) {
        return this.prisma.auditLog.findMany({
            where: { targetType, targetId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
