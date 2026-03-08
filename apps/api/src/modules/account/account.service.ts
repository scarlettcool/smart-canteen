import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AccountService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    async findAccounts(query: any) {
        const where: any = { isDeleted: false };
        if (query.keyword) {
            where.OR = [
                { name: { contains: query.keyword } },
                { staffId: { contains: query.keyword } },
                { phone: { contains: query.keyword } },
            ];
        }
        return this.prisma.paginate('user', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            include: { dept: true },
        });
    }

    async getBalance(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        return { userId, balance: user.balance };
    }

    async topUp(userId: string, amount: number, operatorId: string, traceId: string) {
        if (amount <= 0) throw new BadRequestException('Amount must be positive');

        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } },
            });

            // 创建钱包流水 (使用WalletLog)
            const walletLog = await tx.walletLog.create({
                data: {
                    userId,
                    type: 'RECHARGE',
                    amount: new Decimal(amount),
                    balanceAfter: user.balance,
                    remark: '充值',
                    createdBy: operatorId,
                },
            });

            return { user, walletLog };
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.ACCOUNT,
            action: 'TOPUP',
            targetType: 'User',
            targetId: userId,
            afterValue: result,
        });

        return result;
    }

    async freeze(userId: string, operatorId: string, traceId: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: 'FROZEN',
                frozenAt: new Date(),
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.ACCOUNT,
            action: AuditAction.FREEZE,
            targetType: 'User',
            targetId: userId,
        });

        return user;
    }

    async unfreeze(userId: string, operatorId: string, traceId: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: 'ACTIVE',
                frozenAt: null,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.ACCOUNT,
            action: AuditAction.UNFREEZE,
            targetType: 'User',
            targetId: userId,
        });

        return user;
    }

    async adjustBalance(userId: string, amount: number, reason: string, operatorId: string, traceId: string) {
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } },
            });

            // 创建钱包流水 (使用WalletLog)
            const walletLog = await tx.walletLog.create({
                data: {
                    userId,
                    type: 'CORRECTION',
                    amount: new Decimal(Math.abs(amount)),
                    balanceAfter: user.balance,
                    remark: reason,
                    createdBy: operatorId,
                },
            });

            return { user, walletLog };
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.ACCOUNT,
            action: AuditAction.ADJUST,
            targetType: 'User',
            targetId: userId,
            afterValue: result,
        });

        return result;
    }
}
