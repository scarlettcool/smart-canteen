import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { FeedbackType, FeedbackStatus } from '@prisma/client';

@Injectable()
export class NotifyService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    // ============ 公告管理 (Announcement) ============

    /**
     * 获取公告列表
     */
    async findAnnouncements(query: {
        page?: number;
        pageSize?: number;
        isPublished?: boolean;
        type?: string;
        canteenId?: string;
    }) {
        const where: any = { isDeleted: false };

        if (query.isPublished !== undefined) where.isPublished = query.isPublished;
        if (query.type) where.type = query.type;
        if (query.canteenId) where.canteenId = query.canteenId;

        return this.prisma.paginate('announcement', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
        });
    }

    /**
     * 获取公开的公告列表 (用户端)
     */
    async findPublicAnnouncements(canteenId?: string, limit = 10) {
        const now = new Date();
        const where: any = {
            isPublished: true,
            isDeleted: false,
            OR: [
                { expireAt: null },
                { expireAt: { gt: now } },
            ],
        };

        if (canteenId) where.canteenId = canteenId;

        return this.prisma.announcement.findMany({
            where,
            orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
            take: limit,
            select: {
                id: true,
                title: true,
                type: true,
                isTop: true,
                publishedAt: true,
            },
        });
    }

    /**
     * 获取公告详情
     */
    async findAnnouncement(id: string) {
        const announcement = await this.prisma.announcement.findFirst({
            where: { id, isDeleted: false },
        });

        if (!announcement) {
            throw new NotFoundException('Announcement not found');
        }

        return announcement;
    }

    /**
     * 创建公告
     */
    async createAnnouncement(
        data: {
            title: string;
            content: string;
            type?: string;
            canteenId?: string;
            isTop?: boolean;
            expireAt?: string;
        },
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const announcement = await this.prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                type: data.type || 'notice',
                canteenId: data.canteenId,
                isTop: data.isTop || false,
                expireAt: data.expireAt ? new Date(data.expireAt) : null,
                isPublished: false,
                createdBy: operatorId,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.NOTIFY,
            action: AuditAction.CREATE,
            targetType: 'Announcement',
            targetId: announcement.id,
            targetName: announcement.title,
            afterValue: announcement,
        });

        return announcement;
    }

    /**
     * 更新公告
     */
    async updateAnnouncement(
        id: string,
        data: Partial<{
            title: string;
            content: string;
            type: string;
            isTop: boolean;
            expireAt: string;
        }>,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const existing = await this.findAnnouncement(id);

        const updated = await this.prisma.announcement.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                type: data.type,
                isTop: data.isTop,
                expireAt: data.expireAt ? new Date(data.expireAt) : undefined,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.NOTIFY,
            action: AuditAction.UPDATE,
            targetType: 'Announcement',
            targetId: id,
            targetName: updated.title,
            beforeValue: existing,
            afterValue: updated,
        });

        return updated;
    }

    /**
     * 发布公告
     */
    async publishAnnouncement(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const announcement = await this.findAnnouncement(id);

        const updated = await this.prisma.announcement.update({
            where: { id },
            data: {
                isPublished: true,
                publishedAt: new Date(),
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.NOTIFY,
            action: AuditAction.PUBLISH,
            targetType: 'Announcement',
            targetId: id,
            targetName: announcement.title,
            beforeValue: { isPublished: announcement.isPublished },
            afterValue: { isPublished: updated.isPublished },
        });

        return updated;
    }

    /**
     * 下架公告
     */
    async unpublishAnnouncement(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const announcement = await this.findAnnouncement(id);

        const updated = await this.prisma.announcement.update({
            where: { id },
            data: { isPublished: false },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.NOTIFY,
            action: AuditAction.UNPUBLISH,
            targetType: 'Announcement',
            targetId: id,
            targetName: announcement.title,
            beforeValue: { isPublished: announcement.isPublished },
            afterValue: { isPublished: updated.isPublished },
        });

        return updated;
    }

    /**
     * 删除公告
     */
    async deleteAnnouncement(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const announcement = await this.findAnnouncement(id);

        await this.prisma.announcement.update({
            where: { id },
            data: { isDeleted: true },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.NOTIFY,
            action: AuditAction.DELETE,
            targetType: 'Announcement',
            targetId: id,
            targetName: announcement.title,
            beforeValue: announcement,
        });

        return { success: true };
    }

    // ============ 反馈管理 (Feedback) ============

    /**
     * 获取反馈列表
     */
    async findFeedbacks(query: {
        page?: number;
        pageSize?: number;
        status?: string;
        type?: string;
        userId?: string;
    }) {
        const where: any = {};

        if (query.status) where.status = query.status;
        if (query.type) where.type = query.type;
        if (query.userId) where.userId = query.userId;

        return this.prisma.paginate('feedback', {
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
     * 获取反馈详情
     */
    async findFeedback(id: string) {
        const feedback = await this.prisma.feedback.findFirst({
            where: { id },
            include: {
                user: { select: { id: true, name: true, staffId: true, phone: true } },
            },
        });

        if (!feedback) {
            throw new NotFoundException('Feedback not found');
        }

        return feedback;
    }

    /**
     * 提交反馈 (用户)
     */
    async createFeedback(
        data: {
            type: FeedbackType;
            content: string;
            relatedId?: string;
            images?: string[];
        },
        userId: string,
        traceId: string,
    ) {
        const feedback = await this.prisma.feedback.create({
            data: {
                type: data.type,
                content: data.content,
                relatedId: data.relatedId,
                images: data.images,
                userId,
                status: FeedbackStatus.PENDING,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId: userId,
            module: AuditModule.NOTIFY,
            action: AuditAction.CREATE,
            targetType: 'Feedback',
            targetId: feedback.id,
            afterValue: feedback,
        });

        return feedback;
    }

    /**
     * 回复反馈
     */
    async replyFeedback(
        id: string,
        reply: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const feedback = await this.findFeedback(id);

        // 更新反馈状态和回复
        const updated = await this.prisma.feedback.update({
            where: { id },
            data: {
                reply,
                repliedBy: operatorId,
                repliedAt: new Date(),
                status: FeedbackStatus.PROCESSING,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.NOTIFY,
            action: AuditAction.REPLY,
            targetType: 'Feedback',
            targetId: id,
            beforeValue: { reply: feedback.reply, status: feedback.status },
            afterValue: { reply: updated.reply, status: updated.status },
        });

        return updated;
    }

    /**
     * 关闭反馈
     */
    async closeFeedback(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const feedback = await this.findFeedback(id);

        const updated = await this.prisma.feedback.update({
            where: { id },
            data: {
                status: FeedbackStatus.CLOSED,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.NOTIFY,
            action: AuditAction.CLOSE,
            targetType: 'Feedback',
            targetId: id,
            beforeValue: { status: feedback.status },
            afterValue: { status: updated.status },
        });

        return updated;
    }

    /**
     * 获取用户的反馈列表
     */
    async findUserFeedbacks(userId: string) {
        return this.prisma.feedback.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                type: true,
                content: true,
                status: true,
                reply: true,
                createdAt: true,
            },
        });
    }
}
