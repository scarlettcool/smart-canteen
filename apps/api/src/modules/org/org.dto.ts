import { IsOptional, IsString, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Organization DTOs ====================

export class CreateDepartmentDto {
    @ApiProperty({ description: '部门名称' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: '父部门ID' })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({ description: '部门负责人ID' })
    @IsOptional()
    @IsString()
    managerId?: string;

    @ApiPropertyOptional({ description: '餐厅ID' })
    @IsOptional()
    @IsUUID()
    canteenId?: string;

    @ApiPropertyOptional({ description: '站点ID' })
    @IsOptional()
    @IsString()
    siteId?: string;

    @ApiPropertyOptional({ description: '排序序号', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number = 0;
}

export class UpdateDepartmentDto {
    @ApiPropertyOptional({ description: '部门名称' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '部门负责人ID' })
    @IsOptional()
    @IsString()
    managerId?: string;

    @ApiPropertyOptional({ description: '餐厅ID' })
    @IsOptional()
    @IsUUID()
    canteenId?: string;

    @ApiPropertyOptional({ description: '站点ID' })
    @IsOptional()
    @IsString()
    siteId?: string;

    @ApiPropertyOptional({ description: '排序序号' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number;
}

export class MoveDepartmentDto {
    @ApiProperty({ description: '部门ID' })
    @IsUUID()
    deptId: string;

    @ApiProperty({ description: '目标父部门ID' })
    @IsUUID()
    targetParentId: string;
}
