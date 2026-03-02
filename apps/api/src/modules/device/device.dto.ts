import { IsOptional, IsString, IsNumber, IsEnum, IsUUID, Min, Max, IsIP, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Device Module DTOs ====================

export class CreateDeviceDto {
    @ApiProperty({ description: '设备序列号' })
    @IsString()
    sn: string;

    @ApiProperty({ description: '设备名称' })
    @IsString()
    name: string;

    @ApiProperty({ description: '设备类型', enum: ['POS', 'RECHARGE_KIOSK', 'GATE', 'FACE_TERMINAL'] })
    @IsEnum(['POS', 'RECHARGE_KIOSK', 'GATE', 'FACE_TERMINAL'])
    type: string;

    @ApiProperty({ description: '餐厅ID' })
    @IsUUID()
    canteenId: string;

    @ApiPropertyOptional({ description: 'IP地址' })
    @IsOptional()
    @IsIP()
    ip?: string;
}

export class UpdateDeviceDto {
    @ApiPropertyOptional({ description: '设备名称' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'IP地址' })
    @IsOptional()
    @IsIP()
    ip?: string;
}

export class QueryDevicesDto {
    @ApiPropertyOptional({ description: '页码', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: '每页数量', default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    pageSize?: number = 20;

    @ApiPropertyOptional({ description: '餐厅ID' })
    @IsOptional()
    @IsString()
    canteenId?: string;

    @ApiPropertyOptional({ description: '设备类型' })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiPropertyOptional({ description: '设备状态', enum: ['ONLINE', 'OFFLINE', 'ERROR'] })
    @IsOptional()
    @IsString()
    status?: string;
}

export class BindDeviceDto {
    @ApiProperty({ description: '餐厅ID' })
    @IsUUID()
    canteenId: string;
}

export class SendCommandDto {
    @ApiProperty({ description: '命令名称' })
    @IsString()
    command: string;

    @ApiPropertyOptional({ description: '命令参数' })
    @IsOptional()
    @IsObject()
    params?: Record<string, any>;
}

export class HeartbeatDto {
    @ApiPropertyOptional({ description: '设备状态', enum: ['ONLINE', 'OFFLINE', 'ERROR'] })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '固件版本' })
    @IsOptional()
    @IsString()
    version?: string;
}
