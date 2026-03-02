# 智慧食堂 RBAC 权限体系 (Role-Based Access Control)

> Version: 1.0.0  
> Last Updated: 2026-02-04

---

## 1. 权限架构

```
┌─────────────────────────────────────────────────────────┐
│                    用户 (AdminUser)                      │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │   角色    │ (多对多)                │
│                    │  (Role)   │                        │
│                    └─────┬─────┘                        │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │   权限    │ (多对多)                │
│                    │(Permission)│                       │
│                    └───────────┘                        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 权限点清单 (Permission Catalog)

### 2.1 人员管理模块 (PEOPLE_*)

| 权限编码 | 名称 | 描述 | API Scope |
|----------|------|------|-----------|
| `PEOPLE_ARCHIVE_READ` | 查看档案 | 查看人员列表和详情 | GET /people/* |
| `PEOPLE_ARCHIVE_WRITE` | 编辑档案 | 新增/修改/删除人员 | POST/PUT/DELETE /people/* |
| `PEOPLE_ARCHIVE_IMPORT` | 导入档案 | 批量导入人员数据 | POST /people/import |
| `PEOPLE_ARCHIVE_EXPORT` | 导出档案 | 导出人员数据 | GET /people/export |
| `PEOPLE_ORG_READ` | 查看架构 | 查看组织架构树 | GET /org/* |
| `PEOPLE_ORG_MANAGE` | 管理架构 | 新增/移动/删除部门 | POST/PUT/DELETE /org/* |
| `PEOPLE_ORG_AUDIT` | 架构审计 | 查看架构变更历史 | GET /org/history |
| `PEOPLE_AUDIT_READ` | 查看审批 | 查看注册审批列表 | GET /approvals |
| `PEOPLE_AUDIT_OPERATE` | 执行审批 | 通过/驳回注册申请 | POST /approvals/* |
| `PEOPLE_CONFIG_ATTR` | 人事配置 | 自定义属性/字典/规则 | */options/* |
| `PEOPLE_REPORT_READ` | 人事报表 | 查看人事相关报表 | GET /reports/people/* |
| `PEOPLE_BLACKLIST_READ` | 查看黑名单 | 查看受限人员名单 | GET /blacklist |
| `PEOPLE_BLACKLIST_ADMIN` | 管理黑名单 | 拉黑/解除限制 | POST/PUT /blacklist/* |

### 2.2 消费管理模块 (CONSUME_*)

| 权限编码 | 名称 | 描述 | API Scope |
|----------|------|------|-----------|
| `CONSUME_ACCOUNT_READ` | 查看账户 | 查看账户列表和余额 | GET /accounts |
| `CONSUME_ACCOUNT_WRITE` | 操作账户 | 调账/冻结/解冻 | POST /accounts/* |
| `CONSUME_TRADE_READ` | 查看交易 | 查看交易明细 | GET /transactions |
| `CONSUME_TRADE_WRITE` | 操作交易 | 冲正/退款审核 | POST /transactions/*, /refunds/* |
| `CONSUME_REPORT_READ` | 消费报表 | 查看消费报表 | GET /reports/consumption/* |
| `CONSUME_REPORT_EXPORT` | 导出报表 | 导出消费报表 | POST /reports/export |
| `CONSUME_CONFIG_WRITE` | 消费配置 | 修改消费限额和规则 | PUT /consumption/config |
| `CONSUME_DEVICE_ADMIN` | 设备管理 | 设备绑定和指令控制 | */devices/* |

### 2.3 菜品管理模块 (DISH_*)

| 权限编码 | 名称 | 描述 | API Scope |
|----------|------|------|-----------|
| `DISH_READ` | 查看菜品 | 查看菜品列表 | GET /dishes |
| `DISH_WRITE` | 编辑菜品 | 新增/修改/删除菜品 | POST/PUT/DELETE /dishes/* |
| `DISH_PUBLISH` | 发布菜品 | 菜品上下架 | POST /dishes/publish |
| `DISH_CONFIG` | 菜品配置 | 餐别/账户类型/规则 | */meal-types/*, */rules/* |
| `CANTEEN_READ` | 查看餐厅 | 查看餐厅信息 | GET /canteens |
| `CANTEEN_WRITE` | 管理餐厅 | 编辑餐厅信息 | POST/PUT/DELETE /canteens/* |
| `RESERVATION_ADMIN` | 预约管理 | 管理预约和容量 | */reservations/* (admin) |
| `NOTICE_ADMIN` | 通知管理 | 发送提醒通知 | */notices/* |
| `ANNOUNCEMENT_ADMIN` | 公告管理 | 发布公告 | */announcements/* |
| `FEEDBACK_ADMIN` | 意见管理 | 处理用户反馈 | */feedbacks/* (admin) |

### 2.4 系统设置模块 (SYSTEM_*)

| 权限编码 | 名称 | 描述 | API Scope |
|----------|------|------|-----------|
| `SYSTEM_LOG_READ` | 查看日志 | 查看操作日志 | GET /system/logs |
| `SYSTEM_WECHAT` | 微信配置 | 管理微信接入配置 | */system/wechat |
| `SYSTEM_SMS` | 短信配置 | 管理政务短信 | */system/sms |
| `SYSTEM_OPENAPI` | 开放接口 | 管理API密钥 | */system/openapi |
| `SYSTEM_MENU` | 菜单设置 | 配置系统菜单 | */system/menus |
| `SYSTEM_CONFIG` | 系统配置 | 通用系统配置 | */system/config |
| `SYSTEM_REPORT_CONFIG` | 报表配置 | 配置报表模板 | */system/report-config |
| `SYSTEM_PLUGIN` | 插件管理 | 管理系统插件 | */system/plugins |
| `SYSTEM_PORTAL` | 门户定制 | 自定义门户样式 | */system/portal |
| `SYSTEM_HOLIDAY` | 节假日 | 设置节假日 | */system/holidays |
| `SYSTEM_PERM_ADMIN` | 权限管理 | 管理权限定义 | */system/permissions |
| `SYSTEM_ROLE_ADMIN` | 角色管理 | 管理角色 | */system/roles |
| `SYSTEM_ADMIN` | 管理员设置 | 管理管理员账户 | */system/admins |

---

## 3. 预置角色

### 3.1 超级管理员 (SUPER_ADMIN)

```yaml
name: 超级管理员
code: SUPER_ADMIN
isSystem: true  # 系统角色，不可删除
permissions: "*"  # 全量权限
description: 拥有系统所有权限，可管理其他管理员
```

### 3.2 人事主管 (HR_MANAGER)

```yaml
name: 人事主管
code: HR_MANAGER
permissions:
  - PEOPLE_ARCHIVE_READ
  - PEOPLE_ARCHIVE_WRITE
  - PEOPLE_ARCHIVE_IMPORT
  - PEOPLE_ARCHIVE_EXPORT
  - PEOPLE_ORG_READ
  - PEOPLE_ORG_MANAGE
  - PEOPLE_ORG_AUDIT
  - PEOPLE_AUDIT_READ
  - PEOPLE_AUDIT_OPERATE
  - PEOPLE_CONFIG_ATTR
  - PEOPLE_REPORT_READ
  - PEOPLE_BLACKLIST_READ
  - PEOPLE_BLACKLIST_ADMIN
```

### 3.3 财务总监 (FINANCE_DIRECTOR)

```yaml
name: 财务总监
code: FINANCE_DIRECTOR
permissions:
  - PEOPLE_ARCHIVE_READ  # 只读人员信息
  - CONSUME_ACCOUNT_READ
  - CONSUME_ACCOUNT_WRITE
  - CONSUME_TRADE_READ
  - CONSUME_TRADE_WRITE
  - CONSUME_REPORT_READ
  - CONSUME_REPORT_EXPORT
  - CONSUME_CONFIG_WRITE
```

### 3.4 食堂管理员 (CANTEEN_MANAGER)

```yaml
name: 食堂管理员
code: CANTEEN_MANAGER
dataScope: canteenId  # 数据域限制
permissions:
  - PEOPLE_ARCHIVE_READ  # 限本餐厅域
  - PEOPLE_BLACKLIST_READ
  - CONSUME_TRADE_READ  # 限本餐厅域
  - CONSUME_REPORT_READ
  - DISH_READ
  - DISH_WRITE
  - DISH_PUBLISH
  - DISH_CONFIG
  - CANTEEN_READ
  - CANTEEN_WRITE
  - RESERVATION_ADMIN
  - NOTICE_ADMIN
  - ANNOUNCEMENT_ADMIN
  - FEEDBACK_ADMIN
```

### 3.5 前台操作员 (OPERATOR)

```yaml
name: 前台操作员
code: OPERATOR
permissions:
  - PEOPLE_ARCHIVE_READ
  - PEOPLE_AUDIT_READ
  - CONSUME_ACCOUNT_READ
  - CONSUME_TRADE_READ
  - DISH_READ
  - CANTEEN_READ
```

### 3.6 IT维护员 (IT_ADMIN)

```yaml
name: IT维护员
code: IT_ADMIN
permissions:
  - CONSUME_DEVICE_ADMIN
  - SYSTEM_LOG_READ
  - SYSTEM_WECHAT
  - SYSTEM_OPENAPI
  - SYSTEM_PLUGIN
```

---

## 4. 数据域隔离 (Data Scope)

### 4.1 隔离策略

| 角色 | 数据域 | 隔离字段 |
|------|--------|----------|
| SUPER_ADMIN | 全局 | - |
| HR_MANAGER | 全局 | - |
| FINANCE_DIRECTOR | 全局 | - |
| CANTEEN_MANAGER | 所属餐厅 | canteenId |
| OPERATOR | 所属餐厅 | canteenId |

### 4.2 实现机制

```typescript
// 查询时自动注入数据域条件
async function injectDataScope(query: Query, user: AdminUser): Query {
  const scope = await getDataScope(user);
  if (scope.type === 'global') return query;
  
  return {
    ...query,
    where: {
      ...query.where,
      [scope.field]: scope.value
    }
  };
}
```

---

## 5. 权限校验流程

### 5.1 API层校验

```typescript
// 装饰器方式
@RequirePermission('PEOPLE_ARCHIVE_WRITE')
async createPerson(dto: CreatePersonDto) { ... }

// 中间件方式
router.post('/people/archives', 
  requireAuth(),
  checkPermission('PEOPLE_ARCHIVE_WRITE'),
  controller.create
);
```

### 5.2 前端菜单过滤

```typescript
function filterMenuByPermissions(
  menu: MenuItem[], 
  permissions: string[]
): MenuItem[] {
  return menu
    .filter(item => {
      if (!item.permissions) return true;
      return item.permissions.some(p => permissions.includes(p));
    })
    .map(item => ({
      ...item,
      children: item.children 
        ? filterMenuByPermissions(item.children, permissions)
        : undefined
    }));
}
```

### 5.3 按钮级控制

```tsx
// React Hook
function usePermission(code: string): boolean {
  const { permissions } = useAuth();
  return permissions.includes(code);
}

// 使用
{usePermission('PEOPLE_ARCHIVE_WRITE') && (
  <Button onClick={handleCreate}>新增</Button>
)}
```

---

## 6. 审计要求

### 6.1 必审计操作

| 操作类型 | 记录内容 |
|----------|----------|
| 角色创建/修改/删除 | 角色信息、权限变更 |
| 用户角色分配 | 用户ID、角色变更 |
| 权限变更 | 权限代码、变更原因 |
| 敏感数据访问 | 访问记录、数据范围 |

### 6.2 审计日志格式

```json
{
  "traceId": "uuid",
  "operatorId": "admin_user_id",
  "module": "RBAC",
  "action": "ASSIGN_ROLE",
  "targetType": "AdminUser",
  "targetId": "target_admin_id",
  "beforeValue": { "roles": ["OPERATOR"] },
  "afterValue": { "roles": ["OPERATOR", "CANTEEN_MANAGER"] },
  "ip": "192.168.1.100",
  "userAgent": "...",
  "createdAt": "2026-02-04T13:00:00Z"
}
```

---

## 7. 安全策略

### 7.1 最小权限原则

- 默认拒绝所有权限
- 仅授予必要的最小权限集
- 定期审查权限分配

### 7.2 职责分离

- 人事与财务权限分离
- 审批与执行权限分离
- 配置与操作权限分离

### 7.3 超级管理员保护

- SUPER_ADMIN 至少保留一个
- 不可自我删除或降级
- 所有操作记录审计日志
