import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { dishPublishStateMachine, DishPublishStatus, DishPublishAction } from '../../common/state-machine';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DishService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * 获取菜品列表
     */
    async findDishes(query: {
        page?: number;
        pageSize?: number;
        publishStatus?: string;
        categoryId?: string;
        canteenId?: string;
        keyword?: string;
    }) {
        const where: any = { isDeleted: false };

        if (query.publishStatus) where.publishStatus = query.publishStatus;
        if (query.categoryId) where.categoryId = query.categoryId;
        if (query.canteenId) where.canteenId = query.canteenId;
        if (query.keyword) {
            where.OR = [
                { name: { contains: query.keyword, mode: 'insensitive' } },
                { description: { contains: query.keyword, mode: 'insensitive' } },
            ];
        }

        return this.prisma.paginate('dish', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { id: true, name: true } },
                canteen: { select: { id: true, name: true } },
            },
        });
    }

    /**
     * 获取菜品详情
     */
    async findDish(id: string) {
        const dish = await this.prisma.dish.findFirst({
            where: { id, isDeleted: false },
            include: {
                category: true,
                canteen: true,
            },
        });

        if (!dish) {
            throw new NotFoundException('Dish not found');
        }

        return dish;
    }

    /**
     * 创建菜品
     */
    async createDish(
        data: {
            name: string;
            description?: string;
            price: number;
            categoryId?: string;
            canteenId: string;
            imageUrl?: string;
            stock?: number;
            tags?: string[];
        },
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const dish = await this.prisma.dish.create({
            data: {
                name: data.name,
                description: data.description,
                price: new Decimal(data.price),
                categoryId: data.categoryId,
                canteenId: data.canteenId,
                imageUrl: data.imageUrl,
                stock: data.stock || 0,
                tags: data.tags,
                publishStatus: 'DRAFT',
                createdBy: operatorId,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DISH,
            action: AuditAction.CREATE,
            targetType: 'Dish',
            targetId: dish.id,
            targetName: dish.name,
            afterValue: dish,
        });

        return dish;
    }

    /**
     * 更新菜品
     */
    async updateDish(
        id: string,
        data: Partial<{
            name: string;
            description: string;
            price: number;
            categoryId: string;
            imageUrl: string;
            stock: number;
            tags: string[];
            isAvailable: boolean;
        }>,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const existing = await this.findDish(id);

        const updateData: any = {
            updatedBy: operatorId,
        };
        if (data.name) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = new Decimal(data.price);
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.tags !== undefined) updateData.tags = data.tags;
        if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;

        const updated = await this.prisma.dish.update({
            where: { id },
            data: updateData,
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DISH,
            action: AuditAction.UPDATE,
            targetType: 'Dish',
            targetId: id,
            targetName: updated.name,
            beforeValue: existing,
            afterValue: updated,
        });

        return updated;
    }

    /**
     * 删除菜品 (软删除)
     */
    async deleteDish(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const existing = await this.findDish(id);

        await this.prisma.dish.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DISH,
            action: AuditAction.DELETE,
            targetType: 'Dish',
            targetId: id,
            targetName: existing.name,
            beforeValue: existing,
        });

        return { success: true };
    }

    /**
     * 发布菜品
     */
    async publishDish(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const dish = await this.findDish(id);

        if (!dishPublishStateMachine.canTransition(dish.publishStatus as DishPublishStatus, 'PUBLISH' as DishPublishAction)) {
            throw new BadRequestException(`Cannot publish dish in status: ${dish.publishStatus}`);
        }

        const newStatus = dishPublishStateMachine.getNextState(dish.publishStatus as DishPublishStatus, 'PUBLISH' as DishPublishAction);

        const updated = await this.prisma.dish.update({
            where: { id },
            data: {
                publishStatus: newStatus,
                publishedAt: new Date(),
                publishedBy: operatorId,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DISH,
            action: AuditAction.PUBLISH,
            targetType: 'Dish',
            targetId: id,
            targetName: dish.name,
            beforeValue: { publishStatus: dish.publishStatus },
            afterValue: { publishStatus: updated.publishStatus },
        });

        return updated;
    }

    /**
     * 下架菜品
     */
    async unpublishDish(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const dish = await this.findDish(id);

        if (!dishPublishStateMachine.canTransition(dish.publishStatus as DishPublishStatus, 'UNPUBLISH' as DishPublishAction)) {
            throw new BadRequestException(`Cannot unpublish dish in status: ${dish.publishStatus}`);
        }

        const newStatus = dishPublishStateMachine.getNextState(dish.publishStatus as DishPublishStatus, 'UNPUBLISH' as DishPublishAction);

        const updated = await this.prisma.dish.update({
            where: { id },
            data: {
                publishStatus: newStatus,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.DISH,
            action: AuditAction.UNPUBLISH,
            targetType: 'Dish',
            targetId: id,
            targetName: dish.name,
            beforeValue: { publishStatus: dish.publishStatus },
            afterValue: { publishStatus: updated.publishStatus },
        });

        return updated;
    }

    /**
     * 批量发布
     */
    async batchPublish(
        ids: string[],
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const results = await Promise.allSettled(
            ids.map((id) => this.publishDish(id, operatorId, operatorName, traceId)),
        );

        const succeeded = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        return { succeeded, failed, total: ids.length };
    }

    /**
     * 批量下架
     */
    async batchUnpublish(
        ids: string[],
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const results = await Promise.allSettled(
            ids.map((id) => this.unpublishDish(id, operatorId, operatorName, traceId)),
        );

        const succeeded = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        return { succeeded, failed, total: ids.length };
    }

    // ============ 分类管理 ============

    /**
     * 获取分类列表
     */
    async findCategories(canteenId?: string) {
        const where: any = { isDeleted: false };
        if (canteenId) where.canteenId = canteenId;

        return this.prisma.dishCategory.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
        });
    }

    /**
     * 创建分类
     */
    async createCategory(
        data: { name: string; sortOrder?: number },
        operatorId: string,
        traceId: string,
    ) {
        const category = await this.prisma.dishCategory.create({
            data: {
                name: data.name,
                sortOrder: data.sortOrder || 0,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.DISH,
            action: AuditAction.CREATE,
            targetType: 'DishCategory',
            targetId: category.id,
            targetName: category.name,
            afterValue: category,
        });

        return category;
    }

    /**
     * 更新分类
     */
    async updateCategory(
        id: string,
        data: { name?: string; sortOrder?: number },
        operatorId: string,
        traceId: string,
    ) {
        const existing = await this.prisma.dishCategory.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Category not found');

        const updated = await this.prisma.dishCategory.update({
            where: { id },
            data,
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.DISH,
            action: AuditAction.UPDATE,
            targetType: 'DishCategory',
            targetId: id,
            beforeValue: existing,
            afterValue: updated,
        });

        return updated;
    }

    /**
     * 删除分类
     */
    async deleteCategory(id: string, operatorId: string, traceId: string) {
        const existing = await this.prisma.dishCategory.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Category not found');

        // 检查是否有菜品使用此分类
        const dishCount = await this.prisma.dish.count({
            where: { categoryId: id, isDeleted: false },
        });

        if (dishCount > 0) {
            throw new BadRequestException(`Category has ${dishCount} dishes, cannot delete`);
        }

        await this.prisma.dishCategory.update({
            where: { id },
            data: { isDeleted: true },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.DISH,
            action: AuditAction.DELETE,
            targetType: 'DishCategory',
            targetId: id,
            beforeValue: existing,
        });

        return { success: true };
    }
}
