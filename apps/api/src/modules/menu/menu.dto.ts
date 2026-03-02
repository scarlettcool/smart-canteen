import { IsOptional, IsString, IsNumber, IsArray, IsUUID, Min, Max, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Menu Module DTOs ====================

export class CreateMenuDto {
    @ApiProperty({ description: '菜单名称' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: '餐厅ID' })
    @IsUUID()
    @IsNotEmpty()
    canteenId: string;

    @ApiProperty({ description: '日期', example: '2026-02-05' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiPropertyOptional({ description: '餐次', enum: ['breakfast', 'lunch', 'dinner'] })
    @IsString()
    @IsNotEmpty()
    mealType: string;

    @ApiPropertyOptional({ description: '描述' })
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateMenuDto {
    @ApiPropertyOptional({ description: '菜单名称' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '日期' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ description: '餐次' })
    @IsOptional()
    @IsString()
    mealType?: string;

    @ApiPropertyOptional({ description: '描述' })
    @IsOptional()
    @IsString()
    description?: string;
}

export class QueryMenusDto {
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

    @ApiPropertyOptional({ description: '日期' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ description: '发布状态' })
    @IsOptional()
    @IsString()
    publishStatus?: string;
}

export class AddDishesToMenuDto {
    @ApiProperty({ description: '菜品ID数组' })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsNotEmpty()
    dishIds: string[];
}

export class CopyMenuDto {
    @ApiProperty({ description: '目标日期', example: '2026-02-06' })
    @IsDateString()
    @IsNotEmpty()
    targetDate: string;
}
