# 智慧食堂 - 后端 API

> NestJS + Prisma + PostgreSQL

## 快速开始

### 1. 安装依赖

```bash
cd apps/api
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 配置数据库连接等
```

### 3. 数据库设置

```bash
# 生成 Prisma Client
npm run prisma:generate

# 执行迁移
npm run prisma:migrate:dev

# 初始化种子数据
npx ts-node prisma/seed.ts
```

### 4. 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

### 5. 访问 API

- API Base: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/api/docs`

---

## 目录结构

```
apps/api/
├── src/
│   ├── common/                    # 公共模块
│   │   ├── audit/                 # 审计日志服务
│   │   ├── dto/                   # 公共 DTO
│   │   └── state-machine/         # 状态机
│   ├── config/                    # 配置
│   ├── decorators/                # 自定义装饰器
│   │   ├── audit.decorator.ts     # @Audit()
│   │   ├── current-user.decorator.ts # @CurrentUser()
│   │   ├── permissions.decorator.ts  # @Permissions()
│   │   ├── public.decorator.ts    # @Public()
│   │   └── roles.decorator.ts     # @Roles()
│   ├── filters/                   # 异常过滤器
│   │   └── http-exception.filter.ts
│   ├── guards/                    # 守卫
│   │   ├── jwt-auth.guard.ts      # JWT 认证
│   │   └── roles.guard.ts         # RBAC 权限
│   ├── interceptors/              # 拦截器
│   │   ├── audit.interceptor.ts   # 审计日志拦截
│   │   └── transform.interceptor.ts # 响应格式化
│   ├── modules/                   # 业务模块
│   │   ├── auth/                  # 认证模块
│   │   ├── hr/                    # 人事管理
│   │   ├── org/                   # 组织架构
│   │   ├── account/               # 账户管理
│   │   ├── trade/                 # 交易管理
│   │   ├── refund/                # 退款管理
│   │   ├── appeal/                # 申诉管理
│   │   ├── dish/                  # 菜品管理
│   │   ├── menu/                  # 餐厅菜单
│   │   ├── device/                # 设备管理
│   │   ├── notify/                # 通知公告
│   │   ├── system/                # 系统设置
│   │   └── user/                  # 用户端 API
│   ├── prisma/                    # Prisma 服务
│   ├── app.module.ts              # 主模块
│   └── main.ts                    # 入口文件
├── prisma/
│   └── seed.ts                    # 数据库种子
├── test/                          # 测试文件
├── .env.example                   # 环境变量模板
├── nest-cli.json                  # NestJS CLI 配置
├── package.json
└── tsconfig.json
```

---

## API 规范

### 响应格式

成功响应:
```json
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "traceId": "uuid"
}
```

错误响应:
```json
{
  "code": 400,
  "message": "错误描述",
  "traceId": "uuid",
  "path": "/api/v1/xxx",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 分页格式

```json
{
  "list": [...],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

---

## 认证与授权

### JWT 认证

```bash
# 登录获取 token
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "admin123"
}

# 使用 token
Authorization: Bearer <token>
```

### RBAC 权限

```typescript
// 使用装饰器控制权限
@Permissions(Permission.PEOPLE_ARCHIVE_WRITE)
@Post('archives')
createArchive() {}

// 角色控制
@Roles('SUPER_ADMIN', 'ADMIN')
@Delete('archives/:id')
deleteArchive() {}
```

### 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 超级管理员 |

---

## 审计日志

所有关键操作自动记录审计日志:

```typescript
@Audit({ 
  module: AuditModule.HR, 
  action: AuditAction.CREATE, 
  targetType: 'User' 
})
@Post('archives')
createArchive() {}
```

记录内容:
- 操作人 ID/名称
- 操作模块/动作
- 操作目标 ID/类型
- 变更前后值
- IP 地址
- 操作时间

---

## 状态机

### 注册审批状态机

```
DRAFT -> PENDING (SUBMIT)
PENDING -> APPROVED (PASS)
PENDING -> REJECTED (REJECT)
REJECTED -> PENDING (RESUBMIT)
```

### 退款状态机

```
PENDING -> APPROVED (APPROVE)
PENDING -> REJECTED (REJECT)
APPROVED -> REFUNDED (EXECUTE)
```

---

## 测试

```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

---

## 部署

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| DATABASE_URL | PostgreSQL 连接串 | - |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRES_IN | Token 有效期 | 7d |
| PORT | 服务端口 | 3000 |
| CORS_ORIGIN | CORS 允许域名 | - |

---

## 相关文档

- [SPEC/02_DB_SCHEMA.prisma](../../SPEC/02_DB_SCHEMA.prisma) - 数据库模型
- [SPEC/03_API_CONTRACT.openapi.yaml](../../SPEC/03_API_CONTRACT.openapi.yaml) - API 契约
- [SPEC/05_RBAC.md](../../SPEC/05_RBAC.md) - 权限体系
