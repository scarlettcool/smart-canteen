import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TradeService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * 获取交易列表 (使用WalletLog)
     */
    async findTransactions(query: {
        page?: number;
        pageSize?: number;
        userId?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
        canteenId?: string;
    }) {
        const where: any = {};

        if (query.userId) where.userId = query.userId;
        if (query.type) where.type = query.type;
        if (query.canteenId) where.canteenId = query.canteenId;

        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate) where.createdAt.gte = new Date(query.startDate);
            if (query.endDate) where.createdAt.lte = new Date(query.endDate);
        }

        return this.prisma.paginate('walletLog', {
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
     * 获取交易详情
     */
    async findTransaction(id: string) {
        const walletLog = await this.prisma.walletLog.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, staffId: true, phone: true } },
            },
        });

        if (!walletLog) {
            throw new NotFoundException('Transaction not found');
        }

        return walletLog;
    }

    /**
     * 交易冲正
     */
    async correctTransaction(
        id: string,
        reason: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const walletLog = await this.findTransaction(id);

        // 检查是否已被冲正 (通过检查是否有关联的冲正记录)
        const existingCorrection = await this.prisma.walletLog.findFirst({
            where: {
                relatedOrder: id,
                type: 'CORRECTION',
            },
        });

        if (existingCorrection) {
            throw new BadRequestException('Transaction already corrected');
        }

        const result = await this.prisma.$transaction(async (tx) => {
            // 计算冲正金额 (消费类型要返还，充值类型要扣除)
            const correctionAmount = walletLog.type === 'PAYMENT'
                ? Number(walletLog.amount)
                : -Number(walletLog.amount);

            // 更新用户余额
            const user = await tx.user.update({
                where: { id: walletLog.userId },
                data: { balance: { increment: correctionAmount } },
            });

            // 创建冲正流水
            const correctionLog = await tx.walletLog.create({
                data: {
                    userId: walletLog.userId,
                    type: 'CORRECTION',
                    amount: new Decimal(Math.abs(correctionAmount)),
                    balanceAfter: user.balance,
                    remark: `冲正交易 ${id}: ${reason}`,
                    relatedOrder: id,
                    createdBy: operatorId,
                    deptId: walletLog.deptId,
                    canteenId: walletLog.canteenId,
                    siteId: walletLog.siteId,
                },
            });

            return { original: walletLog, correction: correctionLog };
        });

        // 审计日志
        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.TRADE,
            action: AuditAction.CORRECT,
            targetType: 'WalletLog',
            targetId: id,
            beforeValue: walletLog,
            afterValue: result,
        });

        return result;
    }

    /**
     * 导出交易记录
     */
    async exportTransactions(query: any, operatorId: string, traceId: string) {
        // 创建导出任务
        const job = {
            id: `export-${Date.now()}`,
            type: 'TRANSACTION_EXPORT',
            status: 'PENDING',
            params: query,
            createdAt: new Date(),
        };

        // 审计日志
        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.TRADE,
            action: AuditAction.EXPORT,
            targetType: 'WalletLog',
            afterValue: job,
        });

        return { jobId: job.id, message: '导出任务已创建' };
    }

    /**
     * 获取交易统计
     */
    async getStatistics(query: { startDate?: string; endDate?: string; canteenId?: string }) {
        const where: any = {};

        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate) where.createdAt.gte = new Date(query.startDate);
            if (query.endDate) where.createdAt.lte = new Date(query.endDate);
        }
        if (query.canteenId) where.canteenId = query.canteenId;

        const [totalCount, consumeSum, rechargeSum] = await Promise.all([
            this.prisma.walletLog.count({ where }),
            this.prisma.walletLog.aggregate({
                where: { ...where, type: 'PAYMENT' },
                _sum: { amount: true },
            }),
            this.prisma.walletLog.aggregate({
                where: { ...where, type: 'RECHARGE' },
                _sum: { amount: true },
            }),
        ]);

        return {
            totalCount,
            consumeTotal: consumeSum._sum.amount || 0,
            rechargeTotal: rechargeSum._sum.amount || 0,
        };
    }
}
