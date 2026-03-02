import { Controller, Get, Post, Put, Delete, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto, AddDishesToMenuDto, CopyMenuDto } from './menu.dto';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { Public } from '../../decorators/public.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('menu')
@ApiBearerAuth('JWT-auth')
@Controller('menu')
export class MenuController {
    constructor(private menuService: MenuService) { }

    @Get()
    @Permissions(Permission.DISH_MENU_READ)
    @ApiOperation({ summary: 'Get menu list' })
    async getMenus(@Query() query: any) {
        return this.menuService.findMenus(query);
    }

    @Get('today/:canteenId')
    @Public()
    @ApiOperation({ summary: 'Get today menu for canteen (Public)' })
    async getTodayMenu(
        @Param('canteenId') canteenId: string,
        @Query('mealType') mealType?: string,
    ) {
        return this.menuService.getTodayMenu(canteenId, mealType);
    }

    @Get(':id')
    @Permissions(Permission.DISH_MENU_READ)
    @ApiOperation({ summary: 'Get menu by ID' })
    async getMenu(@Param('id') id: string) {
        return this.menuService.findMenu(id);
    }

    @Post()
    @Permissions(Permission.DISH_MENU_WRITE)
    @Audit({ module: AuditModule.MENU, action: AuditAction.CREATE, targetType: 'Menu' })
    @ApiOperation({ summary: 'Create menu' })
    async createMenu(
        @Body() dto: CreateMenuDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.createMenu(dto, user.id, user.name, traceId || uuidv4());
    }

    @Put(':id')
    @Permissions(Permission.DISH_MENU_WRITE)
    @Audit({ module: AuditModule.MENU, action: AuditAction.UPDATE, targetType: 'Menu' })
    @ApiOperation({ summary: 'Update menu' })
    async updateMenu(
        @Param('id') id: string,
        @Body() dto: UpdateMenuDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.updateMenu(id, dto, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/dishes')
    @Permissions(Permission.DISH_MENU_WRITE)
    @ApiOperation({ summary: 'Add dishes to menu' })
    async addDishes(
        @Param('id') id: string,
        @Body() dto: AddDishesToMenuDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.addDishesToMenu(id, dto.dishIds, user.id, traceId || uuidv4());
    }

    @Delete(':id/dishes/:dishId')
    @Permissions(Permission.DISH_MENU_WRITE)
    @ApiOperation({ summary: 'Remove dish from menu' })
    async removeDish(
        @Param('id') id: string,
        @Param('dishId') dishId: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.removeDishFromMenu(id, dishId, user.id, traceId || uuidv4());
    }

    @Post(':id/publish')
    @Permissions(Permission.DISH_MENU_PUBLISH)
    @Audit({ module: AuditModule.MENU, action: AuditAction.PUBLISH, targetType: 'Menu' })
    @ApiOperation({ summary: 'Publish menu' })
    async publishMenu(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.publishMenu(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/unpublish')
    @Permissions(Permission.DISH_MENU_PUBLISH)
    @Audit({ module: AuditModule.MENU, action: AuditAction.UNPUBLISH, targetType: 'Menu' })
    @ApiOperation({ summary: 'Unpublish menu' })
    async unpublishMenu(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.unpublishMenu(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/copy')
    @Permissions(Permission.DISH_MENU_WRITE)
    @ApiOperation({ summary: 'Copy menu to another date' })
    async copyMenu(
        @Param('id') id: string,
        @Body() dto: CopyMenuDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.copyMenu(id, dto.targetDate, user.id, user.name, traceId || uuidv4());
    }

    @Delete(':id')
    @Permissions(Permission.DISH_MENU_WRITE)
    @Audit({ module: AuditModule.MENU, action: AuditAction.DELETE, targetType: 'Menu' })
    @ApiOperation({ summary: 'Delete menu' })
    async deleteMenu(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.menuService.deleteMenu(id, user.id, user.name, traceId || uuidv4());
    }
}
