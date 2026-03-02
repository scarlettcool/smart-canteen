import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { Request, Response } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Health check endpoint (for Railway)
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/api/health', (_req: Request, res: Response) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Security
    app.use(helmet());
    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);
            // Allow localhost and Vercel domains
            const allowed = process.env.CORS_ORIGIN?.split(',') || [];
            const isAllowed = allowed.includes(origin) ||
                origin.includes('localhost') ||
                origin.endsWith('.vercel.app') ||
                origin.endsWith('.railway.app');
            callback(null, isAllowed);
        },
        credentials: true,
    });

    // API Versioning
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // Global Pipes
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global Filters
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global Interceptors
    app.useGlobalInterceptors(
        new TransformInterceptor(),
        app.get(AuditInterceptor),
    );

    // Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle('智慧食堂 API')
        .setDescription('Smart Canteen Management System API')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('auth', '认证模块')
        .addTag('hr', '人事管理')
        .addTag('org', '组织架构')
        .addTag('account', '账户管理')
        .addTag('trade', '交易管理')
        .addTag('refund', '退款管理')
        .addTag('appeal', '申诉管理')
        .addTag('dish', '菜品管理')
        .addTag('menu', '餐厅菜单')
        .addTag('device', '设备管理')
        .addTag('notify', '通知公告')
        .addTag('system', '系统设置')
        .addTag('user', '用户端')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    const port = process.env.PORT || 3038;
    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}/api`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
