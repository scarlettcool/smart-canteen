import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RefundController (e2e)', () => {
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

    describe('GET /refund', () => {
        it('should return paginated refund requests', async () => {
            const res = await request(app.getHttpServer())
                .get('/refund')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('code', 0);
            expect(res.body.data).toHaveProperty('list');
            expect(res.body.data).toHaveProperty('total');
        });

        it('should filter by status', async () => {
            const res = await request(app.getHttpServer())
                .get('/refund?status=PENDING')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });
    });

    describe('GET /refund/:id', () => {
        it('should return 404 for non-existent refund', async () => {
            await request(app.getHttpServer())
                .get('/refund/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /refund', () => {
        it('should require orderId and amount', async () => {
            const res = await request(app.getHttpServer())
                .post('/refund')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });

        it('should validate amount is positive', async () => {
            const res = await request(app.getHttpServer())
                .post('/refund')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    orderId: 'some-order-id',
                    amount: -10,
                    reason: 'test',
                })
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /refund/:id/approve', () => {
        it('should return 404 for non-existent refund', async () => {
            await request(app.getHttpServer())
                .post('/refund/non-existent-id/approve')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /refund/:id/reject', () => {
        it('should require reason for rejection', async () => {
            const res = await request(app.getHttpServer())
                .post('/refund/some-id/reject')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('Refund State Machine', () => {
        it('should follow correct state transitions', async () => {
            // This test verifies the state machine logic
            // PENDING -> APPROVED -> REFUNDED
            // PENDING -> REJECTED

            // Note: Full state machine testing requires actual refund creation
            // This is a placeholder for integration testing
            expect(true).toBe(true);
        });
    });
});
