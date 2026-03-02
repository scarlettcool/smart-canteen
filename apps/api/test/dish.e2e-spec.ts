import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('DishController (e2e)', () => {
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

    describe('GET /dish', () => {
        it('should return paginated dishes', async () => {
            const res = await request(app.getHttpServer())
                .get('/dish')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('code', 0);
            expect(res.body.data).toHaveProperty('list');
            expect(res.body.data).toHaveProperty('total');
        });

        it('should filter by categoryId', async () => {
            const res = await request(app.getHttpServer())
                .get('/dish?categoryId=some-category-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });

        it('should filter by publishStatus', async () => {
            const res = await request(app.getHttpServer())
                .get('/dish?publishStatus=PUBLISHED')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });
    });

    describe('POST /dish', () => {
        it('should require name, canteenId, and price', async () => {
            const res = await request(app.getHttpServer())
                .post('/dish')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });

        it('should validate price is positive', async () => {
            const res = await request(app.getHttpServer())
                .post('/dish')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Test Dish',
                    canteenId: 'some-canteen-id',
                    price: -10,
                })
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('PUT /dish/:id', () => {
        it('should return 404 for non-existent dish', async () => {
            await request(app.getHttpServer())
                .put('/dish/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Updated Dish' })
                .expect(404);
        });
    });

    describe('POST /dish/:id/publish', () => {
        it('should return 404 for non-existent dish', async () => {
            await request(app.getHttpServer())
                .post('/dish/non-existent-id/publish')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /dish/:id/unpublish', () => {
        it('should return 404 for non-existent dish', async () => {
            await request(app.getHttpServer())
                .post('/dish/non-existent-id/unpublish')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('DELETE /dish/:id', () => {
        it('should return 404 for non-existent dish', async () => {
            await request(app.getHttpServer())
                .delete('/dish/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('Dish Categories', () => {
        describe('GET /dish/categories', () => {
            it('should return all categories', async () => {
                const res = await request(app.getHttpServer())
                    .get('/dish/categories')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
                expect(Array.isArray(res.body.data)).toBe(true);
            });
        });

        describe('POST /dish/categories', () => {
            it('should require name', async () => {
                const res = await request(app.getHttpServer())
                    .post('/dish/categories')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });
        });
    });

    describe('Batch Operations', () => {
        describe('POST /dish/batch/publish', () => {
            it('should require ids array', async () => {
                const res = await request(app.getHttpServer())
                    .post('/dish/batch/publish')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });
        });

        describe('POST /dish/batch/delete', () => {
            it('should require ids array', async () => {
                const res = await request(app.getHttpServer())
                    .post('/dish/batch/delete')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });
        });
    });
});
