import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HrService } from './hr.service';
import {
    CreateArchiveDto,
    UpdateArchiveDto,
    QueryArchiveDto,
    ApprovalBatchDto,
    RejectDto,
    AddToBlacklistDto,
    LiftBlacklistDto,
    ImportArchiveDto,
} from './hr.dto';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditAction, AuditModule } from '../../decorators/audit.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('hr')
@ApiBearerAuth('JWT-auth')
@Controller('hr')
export class HrController {
    constructor(private hrService: HrService) { }

    // ==========================================================================
    // Archives (人员档案)
    // ==========================================================================

    @Get('archives')
    @Permissions(Permission.PEOPLE_ARCHIVE_READ)
    @ApiOperation({ summary: 'Get personnel archives list' })
    async getArchives(
        @Query() query: QueryArchiveDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        // Apply data permission based on user's dept
        const deptId = user.roles.includes('SUPER_ADMIN') ? undefined : user.deptId;
        return this.hrService.findArchives(query, deptId);
    }

    @Get('archives/:id')
    @Permissions(Permission.PEOPLE_ARCHIVE_READ)
    @ApiOperation({ summary: 'Get archive by ID' })
    async getArchive(@Param('id') id: string) {
        return this.hrService.findArchiveById(id);
    }

    @Post('archives')
    @Permissions(Permission.PEOPLE_ARCHIVE_WRITE)
    @Audit({ module: AuditModule.HR, action: AuditAction.CREATE, targetType: 'User' })
    @ApiOperation({ summary: 'Create new archive' })
    async createArchive(
        @Body() dto: CreateArchiveDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.createArchive(dto, user.id, traceId || uuidv4());
    }

    @Put('archives/:id')
    @Permissions(Permission.PEOPLE_ARCHIVE_WRITE)
    @Audit({ module: AuditModule.HR, action: AuditAction.UPDATE, targetType: 'User' })
    @ApiOperation({ summary: 'Update archive' })
    async updateArchive(
        @Param('id') id: string,
        @Body() dto: UpdateArchiveDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.updateArchive(id, dto, user.id, traceId || uuidv4());
    }

    @Delete('archives/:id')
    @Permissions(Permission.PEOPLE_ARCHIVE_WRITE)
    @Audit({ module: AuditModule.HR, action: AuditAction.DELETE, targetType: 'User' })
    @ApiOperation({ summary: 'Delete archive (soft delete)' })
    async deleteArchive(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.deleteArchive(id, user.id, traceId || uuidv4());
    }

    @Post('archives/import')
    @Permissions(Permission.PEOPLE_ARCHIVE_IMPORT)
    @Audit({ module: AuditModule.HR, action: AuditAction.IMPORT, targetType: 'User' })
    @ApiOperation({ summary: 'Import archives from Excel' })
    async importArchives(
        @Body() dto: ImportArchiveDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.importArchives(
            dto.data,
            user.id,
            traceId || uuidv4(),
            dto.duplicatePolicy,
        );
    }

    // ==========================================================================
    // Approvals (注册审批)
    // ==========================================================================

    @Get('approvals')
    @Permissions(Permission.PEOPLE_APPROVAL_READ)
    @ApiOperation({ summary: 'Get registration approvals list' })
    async getApprovals(@Query() query: QueryArchiveDto) {
        return this.hrService.findApprovals(query);
    }

    @Post('approvals/:id/pass')
    @Permissions(Permission.PEOPLE_APPROVAL_WRITE)
    @Audit({ module: AuditModule.HR, action: AuditAction.PASS, targetType: 'Registration' })
    @ApiOperation({ summary: 'Approve registration' })
    async passApproval(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.passApproval(id, user.id, user.name, traceId || uuidv4());
    }

    @Post('approvals/:id/reject')
    @Permissions(Permission.PEOPLE_APPROVAL_WRITE)
    @Audit({ module: AuditModule.HR, action: AuditAction.REJECT, targetType: 'Registration' })
    @ApiOperation({ summary: 'Reject registration' })
    async rejectApproval(
        @Param('id') id: string,
        @Body() dto: RejectDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.rejectApproval(
            id,
            dto.rejectReason,
            user.id,
            user.name,
            traceId || uuidv4(),
        );
    }

    @Post('approvals/batch')
    @Permissions(Permission.PEOPLE_APPROVAL_WRITE)
    @Audit({ module: AuditModule.HR, action: 'BATCH_APPROVAL', targetType: 'Registration' })
    @ApiOperation({ summary: 'Batch approve/reject registrations' })
    async batchApproval(
        @Body() dto: ApprovalBatchDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.batchApproval(dto, user.id, user.name, traceId || uuidv4());
    }

    // ==========================================================================
    // Blacklist (黑名单)
    // ==========================================================================

    @Get('blacklist')
    @Permissions(Permission.PEOPLE_BLACKLIST_READ)
    @ApiOperation({ summary: 'Get blacklist records' })
    async getBlacklist(@Query() query: QueryArchiveDto) {
        return this.hrService.findBlacklist(query);
    }

    @Post('blacklist')
    @Permissions(Permission.PEOPLE_BLACKLIST_WRITE)
    @Audit({ module: AuditModule.HR, action: AuditAction.CREATE, targetType: 'BlacklistRecord' })
    @ApiOperation({ summary: 'Add user to blacklist' })
    async addToBlacklist(
        @Body() dto: AddToBlacklistDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.addToBlacklist(dto, user.id, user.name, traceId || uuidv4());
    }

    @Put('blacklist/:id/lift')
    @Permissions(Permission.PEOPLE_BLACKLIST_WRITE)
    @Audit({ module: AuditModule.HR, action: AuditAction.LIFT, targetType: 'BlacklistRecord' })
    @ApiOperation({ summary: 'Lift blacklist restriction' })
    async liftBlacklist(
        @Param('id') id: string,
        @Body() dto: LiftBlacklistDto,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.hrService.liftBlacklist(
            id,
            dto.liftReason,
            user.id,
            user.name,
            traceId || uuidv4(),
        );
    }
}
