import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e) - H5 API', () => {
    let app: INestApplication;
    let userToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        // Note: In real tests, you would create a user and get their token
        // For now, using admin token for testing H5 endpoints
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'admin', password: 'admin123' });
        userToken = loginRes.body.data?.token;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Profile', () => {
        describe('GET /user/profile', () => {
            it('should return user profile', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/profile')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
                expect(res.body.data).toHaveProperty('id');
                expect(res.body.data).toHaveProperty('name');
            });
        });

        describe('PUT /user/profile', () => {
            it('should update user profile', async () => {
                const res = await request(app.getHttpServer())
                    .put('/user/profile')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({
                        phone: '13800000000',
                    })
                    .expect(200);

                expect(res.body.code).toBe(0);
            });
        });
    });

    describe('Balance', () => {
        describe('GET /user/balance', () => {
            it('should return user balance', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/balance')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
                expect(res.body.data).toHaveProperty('balance');
            });
        });
    });

    describe('Transactions', () => {
        describe('GET /user/transactions', () => {
            it('should return paginated transactions', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/transactions')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
                expect(res.body.data).toHaveProperty('list');
                expect(res.body.data).toHaveProperty('total');
            });

            it('should filter by type', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/transactions?type=PAYMENT')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
            });
        });
    });

    describe('Reservations', () => {
        describe('GET /user/reservations', () => {
            it('should return user reservations', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/reservations')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
            });
        });

        describe('POST /user/reservations', () => {
            it('should require canteenId, date, and mealType', async () => {
                const res = await request(app.getHttpServer())
                    .post('/user/reservations')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });
        });

        describe('POST /user/reservations/:id/cancel', () => {
            it('should return 404 for non-existent reservation', async () => {
                await request(app.getHttpServer())
                    .post('/user/reservations/non-existent-id/cancel')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(404);
            });
        });
    });

    describe('Coupons', () => {
        describe('GET /user/coupons', () => {
            it('should return user coupons', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/coupons')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
            });

            it('should filter by status', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/coupons?status=valid')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
            });
        });

        describe('POST /user/coupons/:id/claim', () => {
            it('should return 404 for non-existent template', async () => {
                await request(app.getHttpServer())
                    .post('/user/coupons/non-existent-id/claim')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(404);
            });
        });
    });

    describe('Registration', () => {
        describe('GET /user/reg-status', () => {
            it('should return registration status', async () => {
                const res = await request(app.getHttpServer())
                    .get('/user/reg-status')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
                expect(res.body.data).toHaveProperty('status');
            });
        });

        describe('POST /user/register', () => {
            it('should require name, staffId, and phone', async () => {
                const res = await request(app.getHttpServer())
                    .post('/user/register')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });
        });
    });
});
