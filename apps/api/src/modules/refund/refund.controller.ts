import { Controller, Get, Post, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RefundService } from './refund.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('refund')
@ApiBearerAuth('JWT-auth')
@Controller('refund')
export class RefundController {
    constructor(private refundService: RefundService) { }

    @Get()
    @Permissions(Permission.CONSUME_REFUND_READ)
    @ApiOperation({ summary: 'Get refund list' })
    async getRefunds(@Query() query: any) {
        return this.refundService.findRefunds(query);
    }

    @Get(':id')
    @Permissions(Permission.CONSUME_REFUND_READ)
    @ApiOperation({ summary: 'Get refund by ID' })
    async getRefund(@Param('id') id: string) {
        return this.refundService.findRefund(id);
    }

    @Post(':id/approve')
    @Permissions(Permission.CONSUME_REFUND_AUDIT)
    @Audit({ module: AuditModule.REFUND, action: AuditAction.APPROVE, targetType: 'Refund' })
    @ApiOperation({ summary: 'Approve refund' })
    async approveRefund(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.refundService.approveRefund(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/reject')
    @Permissions(Permission.CONSUME_REFUND_AUDIT)
    @Audit({ module: AuditModule.REFUND, action: AuditAction.REJECT, targetType: 'Refund' })
    @ApiOperation({ summary: 'Reject refund' })
    async rejectRefund(
        @Param('id') id: string,
        @Body() dto: { rejectReason: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.refundService.rejectRefund(
            id,
            dto.rejectReason,
            user.id,
            user.name,
            traceId || uuidv4(),
        );
    }

    @Post()
    @ApiOperation({ summary: 'Create refund request (User)' })
    async createRefund(
        @Body() dto: { orderId: string; amount: number; reason: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.refundService.createRefund(dto, user.id, traceId || uuidv4());
    }
}
