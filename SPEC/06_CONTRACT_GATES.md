# Contract Lockdown Gates

> Version: 1.0.0  
> Last Updated: 2026-02-04T14:00:11+08:00

---

## 概述

Contract Lockdown Gates 是一套 CI 检查机制，确保 SPEC 文档与代码实现保持同步。
任何违反这些规则的 PR 都会被自动拦截。

---

## 四道门禁 (4 Gates)

### Gate 1: OpenAPI → Shared Types 同步

**规则**: 如果 `SPEC/03_API_CONTRACT.openapi.yaml` 变更，必须重新生成共享类型。

```
SPEC/03_API_CONTRACT.openapi.yaml  ──变更──>  shared/api-types/  必须更新
```

**检查方式**:
- CI 检测 OpenAPI 文件变更
- 验证 `shared/api-types/` 目录也有变更
- 若只改 OpenAPI 未生成类型 → **❌ FAIL**

**修复命令**:
```bash
npm run generate:types
git add shared/api-types/
git commit --amend --no-edit
```

---

### Gate 2: DB Schema → Migration 同步

**规则**: 如果 `SPEC/02_DB_SCHEMA.prisma` 变更，必须创建对应迁移。

```
SPEC/02_DB_SCHEMA.prisma  ──变更──>  prisma/migrations/  必须更新
```

**检查方式**:
- CI 检测 Prisma schema 变更
- 验证 `prisma/migrations/` 目录有新迁移
- 若只改 schema 未创建迁移 → **❌ FAIL**

**修复命令**:
```bash
npx prisma migrate dev --name describe_your_change
git add prisma/migrations/
git commit --amend --no-edit
```

---

### Gate 3: 审计日志覆盖

**规则**: 所有关键操作端点必须在 UI Contract 中标记审计要求。

**关键操作端点**:
- 状态变更: `/approve`, `/reject`, `/pass`, `/accept`, `/resolve`, `/lift`
- 账户操作: `/freeze`, `/unfreeze`, `/adjust`, `/correct`
- 发布操作: `/publish`, `/unpublish`, `/batch-publish`
- 设备操作: `/command`, `/restart`, `/bind`, `/unbind`
- 批量操作: `/batch`, `/batch-convert`, `/convert`
- 数据变更: `/import`

**检查方式**:
- 扫描 OpenAPI 中所有关键操作端点
- 验证 `04_UI_CONTRACT.md` 中对应功能标记 `**审计** | ✅`
- 若关键端点未标记审计 → **❌ FAIL**

**修复方式**:
1. 打开 `SPEC/04_UI_CONTRACT.md`
2. 找到对应功能模块
3. 确保 `| **审计** | ✅ |` 存在
4. 提交变更

---

### Gate 4: RBAC 权限绑定

**规则**: 所有管理后台路由必须绑定 RBAC 权限。

```
/hr/archives       → PEOPLE_ARCHIVE_READ / PEOPLE_ARCHIVE_WRITE
/account/{id}/adjust → CONSUME_ACCOUNT_WRITE
/dish/{id}/publish   → DISH_PUBLISH
```

**检查方式**:
- 扫描 OpenAPI 中所有非 `/user/` 前缀的端点
- 验证 UI Contract 或 RBAC.md 中有对应权限绑定
- 若 POST/PUT/DELETE 端点无权限绑定 → **❌ FAIL**

**修复方式**:
1. 在 `SPEC/04_UI_CONTRACT.md` 的功能表中添加 `**权限** | PERMISSION_CODE`
2. 确保权限代码在 `SPEC/05_RBAC.md` 中已定义
3. 提交变更

---

## 本地检查

在提交前运行本地检查:

```bash
# 检查同步状态
node scripts/check-sync.js

# 检查审计覆盖
node scripts/check-audit-coverage.js

# 检查 RBAC 绑定
node scripts/check-rbac-bindings.js

# 运行所有检查 (推荐)
npm run gates:check
```

---

## package.json 脚本

将以下脚本添加到 `package.json`:

```json
{
  "scripts": {
    "generate:types": "npx openapi-typescript ./SPEC/03_API_CONTRACT.openapi.yaml -o ./shared/api-types/index.ts",
    "gates:check": "node scripts/check-sync.js && node scripts/check-audit-coverage.js && node scripts/check-rbac-bindings.js",
    "gates:sync": "npm run generate:types",
    "precommit": "npm run gates:check"
  }
}
```

---

## Git Hooks (可选)

使用 husky 添加 pre-commit 钩子:

```bash
npx husky install
npx husky add .husky/pre-commit "npm run gates:check"
```

---

## CI 工作流

工作流文件: `.github/workflows/contract-gates.yml`

```yaml
jobs:
  openapi-types-sync:    # Gate 1
  db-migration-sync:     # Gate 2
  audit-log-coverage:    # Gate 3
  rbac-binding-check:    # Gate 4
  gates-summary:         # 汇总结果
```

---

## 豁免规则

以下情况可豁免检查:

| Gate | 豁免条件 |
|------|----------|
| Gate 1 | 仅修改注释或描述，schema 结构未变 |
| Gate 2 | 仅修改注释或 @map 名称 |
| Gate 3 | `/user/*` 用户端点 (有独立审计)、`/report/*` 只读报表 |
| Gate 4 | `/user/*` 用户端点 (使用用户认证)、GET 报表端点 |

---

## 故障排除

### Q: Gate 1 失败但我确实生成了类型

A: 检查生成的类型文件是否已添加到 git:
```bash
git status shared/api-types/
git add shared/api-types/
```

### Q: Gate 2 检测到 schema 变更但没有实质修改

A: 如果只是格式化或注释变更，可以重置 schema 文件:
```bash
git checkout HEAD -- SPEC/02_DB_SCHEMA.prisma
```

### Q: Gate 3/4 报告端点找不到权限绑定

A: 确保 UI Contract 中的 API Endpoint 列与 OpenAPI 路径完全匹配:
- OpenAPI: `/hr/archives/{id}`
- UI Contract: `PUT /hr/archives/{id}` 或 `/hr/archives/{id}`

---

## 联系方式

如有问题，请联系项目架构师。
