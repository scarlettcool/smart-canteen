import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrgService } from './org.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';

@ApiTags('org')
@ApiBearerAuth('JWT-auth')
@Controller('org')
export class OrgController {
    constructor(private orgService: OrgService) { }

    @Get('tree')
    @Permissions(Permission.PEOPLE_ORG_READ)
    @ApiOperation({ summary: 'Get organization tree' })
    async getTree() {
        return this.orgService.getTree();
    }

    @Post('departments')
    @Permissions(Permission.PEOPLE_ORG_WRITE)
    @Audit({ module: AuditModule.ORG, action: AuditAction.CREATE, targetType: 'Department' })
    @ApiOperation({ summary: 'Create department' })
    async createDepartment(
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.orgService.createDepartment(dto, user.id);
    }

    @Put('departments/:id')
    @Permissions(Permission.PEOPLE_ORG_WRITE)
    @Audit({ module: AuditModule.ORG, action: AuditAction.UPDATE, targetType: 'Department' })
    @ApiOperation({ summary: 'Update department' })
    async updateDepartment(
        @Param('id') id: string,
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.orgService.updateDepartment(id, dto, user.id);
    }

    @Delete('departments/:id')
    @Permissions(Permission.PEOPLE_ORG_WRITE)
    @Audit({ module: AuditModule.ORG, action: AuditAction.DELETE, targetType: 'Department' })
    @ApiOperation({ summary: 'Delete department' })
    async deleteDepartment(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.orgService.deleteDepartment(id, user.id);
    }

    @Put('move')
    @Permissions(Permission.PEOPLE_ORG_WRITE)
    @Audit({ module: AuditModule.ORG, action: 'MOVE', targetType: 'Department' })
    @ApiOperation({ summary: 'Move department' })
    async moveDepartment(
        @Body() dto: { deptId: string; targetParentId: string },
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.orgService.moveDepartment(dto.deptId, dto.targetParentId, user.id);
    }
}
