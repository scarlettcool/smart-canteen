import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsArray,
    ValidateNested,
    Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/common.dto';

// ==========================================================================
// Archive DTOs
// ==========================================================================

export class CreateArchiveDto {
    @ApiProperty({ example: '张三' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'E00001' })
    @IsString()
    @IsNotEmpty()
    staffId: string;

    @ApiProperty({ example: '13800138000' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^1\d{10}$/, { message: 'Invalid phone number format' })
    phone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    deptId?: string;

    @ApiPropertyOptional({ example: '1990-01-01' })
    @IsOptional()
    @IsString()
    birthday?: string;

    @ApiPropertyOptional()
    @IsOptional()
    customAttributes?: Record<string, any>;
}

export class UpdateArchiveDto extends PartialType(CreateArchiveDto) { }

export class QueryArchiveDto extends PaginationDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    deptId?: string;

    @ApiPropertyOptional({ enum: ['ACTIVE', 'SUSPENDED', 'FROZEN', 'RESIGNED'] })
    @IsOptional()
    @IsEnum(['ACTIVE', 'SUSPENDED', 'FROZEN', 'RESIGNED'])
    status?: string;

    @ApiPropertyOptional({ enum: ['NONE', 'PENDING', 'APPROVED', 'REJECTED'] })
    @IsOptional()
    @IsEnum(['NONE', 'PENDING', 'APPROVED', 'REJECTED'])
    regStatus?: string;
}

export class ImportArchiveDto {
    @ApiProperty({ type: [CreateArchiveDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateArchiveDto)
    data: CreateArchiveDto[];

    @ApiPropertyOptional({ enum: ['skip', 'overwrite', 'merge'], default: 'skip' })
    @IsOptional()
    @IsEnum(['skip', 'overwrite', 'merge'])
    duplicatePolicy?: 'skip' | 'overwrite' | 'merge';
}

// ==========================================================================
// Approval DTOs
// ==========================================================================

export class RejectDto {
    @ApiProperty({ example: '信息不完整' })
    @IsString()
    @IsNotEmpty()
    rejectReason: string;
}

export class ApprovalBatchDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    ids: string[];

    @ApiProperty({ enum: ['pass', 'reject'] })
    @IsEnum(['pass', 'reject'])
    action: 'pass' | 'reject';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    rejectReason?: string;
}

// ==========================================================================
// Blacklist DTOs
// ==========================================================================

export class AddToBlacklistDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: '多次违规' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ enum: ['TEMPORARY', 'PERMANENT'] })
    @IsEnum(['TEMPORARY', 'PERMANENT'])
    type: 'TEMPORARY' | 'PERMANENT';

    @ApiPropertyOptional({ example: '2024-12-31' })
    @IsOptional()
    @IsString()
    deadline?: string;
}

export class LiftBlacklistDto {
    @ApiProperty({ example: '解除原因说明' })
    @IsString()
    @IsNotEmpty()
    liftReason: string;
}
