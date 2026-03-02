import { IsOptional, IsString, IsNumber, IsArray, IsUUID, Min, Max, IsDateString, IsEmail, IsEnum, IsMobilePhone } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== User Profile DTOs ====================

export class UpdateProfileDto {
    @ApiPropertyOptional({ description: '姓名' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '手机号' })
    @IsOptional()
    @IsMobilePhone('zh-CN')
    phone?: string;

    @ApiPropertyOptional({ description: '邮箱' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: '头像URL' })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiPropertyOptional({ description: '性别', enum: ['M', 'F'] })
    @IsOptional()
    @IsEnum(['M', 'F'])
    gender?: string;

    @ApiPropertyOptional({ description: '生日' })
    @IsOptional()
    @IsDateString()
    birthday?: string;
}

export class RegisterDto {
    @ApiProperty({ description: '姓名' })
    @IsString()
    name: string;

    @ApiProperty({ description: '工号' })
    @IsString()
    staffId: string;

    @ApiProperty({ description: '手机号' })
    @IsMobilePhone('zh-CN')
    phone: string;

    @ApiPropertyOptional({ description: '部门ID' })
    @IsOptional()
    @IsUUID()
    departmentId?: string;

    @ApiPropertyOptional({ description: '邮箱' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: '性别' })
    @IsOptional()
    @IsEnum(['M', 'F'])
    gender?: string;

    @ApiPropertyOptional({ description: '生日' })
    @IsOptional()
    @IsDateString()
    birthday?: string;

    @ApiPropertyOptional({ description: '身份证号' })
    @IsOptional()
    @IsString()
    idCard?: string;

    @ApiPropertyOptional({ description: '证件照URL' })
    @IsOptional()
    @IsString()
    idPhoto?: string;
}

// ==================== Transaction Query DTOs ====================

export class QueryUserTransactionsDto {
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

    @ApiPropertyOptional({ description: '交易类型', enum: ['RECHARGE', 'PAYMENT', 'REFUND', 'ADJUSTMENT'] })
    @IsOptional()
    @IsString()
    type?: string;
}

// ==================== Reservation DTOs ====================

export class CreateReservationDto {
    @ApiProperty({ description: '餐厅ID' })
    @IsUUID()
    canteenId: string;

    @ApiProperty({ description: '预约日期', example: '2026-02-05' })
    @IsDateString()
    date: string;

    @ApiProperty({ description: '餐次', enum: ['breakfast', 'lunch', 'dinner'] })
    @IsString()
    mealType: string;

    @ApiPropertyOptional({ description: '预订菜品ID数组' })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    dishes?: string[];
}

// ==================== Coupon DTOs ====================

export class QueryCouponsDto {
    @ApiPropertyOptional({ description: '状态', enum: ['valid', 'used', 'expired'] })
    @IsOptional()
    @IsEnum(['valid', 'used', 'expired'])
    status?: string;
}
