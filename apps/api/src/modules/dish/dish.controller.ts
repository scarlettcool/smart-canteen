import { Controller, Get, Post, Put, Delete, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DishService } from './dish.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('dish')
@ApiBearerAuth('JWT-auth')
@Controller('dish')
export class DishController {
    constructor(private dishService: DishService) { }

    @Get()
    @Permissions(Permission.DISH_INFO_READ)
    @ApiOperation({ summary: 'Get dish list' })
    async getDishes(@Query() query: any) {
        return this.dishService.findDishes(query);
    }

    @Get('categories')
    @Permissions(Permission.DISH_INFO_READ)
    @ApiOperation({ summary: 'Get dish categories' })
    async getCategories(@Query('canteenId') canteenId?: string) {
        return this.dishService.findCategories(canteenId);
    }

    @Get(':id')
    @Permissions(Permission.DISH_INFO_READ)
    @ApiOperation({ summary: 'Get dish by ID' })
    async getDish(@Param('id') id: string) {
        return this.dishService.findDish(id);
    }

    @Post()
    @Permissions(Permission.DISH_INFO_WRITE)
    @Audit({ module: AuditModule.DISH, action: AuditAction.CREATE, targetType: 'Dish' })
    @ApiOperation({ summary: 'Create dish' })
    async createDish(
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.createDish(dto, user.id, user.name, traceId || uuidv4());
    }

    @Put(':id')
    @Permissions(Permission.DISH_INFO_WRITE)
    @Audit({ module: AuditModule.DISH, action: AuditAction.UPDATE, targetType: 'Dish' })
    @ApiOperation({ summary: 'Update dish' })
    async updateDish(
        @Param('id') id: string,
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.updateDish(id, dto, user.id, user.name, traceId || uuidv4());
    }

    @Delete(':id')
    @Permissions(Permission.DISH_INFO_WRITE)
    @Audit({ module: AuditModule.DISH, action: AuditAction.DELETE, targetType: 'Dish' })
    @ApiOperation({ summary: 'Delete dish' })
    async deleteDish(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.deleteDish(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/publish')
    @Permissions(Permission.DISH_PUBLISH)
    @Audit({ module: AuditModule.DISH, action: AuditAction.PUBLISH, targetType: 'Dish' })
    @ApiOperation({ summary: 'Publish dish' })
    async publishDish(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.publishDish(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/unpublish')
    @Permissions(Permission.DISH_PUBLISH)
    @Audit({ module: AuditModule.DISH, action: AuditAction.UNPUBLISH, targetType: 'Dish' })
    @ApiOperation({ summary: 'Unpublish dish' })
    async unpublishDish(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.unpublishDish(id, user.id, user.name, traceId || uuidv4());
    }

    @Post('batch-publish')
    @Permissions(Permission.DISH_PUBLISH)
    @ApiOperation({ summary: 'Batch publish dishes' })
    async batchPublish(
        @Body() dto: { ids: string[] },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.batchPublish(dto.ids, user.id, user.name, traceId || uuidv4());
    }

    @Post('batch-unpublish')
    @Permissions(Permission.DISH_PUBLISH)
    @ApiOperation({ summary: 'Batch unpublish dishes' })
    async batchUnpublish(
        @Body() dto: { ids: string[] },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.batchUnpublish(dto.ids, user.id, user.name, traceId || uuidv4());
    }

    // ============ 分类管理 ============

    @Post('categories')
    @Permissions(Permission.DISH_INFO_WRITE)
    @Audit({ module: AuditModule.DISH, action: AuditAction.CREATE, targetType: 'DishCategory' })
    @ApiOperation({ summary: 'Create dish category' })
    async createCategory(
        @Body() dto: { name: string; canteenId: string; sortOrder?: number },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.createCategory(dto, user.id, traceId || uuidv4());
    }

    @Put('categories/:id')
    @Permissions(Permission.DISH_INFO_WRITE)
    @Audit({ module: AuditModule.DISH, action: AuditAction.UPDATE, targetType: 'DishCategory' })
    @ApiOperation({ summary: 'Update dish category' })
    async updateCategory(
        @Param('id') id: string,
        @Body() dto: { name?: string; sortOrder?: number },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.updateCategory(id, dto, user.id, traceId || uuidv4());
    }

    @Delete('categories/:id')
    @Permissions(Permission.DISH_INFO_WRITE)
    @Audit({ module: AuditModule.DISH, action: AuditAction.DELETE, targetType: 'DishCategory' })
    @ApiOperation({ summary: 'Delete dish category' })
    async deleteCategory(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.dishService.deleteCategory(id, user.id, traceId || uuidv4());
    }
}
