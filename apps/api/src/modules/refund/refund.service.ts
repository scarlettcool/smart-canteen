import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { refundStateMachine, RefundStatus, RefundAction } from '../../common/state-machine';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class RefundService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * 获取退款申请列表
     */
    async findRefunds(query: {
        page?: number;
        pageSize?: number;
        status?: string;
        applicantId?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const where: any = {};

        if (query.status) where.status = query.status;
        if (query.applicantId) where.applicantId = query.applicantId;

        if (query.startDate || query.endDate) {
            where.applyTime = {};
            if (query.startDate) where.applyTime.gte = new Date(query.startDate);
            if (query.endDate) where.applyTime.lte = new Date(query.endDate);
        }

        return this.prisma.paginate('refundApplication', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            orderBy: { applyTime: 'desc' },
            include: {
                order: { select: { id: true, orderNo: true, totalAmount: true } },
            },
        });
    }

    /**
     * 获取退款申请详情
     */
    async findRefund(id: string) {
        const refund = await this.prisma.refundApplication.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        user: { select: { id: true, name: true, staffId: true, phone: true } },
                    },
                },
            },
        });

        if (!refund) {
            throw new NotFoundException('Refund application not found');
        }

        return refund;
    }

    /**
     * 批准退款
     */
    async approveRefund(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const refund = await this.findRefund(id);

        // 状态机校验
        if (!refundStateMachine.canTransition(refund.status as RefundStatus, 'APPROVE' as RefundAction)) {
            throw new BadRequestException(`Cannot approve refund in status: ${refund.status}`);
        }

        const newStatus = refundStateMachine.getNextState(refund.status as RefundStatus, 'APPROVE' as RefundAction);

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.refundApplication.update({
                where: { id },
                data: {
                    status: newStatus,
                    auditTime: new Date(),
                    auditorId: operatorId,
                },
            });

            // 获取订单用户
            const order = await tx.order.findUnique({
                where: { id: refund.orderId },
                select: { userId: true },
            });

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            // 更新用户余额
            const user = await tx.user.update({
                where: { id: order.userId },
                data: { balance: { increment: Number(refund.amount) } },
            });

            // 创建退款流水记录
            await tx.walletLog.create({
                data: {
                    userId: order.userId,
                    type: 'REFUND',
                    amount: refund.amount,
                    balanceAfter: user.balance,
                    remark: `订单退款 ${refund.orderId}`,
                    relatedOrder: refund.orderId,
                    createdBy: operatorId,
                    deptId: refund.deptId,
                    canteenId: refund.canteenId,
                    siteId: refund.siteId,
                },
            });

            // 记录状态变更日志
            await tx.refundStateLog.create({
                data: {
                    refundId: id,
                    fromStatus: refund.status,
                    toStatus: newStatus,
                    operatorId,
                    operatorName,
                },
            });

            return updated;
        });

        // 审计日志
        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.REFUND,
            action: AuditAction.APPROVE,
            targetType: 'RefundApplication',
            targetId: id,
            beforeValue: refund,
            afterValue: result,
        });

        return result;
    }

    /**
     * 拒绝退款
     */
    async rejectRefund(
        id: string,
        rejectReason: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const refund = await this.findRefund(id);

        // 状态机校验
        if (!refundStateMachine.canTransition(refund.status as RefundStatus, 'REJECT' as RefundAction)) {
            throw new BadRequestException(`Cannot reject refund in status: ${refund.status}`);
        }

        const newStatus = refundStateMachine.getNextState(refund.status as RefundStatus, 'REJECT' as RefundAction);

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.refundApplication.update({
                where: { id },
                data: {
                    status: newStatus,
                    rejectReason,
                    auditTime: new Date(),
                    auditorId: operatorId,
                },
            });

            // 记录状态变更日志
            await tx.refundStateLog.create({
                data: {
                    refundId: id,
                    fromStatus: refund.status,
                    toStatus: newStatus,
                    operatorId,
                    operatorName,
                    reason: rejectReason,
                },
            });

            return updated;
        });

        // 审计日志
        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.REFUND,
            action: AuditAction.REJECT,
            targetType: 'RefundApplication',
            targetId: id,
            beforeValue: refund,
            afterValue: result,
        });

        return result;
    }

    /**
     * 用户申请退款
     */
    async createRefund(
        data: {
            orderId: string;
            amount: number;
            reason: string;
        },
        applicantId: string,
        traceId: string,
    ) {
        // 验证订单
        const order = await this.prisma.order.findUnique({
            where: { id: data.orderId },
            include: { user: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== applicantId) {
            throw new BadRequestException('Order does not belong to this user');
        }

        if (order.status !== 'PAID' && order.status !== 'COMPLETED') {
            throw new BadRequestException('Only paid orders can be refunded');
        }

        // 检查金额是否合理
        if (data.amount > Number(order.totalAmount)) {
            throw new BadRequestException('Refund amount exceeds order amount');
        }

        // 检查是否已有退款申请
        const existingRefund = await this.prisma.refundApplication.findFirst({
            where: {
                orderId: data.orderId,
                status: { notIn: ['REJECTED'] },
            },
        });

        if (existingRefund) {
            throw new BadRequestException('Refund already exists for this order');
        }

        const refund = await this.prisma.refundApplication.create({
            data: {
                orderId: data.orderId,
                applicantId,
                amount: new Decimal(data.amount),
                reason: data.reason,
                status: 'PENDING',
                deptId: order.deptId,
                canteenId: order.canteenId,
                siteId: order.siteId,
            },
        });

        // 审计日志
        await this.auditService.log({
            traceId,
            operatorId: applicantId,
            module: AuditModule.REFUND,
            action: AuditAction.CREATE,
            targetType: 'RefundApplication',
            targetId: refund.id,
            afterValue: refund,
        });

        return refund;
    }
}
