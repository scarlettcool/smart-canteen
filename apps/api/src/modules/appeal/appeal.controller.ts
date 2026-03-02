import { Controller, Get, Post, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppealService } from './appeal.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('appeal')
@ApiBearerAuth('JWT-auth')
@Controller('appeal')
export class AppealController {
    constructor(private appealService: AppealService) { }

    @Get()
    @Permissions(Permission.CONSUME_APPEAL_READ)
    @ApiOperation({ summary: 'Get appeal list' })
    async getAppeals(@Query() query: any) {
        return this.appealService.findAppeals(query);
    }

    @Get(':id')
    @Permissions(Permission.CONSUME_APPEAL_READ)
    @ApiOperation({ summary: 'Get appeal by ID' })
    async getAppeal(@Param('id') id: string) {
        return this.appealService.findAppeal(id);
    }

    @Post(':id/accept')
    @Permissions(Permission.CONSUME_APPEAL_HANDLE)
    @Audit({ module: AuditModule.APPEAL, action: AuditAction.ACCEPT, targetType: 'Appeal' })
    @ApiOperation({ summary: 'Accept appeal for processing' })
    async acceptAppeal(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.appealService.acceptAppeal(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/reject')
    @Permissions(Permission.CONSUME_APPEAL_HANDLE)
    @Audit({ module: AuditModule.APPEAL, action: AuditAction.REJECT, targetType: 'Appeal' })
    @ApiOperation({ summary: 'Reject appeal' })
    async rejectAppeal(
        @Param('id') id: string,
        @Body() dto: { reason: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.appealService.rejectAppeal(id, dto.reason, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/process')
    @Permissions(Permission.CONSUME_APPEAL_HANDLE)
    @Audit({ module: AuditModule.APPEAL, action: AuditAction.PROCESS, targetType: 'Appeal' })
    @ApiOperation({ summary: 'Start processing appeal' })
    async startProcessing(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.appealService.startProcessing(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/resolve')
    @Permissions(Permission.CONSUME_APPEAL_HANDLE)
    @Audit({ module: AuditModule.APPEAL, action: AuditAction.RESOLVE, targetType: 'Appeal' })
    @ApiOperation({ summary: 'Resolve appeal' })
    async resolveAppeal(
        @Param('id') id: string,
        @Body() dto: { resolution: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.appealService.resolveAppeal(
            id,
            dto.resolution,
            user.id,
            user.name,
            traceId || uuidv4(),
        );
    }

    @Post()
    @ApiOperation({ summary: 'Submit appeal (User)' })
    async createAppeal(
        @Body() dto: { type: 'BREACH' | 'REFUND' | 'SERVICE' | 'OTHER'; content: string; relatedId?: string; images?: string[] },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.appealService.createAppeal(dto, user.id, traceId || uuidv4());
    }
}
