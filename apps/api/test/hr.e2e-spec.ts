import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('HR Module (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: string;
    let createdArchiveId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        prisma = app.get(PrismaService);

        // Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({ username: 'admin', password: 'admin123' });
        accessToken = loginRes.body.data.accessToken;
    });

    afterAll(async () => {
        // Cleanup
        if (createdArchiveId) {
            await prisma.user.delete({ where: { id: createdArchiveId } }).catch(() => { });
        }
        await app.close();
    });

    describe('GET /api/v1/hr/archives', () => {
        it('should return 401 without token', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/hr/archives')
                .expect(401);
        });

        it('should return paginated archives', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/hr/archives')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.code).toBe(0);
            expect(response.body.data).toHaveProperty('list');
            expect(response.body.data).toHaveProperty('total');
            expect(response.body.data).toHaveProperty('page');
            expect(response.body.data).toHaveProperty('pageSize');
        });

        it('should filter by keyword', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/hr/archives')
                .query({ keyword: '测试' })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.code).toBe(0);
        });
    });

    describe('POST /api/v1/hr/archives', () => {
        const testArchive = {
            name: `测试员工_${Date.now()}`,
            staffId: `E${Date.now().toString().slice(-8)}`,
            phone: `138${Date.now().toString().slice(-8)}`,
        };

        it('should create a new archive', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/hr/archives')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testArchive)
                .expect(201);

            expect(response.body.code).toBe(0);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.name).toBe(testArchive.name);
            expect(response.body.data.staffId).toBe(testArchive.staffId);

            createdArchiveId = response.body.data.id;
        });

        it('should reject duplicate staffId', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/hr/archives')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testArchive)
                .expect(400);
        });

        it('should validate phone format', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/v1/hr/archives')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: '测试',
                    staffId: 'E99999999',
                    phone: '12345', // Invalid
                })
                .expect(400);

            expect(response.body.message).toContain('phone');
        });
    });

    describe('PUT /api/v1/hr/archives/:id', () => {
        it('should update archive', async () => {
            const response = await request(app.getHttpServer())
                .put(`/api/v1/hr/archives/${createdArchiveId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ name: '更新后的名字' })
                .expect(200);

            expect(response.body.code).toBe(0);
            expect(response.body.data.name).toBe('更新后的名字');
        });

        it('should return 404 for non-existent id', async () => {
            await request(app.getHttpServer())
                .put('/api/v1/hr/archives/non-existent-id')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ name: '测试' })
                .expect(404);
        });
    });

    describe('DELETE /api/v1/hr/archives/:id', () => {
        it('should soft delete archive', async () => {
            const response = await request(app.getHttpServer())
                .delete(`/api/v1/hr/archives/${createdArchiveId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.code).toBe(0);
            expect(response.body.data.success).toBe(true);

            // Verify soft delete
            const deleted = await prisma.user.findUnique({
                where: { id: createdArchiveId },
            });
            expect(deleted?.isDeleted).toBe(true);
        });
    });

    describe('Audit Logs', () => {
        it('should have created audit logs for CRUD operations', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/v1/system/audit-logs')
                .query({ targetId: createdArchiveId })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.code).toBe(0);

            const actions = response.body.data.list.map((log: any) => log.action);
            expect(actions).toContain('CREATE');
            expect(actions).toContain('UPDATE');
            expect(actions).toContain('DELETE');
        });
    });
});
