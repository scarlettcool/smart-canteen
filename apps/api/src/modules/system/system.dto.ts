import { IsOptional, IsString, IsNumber, IsArray, IsUUID, Min, Max, IsDateString, IsEmail, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Audit Log Query DTOs ====================

export class QueryAuditLogsDto {
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

    @ApiPropertyOptional({ description: '模块' })
    @IsOptional()
    @IsString()
    module?: string;

    @ApiPropertyOptional({ description: '操作类型' })
    @IsOptional()
    @IsString()
    action?: string;

    @ApiPropertyOptional({ description: '操作人ID' })
    @IsOptional()
    @IsString()
    operatorId?: string;

    @ApiPropertyOptional({ description: '开始日期' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: '结束日期' })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}

// ==================== Role DTOs ====================

export class CreateRoleDto {
    @ApiProperty({ description: '角色代码' })
    @IsString()
    code: string;

    @ApiProperty({ description: '角色名称' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: '角色描述' })
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateRoleDto {
    @ApiPropertyOptional({ description: '角色名称' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '角色描述' })
    @IsOptional()
    @IsString()
    description?: string;
}

export class AssignPermissionsDto {
    @ApiProperty({ description: '权限ID数组' })
    @IsArray()
    @IsUUID('4', { each: true })
    permissionIds: string[];
}

// ==================== Admin DTOs ====================

export class CreateAdminDto {
    @ApiProperty({ description: '用户名' })
    @IsString()
    username: string;

    @ApiProperty({ description: '密码' })
    @IsString()
    password: string;

    @ApiProperty({ description: '姓名' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: '手机号' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: '邮箱' })
    @IsOptional()
    @IsEmail()
    email?: string;
}

export class UpdateAdminDto {
    @ApiPropertyOptional({ description: '姓名' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '手机号' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: '邮箱' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: '密码' })
    @IsOptional()
    @IsString()
    password?: string;
}

export class AssignRolesDto {
    @ApiProperty({ description: '角色ID数组' })
    @IsArray()
    @IsUUID('4', { each: true })
    roleIds: string[];
}

// ==================== Config DTOs ====================

export class UpdateConfigDto {
    @ApiProperty({ description: '配置值' })
    value: any;
}

export class QueryConfigsDto {
    @ApiPropertyOptional({ description: '配置分组' })
    @IsOptional()
    @IsString()
    group?: string;
}
