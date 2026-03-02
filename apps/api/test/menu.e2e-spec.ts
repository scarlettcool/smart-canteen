import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { TransformInterceptor } from '../src/interceptors/transform.interceptor';

describe('MenuController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let authToken: string;
    let canteenId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalInterceptors(new TransformInterceptor());
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);

        // 1. Create text Canteen
        const existingCanteen = await prisma.canteen.findFirst({ where: { name: 'E2E Test Canteen' } });
        if (existingCanteen) {
            canteenId = existingCanteen.id;
        } else {
            const newCanteen = await prisma.canteen.create({
                data: {
                    name: 'E2E Test Canteen',
                    location: 'Test Location',
                    isOpen: true
                }
            });
            canteenId = newCanteen.id;
        }

        // 2. Create/Update Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.adminUser.upsert({
            where: { username: 'admin' },
            update: { password: hashedPassword, status: 'ACTIVE', isDeleted: false },
            create: {
                username: 'admin',
                password: hashedPassword,
                name: 'Admin User',
                status: 'ACTIVE'
            },
        });

        // 3. Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'admin', password: 'admin123' });

        if (loginRes.status !== 200 && loginRes.status !== 201) {
            console.error('Login Failed Response:', JSON.stringify(loginRes.body, null, 2));
            throw new Error(`Login failed with status ${loginRes.status}`);
        }

        authToken = loginRes.body.data?.accessToken;
        if (!authToken) {
            throw new Error('Login succeeded but no token returned');
        }
    });

    afterAll(async () => {
        // Optional: Cleanup
        if (canteenId && prisma) {
            // Be careful with cleanup if tests run in parallel or against shared DB
            // await prisma.canteen.delete({ where: { id: canteenId } }).catch(() => {});
        }
        await app.close();
    });

    describe('GET /menu', () => {
        it('should return paginated menus', async () => {
            const res = await request(app.getHttpServer())
                .get('/menu')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('code', 0);
            expect(res.body.data).toHaveProperty('list');
            expect(res.body.data).toHaveProperty('total');
        });

        it('should filter by canteenId', async () => {
            const res = await request(app.getHttpServer())
                .get(`/menu?canteenId=${canteenId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });
    });

    describe('GET /menu/today/:canteenId', () => {
        it('should return today menu (public endpoint)', async () => {
            const res = await request(app.getHttpServer())
                .get(`/menu/today/${canteenId}`)
                .expect(200);

            expect(res.body.code).toBe(0);
        });
    });

    describe('POST /menu', () => {
        it('should require name, canteenId, and date', async () => {
            const res = await request(app.getHttpServer())
                .post('/menu')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('PUT /menu/:id', () => {
        it('should return 404 for non-existent menu', async () => {
            await request(app.getHttpServer())
                .put('/menu/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Updated Menu' })
                .expect(404);
        });
    });

    describe('POST /menu/:id/dishes', () => {
        it('should require dishIds array', async () => {
            const res = await request(app.getHttpServer())
                .post('/menu/some-id/dishes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /menu/:id/publish', () => {
        it('should return 404 for non-existent menu', async () => {
            await request(app.getHttpServer())
                .post('/menu/non-existent-id/publish')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /menu/:id/copy', () => {
        it('should require targetDate', async () => {
            const res = await request(app.getHttpServer())
                .post('/menu/some-id/copy')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });
    });

    describe('DELETE /menu/:id', () => {
        it('should return 404 for non-existent menu', async () => {
            await request(app.getHttpServer())
                .delete('/menu/non-existent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
