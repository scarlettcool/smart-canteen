import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditModule, AuditAction } from '../../decorators/audit.decorator';

@Injectable()
export class MenuService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * 获取菜单列表
     */
    async findMenus(query: {
        page?: number;
        pageSize?: number;
        canteenId?: string;
        date?: string;
        mealTypeId?: string;
        status?: string;
    }) {
        const where: any = { isDeleted: false };

        if (query.canteenId) where.canteenId = query.canteenId;
        if (query.date) where.menuDate = new Date(query.date);
        if (query.mealTypeId) where.mealTypeId = query.mealTypeId;
        if (query.status) where.status = query.status;

        return this.prisma.paginate('menu', {
            where,
            page: query.page,
            pageSize: query.pageSize,
            orderBy: [{ menuDate: 'desc' }, { mealTypeId: 'asc' }],
            include: {
                canteen: { select: { id: true, name: true } },
                dishes: {
                    include: {
                        menu: false,
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }

    /**
     * 获取菜单详情
     */
    async findMenu(id: string) {
        const menu = await this.prisma.menu.findFirst({
            where: { id, isDeleted: false },
            include: {
                canteen: true,
                dishes: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });

        if (!menu) {
            throw new NotFoundException('Menu not found');
        }

        return menu;
    }

    /**
     * 获取今日菜单 (公开接口)
     */
    async getTodayMenu(canteenId: string, mealTypeId?: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const where: any = {
            canteenId,
            menuDate: today,
            status: 'PUBLISHED',
            isDeleted: false,
        };

        if (mealTypeId) where.mealTypeId = mealTypeId;

        return this.prisma.menu.findMany({
            where,
            include: {
                dishes: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { mealTypeId: 'asc' },
        });
    }

    /**
     * 创建菜单
     */
    async createMenu(
        data: {
            name: string;
            canteenId: string;
            date: string;
            mealType: string;
            dishes?: { dishId: string; sortOrder?: number }[];
        },
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        // Find meal type id by code
        const mealTypeRecord = await this.prisma.mealType.findUnique({
            where: { code: data.mealType },
        });

        if (!mealTypeRecord) {
            throw new BadRequestException(`Invalid meal type: ${data.mealType}`);
        }

        const mealTypeId = mealTypeRecord.id;

        // 检查是否已存在相同日期和餐别的菜单
        const existing = await this.prisma.menu.findFirst({
            where: {
                canteenId: data.canteenId,
                menuDate: new Date(data.date),
                mealTypeId: mealTypeId,
                isDeleted: false,
            },
        });

        if (existing) {
            throw new BadRequestException('Menu already exists for this date and meal type');
        }

        const menu = await this.prisma.menu.create({
            data: {
                name: data.name,
                canteenId: data.canteenId,
                menuDate: new Date(data.date),
                mealTypeId: mealTypeId,
                status: 'DRAFT',
                createdBy: operatorId,
                dishes: data.dishes
                    ? {
                        create: data.dishes.map((d, index) => ({
                            dishId: d.dishId,
                            sortOrder: d.sortOrder ?? index,
                        })),
                    }
                    : undefined,
            },
            include: { dishes: true },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.MENU,
            action: AuditAction.CREATE,
            targetType: 'Menu',
            targetId: menu.id,
            afterValue: menu,
        });

        return menu;
    }

    /**
     * 更新菜单
     */
    async updateMenu(
        id: string,
        data: {
            name?: string;
            mealType?: string;
        },
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const existing = await this.findMenu(id);

        let mealTypeId = undefined;
        if (data.mealType) {
            const mealTypeRecord = await this.prisma.mealType.findUnique({
                where: { code: data.mealType },
            });
            if (!mealTypeRecord) {
                throw new BadRequestException(`Invalid meal type: ${data.mealType}`);
            }
            mealTypeId = mealTypeRecord.id;
        }

        const updated = await this.prisma.menu.update({
            where: { id },
            data: {
                name: data.name,
                mealTypeId: mealTypeId,
                updatedBy: operatorId,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.MENU,
            action: AuditAction.UPDATE,
            targetType: 'Menu',
            targetId: id,
            beforeValue: existing,
            afterValue: updated,
        });

        return updated;
    }

    /**
     * 添加菜品到菜单
     */
    async addDishesToMenu(
        menuId: string,
        dishIds: string[],
        operatorId: string,
        traceId: string,
    ) {
        const menu = await this.findMenu(menuId);

        // 批量添加菜品
        const results = [];
        for (let i = 0; i < dishIds.length; i++) {
            const dishId = dishIds[i];

            // 检查菜品是否已在菜单中
            const existing = await this.prisma.menuDish.findFirst({
                where: { menuId, dishId },
            });

            if (!existing) {
                const menuDish = await this.prisma.menuDish.create({
                    data: {
                        menuId,
                        dishId,
                        sortOrder: i,
                    },
                });
                results.push(menuDish);
            }
        }

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.MENU,
            action: AuditAction.UPDATE,
            targetType: 'Menu',
            targetId: menuId,
            afterValue: { addedDishIds: dishIds },
        });

        return { success: true, added: results.length };
    }

    /**
     * 从菜单移除菜品
     */
    async removeDishFromMenu(
        menuId: string,
        dishId: string,
        operatorId: string,
        traceId: string,
    ) {
        const menuDish = await this.prisma.menuDish.findFirst({
            where: { menuId, dishId },
        });

        if (!menuDish) {
            throw new NotFoundException('Dish not in menu');
        }

        await this.prisma.menuDish.delete({
            where: { id: menuDish.id },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            module: AuditModule.MENU,
            action: AuditAction.UPDATE,
            targetType: 'Menu',
            targetId: menuId,
            afterValue: { removedDishId: dishId },
        });

        return { success: true };
    }

    /**
     * 发布菜单
     */
    async publishMenu(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const menu = await this.findMenu(id);

        if (menu.status === 'PUBLISHED') {
            throw new BadRequestException('Menu already published');
        }

        const updated = await this.prisma.menu.update({
            where: { id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
                publishedBy: operatorId,
            },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.MENU,
            action: AuditAction.PUBLISH,
            targetType: 'Menu',
            targetId: id,
            beforeValue: { status: menu.status },
            afterValue: { status: updated.status },
        });

        return updated;
    }

    /**
     * 下架菜单
     */
    async unpublishMenu(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const menu = await this.findMenu(id);

        if (menu.status !== 'PUBLISHED') {
            throw new BadRequestException('Menu is not published');
        }

        const updated = await this.prisma.menu.update({
            where: { id },
            data: { status: 'UNPUBLISHED' },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.MENU,
            action: AuditAction.UNPUBLISH,
            targetType: 'Menu',
            targetId: id,
            beforeValue: { status: menu.status },
            afterValue: { status: updated.status },
        });

        return updated;
    }

    /**
     * 删除菜单 (软删除)
     */
    async deleteMenu(
        id: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const menu = await this.findMenu(id);

        await this.prisma.menu.update({
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
            module: AuditModule.MENU,
            action: AuditAction.DELETE,
            targetType: 'Menu',
            targetId: id,
            beforeValue: menu,
        });

        return { success: true };
    }

    /**
     * 复制菜单到指定日期
     */
    async copyMenu(
        id: string,
        targetDate: string,
        operatorId: string,
        operatorName: string,
        traceId: string,
    ) {
        const source = await this.findMenu(id);

        // 检查目标日期是否已有菜单
        const existing = await this.prisma.menu.findFirst({
            where: {
                canteenId: source.canteenId,
                menuDate: new Date(targetDate),
                mealTypeId: source.mealTypeId,
                isDeleted: false,
            },
        });

        if (existing) {
            throw new BadRequestException('Target date already has a menu');
        }

        const newMenu = await this.prisma.menu.create({
            data: {
                name: source.name,
                canteenId: source.canteenId,
                menuDate: new Date(targetDate),
                mealTypeId: source.mealTypeId,
                status: 'DRAFT',
                createdBy: operatorId,
                dishes: {
                    create: source.dishes.map((d: any) => ({
                        dishId: d.dishId,
                        sortOrder: d.sortOrder,
                    })),
                },
            },
            include: { dishes: true },
        });

        await this.auditService.log({
            traceId,
            operatorId,
            operatorName,
            module: AuditModule.MENU,
            action: AuditAction.CREATE,
            targetType: 'Menu',
            targetId: newMenu.id,
            afterValue: { copiedFrom: id, targetDate },
        });

        return newMenu;
    }
}
