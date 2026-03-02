import { Controller, Get, Post, Put, Delete, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotifyService } from './notify.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { Public } from '../../decorators/public.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('notify')
@ApiBearerAuth('JWT-auth')
@Controller('notify')
export class NotifyController {
    constructor(private notifyService: NotifyService) { }

    // ============ 公告 (Announcement) ============

    @Get('announcements')
    @Permissions(Permission.DISH_NOTICE_READ)
    @ApiOperation({ summary: 'Get announcement list (Admin)' })
    async getAnnouncements(@Query() query: any) {
        return this.notifyService.findAnnouncements(query);
    }

    @Get('announcements/public')
    @Public()
    @ApiOperation({ summary: 'Get public announcements (User)' })
    async getPublicAnnouncements(
        @Query('canteenId') canteenId?: string,
        @Query('limit') limit?: string,
    ) {
        return this.notifyService.findPublicAnnouncements(canteenId, limit ? parseInt(limit) : 10);
    }

    @Get('announcements/:id')
    @Public()
    @ApiOperation({ summary: 'Get announcement detail' })
    async getAnnouncement(@Param('id') id: string) {
        return this.notifyService.findAnnouncement(id);
    }

    @Post('announcements')
    @Permissions(Permission.DISH_NOTICE_WRITE)
    @Audit({ module: AuditModule.NOTIFY, action: AuditAction.CREATE, targetType: 'Announcement' })
    @ApiOperation({ summary: 'Create announcement' })
    async createAnnouncement(
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.createAnnouncement(dto, user.id, user.name, traceId || uuidv4());
    }

    @Put('announcements/:id')
    @Permissions(Permission.DISH_NOTICE_WRITE)
    @Audit({ module: AuditModule.NOTIFY, action: AuditAction.UPDATE, targetType: 'Announcement' })
    @ApiOperation({ summary: 'Update announcement' })
    async updateAnnouncement(
        @Param('id') id: string,
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.updateAnnouncement(id, dto, user.id, user.name, traceId || uuidv4());
    }

    @Post('announcements/:id/publish')
    @Permissions(Permission.DISH_NOTICE_PUBLISH)
    @Audit({ module: AuditModule.NOTIFY, action: AuditAction.PUBLISH, targetType: 'Announcement' })
    @ApiOperation({ summary: 'Publish announcement' })
    async publishAnnouncement(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.publishAnnouncement(id, user.id, user.name, traceId || uuidv4());
    }

    @Post('announcements/:id/unpublish')
    @Permissions(Permission.DISH_NOTICE_PUBLISH)
    @Audit({ module: AuditModule.NOTIFY, action: AuditAction.UNPUBLISH, targetType: 'Announcement' })
    @ApiOperation({ summary: 'Unpublish announcement' })
    async unpublishAnnouncement(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.unpublishAnnouncement(id, user.id, user.name, traceId || uuidv4());
    }

    @Delete('announcements/:id')
    @Permissions(Permission.DISH_NOTICE_WRITE)
    @Audit({ module: AuditModule.NOTIFY, action: AuditAction.DELETE, targetType: 'Announcement' })
    @ApiOperation({ summary: 'Delete announcement' })
    async deleteAnnouncement(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.deleteAnnouncement(id, user.id, user.name, traceId || uuidv4());
    }

    // ============ 反馈 (Feedback) ============

    @Get('feedbacks')
    @Permissions(Permission.DISH_FEEDBACK_READ)
    @ApiOperation({ summary: 'Get feedback list (Admin)' })
    async getFeedbacks(@Query() query: any) {
        return this.notifyService.findFeedbacks(query);
    }

    @Get('feedbacks/my')
    @ApiOperation({ summary: 'Get my feedbacks (User)' })
    async getMyFeedbacks(@CurrentUser() user: CurrentUserPayload) {
        return this.notifyService.findUserFeedbacks(user.id);
    }

    @Get('feedbacks/:id')
    @ApiOperation({ summary: 'Get feedback detail' })
    async getFeedback(@Param('id') id: string) {
        return this.notifyService.findFeedback(id);
    }

    @Post('feedbacks')
    @ApiOperation({ summary: 'Submit feedback (User)' })
    async createFeedback(
        @Body() dto: { type: 'SUGGESTION' | 'COMPLAINT' | 'APPEAL'; content: string; relatedId?: string; images?: string[] },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.createFeedback(dto, user.id, traceId || uuidv4());
    }

    @Post('feedbacks/:id/reply')
    @Permissions(Permission.DISH_FEEDBACK_HANDLE)
    @Audit({ module: AuditModule.NOTIFY, action: AuditAction.REPLY, targetType: 'Feedback' })
    @ApiOperation({ summary: 'Reply to feedback' })
    async replyFeedback(
        @Param('id') id: string,
        @Body() dto: { reply: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.replyFeedback(id, dto.reply, user.id, user.name, traceId || uuidv4());
    }

    @Post('feedbacks/:id/close')
    @Permissions(Permission.DISH_FEEDBACK_HANDLE)
    @Audit({ module: AuditModule.NOTIFY, action: AuditAction.CLOSE, targetType: 'Feedback' })
    @ApiOperation({ summary: 'Close feedback' })
    async closeFeedback(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.notifyService.closeFeedback(id, user.id, user.name, traceId || uuidv4());
    }
}
