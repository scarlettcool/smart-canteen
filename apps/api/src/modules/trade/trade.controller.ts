import { Controller, Get, Post, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TradeService } from './trade.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('trade')
@ApiBearerAuth('JWT-auth')
@Controller('trade')
export class TradeController {
    constructor(private tradeService: TradeService) { }

    @Get('transactions')
    @Permissions(Permission.CONSUME_TRADE_READ)
    @ApiOperation({ summary: 'Get transactions list' })
    async getTransactions(@Query() query: any) {
        return this.tradeService.findTransactions(query);
    }

    @Get('transactions/:id')
    @Permissions(Permission.CONSUME_TRADE_READ)
    @ApiOperation({ summary: 'Get transaction by ID' })
    async getTransaction(@Param('id') id: string) {
        return this.tradeService.findTransaction(id);
    }

    @Post('transactions/:id/correct')
    @Permissions(Permission.CONSUME_TRADE_CORRECT)
    @Audit({ module: AuditModule.TRADE, action: AuditAction.CORRECT, targetType: 'Transaction' })
    @ApiOperation({ summary: 'Correct a transaction' })
    async correctTransaction(
        @Param('id') id: string,
        @Body() dto: { reason: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.tradeService.correctTransaction(
            id,
            dto.reason,
            user.id,
            user.name,
            traceId || uuidv4(),
        );
    }

    @Post('transactions/export')
    @Permissions(Permission.CONSUME_REPORT_EXPORT)
    @Audit({ module: AuditModule.TRADE, action: AuditAction.EXPORT, targetType: 'Transaction' })
    @ApiOperation({ summary: 'Export transactions' })
    async exportTransactions(
        @Body() query: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.tradeService.exportTransactions(query, user.id, traceId || uuidv4());
    }

    @Get('statistics')
    @Permissions(Permission.CONSUME_REPORT_READ)
    @ApiOperation({ summary: 'Get trade statistics' })
    async getStatistics(@Query() query: any) {
        return this.tradeService.getStatistics(query);
    }
}
