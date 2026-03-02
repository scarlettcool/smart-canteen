import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('DeviceController (e2e)', () => {
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

    describe('GET /device', () => {
        it('should return paginated devices', async () => {
            const res = await request(app.getHttpServer())
                .get('/device')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('code', 0);
            expect(res.body.data).toHaveProperty('list');
            expect(res.body.data).toHaveProperty('total');
        });

        it('should filter by status', async () => {
            const res = await request(app.getHttpServer())
                .get('/device?status=ONLINE')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });

        it('should filter by canteenId', async () => {
            const res = await request(app.getHttpServer())
                .get('/device?canteenId=some-canteen-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });
    });

    describe('GET /device/statistics', () => {
        it('should return device statistics', async () => {
            const res = await request(app.getHttpServer())
                .get('/device/statistics')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
            expect(res.body.data).toHaveProperty('totalCount');
            expect(res.body.data).toHaveProperty('onlineCount');
            expect(res.body.data).toHaveProperty('offlineCount');
        });
    });

    describe('POST /device', () => {
        it('should require sn, name, type, and canteenId', async () => {
            const res = await request(app.getHttpServer())
                .post('/device')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('PUT /device/:id', () => {
        it('should return 404 for non-existent device', async () => {
            await request(app.getHttpServer())
                .put('/device/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Updated Device' })
                .expect(404);
        });
    });

    describe('POST /device/:id/bind', () => {
        it('should require canteenId', async () => {
            const res = await request(app.getHttpServer())
                .post('/device/some-id/bind')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /device/:id/unbind', () => {
        it('should return 404 for non-existent device', async () => {
            await request(app.getHttpServer())
                .post('/device/non-existent-id/unbind')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /device/:id/command', () => {
        it('should require command', async () => {
            const res = await request(app.getHttpServer())
                .post('/device/some-id/command')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /device/:id/heartbeat', () => {
        it('should update device status (public endpoint)', async () => {
            const res = await request(app.getHttpServer())
                .post('/device/some-id/heartbeat')
                .send({ status: 'ONLINE', version: '1.0.0' })
                .expect(200);

            // Note: May return 404 if device doesn't exist
        });
    });

    describe('DELETE /device/:id', () => {
        it('should return 404 for non-existent device', async () => {
            await request(app.getHttpServer())
                .delete('/device/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
