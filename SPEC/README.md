# 智慧食堂 SPEC 文档索引

> 单一真相源 (Single Source of Truth)  
> Last Updated: 2026-02-04T16:32:55+08:00

---

## 📁 SPEC 目录结构

```
SPEC/
├── 00_CURRENT_STATE_REPORT.md    # 现状分析报告
├── 01_PRODUCT_REQUIREMENTS.md    # 产品需求文档 (PRD)
├── 02_DB_SCHEMA.prisma           # 数据库模型 (Prisma)
├── 03_API_CONTRACT.openapi.yaml  # API 契约 (OpenAPI 3.1)
├── 04_UI_CONTRACT.md             # UI 交互契约 (54管理+13微信)
├── 05_RBAC.md                    # 权限体系文档
├── 06_CONTRACT_GATES.md          # CI门禁规则文档
├── 07_E2E_SMOKE_TESTS.md         # E2E烟雾测试规范 🆕
└── README.md                     # 本索引文件
```

---

## 📋 文档说明

| 文件 | 说明 | 主要内容 |
|------|------|----------|
| **00_CURRENT_STATE_REPORT** | 现状报告 | 已有代码分析、差距分析、技术债务 |
| **01_PRODUCT_REQUIREMENTS** | PRD | 54项功能矩阵、用户角色、状态机 |
| **02_DB_SCHEMA** | 数据库 | 15个领域、50+表、状态转换日志 |
| **03_API_CONTRACT** | API规范 | 13个域、100+端点、幂等字段 |
| **04_UI_CONTRACT** | UI契约 | 67功能映射、验证规则、审计标记 |
| **05_RBAC** | 权限体系 | 40+权限点、6角色、数据域隔离 |
| **06_CONTRACT_GATES** | CI门禁 | 4道门禁、同步检查、自动拦截 |
| **07_E2E_SMOKE_TESTS** | E2E测试 | 7个场景、Playwright、审计验证 🆕 |

---

## 🚦 Contract Lockdown Gates (CI 门禁)

| Gate | 规则 | 失败条件 |
|------|------|----------|
| **Gate 1** | OpenAPI → Types 同步 | 改了 OpenAPI 未重新生成类型 |
| **Gate 2** | Schema → Migration 同步 | 改了数据库 schema 未创建迁移 |
| **Gate 3** | 审计日志覆盖 | 关键操作端点未标记审计要求 |
| **Gate 4** | RBAC 权限绑定 | 管理后台路由未绑定权限 |

**本地检查命令**:
```bash
node scripts/check-sync.js          # Gate 1 & 2
node scripts/check-audit-coverage.js # Gate 3
node scripts/check-rbac-bindings.js  # Gate 4
```

---

## 🔗 Hard Gates (强制规则)

1. **SPEC-first**: 任何行为变更必须先更新 SPEC，再改代码
2. **共享类型**: FE/BE 必须使用从 OpenAPI 生成的共享类型
3. **迁移优先**: 数据库变更只能通过 Prisma 迁移进行
4. **审计日志**: 所有关键操作必须记录审计日志
5. **CI 必过**: lint + typecheck + unit + **contract-gates** + e2e smoke

---

## 🚀 使用指南

### 生成共享类型

```bash
# 从 OpenAPI 生成 TypeScript 类型
npx openapi-typescript ./SPEC/03_API_CONTRACT.openapi.yaml -o ./shared/api-types.ts

# 生成 API 客户端
npx @openapitools/openapi-generator-cli generate \
  -i ./SPEC/03_API_CONTRACT.openapi.yaml \
  -g typescript-fetch \
  -o ./shared/api-client
```

### 数据库迁移

```bash
# 生成迁移
npx prisma migrate dev --schema=./SPEC/02_DB_SCHEMA.prisma

# 应用迁移
npx prisma migrate deploy --schema=./SPEC/02_DB_SCHEMA.prisma

# 生成 Prisma Client
npx prisma generate --schema=./SPEC/02_DB_SCHEMA.prisma
```

---

## 📊 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| 1.0.0 | 2026-02-04 | 初始版本，完成 Step 0-3 |
| 1.1.0 | 2026-02-04 | 添加 CI 门禁 (Contract Gates) |
| 1.2.0 | 2026-02-04 | 添加 E2E 烟雾测试规范 |

---

## 👥 贡献者

- 系统架构: Antigravity AI
- 产品设计: 待定
- 开发团队: 待定
