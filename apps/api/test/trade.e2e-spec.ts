import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TradeController (e2e)', () => {
    let app: INestApplication;
    let authToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        // Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'admin', password: 'admin123' });
        authToken = loginRes.body.data?.token;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /trade/transactions', () => {
        it('should return paginated transactions', async () => {
            const res = await request(app.getHttpServer())
                .get('/trade/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('code', 0);
            expect(res.body.data).toHaveProperty('list');
            expect(res.body.data).toHaveProperty('total');
            expect(res.body.data).toHaveProperty('page');
            expect(res.body.data).toHaveProperty('pageSize');
        });

        it('should filter by status', async () => {
            const res = await request(app.getHttpServer())
                .get('/trade/transactions?status=COMPLETED')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });

        it('should filter by date range', async () => {
            const res = await request(app.getHttpServer())
                .get('/trade/transactions?startDate=2026-01-01&endDate=2026-12-31')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });
    });

    describe('GET /trade/transactions/:id', () => {
        it('should return 404 for non-existent transaction', async () => {
            const res = await request(app.getHttpServer())
                .get('/trade/transactions/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('GET /trade/statistics', () => {
        it('should return transaction statistics', async () => {
            const res = await request(app.getHttpServer())
                .get('/trade/statistics')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
            expect(res.body.data).toHaveProperty('totalCount');
            expect(res.body.data).toHaveProperty('totalAmount');
        });
    });

    describe('POST /trade/transactions/:id/correct', () => {
        it('should require reason for correction', async () => {
            const res = await request(app.getHttpServer())
                .post('/trade/transactions/some-id/correct')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /trade/export', () => {
        it('should create export job', async () => {
            const res = await request(app.getHttpServer())
                .post('/trade/export')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    startDate: '2026-01-01',
                    endDate: '2026-12-31',
                })
                .expect(201);

            expect(res.body.code).toBe(0);
            expect(res.body.data).toHaveProperty('jobId');
        });
    });
});
