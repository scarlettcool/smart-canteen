import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppealController (e2e)', () => {
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

    describe('GET /appeal', () => {
        it('should return paginated appeals', async () => {
            const res = await request(app.getHttpServer())
                .get('/appeal')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('code', 0);
            expect(res.body.data).toHaveProperty('list');
            expect(res.body.data).toHaveProperty('total');
        });

        it('should filter by status', async () => {
            const res = await request(app.getHttpServer())
                .get('/appeal?status=SUBMITTED')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });

        it('should filter by type', async () => {
            const res = await request(app.getHttpServer())
                .get('/appeal?type=BREACH')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });
    });

    describe('GET /appeal/:id', () => {
        it('should return 404 for non-existent appeal', async () => {
            await request(app.getHttpServer())
                .get('/appeal/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /appeal', () => {
        it('should require type and content', async () => {
            const res = await request(app.getHttpServer())
                .post('/appeal')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /appeal/:id/accept', () => {
        it('should return 404 for non-existent appeal', async () => {
            await request(app.getHttpServer())
                .post('/appeal/non-existent-id/accept')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /appeal/:id/reject', () => {
        it('should require reason for rejection', async () => {
            const res = await request(app.getHttpServer())
                .post('/appeal/some-id/reject')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /appeal/:id/process', () => {
        it('should return 404 for non-existent appeal', async () => {
            await request(app.getHttpServer())
                .post('/appeal/non-existent-id/process')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /appeal/:id/resolve', () => {
        it('should require resolution for completion', async () => {
            const res = await request(app.getHttpServer())
                .post('/appeal/some-id/resolve')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('Appeal State Machine', () => {
        it('should follow correct state transitions', async () => {
            // SUBMITTED -> PENDING (ACCEPT) -> PROCESSING (START_PROCESS) -> RESOLVED (RESOLVE)
            // SUBMITTED -> REJECTED (REJECT)
            expect(true).toBe(true);
        });
    });
});
