# 智慧食堂产品需求文档 (PRD)

> Version: 1.0.0  
> Last Updated: 2026-02-04

---

## 1. 产品概述

**智慧食堂** 是面向政务/企业场景的一站式数字化食堂管理平台，涵盖：
- **用户端 (WeChat H5)**: 员工自助点餐、预约、充值、排队等
- **管理后台 (Admin Portal)**: 人员管理、消费管理、菜品管理、系统设置

---

## 2. 用户角色

| 角色 | 代号 | 权限范围 |
|------|------|----------|
| 超级管理员 | `SUPER_ADMIN` | 全量权限 |
| 人事主管 | `HR_MANAGER` | 人员管理全量 |
| 财务总监 | `FINANCE_DIRECTOR` | 消费管理全量 |
| 食堂管理员 | `CANTEEN_MANAGER` | 菜品管理 + 部分消费查看 |
| 前台操作员 | `OPERATOR` | 日常操作，无配置权限 |
| 员工用户 | `USER` | 仅移动端功能 |

---

## 3. 功能矩阵 (54 项功能)

### 3.1 人员管理 (1-12)

| # | 功能 | 页面路由 | 权限 Key | API Endpoint | 优先级 |
|---|------|----------|----------|--------------|--------|
| 1 | 人员档案 | `/people/archive/list` | PEOPLE_ARCHIVE_READ/WRITE | `/api/admin/people/archives` | P0 |
| 2 | 组织架构 | `/people/archive/org` | PEOPLE_ORG_READ/MANAGE | `/api/admin/org/tree` | P0 |
| 3 | 注册审批 | `/people/archive/approval` | PEOPLE_AUDIT_READ/OPERATE | `/api/admin/approvals` | P0 |
| 4 | 预录资料 | `/people/archive/prerecord` | PEOPLE_ARCHIVE_IMPORT | `/api/admin/pre-records` | P1 |
| 5 | 离职人员表 | `/people/report/resigned` | PEOPLE_REPORT_READ | `/api/admin/reports/resigned` | P1 |
| 6 | 统计分析 | `/people/report/stats` | PEOPLE_REPORT_READ | `/api/admin/reports/stats/overview` | P1 |
| 7 | 近期生日人员表 | `/people/report/birthday` | PEOPLE_REPORT_READ | `/api/admin/reports/birthday` | P2 |
| 8 | 退休人员表 | `/people/report/retired` | PEOPLE_REPORT_READ | `/api/admin/reports/retired` | P2 |
| 9 | 自定义属性 | `/people/option/attr` | PEOPLE_CONFIG_ATTR | `/api/admin/options/attributes` | P2 |
| 10 | 自定义选项 | `/people/option/dict` | PEOPLE_CONFIG_ATTR | `/api/admin/options/dictionaries` | P2 |
| 11 | 人员编号规则 | `/people/option/id-rule` | PEOPLE_CONFIG_ATTR | `/api/admin/rules/id-generate` | P2 |
| 12 | 黑名单管理 | `/people/option/blacklist` | PEOPLE_BLACKLIST_READ/ADMIN | `/api/admin/blacklist` | P1 |

### 3.2 消费管理 (13-31)

| # | 功能 | 页面路由 | 权限 Key | API Endpoint | 优先级 |
|---|------|----------|----------|--------------|--------|
| 13 | 账户管理 | `/consumption/accounts` | CONSUME_ACCOUNT_READ/WRITE | `/api/admin/accounts` | P0 |
| 14 | 交易明细 | `/consumption/trade/tx` | CONSUME_TRADE_READ | `/api/admin/transactions` | P0 |
| 15 | 退款审核 | `/consumption/trade/refund` | CONSUME_TRADE_WRITE | `/api/admin/refunds` | P0 |
| 16 | 失约申诉 | `/consumption/trade/appeal` | CONSUME_TRADE_WRITE | `/api/admin/appeals` | P1 |
| 17 | 消费明细 | `/consumption/report/detail` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/detail` | P0 |
| 18 | 个人汇总 | `/consumption/report/user-summary` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/user-summary` | P1 |
| 19 | 日期汇总 | `/consumption/report/date-summary` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/date-summary` | P1 |
| 20 | 金额统计 | `/consumption/report/amount-stats` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/amount-stats` | P1 |
| 21 | 餐厅汇总 | `/consumption/report/canteen-summary` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/canteen-summary` | P1 |
| 22 | 部门汇总 | `/consumption/report/dept-summary` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/dept-summary` | P1 |
| 23 | 设备汇总 | `/consumption/report/device-summary` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/device-summary` | P2 |
| 24 | 预定统计 | `/consumption/report/order-stats` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/order-stats` | P1 |
| 25 | 充值退款表 | `/consumption/report/recharge` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/recharge` | P1 |
| 26 | 综合统计表 | `/consumption/report/total` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/total` | P1 |
| 27 | 补交差价表 | `/consumption/report/diff` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/diff` | P2 |
| 28 | 个人综合表 | `/consumption/report/personal` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/personal` | P2 |
| 29 | 经营趋势 | `/consumption/report/trend` | CONSUME_REPORT_READ | `/api/admin/reports/consumption/trend` | P1 |
| 30 | 消费设置 | `/consumption/config` | CONSUME_CONFIG_WRITE | `/api/admin/consumption/config` | P1 |
| 31 | 设备管理 | `/consumption/devices` | CONSUME_DEVICE_ADMIN | `/api/admin/devices` | P1 |

### 3.3 菜品管理 (32-41)

| # | 功能 | 页面路由 | 权限 Key | API Endpoint | 优先级 |
|---|------|----------|----------|--------------|--------|
| 32 | 菜品发布 | `/dishes/publish` | DISH_PUBLISH | `/api/admin/dishes/publish` | P0 |
| 33 | 菜品资料 | `/dishes/archives` | DISH_READ/WRITE | `/api/admin/dishes` | P0 |
| 34 | 餐别管理 | `/dishes/meal-types` | DISH_CONFIG | `/api/admin/meal-types` | P1 |
| 35 | 账户类型 | `/dishes/account-types` | DISH_CONFIG | `/api/admin/account-types` | P2 |
| 36 | 消费规则 | `/dishes/rules` | DISH_CONFIG | `/api/admin/consumption-rules` | P1 |
| 37 | 订餐管理 | `/dishes/reservations` | RESERVATION_ADMIN | `/api/admin/reservations` | P0 |
| 38 | 餐厅资料 | `/dishes/canteen-info` | CANTEEN_READ/WRITE | `/api/admin/canteens` | P0 |
| 39 | 提醒通知 | `/dishes/notices` | NOTICE_ADMIN | `/api/admin/notices` | P1 |
| 40 | 公告管理 | `/dishes/announcements` | ANNOUNCEMENT_ADMIN | `/api/admin/announcements` | P1 |
| 41 | 意见箱 | `/dishes/feedback` | FEEDBACK_ADMIN | `/api/admin/feedbacks` | P1 |

### 3.4 系统设置 (42-54)

| # | 功能 | 页面路由 | 权限 Key | API Endpoint | 优先级 |
|---|------|----------|----------|--------------|--------|
| 42 | 操作日志 | `/system/logs` | SYSTEM_LOG_READ | `/api/admin/system/logs` | P0 |
| 43 | 微信配置 | `/system/wechat` | SYSTEM_WECHAT | `/api/admin/system/wechat` | P1 |
| 44 | 政务短信 | `/system/sms` | SYSTEM_SMS | `/api/admin/system/sms` | P2 |
| 45 | 开放接口 | `/system/openapi` | SYSTEM_OPENAPI | `/api/admin/system/openapi` | P2 |
| 46 | 菜单设置 | `/system/menus` | SYSTEM_MENU | `/api/admin/system/menus` | P1 |
| 47 | 字段对照 | `/system/field-map` | SYSTEM_CONFIG | `/api/admin/system/field-map` | P2 |
| 48 | 报表管理 | `/system/report-config` | SYSTEM_REPORT_CONFIG | `/api/admin/system/report-config` | P2 |
| 49 | 插件管理 | `/system/plugins` | SYSTEM_PLUGIN | `/api/admin/system/plugins` | P2 |
| 50 | 门户定制 | `/system/portal` | SYSTEM_PORTAL | `/api/admin/system/portal` | P2 |
| 51 | 节假日设置 | `/system/holidays` | SYSTEM_HOLIDAY | `/api/admin/system/holidays` | P1 |
| 52 | 权限管理 | `/system/perms` | SYSTEM_PERM_ADMIN | `/api/admin/system/permissions` | P0 |
| 53 | 角色管理 | `/system/roles` | SYSTEM_ROLE_ADMIN | `/api/admin/system/roles` | P0 |
| 54 | 管理员设置 | `/system/admins` | SYSTEM_ADMIN | `/api/admin/system/admins` | P0 |

---

## 4. 用户端 H5 功能清单

### 4.1 核心功能

| 功能 | 页面 | API Endpoint | 优先级 |
|------|------|--------------|--------|
| 首页仪表盘 | `/` | `/api/v1/home/summary` | P0 |
| 员工注册 | `/register` | `/api/v1/auth/register` | P0 |
| 余额查询 | `/wallet` | `/api/v1/wallet/balance` | P0 |
| 充值 | `/wallet` | `/api/v1/wallet/recharge` | P0 |
| 食堂选择 | `/canteen/select` | `/api/v1/canteens` | P0 |
| 菜品浏览 | `/canteen/:id/menu` | `/api/v1/canteens/:id/dishes` | P0 |
| 点餐扣款 | `/canteen/:id/menu` | `/api/v1/orders/checkout` | P0 |
| 订单历史 | `/orders` | `/api/v1/orders` | P0 |
| 预约管理 | `/reservation` | `/api/v1/reservations` | P0 |
| 排队取号 | `/queue` | `/api/v1/queue/take` | P1 |
| 优惠券 | `/coupons` | `/api/v1/coupons` | P1 |
| 意见反馈 | `/feedback` | `/api/v1/feedback` | P1 |
| 个人中心 | `/profile` | `/api/v1/user/profile` | P0 |

### 4.2 交互契约

详见 `04_UI_CONTRACT.md`

---

## 5. 非功能需求

| 类别 | 要求 |
|------|------|
| 性能 | 页面首屏加载 < 2s, API P95 < 500ms |
| 并发 | 支持 1000 并发用户 |
| 安全 | JWT 认证, RBAC 鉴权, 审计日志 |
| 可用性 | 99.9% SLA |
| 数据 | 金额精度 DECIMAL(12,2), 禁止浮点 |
| 合规 | 政务数据脱敏, 操作可追溯 |

---

## 6. 状态机定义

### 6.1 注册审核 (RegistrationStatus)
```
none → pending → [success | rejected]
                    ↓
                 (可重新提交)
                    ↓
                 pending
```

### 6.2 订单状态 (OrderStatus)
```
created → pending_payment → paid → completed
                              ↓
                          cancelled (可退款)
                              ↓
                          refunded
```

### 6.3 预约状态 (ReservationStatus)
```
pending → used → (结束)
    ↓
expired (超时未使用)
    ↓
cancelled (用户取消)
```

### 6.4 黑名单状态 (BlacklistStatus)
```
normal → blacklisted (temporary/permanent)
              ↓
           lifted (解除)
              ↓
           normal
```

---

## 7. 审计要求

以下操作必须记录审计日志：

| 操作 | 审计内容 |
|------|----------|
| 人员档案变更 | 操作人、变更前后值、时间 |
| 审批操作 | 审批人、审批结果、原因 |
| 账户调账/冻结 | 操作人、金额、原因 |
| 交易冲正/退款 | 操作人、原交易ID、原因 |
| 黑名单操作 | 操作人、目标用户、原因 |
| 权限变更 | 操作人、变更内容 |
| 系统配置 | 操作人、配置项、变更值 |
