import { IsOptional, IsString, IsNumber, IsPositive, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Account Query DTOs ====================

export class QueryAccountsDto {
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

    @ApiPropertyOptional({ description: '用户状态' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '部门ID' })
    @IsOptional()
    @IsString()
    deptId?: string;

    @ApiPropertyOptional({ description: '关键词搜索' })
    @IsOptional()
    @IsString()
    keyword?: string;
}

// ==================== Top-up DTOs ====================

export class TopUpDto {
    @ApiProperty({ description: '充值金额' })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiPropertyOptional({ description: '备注' })
    @IsOptional()
    @IsString()
    remark?: string;
}

// ==================== Adjustment DTOs ====================

export class AdjustDto {
    @ApiProperty({ description: '调整金额（正数增加，负数扣减）' })
    @IsNumber()
    amount: number;

    @ApiProperty({ description: '调整原因' })
    @IsString()
    reason: string;
}

// ==================== Batch Top-up DTOs ====================

export class BatchTopUpDto {
    @ApiProperty({ description: '用户ID数组' })
    @IsUUID('4', { each: true })
    userIds: string[];

    @ApiProperty({ description: '充值金额' })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiPropertyOptional({ description: '备注' })
    @IsOptional()
    @IsString()
    remark?: string;
}
