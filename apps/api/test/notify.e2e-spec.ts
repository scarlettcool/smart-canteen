import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('NotifyController (e2e)', () => {
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

    describe('Notices', () => {
        describe('GET /notify/notices', () => {
            it('should return paginated notices', async () => {
                const res = await request(app.getHttpServer())
                    .get('/notify/notices')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(res.body).toHaveProperty('code', 0);
                expect(res.body.data).toHaveProperty('list');
                expect(res.body.data).toHaveProperty('total');
            });
        });

        describe('GET /notify/notices/public', () => {
            it('should return public notices without auth', async () => {
                const res = await request(app.getHttpServer())
                    .get('/notify/notices/public')
                    .expect(200);

                expect(res.body.code).toBe(0);
                expect(Array.isArray(res.body.data)).toBe(true);
            });
        });

        describe('POST /notify/notices', () => {
            it('should require title and content', async () => {
                const res = await request(app.getHttpServer())
                    .post('/notify/notices')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });

            it('should create a notice', async () => {
                const res = await request(app.getHttpServer())
                    .post('/notify/notices')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        title: 'Test Notice',
                        content: 'This is a test notice.',
                    })
                    .expect(201);

                expect(res.body.code).toBe(0);
                expect(res.body.data).toHaveProperty('id');
            });
        });

        describe('POST /notify/notices/:id/publish', () => {
            it('should return 404 for non-existent notice', async () => {
                await request(app.getHttpServer())
                    .post('/notify/notices/non-existent-id/publish')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);
            });
        });

        describe('POST /notify/notices/:id/unpublish', () => {
            it('should return 404 for non-existent notice', async () => {
                await request(app.getHttpServer())
                    .post('/notify/notices/non-existent-id/unpublish')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);
            });
        });

        describe('DELETE /notify/notices/:id', () => {
            it('should return 404 for non-existent notice', async () => {
                await request(app.getHttpServer())
                    .delete('/notify/notices/non-existent-id')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);
            });
        });
    });

    describe('Feedbacks', () => {
        describe('GET /notify/feedbacks', () => {
            it('should return paginated feedbacks', async () => {
                const res = await request(app.getHttpServer())
                    .get('/notify/feedbacks')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(res.body).toHaveProperty('code', 0);
                expect(res.body.data).toHaveProperty('list');
                expect(res.body.data).toHaveProperty('total');
            });

            it('should filter by status', async () => {
                const res = await request(app.getHttpServer())
                    .get('/notify/feedbacks?status=PENDING')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(res.body.code).toBe(0);
            });
        });

        describe('POST /notify/feedbacks', () => {
            it('should require type, title, and content', async () => {
                const res = await request(app.getHttpServer())
                    .post('/notify/feedbacks')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });
        });

        describe('POST /notify/feedbacks/:id/reply', () => {
            it('should require reply content', async () => {
                const res = await request(app.getHttpServer())
                    .post('/notify/feedbacks/some-id/reply')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({})
                    .expect(400);

                expect(res.body).toHaveProperty('message');
            });
        });

        describe('POST /notify/feedbacks/:id/close', () => {
            it('should return 404 for non-existent feedback', async () => {
                await request(app.getHttpServer())
                    .post('/notify/feedbacks/non-existent-id/close')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);
            });
        });
    });
});
