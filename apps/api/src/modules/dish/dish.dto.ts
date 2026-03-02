import { IsOptional, IsString, IsNumber, IsPositive, IsEnum, IsArray, IsUUID, Min, Max, IsDateString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Dish Module DTOs ====================

export class CreateDishDto {
    @ApiProperty({ description: '菜品名称' })
    @IsString()
    name: string;

    @ApiProperty({ description: '餐厅ID' })
    @IsUUID()
    canteenId: string;

    @ApiPropertyOptional({ description: '分类ID' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ description: '菜品描述' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: '图片URL' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ description: '价格' })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiPropertyOptional({ description: '库存', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock?: number = 0;

    @ApiPropertyOptional({ description: '标签' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ description: '排序序号', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number = 0;
}

export class UpdateDishDto {
    @ApiPropertyOptional({ description: '菜品名称' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '分类ID' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ description: '菜品描述' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: '图片URL' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ description: '价格' })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @ApiPropertyOptional({ description: '库存' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock?: number;

    @ApiPropertyOptional({ description: '标签' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ description: '是否可用' })
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @ApiPropertyOptional({ description: '排序序号' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number;
}

export class QueryDishesDto {
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

    @ApiPropertyOptional({ description: '分类ID' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ description: '餐厅ID' })
    @IsOptional()
    @IsString()
    canteenId?: string;

    @ApiPropertyOptional({ description: '发布状态' })
    @IsOptional()
    @IsString()
    publishStatus?: string;

    @ApiPropertyOptional({ description: '关键词搜索' })
    @IsOptional()
    @IsString()
    keyword?: string;
}

export class BatchDishIdsDto {
    @ApiProperty({ description: '菜品ID数组' })
    @IsArray()
    @IsUUID('4', { each: true })
    ids: string[];
}

// ==================== Category DTOs ====================

export class CreateCategoryDto {
    @ApiProperty({ description: '分类名称' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: '排序序号', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number = 0;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({ description: '分类名称' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '排序序号' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number;
}
