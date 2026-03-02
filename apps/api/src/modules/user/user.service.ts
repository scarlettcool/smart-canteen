import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * 获取用户个人信息
     */
    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                staffId: true,
                phone: true,
                avatar: true,
                birthday: true,
                dept: { select: { id: true, name: true } },
                balance: true,
                status: true,
                regStatus: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    /**
     * 更新用户信息
     */
    async updateProfile(
        userId: string,
        data: Partial<{
            name: string;
            phone: string;
            avatar: string;
            birthday: string;
        }>,
        traceId: string,
    ) {
        const user = await this.getProfile(userId);

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                phone: data.phone,
                avatar: data.avatar,
                birthday: data.birthday ? new Date(data.birthday) : undefined,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                avatar: true,
                birthday: true,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId: userId,
            module: AuditModule.USER,
            action: AuditAction.UPDATE,
            targetType: 'User',
            targetId: userId,
            beforeValue: user,
            afterValue: updated,
        });

        return updated;
    }

    /**
     * 获取用户余额
     */
    async getBalance(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return { balance: user.balance };
    }

    /**
     * 提交注册申请 (通过Registration模型)
     */
    async register(
        data: {
            name: string;
            staffId: string;
            phone: string;
            deptId?: string;
            idPhoto?: string;
        },
        traceId: string,
    ) {
        // 检查工号是否已存在
        const existingByStaffId = await this.prisma.user.findFirst({
            where: { staffId: data.staffId },
        });

        if (existingByStaffId) {
            throw new BadRequestException('工号已被注册');
        }

        // 检查手机号是否已存在
        const existingByPhone = await this.prisma.user.findFirst({
            where: { phone: data.phone },
        });

        if (existingByPhone) {
            throw new BadRequestException('手机号已被注册');
        }

        // 创建注册申请
        const registration = await this.prisma.registration.create({
            data: {
                name: data.name,
                staffId: data.staffId,
                phone: data.phone,
                deptId: data.deptId,
                idPhoto: data.idPhoto,
                status: 'PENDING',
            },
        });

        await this.auditService.log({
            traceId,
            operatorId: registration.id,
            module: AuditModule.USER,
            action: AuditAction.REGISTER,
            targetType: 'Registration',
            targetId: registration.id,
            afterValue: registration,
        });

        return {
            id: registration.id,
            name: registration.name,
            status: registration.status,
            message: '注册申请已提交，请等待审核',
        };
    }

    /**
     * 获取注册状态
     */
    async getRegStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { regStatus: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 获取最近的注册申请以获取拒绝原因
        const registration = await this.prisma.registration.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: { rejectReason: true },
        });

        return {
            status: user.regStatus,
            rejectReason: registration?.rejectReason,
        };
    }

    /**
     * 获取交易记录 (使用WalletLog)
     */
    async getTransactions(
        userId: string,
        query: { page?: number; pageSize?: number; type?: string },
    ) {
        const where: any = { userId };
        if (query.type) where.type = query.type;

        return this.prisma.paginate('walletLog', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * 获取交易详情
     */
    async getTransaction(userId: string, transactionId: string) {
        const transaction = await this.prisma.walletLog.findFirst({
            where: { id: transactionId, userId },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    /**
     * 获取预约列表
     */
    async getReservations(userId: string) {
        return this.prisma.reservation.findMany({
            where: { userId },
            orderBy: { mealDate: 'desc' },
            include: {
                mealType: { select: { id: true, name: true, code: true } },
            },
        });
    }

    /**
     * 获取预约详情
     */
    async getReservation(userId: string, reservationId: string) {
        const reservation = await this.prisma.reservation.findFirst({
            where: { id: reservationId, userId },
            include: {
                mealType: true,
            },
        });

        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }

        return reservation;
    }

    /**
     * 创建预约
     */
    async createReservation(
        userId: string,
        data: {
            canteenId: string;
            date: string;
            mealTypeId: string;
        },
        traceId: string,
    ) {
        const mealDate = new Date(data.date);

        // 检查是否已有预约
        const existing = await this.prisma.reservation.findFirst({
            where: {
                userId,
                mealDate,
                mealTypeId: data.mealTypeId,
                status: { notIn: ['CANCELLED'] },
            },
        });

        if (existing) {
            throw new BadRequestException('您已预约该餐次');
        }

        const reservation = await this.prisma.reservation.create({
            data: {
                userId,
                canteenId: data.canteenId,
                mealDate,
                mealTypeId: data.mealTypeId,
                status: 'PENDING',
            },
            include: { mealType: true },
        });

        await this.auditService.log({
            traceId,
            operatorId: userId,
            module: AuditModule.USER,
            action: AuditAction.CREATE,
            targetType: 'Reservation',
            targetId: reservation.id,
            afterValue: reservation,
        });

        return reservation;
    }

    /**
     * 取消预约
     */
    async cancelReservation(userId: string, reservationId: string, traceId: string) {
        const reservation = await this.getReservation(userId, reservationId);

        if (reservation.status === 'CANCELLED') {
            throw new BadRequestException('Reservation already cancelled');
        }

        if (reservation.status === 'USED') {
            throw new BadRequestException('Cannot cancel used reservation');
        }

        const updated = await this.prisma.reservation.update({
            where: { id: reservationId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
            },
        });

        await this.auditService.log({
            traceId,
            operatorId: userId,
            module: AuditModule.USER,
            action: AuditAction.CANCEL,
            targetType: 'Reservation',
            targetId: reservationId,
            beforeValue: { status: reservation.status },
            afterValue: { status: updated.status },
        });

        return updated;
    }

    /**
     * 获取优惠券 (使用UserCoupon)
     */
    async getCoupons(userId: string, status?: 'valid' | 'used' | 'expired') {
        const now = new Date();
        const where: any = { userId };

        if (status === 'valid') {
            where.status = 'UNUSED';
            where.expireAt = { gt: now };
        } else if (status === 'used') {
            where.status = 'USED';
        } else if (status === 'expired') {
            where.OR = [{ status: 'EXPIRED' }, { expireAt: { lte: now } }];
        }

        return this.prisma.userCoupon.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                template: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        value: true,
                        minAmount: true,
                    },
                },
            },
        });
    }

    /**
     * 领取优惠券
     */
    async claimCoupon(userId: string, couponTemplateId: string, traceId: string) {
        // 检查模板是否存在且有效
        const template = await this.prisma.couponTemplate.findUnique({
            where: { id: couponTemplateId },
        });

        if (!template) {
            throw new NotFoundException('Coupon template not found');
        }

        if (!template.isActive) {
            throw new BadRequestException('优惠券活动已结束');
        }

        // 检查是否已领取
        const existing = await this.prisma.userCoupon.findFirst({
            where: { userId, templateId: couponTemplateId },
        });

        if (existing) {
            throw new BadRequestException('您已领取过该优惠券');
        }

        // 创建用户优惠券
        const userCoupon = await this.prisma.userCoupon.create({
            data: {
                userId,
                templateId: couponTemplateId,
                expireAt: new Date(Date.now() + template.validDays * 24 * 60 * 60 * 1000),
                status: 'UNUSED',
            },
            include: { template: true },
        });

        await this.auditService.log({
            traceId,
            operatorId: userId,
            module: AuditModule.USER,
            action: AuditAction.CLAIM,
            targetType: 'UserCoupon',
            targetId: userCoupon.id,
            afterValue: userCoupon,
        });

        return userCoupon;
    }
}
