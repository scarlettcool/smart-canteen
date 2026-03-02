import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuditAction, AuditModule } from '../../decorators/audit.decorator';
import { v4 as uuidv4 } from 'uuid';

export interface JwtPayload {
    sub: string;
    username: string;
    name: string;
    roles: string[];
    permissions: string[];
    deptId?: string;
    canteenId?: string;
    siteId?: string;
    isAdmin: boolean;
}

export interface LoginResult {
    accessToken: string;
    expiresIn: number;
    user: {
        id: string;
        username: string;
        name: string;
        roles: string[];
    };
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private auditService: AuditService,
    ) { }

    /**
     * Admin login
     */
    async loginAdmin(username: string, password: string, ip?: string): Promise<LoginResult> {
        const admin = await this.prisma.adminUser.findFirst({
            where: {
                username,
                isDeleted: false,
                status: 'ACTIVE',
            },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!admin) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid username or password');
        }

        // Extract roles and permissions
        const roles = admin.roles.map((r) => r.role.code);
        const permissions = admin.roles
            .flatMap((r) => r.role.permissions.map((p) => p.permission.code))
            .filter((v, i, a) => a.indexOf(v) === i); // Dedupe

        // Generate JWT
        const payload: JwtPayload = {
            sub: admin.id,
            username: admin.username,
            name: admin.name,
            roles,
            permissions,
            deptId: admin.deptId ?? undefined,
            canteenId: admin.canteenId ?? undefined,
            siteId: admin.siteId ?? undefined,
            isAdmin: true,
        };

        const accessToken = this.jwtService.sign(payload);

        // Update last login
        await this.prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
        });

        // Audit log
        await this.auditService.log({
            traceId: uuidv4(),
            operatorId: admin.id,
            operatorName: admin.name,
            module: AuditModule.AUTH,
            action: AuditAction.LOGIN,
            targetType: 'AdminUser',
            targetId: admin.id,
            ip,
        });

        return {
            accessToken,
            expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
            user: {
                id: admin.id,
                username: admin.username,
                name: admin.name,
                roles,
            },
        };
    }

    /**
     * User (H5) login via phone
     */
    async loginUser(phone: string, staffId?: string): Promise<LoginResult> {
        let user = await this.prisma.user.findFirst({
            where: {
                phone,
                isDeleted: false,
            },
            include: {
                dept: true,
            },
        });

        // Auto-create user if not exists
        if (!user && staffId) {
            user = await this.prisma.user.create({
                data: {
                    phone,
                    staffId,
                    name: `用户${phone.slice(-4)}`,
                    regStatus: 'NONE',
                    status: 'ACTIVE',
                    balance: 0,
                },
                include: {
                    dept: true,
                },
            });
        }

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedException('Account is suspended');
        }

        const payload: JwtPayload = {
            sub: user.id,
            username: user.phone,
            name: user.name,
            roles: ['USER'],
            permissions: [],
            deptId: user.deptId ?? undefined,
            canteenId: user.canteenId ?? undefined,
            siteId: user.siteId ?? undefined,
            isAdmin: false,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            expiresIn: 7 * 24 * 60 * 60,
            user: {
                id: user.id,
                username: user.phone,
                name: user.name,
                roles: ['USER'],
            },
        };
    }

    /**
     * Validate JWT payload
     */
    async validateUser(payload: JwtPayload): Promise<JwtPayload> {
        // Could add additional validation here (e.g., check if user still active)
        return payload;
    }

    /**
     * Hash password
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    /**
     * Refresh token
     */
    async refreshToken(userId: string, isAdmin: boolean): Promise<string> {
        if (isAdmin) {
            const admin = await this.prisma.adminUser.findUnique({
                where: { id: userId },
                include: {
                    roles: {
                        include: {
                            role: {
                                include: {
                                    permissions: {
                                        include: {
                                            permission: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!admin || admin.status !== 'ACTIVE') {
                throw new UnauthorizedException('Invalid token');
            }

            const roles = admin.roles.map((r) => r.role.code);
            const permissions = admin.roles
                .flatMap((r) => r.role.permissions.map((p) => p.permission.code))
                .filter((v, i, a) => a.indexOf(v) === i);

            const payload: JwtPayload = {
                sub: admin.id,
                username: admin.username,
                name: admin.name,
                roles,
                permissions,
                deptId: admin.deptId ?? undefined,
                canteenId: admin.canteenId ?? undefined,
                siteId: admin.siteId ?? undefined,
                isAdmin: true,
            };

            return this.jwtService.sign(payload);
        } else {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user || user.status !== 'ACTIVE') {
                throw new UnauthorizedException('Invalid token');
            }

            const payload: JwtPayload = {
                sub: user.id,
                username: user.phone,
                name: user.name,
                roles: ['USER'],
                permissions: [],
                deptId: user.deptId ?? undefined,
                canteenId: user.canteenId ?? undefined,
                siteId: user.siteId ?? undefined,
                isAdmin: false,
            };

            return this.jwtService.sign(payload);
        }
    }
}
