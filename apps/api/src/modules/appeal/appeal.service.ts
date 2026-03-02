import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { appealStateMachine, AppealStatus, AppealAction } from '../../common/state-machine';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppealService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * 获取申诉列表
     */
    async findAppeals(query: {
        page?: number;
        pageSize?: number;
        status?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const where: any = {};

        if (query.status) where.status = query.status;
        if (query.userId) where.userId = query.userId;

        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate) where.createdAt.gte = new Date(query.startDate);
            if (query.endDate) where.createdAt.lte = new Date(query.endDate);
        }

        return this.prisma.paginate('appeal', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, staffId: true } },
            },
        });
    }

    /**
     * 获取申诉详情
     */
    async findAppeal(id: string) {
        const appeal = await this.prisma.appeal.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, staffId: true, phone: true } },
                stateTransitions: { orderBy: { createdAt: 'asc' } },
            },
        });

        if (!appeal) {
            throw new NotFoundException('Appeal not found');
        }

        return appeal;
    }

    /**
     * 接受申诉 (进入处理中)
     */
    async acceptAppeal(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const appeal = await this.findAppeal(id);

        // 状态机校验
        if (!appealStateMachine.canTransition(appeal.status as AppealStatus, 'ACCEPT' as AppealAction)) {
            throw new BadRequestException(`Cannot accept appeal in status: ${appeal.status}`);
        }

        const newStatus = appealStateMachine.getNextState(appeal.status as AppealStatus, 'ACCEPT' as AppealAction);

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.appeal.update({
                where: { id },
                data: {
                    status: newStatus,
                    handlerId: operatorId,
                },
            });

            // 记录状态变更
            await tx.appealStateLog.create({
                data: {
                    appealId: id,
                    fromStatus: appeal.status,
                    toStatus: newStatus,
                    operatorId,
                    operatorName,
                },
            });

            return updated;
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.APPEAL,
            action: AuditAction.ACCEPT,
            targetType: 'Appeal',
            targetId: id,
            beforeValue: appeal,
            afterValue: result,
        });

        return result;
    }

    /**
     * 拒绝申诉
     */
    async rejectAppeal(
        id: string,
        reason: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const appeal = await this.findAppeal(id);

        // 状态机校验
        if (!appealStateMachine.canTransition(appeal.status as AppealStatus, 'REJECT' as AppealAction)) {
            throw new BadRequestException(`Cannot reject appeal in status: ${appeal.status}`);
        }

        const newStatus = appealStateMachine.getNextState(appeal.status as AppealStatus, 'REJECT' as AppealAction);

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.appeal.update({
                where: { id },
                data: {
                    status: newStatus,
                    rejectReason: reason,
                    handlerId: operatorId,
                    handledAt: new Date(),
                },
            });

            // 记录状态变更
            await tx.appealStateLog.create({
                data: {
                    appealId: id,
                    fromStatus: appeal.status,
                    toStatus: newStatus,
                    operatorId,
                    operatorName,
                    reason,
                },
            });

            return updated;
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.APPEAL,
            action: AuditAction.REJECT,
            targetType: 'Appeal',
            targetId: id,
            beforeValue: appeal,
            afterValue: result,
        });

        return result;
    }

    /**
     * 开始处理申诉
     */
    async startProcessing(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const appeal = await this.findAppeal(id);

        if (!appealStateMachine.canTransition(appeal.status as AppealStatus, 'START_PROCESS' as AppealAction)) {
            throw new BadRequestException(`Cannot start processing appeal in status: ${appeal.status}`);
        }

        const newStatus = appealStateMachine.getNextState(appeal.status as AppealStatus, 'START_PROCESS' as AppealAction);

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.appeal.update({
                where: { id },
                data: {
                    status: newStatus,
                    handlerId: operatorId,
                },
            });

            // 记录状态变更
            await tx.appealStateLog.create({
                data: {
                    appealId: id,
                    fromStatus: appeal.status,
                    toStatus: newStatus,
                    operatorId,
                    operatorName,
                },
            });

            return updated;
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.APPEAL,
            action: AuditAction.PROCESS,
            targetType: 'Appeal',
            targetId: id,
            beforeValue: appeal,
            afterValue: result,
        });

        return result;
    }

    /**
     * 解决申诉
     */
    async resolveAppeal(
        id: string,
        resolution: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const appeal = await this.findAppeal(id);

        if (!appealStateMachine.canTransition(appeal.status as AppealStatus, 'RESOLVE' as AppealAction)) {
            throw new BadRequestException(`Cannot resolve appeal in status: ${appeal.status}`);
        }

        const newStatus = appealStateMachine.getNextState(appeal.status as AppealStatus, 'RESOLVE' as AppealAction);

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.appeal.update({
                where: { id },
                data: {
                    status: newStatus,
                    resolution,
                    handlerId: operatorId,
                    handledAt: new Date(),
                },
            });

            // 记录状态变更
            await tx.appealStateLog.create({
                data: {
                    appealId: id,
                    fromStatus: appeal.status,
                    toStatus: newStatus,
                    operatorId,
                    operatorName,
                    reason: resolution,
                },
            });

            return updated;
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.APPEAL,
            action: AuditAction.RESOLVE,
            targetType: 'Appeal',
            targetId: id,
            beforeValue: appeal,
            afterValue: result,
        });

        return result;
    }

    /**
     * 用户提交申诉
     */
    async createAppeal(
        data: {
            type: 'BREACH' | 'REFUND' | 'SERVICE' | 'OTHER';
            relatedId?: string;
            content: string;
            images?: string[];
        },
        userId: string,
        traceId: string,
    ) {
        // 获取用户信息用于数据权限
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { deptId: true, canteenId: true, siteId: true },
        });

        // 检查是否已有相同关联的待处理申诉
        if (data.relatedId) {
            const existingAppeal = await this.prisma.appeal.findFirst({
                where: {
                    relatedId: data.relatedId,
                    status: { notIn: ['REJECTED', 'RESOLVED'] },
                },
            });

            if (existingAppeal) {
                throw new BadRequestException('Appeal already exists for this item');
            }
        }

        const appeal = await this.prisma.appeal.create({
            data: {
                userId,
                type: data.type,
                relatedId: data.relatedId,
                content: data.content,
                images: data.images || [],
                status: 'SUBMITTED',
                deptId: user?.deptId,
                canteenId: user?.canteenId,
                siteId: user?.siteId,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId: userId,
            module: AuditModule.APPEAL,
            action: AuditAction.CREATE,
            targetType: 'Appeal',
            targetId: appeal.id,
            afterValue: appeal,
        });

        return appeal;
    }
}
