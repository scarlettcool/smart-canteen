import { Controller, Get, Post, Put, Delete, Query, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';
import { Permissions, Permission } from '../../decorators/permissions.decorator';
import { Audit, AuditModule, AuditAction } from '../../decorators/audit.decorator';
import { Public } from '../../decorators/public.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('device')
@ApiBearerAuth('JWT-auth')
@Controller('device')
export class DeviceController {
    constructor(private deviceService: DeviceService) { }

    @Get()
    @Permissions(Permission.CONSUME_DEVICE_READ)
    @ApiOperation({ summary: 'Get device list' })
    async getDevices(@Query() query: any) {
        return this.deviceService.findDevices(query);
    }

    @Get('statistics')
    @Permissions(Permission.CONSUME_DEVICE_READ)
    @ApiOperation({ summary: 'Get device statistics' })
    async getStatistics(@Query('canteenId') canteenId?: string) {
        return this.deviceService.getStatistics(canteenId);
    }

    @Get(':id')
    @Permissions(Permission.CONSUME_DEVICE_READ)
    @ApiOperation({ summary: 'Get device by ID' })
    async getDevice(@Param('id') id: string) {
        return this.deviceService.findDevice(id);
    }

    @Post()
    @Permissions(Permission.CONSUME_DEVICE_ADMIN)
    @Audit({ module: AuditModule.DEVICE, action: AuditAction.CREATE, targetType: 'Device' })
    @ApiOperation({ summary: 'Create device' })
    async createDevice(
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.deviceService.createDevice(dto, user.id, user.name, traceId || uuidv4());
    }

    @Put(':id')
    @Permissions(Permission.CONSUME_DEVICE_ADMIN)
    @Audit({ module: AuditModule.DEVICE, action: AuditAction.UPDATE, targetType: 'Device' })
    @ApiOperation({ summary: 'Update device' })
    async updateDevice(
        @Param('id') id: string,
        @Body() dto: any,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.deviceService.updateDevice(id, dto, user.id, user.name, traceId || uuidv4());
    }

    @Delete(':id')
    @Permissions(Permission.CONSUME_DEVICE_ADMIN)
    @Audit({ module: AuditModule.DEVICE, action: AuditAction.DELETE, targetType: 'Device' })
    @ApiOperation({ summary: 'Delete device' })
    async deleteDevice(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.deviceService.deleteDevice(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/bind')
    @Permissions(Permission.CONSUME_DEVICE_ADMIN)
    @Audit({ module: AuditModule.DEVICE, action: AuditAction.BIND, targetType: 'Device' })
    @ApiOperation({ summary: 'Bind device to canteen' })
    async bindDevice(
        @Param('id') id: string,
        @Body() dto: { canteenId: string },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.deviceService.bindDevice(id, dto.canteenId, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/unbind')
    @Permissions(Permission.CONSUME_DEVICE_ADMIN)
    @Audit({ module: AuditModule.DEVICE, action: AuditAction.UNBIND, targetType: 'Device' })
    @ApiOperation({ summary: 'Unbind device from canteen' })
    async unbindDevice(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.deviceService.unbindDevice(id, user.id, user.name, traceId || uuidv4());
    }

    @Post(':id/command')
    @Permissions(Permission.CONSUME_DEVICE_ADMIN)
    @ApiOperation({ summary: 'Send command to device' })
    async sendCommand(
        @Param('id') id: string,
        @Body() dto: { command: string; params?: any },
        @CurrentUser() user: CurrentUserPayload,
        @Headers('x-trace-id') traceId?: string,
    ) {
        return this.deviceService.sendCommand(id, dto.command, dto.params, user.id, traceId || uuidv4());
    }

    @Post('heartbeat')
    @Public()
    @ApiOperation({ summary: 'Device heartbeat (Public)' })
    async heartbeat(
        @Body() dto: { serialNumber: string; status: 'ONLINE' | 'OFFLINE' | 'ERROR'; data?: any },
    ) {
        return this.deviceService.updateDeviceStatus(dto.serialNumber, dto.status, dto.data);
    }
}
