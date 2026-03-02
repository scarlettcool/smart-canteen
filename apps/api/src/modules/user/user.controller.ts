import { Controller, Get, Post, Put, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    // ============ 个人信息 ============

    @Get('profile')
    @ApiOperation({ summary: 'Get user profile' })
    async getProfile(@CurrentUser() user: CurrentUserPayload) {
        return this.userService.getProfile(user.id);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.userService.updateProfile(user.id, dto, traceId || uuidv4());
    }

    @Get('balance')
    @ApiOperation({ summary: 'Get user balance' })
    async getBalance(@CurrentUser() user: CurrentUserPayload) {
        return this.userService.getBalance(user.id);
    }

    @Get('reg-status')
    @ApiOperation({ summary: 'Get registration status' })
    async getRegStatus(@CurrentUser() user: CurrentUserPayload) {
        return this.userService.getRegStatus(user.id);
    }

    @Post('register')
    @ApiOperation({ summary: 'Submit registration' })
    async register(
        @Body() dto: any,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.userService.register(dto, traceId || uuidv4());
    }

    // ============ 交易记录 ============

    @Get('transactions')
    @ApiOperation({ summary: 'Get user transactions' })
    async getTransactions(
        @Query() query: { page?: string; pageSize?: string; type?: string },
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.userService.getTransactions(user.id, {
            page: query.page ? parseInt(query.page) : undefined,
            pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
            type: query.type,
        });
    }

    @Get('transactions/:id')
    @ApiOperation({ summary: 'Get transaction detail' })
    async getTransaction(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.userService.getTransaction(user.id, id);
    }

    // ============ 预约 ============

    @Get('reservations')
    @ApiOperation({ summary: 'Get user reservations' })
    async getReservations(@CurrentUser() user: CurrentUserPayload) {
        return this.userService.getReservations(user.id);
    }

    @Get('reservations/:id')
    @ApiOperation({ summary: 'Get reservation detail' })
    async getReservation(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.userService.getReservation(user.id, id);
    }

    @Post('reservations')
    @ApiOperation({ summary: 'Create reservation' })
    async createReservation(
        @Body() dto: { canteenId: string; date: string; mealTypeId: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.userService.createReservation(user.id, dto, traceId || uuidv4());
    }

    @Post('reservations/:id/cancel')
    @ApiOperation({ summary: 'Cancel reservation' })
    async cancelReservation(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.userService.cancelReservation(user.id, id, traceId || uuidv4());
    }

    // ============ 优惠券 ============

    @Get('coupons')
    @ApiOperation({ summary: 'Get user coupons' })
    async getCoupons(
        @Query('status') status?: 'valid' | 'used' | 'expired',
        @CurrentUser() user?: CurrentUserPayload,
    ) {
        return this.userService.getCoupons(user!.id, status);
    }

    @Post('coupons/:id/claim')
    @ApiOperation({ summary: 'Claim coupon' })
    async claimCoupon(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.userService.claimCoupon(user.id, id, traceId || uuidv4());
    }
}
