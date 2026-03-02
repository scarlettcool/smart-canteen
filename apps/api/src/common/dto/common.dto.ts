import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Common pagination query DTO
 */
export class PaginationDto {
    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    pageSize?: number = 20;
}

/**
 * Common pagination response
 */
export class PaginatedResponse<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * Common date range query DTO
 */
export class DateRangeDto {
    @ApiPropertyOptional({ description: 'Start date (ISO 8601)' })
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date (ISO 8601)' })
    @IsOptional()
    endDate?: string;
}

/**
 * Common ID param DTO
 */
export class IdParamDto {
    @ApiPropertyOptional()
    id: string;
}

/**
 * Common soft delete DTO
 */
export class SoftDeleteDto {
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: string;
}

/**
 * Common idempotent request DTO
 */
export class IdempotentDto {
    @ApiPropertyOptional({ description: 'Unique request ID for idempotency' })
    @IsOptional()
    requestId?: string;
}
