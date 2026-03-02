import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface ErrorResponse {
    code: number;
    message: string;
    traceId: string;
    path: string;
    timestamp: string;
    details?: any;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const traceId = (request.headers['x-trace-id'] as string) || uuidv4();

        let status: number;
        let message: string;
        let details: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const res = exceptionResponse as any;
                message = res.message || exception.message;
                details = res.errors || res.details;
            } else {
                message = exception.message;
            }
        } else if (exception instanceof Error) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';

            // Log full error for debugging
            this.logger.error(
                `[${traceId}] Unhandled error: ${exception.message}`,
                exception.stack,
            );
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Unknown error occurred';
        }

        const errorResponse: ErrorResponse = {
            code: status,
            message,
            traceId,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        if (details) {
            errorResponse.details = details;
        }

        // Log error
        this.logger.warn(
            `[${traceId}] ${request.method} ${request.url} -> ${status} ${message}`,
        );

        response.status(status).json(errorResponse);
    }
}
