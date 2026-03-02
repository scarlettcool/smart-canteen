import { Controller, Get, Post, Put, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('account')
@ApiBearerAuth('JWT-auth')
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @Get('')
    @Permissions(Permission.CONSUME_ACCOUNT_READ)
    @ApiOperation({ summary: 'Get accounts list' })
    async getAccounts(@Query() query: any) {
        return this.accountService.findAccounts(query);
    }

    @Get(':userId/balance')
    @Permissions(Permission.CONSUME_ACCOUNT_READ)
    @ApiOperation({ summary: 'Get user balance' })
    async getBalance(@Param('userId') userId: string) {
        return this.accountService.getBalance(userId);
    }

    @Post(':userId/topup')
    @Permissions(Permission.CONSUME_ACCOUNT_WRITE)
    @Audit({ module: AuditModule.ACCOUNT, action: 'TOPUP', targetType: 'User' })
    @ApiOperation({ summary: 'Top up user balance' })
    async topUp(
        @Param('userId') userId: string,
        @Body() dto: { amount: number },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.accountService.topUp(userId, dto.amount, user.id, traceId || uuidv4());
    }

    @Put(':userId/freeze')
    @Permissions(Permission.CONSUME_ACCOUNT_WRITE)
    @Audit({ module: AuditModule.ACCOUNT, action: AuditAction.FREEZE, targetType: 'User' })
    @ApiOperation({ summary: 'Freeze account' })
    async freeze(
        @Param('userId') userId: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.accountService.freeze(userId, user.id, traceId || uuidv4());
    }

    @Put(':userId/unfreeze')
    @Permissions(Permission.CONSUME_ACCOUNT_WRITE)
    @Audit({ module: AuditModule.ACCOUNT, action: AuditAction.UNFREEZE, targetType: 'User' })
    @ApiOperation({ summary: 'Unfreeze account' })
    async unfreeze(
        @Param('userId') userId: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.accountService.unfreeze(userId, user.id, traceId || uuidv4());
    }

    @Post(':userId/adjust')
    @Permissions(Permission.CONSUME_ACCOUNT_WRITE)
    @Audit({ module: AuditModule.ACCOUNT, action: AuditAction.ADJUST, targetType: 'User' })
    @ApiOperation({ summary: 'Adjust user balance' })
    async adjust(
        @Param('userId') userId: string,
        @Body() dto: { amount: number; reason: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.accountService.adjustBalance(userId, dto.amount, dto.reason, user.id, traceId || uuidv4());
    }
}
