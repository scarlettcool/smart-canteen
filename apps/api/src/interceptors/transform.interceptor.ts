import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    traceId: string;
}

/**
 * Transform Interceptor
 * 
 * Wraps all successful responses in a standard format:
 * {
 *   code: 0,
 *   message: 'success',
 *   data: { ... },
 *   traceId: 'xxx'
 * }
 */
@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const request = context.switchToHttp().getRequest();
        const traceId = (request.headers['x-trace-id'] as string) || uuidv4();

        // Set trace ID in response headers
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-Trace-Id', traceId);

        return next.handle().pipe(
            map((data) => ({
                code: 0,
                message: 'success',
                data,
                traceId,
            })),
        );
    }
}
