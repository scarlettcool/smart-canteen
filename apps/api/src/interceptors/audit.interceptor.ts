import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AUDIT_KEY, AuditMetadata } from '../decorators/audit.decorator';
import { AuditService } from '../common/audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Audit Interceptor
 * 
 * Automatically logs audit records for routes decorated with @Audit()
 * 
 * Records:
 * - Operator info
 * - Action type
 * - Request body (before)
 * - Response data (after)
 * - IP address
 * - User agent
 * - Timestamp
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditInterceptor.name);

    constructor(
        private reflector: Reflector,
        private auditService: AuditService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditMeta = this.reflector.get<AuditMetadata>(
            AUDIT_KEY,
            context.getHandler(),
        );

        // Skip if not audited
        if (!auditMeta) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const traceId = (request.headers['x-trace-id'] as string) || uuidv4();
        const startTime = Date.now();

        // Capture request body for "before" value
        const beforeValue = this.sanitizeBody(request.body);

        return next.handle().pipe(
            tap({
                next: async (data) => {
                    try {
                        await this.auditService.log({
                            traceId,
                            operatorId: user?.id || 'anonymous',
                            operatorName: user?.name || 'Anonymous',
                            module: auditMeta.module,
                            action: auditMeta.action,
                            targetType: auditMeta.targetType,
                            targetId: this.extractTargetId(request, data),
                            targetName: this.extractTargetName(data),
                            beforeValue,
                            afterValue: this.sanitizeBody(data),
                            ip: this.getClientIp(request),
                            userAgent: request.headers['user-agent'],
                            duration: Date.now() - startTime,
                            success: true,
                        });
                    } catch (error) {
                        this.logger.error(`Failed to log audit: ${error.message}`);
                    }
                },
                error: async (error) => {
                    try {
                        await this.auditService.log({
                            traceId,
                            operatorId: user?.id || 'anonymous',
                            operatorName: user?.name || 'Anonymous',
                            module: auditMeta.module,
                            action: auditMeta.action,
                            targetType: auditMeta.targetType,
                            targetId: this.extractTargetId(request, null),
                            beforeValue,
                            afterValue: null,
                            ip: this.getClientIp(request),
                            userAgent: request.headers['user-agent'],
                            duration: Date.now() - startTime,
                            success: false,
                            errorMessage: error.message,
                        });
                    } catch (auditError) {
                        this.logger.error(`Failed to log audit error: ${auditError.message}`);
                    }
                },
            }),
        );
    }

    private extractTargetId(request: any, data: any): string | undefined {
        // Try to get ID from various sources
        return (
            request.params?.id ||
            data?.id ||
            data?.data?.id ||
            undefined
        );
    }

    private extractTargetName(data: any): string | undefined {
        return data?.name || data?.data?.name || undefined;
    }

    private getClientIp(request: any): string {
        return (
            request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            request.headers['x-real-ip'] ||
            request.connection?.remoteAddress ||
            request.ip ||
            'unknown'
        );
    }

    private sanitizeBody(body: any): any {
        if (!body) return null;

        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'secret', 'accessToken', 'refreshToken'];
        const sanitized = { ...body };

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }

        return sanitized;
    }
}
