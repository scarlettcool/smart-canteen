import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Core Modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

// Domain Modules
import { HrModule } from './modules/hr/hr.module';
import { OrgModule } from './modules/org/org.module';
import { AccountModule } from './modules/account/account.module';
import { TradeModule } from './modules/trade/trade.module';
import { RefundModule } from './modules/refund/refund.module';
import { AppealModule } from './modules/appeal/appeal.module';
import { DishModule } from './modules/dish/dish.module';
import { MenuModule } from './modules/menu/menu.module';
import { DeviceModule } from './modules/device/device.module';
import { NotifyModule } from './modules/notify/notify.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/user/user.module';

// Common Modules
import { AuditModule } from './common/audit/audit.module';
import { AuditInterceptor } from './interceptors/audit.interceptor';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),

        // Core
        PrismaModule,
        AuthModule,
        AuditModule,

        // Domain Modules
        HrModule,
        OrgModule,
        AccountModule,
        TradeModule,
        RefundModule,
        AppealModule,
        DishModule,
        MenuModule,
        DeviceModule,
        NotifyModule,
        SystemModule,
        UserModule,
    ],
    providers: [
        // Global Guards
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        // Audit Interceptor
        AuditInterceptor,
    ],
})
export class AppModule { }
