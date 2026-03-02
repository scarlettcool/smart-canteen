import { IsOptional, IsString, IsNumber, IsPositive, IsEnum, IsArray, IsUUID, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Trade Module DTOs ====================

export class QueryTransactionsDto {
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

    @ApiPropertyOptional({ description: '用户ID' })
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiPropertyOptional({ description: '订单状态', enum: ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'CORRECTED'] })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '开始日期' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: '结束日期' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: '餐厅ID' })
    @IsOptional()
    @IsString()
    canteenId?: string;
}

export class CorrectTransactionDto {
    @ApiProperty({ description: '冲正原因' })
    @IsString()
    reason: string;
}

export class ExportTransactionsDto {
    @ApiPropertyOptional({ description: '开始日期' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: '结束日期' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: '状态筛选' })
    @IsOptional()
    @IsString()
    status?: string;
}

// ==================== Refund Module DTOs ====================

export class CreateRefundDto {
    @ApiProperty({ description: '订单ID' })
    @IsUUID()
    orderId: string;

    @ApiProperty({ description: '退款金额' })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({ description: '退款原因' })
    @IsString()
    reason: string;
}

export class RejectRefundDto {
    @ApiProperty({ description: '驳回原因' })
    @IsString()
    rejectReason: string;
}

export class QueryRefundsDto {
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

    @ApiPropertyOptional({ description: '状态', enum: ['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'] })
    @IsOptional()
    @IsString()
    status?: string;
}

// ==================== Appeal Module DTOs ====================

export class CreateAppealDto {
    @ApiProperty({ description: '申诉类型', enum: ['BREACH', 'REFUND', 'SERVICE', 'OTHER'] })
    @IsEnum(['BREACH', 'REFUND', 'SERVICE', 'OTHER'])
    type: string;

    @ApiProperty({ description: '申诉内容' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: '关联订单/记录ID' })
    @IsOptional()
    @IsString()
    relatedId?: string;

    @ApiPropertyOptional({ description: '图片URL数组' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}

export class RejectAppealDto {
    @ApiProperty({ description: '驳回原因' })
    @IsString()
    reason: string;
}

export class ResolveAppealDto {
    @ApiProperty({ description: '解决方案' })
    @IsString()
    resolution: string;
}

export class QueryAppealsDto {
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

    @ApiPropertyOptional({ description: '状态' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '类型' })
    @IsOptional()
    @IsString()
    type?: string;
}
