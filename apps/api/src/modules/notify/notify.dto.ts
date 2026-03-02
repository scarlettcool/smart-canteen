import { IsOptional, IsString, IsNumber, IsArray, IsUUID, Min, Max, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Notice DTOs ====================

export class CreateNoticeDto {
    @ApiProperty({ description: '公告标题' })
    @IsString()
    title: string;

    @ApiProperty({ description: '公告内容' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: '公告类型', default: 'general' })
    @IsOptional()
    @IsString()
    type?: string = 'general';

    @ApiPropertyOptional({ description: '是否置顶', default: false })
    @IsOptional()
    @IsBoolean()
    isTop?: boolean = false;

    @ApiPropertyOptional({ description: '过期时间' })
    @IsOptional()
    @IsDateString()
    expireAt?: string;

    @ApiPropertyOptional({ description: '餐厅ID（不填则全部可见）' })
    @IsOptional()
    @IsUUID()
    canteenId?: string;
}

export class UpdateNoticeDto {
    @ApiPropertyOptional({ description: '公告标题' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: '公告内容' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ description: '公告类型' })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiPropertyOptional({ description: '是否置顶' })
    @IsOptional()
    @IsBoolean()
    isTop?: boolean;

    @ApiPropertyOptional({ description: '过期时间' })
    @IsOptional()
    @IsDateString()
    expireAt?: string;
}

export class QueryNoticesDto {
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

    @ApiPropertyOptional({ description: '是否已发布' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isPublished?: boolean;
}

// ==================== Feedback DTOs ====================

export class CreateFeedbackDto {
    @ApiProperty({ description: '反馈类型', enum: ['SUGGESTION', 'COMPLAINT', 'APPEAL'] })
    @IsEnum(['SUGGESTION', 'COMPLAINT', 'APPEAL'])
    type: string;

    @ApiProperty({ description: '反馈内容' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: '关联订单/菜品ID' })
    @IsOptional()
    @IsString()
    relatedId?: string;

    @ApiPropertyOptional({ description: '图片URL数组' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}

export class ReplyFeedbackDto {
    @ApiProperty({ description: '回复内容' })
    @IsString()
    reply: string;
}

export class QueryFeedbacksDto {
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

    @ApiPropertyOptional({ description: '状态', enum: ['PENDING', 'PROCESSING', 'RESOLVED', 'CLOSED'] })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '类型' })
    @IsOptional()
    @IsString()
    type?: string;
}
