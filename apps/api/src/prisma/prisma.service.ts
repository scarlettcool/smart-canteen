import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

// Type for model names that exist in Prisma
export type ModelName = Prisma.ModelName;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
            ],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database disconnected');
    }

    /**
     * Get model delegate by name
     */
    private getModelDelegate(modelName: string): any {
        const lowerName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
        return (this as any)[lowerName];
    }

    /**
     * Soft delete extension - adds isDeleted filter to queries
     */
    async softDelete(
        modelName: string,
        where: any,
        deletedBy?: string,
    ): Promise<any> {
        const delegate = this.getModelDelegate(modelName);
        if (!delegate) {
            throw new Error(`Model ${modelName} not found`);
        }
        return delegate.update({
            where,
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy,
            },
        });
    }

    /**
     * Get active records (not soft deleted)
     */
    whereActive<T>(additionalWhere?: T): T & { isDeleted: false } {
        return {
            ...additionalWhere,
            isDeleted: false,
        } as T & { isDeleted: false };
    }

    /**
     * Paginate helper - accepts model name as string
     */
    async paginate<T>(
        modelName: string,
        args: {
            where?: any;
            orderBy?: any;
            page?: number;
            pageSize?: number;
            include?: any;
            select?: any;
        },
    ): Promise<{ list: T[]; total: number; page: number; pageSize: number }> {
        const page = args.page || 1;
        const pageSize = args.pageSize || 20;
        const skip = (page - 1) * pageSize;

        const delegate = this.getModelDelegate(modelName);
        if (!delegate) {
            throw new Error(`Model ${modelName} not found`);
        }

        // Build where clause - only add isDeleted if the model might have it
        const whereClause = args.where || {};

        const findManyArgs: any = {
            where: whereClause,
            orderBy: args.orderBy || { createdAt: 'desc' },
            skip,
            take: pageSize,
        };

        if (args.include) findManyArgs.include = args.include;
        if (args.select) findManyArgs.select = args.select;

        const [list, total] = await Promise.all([
            delegate.findMany(findManyArgs),
            delegate.count({ where: whereClause }),
        ]);

        return { list, total, page, pageSize };
    }

    /**
     * Transaction helper
     */
    async transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.$transaction(fn);
    }
}
