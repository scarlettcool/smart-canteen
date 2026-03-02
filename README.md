# 🍽️ 智慧食堂管理系统

> 企业级智慧食堂一体化解决方案

[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 项目简介

智慧食堂是一套完整的企业食堂管理系统，包含：

- **Admin 管理后台** - 人事管理、账户管理、菜品管理、设备管理等
- **H5 移动端** - 员工就餐预约、账户充值、菜单查看、反馈申诉等
- **后端 API** - 基于 NestJS 的 RESTful API 服务

## ✨ 核心功能

### 👥 人员管理
- 人员档案 CRUD、批量导入
- 注册审批流程 (状态机)
- 黑名单管理
- 组织架构树管理

### 💰 账户管理
- 账户余额查询
- 在线充值
- 账户冻结/解冻
- 余额调整

### 🍜 菜品管理
- 菜品分类管理
- 菜品 CRUD
- 发布/下架 (状态机)
- 每日菜单编排
- 菜单复制功能

### 📊 交易管理
- 交易流水查询
- 交易冲正
- 统计报表
- 数据导出

### 📝 申诉退款
- 退款申请与审批
- 申诉提交与处理
- 完整状态机流程

### 🖥️ 设备管理
- 设备 CRUD
- 餐厅绑定
- 远程命令下发
- 心跳监控

### 🔔 通知公告
- 公告管理
- 用户反馈处理

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端 (Frontend)                       │
├───────────────────────────┬─────────────────────────────┤
│      Admin Frontend       │        H5 Frontend          │
│   React + Ant Design      │    React + Ant Design       │
└───────────────────────────┴─────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   后端 API (Backend)                     │
│                   NestJS + TypeScript                    │
├─────────────────────────────────────────────────────────┤
│  Auth   │  HR  │ Account │ Trade │ Dish │ Device │ ... │
├─────────────────────────────────────────────────────────┤
│        Prisma ORM │ PostgreSQL │ Redis (可选)           │
└─────────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+ (推荐) 或 npm 9+
- PostgreSQL 14+
- Redis (可选，用于缓存)

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-org/smart-canteen.git
cd smart-canteen

# 2. 运行安装脚本
./scripts/setup.sh

# 或手动安装:
pnpm install

# 3. 配置环境变量
cp apps/api/.env.example apps/api/.env
# 编辑 DATABASE_URL 等配置

# 4. 初始化数据库
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts

# 5. 启动服务
npm run start:dev
```

### 启动服务

```bash
# 终端 1: 后端 API
cd apps/api && npm run start:dev

# 终端 2: Admin 前端
cd apps/admin-frontend && npm run dev

# 终端 3: H5 前端
cd apps/h5-frontend && npm run dev
```

### 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 后端 API | http://localhost:3000/api/v1 | RESTful API |
| Swagger 文档 | http://localhost:3000/api/docs | API 文档 |
| Admin 管理后台 | http://localhost:3001 | 管理员登录 |
| H5 移动端 | http://localhost:3002 | 员工端 |

### 默认账号

- **管理员**: admin / admin123

## 📁 项目结构

```
智慧食堂/
├── apps/
│   ├── api/                    # NestJS 后端
│   │   ├── prisma/            # 数据库 Schema & 迁移
│   │   ├── src/
│   │   │   ├── common/        # 公共服务
│   │   │   ├── decorators/    # 自定义装饰器
│   │   │   ├── guards/        # 守卫
│   │   │   ├── interceptors/  # 拦截器
│   │   │   └── modules/       # 业务模块
│   │   └── test/              # E2E 测试
│   ├── admin-frontend/        # Admin 前端 (React)
│   └── h5-frontend/           # H5 前端 (React)
├── SPEC/                       # 设计规格文档
│   ├── 00_OVERVIEW.md
│   ├── 01_OPENAPI.yaml
│   ├── 02_DB_SCHEMA.prisma
│   └── ...
└── scripts/                    # 运维脚本
```

## 🔐 权限系统

### 预置角色

| 角色 | 说明 |
|------|------|
| SUPER_ADMIN | 超级管理员，全部权限 |
| ADMIN | 管理员，除系统设置外的权限 |
| CANTEEN_MANAGER | 餐厅经理，菜品相关权限 |
| HR_MANAGER | 人事经理，人员相关权限 |
| FINANCE | 财务，账户和交易权限 |
| VIEWER | 观察者，只读权限 |

### 权限点 (50+)

权限按模块组织，例如：
- `PEOPLE_ARCHIVE_READ` - 人员档案查看
- `CONSUME_TRADE_CORRECT` - 交易冲正
- `DISH_PUBLISH` - 菜品发布

## 📝 API 文档

启动后端后访问 Swagger 文档：

```
http://localhost:3000/api/docs
```

主要 API 模块：

| 模块 | 路径 | 说明 |
|------|------|------|
| Auth | `/api/v1/auth` | 认证登录 |
| HR | `/api/v1/hr` | 人事管理 |
| Org | `/api/v1/org` | 组织架构 |
| Account | `/api/v1/account` | 账户管理 |
| Trade | `/api/v1/trade` | 交易管理 |
| Refund | `/api/v1/refund` | 退款管理 |
| Appeal | `/api/v1/appeal` | 申诉管理 |
| Dish | `/api/v1/dish` | 菜品管理 |
| Menu | `/api/v1/menu` | 菜单管理 |
| Device | `/api/v1/device` | 设备管理 |
| Notify | `/api/v1/notify` | 通知公告 |
| System | `/api/v1/system` | 系统设置 |
| User | `/api/v1/user` | 用户端 API |

## 🧪 测试

```bash
# 运行 E2E 测试
cd apps/api
npm run test:e2e

# 运行单元测试
npm run test

# 测试覆盖率
npm run test:cov
```

## 🚢 部署

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 生产环境配置

```bash
# 构建生产版本
cd apps/api && npm run build
cd apps/admin-frontend && npm run build
cd apps/h5-frontend && npm run build
```

## 📊 状态机

系统使用状态机管理关键业务流程：

### 注册审批
```
DRAFT → PENDING → APPROVED
                → REJECTED
```

### 退款流程
```
PENDING → APPROVED → REFUNDED
        → REJECTED
```

### 申诉流程
```
SUBMITTED → PENDING → PROCESSING → RESOLVED
          → REJECTED
```

### 菜品发布
```
DRAFT → PENDING → PUBLISHED → UNPUBLISHED
                → REJECTED
```

## 🔧 开发指南

### 添加新模块

1. 在 `apps/api/src/modules/` 创建模块目录
2. 创建 `*.module.ts`, `*.controller.ts`, `*.service.ts`
3. 创建 `*.dto.ts` 定义请求/响应结构
4. 在 `app.module.ts` 导入模块
5. 添加相应权限点
6. 编写 E2E 测试

### 代码规范

- 使用 ESLint + Prettier
- 遵循 NestJS 最佳实践
- TypeScript 严格模式

## 📋 更新日志

### v3.2.0 (2026-02-05)
- ✅ 完成所有后端模块
- ✅ 完成前后端 API 集成
- ✅ 完成 RBAC 权限系统
- ✅ 完成审计日志系统
- ✅ 完成 E2E 测试覆盖

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**智慧食堂** - 让企业食堂管理更智能 🍽️
