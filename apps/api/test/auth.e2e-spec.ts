import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        prisma = app.get(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/v1/auth/login', () => {
        it('should return 401 for invalid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({ username: 'invalid', password: 'invalid' })
                .expect(401);

            expect(response.body.message).toBe('Invalid username or password');
        });

        it('should return access token for valid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({ username: 'admin', password: 'admin123' })
                .expect(200);

            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user.username).toBe('admin');

            accessToken = response.body.data.accessToken;
        });

        it('should validate password length', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({ username: 'admin', password: '123' })
                .expect(400);

            expect(response.body.message).toContain('password');
        });
    });

    describe('POST /api/v1/auth/refresh', () => {
        it('should return 401 without token', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/refresh')
                .expect(401);
        });

        it('should return new access token', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/auth/refresh')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.data).toHaveProperty('accessToken');
        });
    });
});
