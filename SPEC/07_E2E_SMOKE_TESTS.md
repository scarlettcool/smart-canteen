# 智慧食堂 E2E 烟雾测试规范

> Version: 1.0.0  
> Last Updated: 2026-02-04T16:12:14+08:00

---

## 测试清单

| # | 测试场景 | 验证项 | 优先级 |
|---|----------|--------|--------|
| 01 | 管理员登录 | 页面导航、API 200、UI显示用户信息 | P0 |
| 02 | 人员档案 CRUD | 创建→编辑→软删除→审计日志存在 | P0 |
| 03 | 人员导入 | 模板下载→导入→错误行报告 | P0 |
| 04 | 交易流水导出 | 列表加载→筛选→导出下载 | P1 |
| 05 | 菜单发布 | 发布→撤回→通知日志 | P1 |
| 06 | 投诉回复 | 回复→关闭→审计日志存在 | P1 |
| 07 | 操作日志 | 查看日志→筛选→前置操作日志验证 | P0 |

---

## 测试断言要求

每个测试用例必须验证以下四项:

### 1. 页面导航正常 (Page Navigation OK)
```typescript
await page.goto('/path');
await expect(page).toHaveURL(/expected-pattern/);
await expect(page.locator('.page-title')).toBeVisible();
```

### 2. API 返回 200 (API 200)
```typescript
const [response] = await Promise.all([
  waitForApiResponse(page, '/api/endpoint', { status: 200 }),
  page.click('button'),
]);
expect(response.status).toBe(200);
expect((response.body as any).code).toBe(0);
```

### 3. UI 刷新 (UI Refresh)
```typescript
await waitForToast(page, /成功/);
await waitForTableRefresh(page);
await expect(page.locator('.ant-table-row')).toContainText(expectedText);
```

### 4. 审计日志记录 (Audit Log Inserted)
```typescript
const auditLog = await auditHelper.assertAuditLogExists({
  module: 'hr',
  action: 'CREATE',
  targetId: createdId,
  within: 60, // seconds
});
expect(auditLog).not.toBeNull();
```

---

## 测试文件结构

```
e2e/
├── tests/
│   ├── auth.setup.ts              # 登录认证 setup
│   ├── 01-admin-login.spec.ts     # 管理员登录
│   ├── 02-personnel-archive.spec.ts # 人员档案 CRUD
│   ├── 03-import-personnel.spec.ts  # 人员导入
│   ├── 04-trade-ledger-export.spec.ts # 流水导出
│   ├── 05-menu-publish.spec.ts      # 菜单发布
│   ├── 06-complaint-reply.spec.ts   # 投诉回复
│   └── 07-operation-logs.spec.ts    # 操作日志
├── utils/
│   └── fixtures.ts                # 测试工具和 fixtures
├── fixtures/
│   ├── import-personnel-test.xlsx # 导入测试文件
│   └── downloaded-template.xlsx   # 下载的模板
├── pages/                         # Page Objects (可选)
└── .auth/
    └── admin.json                 # 登录状态缓存
```

---

## 运行测试

### 安装依赖
```bash
npm install -D @playwright/test
npx playwright install
```

### 运行命令
```bash
# 运行所有烟雾测试
npm run e2e

# 运行单个测试文件
npm run e2e -- --grep "02-personnel"

# 带 UI 运行
npm run e2e:ui

# 生成报告
npm run e2e:report
```

### CI 集成
```bash
# CI 环境运行
npm run e2e:ci
```

---

## 测试数据

### 测试账号
| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 超级管理员 |

### 测试数据命名规范
- 人员名称: `测试员工_{timestamp}`
- 工号: `E{timestamp后8位}`
- 手机: `138{timestamp后8位}`

---

## 审计日志验证

### 必须记录审计的操作

| 模块 | 操作 | 描述 |
|------|------|------|
| hr | CREATE | 创建人员档案 |
| hr | UPDATE | 更新人员档案 |
| hr | DELETE | 删除人员档案 |
| hr | IMPORT | 批量导入 |
| dish | PUBLISH | 发布菜品 |
| dish | UNPUBLISH | 下架菜品 |
| notify | REPLY | 回复反馈 |
| notify | CLOSE | 关闭反馈 |
| trade | EXPORT | 导出流水 |

### 审计日志结构验证
```typescript
interface AuditLogRecord {
  id: string;
  module: string;      // hr, dish, notify, trade, etc.
  action: string;      // CREATE, UPDATE, DELETE, etc.
  targetType: string;  // User, Dish, Feedback, etc.
  targetId: string;    // 操作对象ID
  operatorName: string; // 操作人
  createdAt: string;   // ISO 时间戳
}
```

---

## 故障排查

### 常见问题

1. **登录失败**
   - 检查 `e2e/.auth/admin.json` 是否过期
   - 删除后重新运行 setup

2. **元素找不到**
   - 检查选择器是否匹配当前 UI
   - 增加等待时间

3. **API 超时**
   - 检查后端服务是否运行
   - 增加 navigationTimeout

4. **审计日志未找到**
   - 检查后端是否正确记录
   - 增加 `within` 时间窗口

---

## 扩展测试

后续可添加:
- 用户端 H5 测试
- 多角色权限测试
- 并发操作测试
- 性能基准测试
