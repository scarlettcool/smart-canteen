# 智慧食堂 UI 交互契约 (UI Contract)

> Version: 2.0.0  
> Last Updated: 2026-02-04T13:47:02+08:00

---

## 1. 管理后台功能矩阵 (54 Admin Features)

### 1.1 人员管理 - 人事资料 (1-4)

#### #1 人员档案
| 属性 | 值 |
|------|-----|
| **路由** | `/people/archive/list` |
| **页面类型** | list, create, edit, detail |
| **权限** | PEOPLE_ARCHIVE_READ, PEOPLE_ARCHIVE_WRITE |
| **审计** | ✅ 新增/修改/删除必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 搜索 | GET `/hr/archives` | - |
| 新增 | POST `/hr/archives` | name必填, staffId唯一, phone格式 |
| 编辑 | PUT `/hr/archives/{id}` | 同上 |
| 删除 | DELETE `/hr/archives/{id}` | 软删除, 需二次确认 |
| 导入 | POST `/hr/archives/import` | Excel格式校验 |
| 导出 | GET `/hr/archives/export` | - |
| 查看详情 | GET `/hr/archives/{id}` | - |

---

#### #2 组织架构
| 属性 | 值 |
|------|-----|
| **路由** | `/people/archive/org` |
| **页面类型** | tree, create, edit |
| **权限** | PEOPLE_ORG_READ, PEOPLE_ORG_MANAGE |
| **审计** | ✅ 架构变更必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 加载树 | GET `/org/tree` | - |
| 新增部门 | POST `/org/departments` | name必填, parentId可选 |
| 编辑部门 | PUT `/org/departments/{id}` | name必填 |
| 删除部门 | DELETE `/org/departments/{id}` | 无子节点且无人员 |
| 移动部门 | PUT `/org/move` | 不可移动到自身子节点 |
| 设置负责人 | PUT `/org/departments/{id}/manager` | managerId存在 |

---

#### #3 注册审批
| 属性 | 值 |
|------|-----|
| **路由** | `/people/archive/approval` |
| **页面类型** | list, detail, confirm |
| **权限** | PEOPLE_AUDIT_READ, PEOPLE_AUDIT_OPERATE |
| **审计** | ✅ 审批操作必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 待审列表 | GET `/hr/approvals` | status=pending |
| 查看详情 | GET `/hr/approvals/{id}` | - |
| 通过 | POST `/hr/approvals/{id}/pass` | - |
| 驳回 | POST `/hr/approvals/{id}/reject` | **rejectReason必填** |
| 批量通过 | POST `/hr/approvals/batch` | ids非空, action=pass |
| 批量驳回 | POST `/hr/approvals/batch` | ids非空, action=reject, **rejectReason必填** |

**状态机: 注册审批流**
```
┌─────────┐     submit     ┌─────────┐
│  DRAFT  │ ─────────────> │ PENDING │
└─────────┘                └────┬────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
               pass │                       │ reject
                    ▼                       ▼
             ┌──────────┐            ┌──────────┐
             │ APPROVED │            │ REJECTED │
             └──────────┘            └────┬─────┘
                                          │ resubmit
                                          ▼
                                    ┌─────────┐
                                    │ PENDING │
                                    └─────────┘
```

---

#### #4 预录资料
| 属性 | 值 |
|------|-----|
| **路由** | `/people/archive/prerecord` |
| **页面类型** | list, create, edit, confirm |
| **权限** | PEOPLE_ARCHIVE_IMPORT |
| **审计** | ✅ 转正操作必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 预录列表 | GET `/hr/pre-records` | - |
| 新增预录 | POST `/hr/pre-records` | 基本信息校验 |
| 编辑预录 | PUT `/hr/pre-records/{id}` | - |
| 删除预录 | DELETE `/hr/pre-records/{id}` | - |
| 转正式档案 | POST `/hr/pre-records/{id}/convert` | 冲突解决策略必选 |
| 批量转正 | POST `/hr/pre-records/batch-convert` | ids非空 |

---

### 1.2 人员管理 - 人事报表 (5-8)

#### #5 离职人员表
| 属性 | 值 |
|------|-----|
| **路由** | `/people/report/resigned` |
| **页面类型** | list |
| **权限** | PEOPLE_REPORT_READ |
| **审计** | ❌ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 查询 | GET `/report/hr/resigned` | dateRange可选 |
| 导出 | GET `/report/hr/resigned/export` | - |

---

#### #6 统计分析
| 属性 | 值 |
|------|-----|
| **路由** | `/people/report/stats` |
| **页面类型** | dashboard |
| **权限** | PEOPLE_REPORT_READ |
| **审计** | ❌ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 概览数据 | GET `/report/hr/overview` | - |
| 部门分布 | GET `/report/hr/dept-distribution` | - |
| 趋势图 | GET `/report/hr/trend` | period必填 |

---

#### #7 近期生日人员表
| 属性 | 值 |
|------|-----|
| **路由** | `/people/report/birthday` |
| **页面类型** | list |
| **权限** | PEOPLE_REPORT_READ |
| **审计** | ❌ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 查询 | GET `/report/hr/birthday` | days默认30 |
| 导出 | GET `/report/hr/birthday/export` | - |

---

#### #8 退休人员表
| 属性 | 值 |
|------|-----|
| **路由** | `/people/report/retired` |
| **页面类型** | list |
| **权限** | PEOPLE_REPORT_READ |
| **审计** | ❌ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 查询 | GET `/report/hr/retired` | - |
| 导出 | GET `/report/hr/retired/export` | - |

---

### 1.3 人员管理 - 人事选项 (9-12)

#### #9 自定义属性
| 属性 | 值 |
|------|-----|
| **路由** | `/people/option/attr` |
| **页面类型** | list, create, edit |
| **权限** | PEOPLE_CONFIG_ATTR |
| **审计** | ✅ 配置变更记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 属性列表 | GET `/system/custom-attributes` | entityType=user |
| 新增属性 | POST `/system/custom-attributes` | fieldName唯一 |
| 编辑属性 | PUT `/system/custom-attributes/{id}` | - |
| 删除属性 | DELETE `/system/custom-attributes/{id}` | 无数据引用 |

---

#### #10 自定义选项
| 属性 | 值 |
|------|-----|
| **路由** | `/people/option/dict` |
| **页面类型** | list, create, edit |
| **权限** | PEOPLE_CONFIG_ATTR |
| **审计** | ✅ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 字典列表 | GET `/system/dictionaries` | - |
| 新增字典项 | POST `/system/dictionaries` | category+code唯一 |
| 编辑 | PUT `/system/dictionaries/{id}` | - |
| 删除 | DELETE `/system/dictionaries/{id}` | - |

---

#### #11 人员编号规则
| 属性 | 值 |
|------|-----|
| **路由** | `/people/option/id-rule` |
| **页面类型** | edit, confirm |
| **权限** | PEOPLE_CONFIG_ATTR |
| **审计** | ✅ 规则变更记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 获取规则 | GET `/system/id-rules/user` | - |
| 预览生成 | POST `/system/id-rules/preview` | formula必填 |
| 保存规则 | PUT `/system/id-rules/user` | 二次确认 |

---

#### #12 黑名单管理
| 属性 | 值 |
|------|-----|
| **路由** | `/people/option/blacklist` |
| **页面类型** | list, create, confirm |
| **权限** | PEOPLE_BLACKLIST_READ, PEOPLE_BLACKLIST_ADMIN |
| **审计** | ✅ 拉黑/解除必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 黑名单列表 | GET `/hr/blacklist` | - |
| 拉入黑名单 | POST `/hr/blacklist` | userId必填, **reason必填**, type必填 |
| 解除限制 | PUT `/hr/blacklist/{id}/lift` | **liftReason必填** |
| 查看历史 | GET `/hr/blacklist/{userId}/history` | - |

---

### 1.4 消费管理 - 账户与交易 (13-16)

#### #13 账户管理
| 属性 | 值 |
|------|-----|
| **路由** | `/consumption/accounts` |
| **页面类型** | list, detail, confirm |
| **权限** | CONSUME_ACCOUNT_READ, CONSUME_ACCOUNT_WRITE |
| **审计** | ✅ 调账/冻结必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 账户列表 | GET `/account/list` | - |
| 账户详情 | GET `/account/{id}` | - |
| 调账 | POST `/account/{id}/adjust` | amount非0, **reason必填**, **requestId幂等** |
| 冻结 | POST `/account/{id}/freeze` | 当前状态!=frozen |
| 解冻 | POST `/account/{id}/unfreeze` | 当前状态=frozen |
| 流水查询 | GET `/account/{id}/ledger` | - |

---

#### #14 交易明细
| 属性 | 值 |
|------|-----|
| **路由** | `/consumption/trade/tx` |
| **页面类型** | list, detail |
| **权限** | CONSUME_TRADE_READ, CONSUME_TRADE_WRITE |
| **审计** | ✅ 冲正必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 交易列表 | GET `/trade/transactions` | dateRange必填 |
| 交易详情 | GET `/trade/transactions/{id}` | - |
| 冲正 | POST `/trade/transactions/{id}/correct` | status=SUCCESS, **reason必填** |

---

#### #15 退款审核
| 属性 | 值 |
|------|-----|
| **路由** | `/consumption/trade/refund` |
| **页面类型** | list, detail, confirm |
| **权限** | CONSUME_TRADE_READ, CONSUME_TRADE_WRITE |
| **审计** | ✅ 审核操作必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 退款列表 | GET `/refund/applications` | - |
| 退款详情 | GET `/refund/applications/{id}` | - |
| 审核通过 | POST `/refund/applications/{id}/approve` | - |
| 审核拒绝 | POST `/refund/applications/{id}/reject` | **rejectReason必填** |

**状态机: 退款审核流**
```
┌─────────┐     apply      ┌─────────┐
│  INIT   │ ─────────────> │ PENDING │
└─────────┘                └────┬────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
             approve│                       │ reject
                    ▼                       ▼
             ┌──────────┐            ┌──────────┐
             │ APPROVED │            │ REJECTED │
             └────┬─────┘            └──────────┘
                  │ execute
                  ▼
             ┌──────────┐
             │ REFUNDED │
             └──────────┘
```

---

#### #16 失约申诉
| 属性 | 值 |
|------|-----|
| **路由** | `/consumption/trade/appeal` |
| **页面类型** | list, detail, confirm |
| **权限** | CONSUME_TRADE_READ, CONSUME_TRADE_WRITE |
| **审计** | ✅ 申诉处理必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 申诉列表 | GET `/appeal/list` | - |
| 申诉详情 | GET `/appeal/{id}` | - |
| 受理 | POST `/appeal/{id}/accept` | - |
| 驳回 | POST `/appeal/{id}/reject` | **rejectReason必填** |
| 解除违约 | POST `/appeal/{id}/resolve` | 恢复用户信用 |

**状态机: 申诉处理流**
```
┌─────────┐    submit     ┌─────────┐
│SUBMITTED│ ────────────> │ PENDING │
└─────────┘               └────┬────┘
                               │
                   ┌───────────┴───────────┐
                   │                       │
            accept │                       │ reject
                   ▼                       ▼
            ┌────────────┐          ┌──────────┐
            │ PROCESSING │          │ REJECTED │
            └─────┬──────┘          └──────────┘
                  │ resolve
                  ▼
            ┌──────────┐
            │ RESOLVED │
            └──────────┘
```

---

### 1.5 消费管理 - 报表中心 (17-29)

#### #17-29 报表通用契约

| # | 报表名称 | 路由 | API Endpoint |
|---|----------|------|--------------|
| 17 | 消费明细 | `/consumption/report/detail` | GET `/report/trade/detail` |
| 18 | 个人汇总 | `/consumption/report/user-summary` | GET `/report/trade/user-summary` |
| 19 | 日期汇总 | `/consumption/report/date-summary` | GET `/report/trade/date-summary` |
| 20 | 金额统计 | `/consumption/report/amount-stats` | GET `/report/trade/amount-stats` |
| 21 | 餐厅汇总 | `/consumption/report/canteen-summary` | GET `/report/trade/canteen-summary` |
| 22 | 部门汇总 | `/consumption/report/dept-summary` | GET `/report/trade/dept-summary` |
| 23 | 设备汇总 | `/consumption/report/device-summary` | GET `/report/trade/device-summary` |
| 24 | 预定统计 | `/consumption/report/order-stats` | GET `/report/trade/order-stats` |
| 25 | 充值退款表 | `/consumption/report/recharge` | GET `/report/trade/recharge` |
| 26 | 综合统计表 | `/consumption/report/total` | GET `/report/trade/total` |
| 27 | 补交差价表 | `/consumption/report/diff` | GET `/report/trade/diff` |
| 28 | 个人综合表 | `/consumption/report/personal` | GET `/report/trade/personal` |
| 29 | 经营趋势 | `/consumption/report/trend` | GET `/report/trade/trend` |

**通用页面类型:** list, chart  
**通用权限:** CONSUME_REPORT_READ  
**通用审计:** ❌ (仅导出需审计)

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 查询 | GET `/report/trade/{type}` | **startDate, endDate必填** |
| 导出 | POST `/report/trade/{type}/export` | 异步任务 |
| 下载 | GET `/report/exports/{jobId}` | - |

---

### 1.6 消费管理 - 设置与设备 (30-31)

#### #30 消费设置
| 属性 | 值 |
|------|-----|
| **路由** | `/consumption/config` |
| **页面类型** | edit, confirm |
| **权限** | CONSUME_CONFIG_WRITE |
| **审计** | ✅ 配置变更必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 获取配置 | GET `/system/consumption-config` | - |
| 保存配置 | PUT `/system/consumption-config` | 二次确认弹窗 |

---

#### #31 设备管理
| 属性 | 值 |
|------|-----|
| **路由** | `/consumption/devices` |
| **页面类型** | list, detail, confirm |
| **权限** | CONSUME_DEVICE_ADMIN |
| **审计** | ✅ 设备指令必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 设备列表 | GET `/device/list` | - |
| 设备详情 | GET `/device/{id}` | - |
| 绑定设备 | POST `/device/bind` | sn, canteenId必填 |
| 解绑设备 | POST `/device/{id}/unbind` | 二次确认 |
| 发送指令 | POST `/device/{id}/command` | status=ONLINE, command必填 |
| 重启设备 | POST `/device/{id}/restart` | 二次确认 |

---

### 1.7 菜品管理 (32-41)

#### #32 菜品发布
| 属性 | 值 |
|------|-----|
| **路由** | `/dishes/publish` |
| **页面类型** | list, create, confirm |
| **权限** | DISH_PUBLISH |
| **审计** | ✅ 发布操作必须记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 待发布列表 | GET `/dish/pending-publish` | - |
| 发布菜品 | POST `/dish/{id}/publish` | - |
| 批量发布 | POST `/dish/batch-publish` | ids非空 |
| 下架 | POST `/dish/{id}/unpublish` | - |
| 设置每日菜单 | POST `/menu/daily` | date, dishes必填 |

**状态机: 菜品发布流**
```
┌─────────┐    create    ┌─────────┐
│  DRAFT  │ ───────────> │ PENDING │
└─────────┘              └────┬────┘
                              │
                  ┌───────────┴───────────┐
                  │                       │
           publish│                       │ reject
                  ▼                       ▼
           ┌───────────┐          ┌──────────┐
           │ PUBLISHED │          │ REJECTED │
           └─────┬─────┘          └──────────┘
                 │ unpublish
                 ▼
           ┌───────────┐
           │ UNPUBLISHED│
           └───────────┘
```

---

#### #33 菜品资料
| 属性 | 值 |
|------|-----|
| **路由** | `/dishes/archives` |
| **页面类型** | list, create, edit, detail |
| **权限** | DISH_READ, DISH_WRITE |
| **审计** | ✅ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 菜品列表 | GET `/dish/list` | - |
| 新增菜品 | POST `/dish` | name, price, canteenId必填 |
| 编辑菜品 | PUT `/dish/{id}` | - |
| 删除菜品 | DELETE `/dish/{id}` | 软删除 |
| 上传图片 | POST `/dish/{id}/image` | 图片格式校验 |

---

#### #34-36 餐别/账户类型/消费规则

| # | 功能 | 路由 | 页面类型 |
|---|------|------|----------|
| 34 | 餐别管理 | `/dishes/meal-types` | list, create, edit |
| 35 | 账户类型 | `/dishes/account-types` | list, create, edit |
| 36 | 消费规则 | `/dishes/rules` | list, create, edit |

---

#### #37 订餐管理
| 属性 | 值 |
|------|-----|
| **路由** | `/dishes/reservations` |
| **页面类型** | list, detail, confirm |
| **权限** | RESERVATION_ADMIN |
| **审计** | ✅ 容量调整记录 |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 预约列表 | GET `/menu/reservations` | - |
| 设置容量 | PUT `/menu/capacity` | date, mealType, capacity必填 |
| 取消预约 | POST `/menu/reservations/{id}/cancel` | reason可选 |

---

#### #38 餐厅资料
| 属性 | 值 |
|------|-----|
| **路由** | `/dishes/canteen-info` |
| **页面类型** | list, create, edit, detail |
| **权限** | CANTEEN_READ, CANTEEN_WRITE |
| **审计** | ✅ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 餐厅列表 | GET `/menu/canteens` | - |
| 新增餐厅 | POST `/menu/canteens` | name, location必填 |
| 编辑餐厅 | PUT `/menu/canteens/{id}` | - |
| 开关营业 | PUT `/menu/canteens/{id}/toggle` | - |

---

#### #39-41 通知/公告/意见箱

| # | 功能 | 路由 | API前缀 |
|---|------|------|---------|
| 39 | 提醒通知 | `/dishes/notices` | `/notify/notices` |
| 40 | 公告管理 | `/dishes/announcements` | `/notify/announcements` |
| 41 | 意见箱 | `/dishes/feedback` | `/notify/feedbacks` |

---

### 1.8 系统设置 (42-54)

#### #42 操作日志
| 属性 | 值 |
|------|-----|
| **路由** | `/system/logs` |
| **页面类型** | list, detail |
| **权限** | SYSTEM_LOG_READ |
| **审计** | ❌ |

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 日志列表 | GET `/system/audit-logs` | dateRange, module可选 |
| 日志详情 | GET `/system/audit-logs/{id}` | - |
| 导出日志 | GET `/system/audit-logs/export` | - |

---

#### #43-51 系统配置

| # | 功能 | 路由 | API前缀 |
|---|------|------|---------|
| 43 | 微信配置 | `/system/wechat` | `/system/wechat-config` |
| 44 | 政务短信 | `/system/sms` | `/system/sms-config` |
| 45 | 开放接口 | `/system/openapi` | `/system/api-keys` |
| 46 | 菜单设置 | `/system/menus` | `/system/menus` |
| 47 | 字段对照 | `/system/field-map` | `/system/field-mappings` |
| 48 | 报表管理 | `/system/report-config` | `/system/report-templates` |
| 49 | 插件管理 | `/system/plugins` | `/system/plugins` |
| 50 | 门户定制 | `/system/portal` | `/system/portal-config` |
| 51 | 节假日设置 | `/system/holidays` | `/system/holidays` |

---

#### #52-54 权限与角色

| # | 功能 | 路由 | 页面类型 | API前缀 |
|---|------|------|----------|---------|
| 52 | 权限管理 | `/system/perms` | list | `/system/permissions` |
| 53 | 角色管理 | `/system/roles` | list, create, edit | `/system/roles` |
| 54 | 管理员设置 | `/system/admins` | list, create, edit | `/system/admins` |

---

## 2. 用户端 H5 功能矩阵 (13 WeChat Features)

### 2.1 功能清单

| # | 功能 | 路由 | 页面类型 | API Endpoint |
|---|------|------|----------|--------------|
| W1 | 首页 | `/` | dashboard | GET `/user/home` |
| W2 | 员工注册 | `/register` | form, result | POST `/user/register` |
| W3 | 余额查询 | `/wallet` | detail | GET `/user/balance` |
| W4 | 充值 | `/wallet/recharge` | form, confirm, result | POST `/user/recharge` |
| W5 | 食堂选择 | `/canteen/select` | list | GET `/menu/canteens` |
| W6 | 菜品浏览 | `/canteen/:id/menu` | list | GET `/menu/dishes` |
| W7 | 点餐扣款 | `/canteen/:id/menu` | confirm, result | POST `/trade/checkout` |
| W8 | 订单历史 | `/orders` | list, detail | GET `/trade/orders` |
| W9 | 预约管理 | `/reservation` | calendar, confirm | POST/GET `/menu/reservations` |
| W10 | 排队取号 | `/queue` | form, result | POST `/menu/queue/take` |
| W11 | 优惠券 | `/coupons` | list, detail | GET `/user/coupons` |
| W12 | 意见反馈 | `/feedback` | form, result | POST `/notify/user-feedback` |
| W13 | 个人中心 | `/profile` | detail, edit | GET/PUT `/user/profile` |

### 2.2 详细契约

#### W2 员工注册

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 提交申请 | POST `/user/register` | name必填, phone格式, staffId必填 |
| 查看状态 | GET `/user/register/status` | - |
| 重新提交 | POST `/user/register` | 仅status=REJECTED可用 |

---

#### W4 充值

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 选择金额 | - | amount > 0, 预设选项 |
| 确认支付 | POST `/user/recharge` | **requestId幂等**, amount必填 |
| 查看结果 | GET `/trade/recharge/{id}` | - |

---

#### W7 点餐扣款

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 加入购物车 | 本地状态 | quantity > 0 |
| 确认订单 | POST `/trade/checkout` | items非空, totalAmount正确 |
| 取餐码 | 返回值 pickupCode | - |

---

#### W9 预约管理

| 按钮 | API Endpoint | 验证规则 |
|------|--------------|----------|
| 加载日历 | GET `/menu/reservation-calendar` | - |
| 提交预约 | POST `/menu/reservations` | dates非空, mealType必填 |
| 取消预约 | DELETE `/menu/reservations/{id}` | status=PENDING |

---

## 3. 验证规则汇总

### 3.1 必填字段 (Required Fields)

| 场景 | 必填字段 |
|------|----------|
| 审批驳回 | rejectReason |
| 退款拒绝 | rejectReason |
| 申诉驳回 | rejectReason |
| 黑名单拉入 | reason, type |
| 黑名单解除 | liftReason |
| 账户调账 | amount, reason, requestId |
| 交易冲正 | reason |

### 3.2 幂等请求

| API | 幂等字段 |
|-----|----------|
| POST `/account/{id}/adjust` | requestId |
| POST `/user/recharge` | requestId |
| POST `/trade/checkout` | requestId |
| POST `/refund/applications` | requestId |

### 3.3 二次确认弹窗

| 操作 | 确认文案 |
|------|----------|
| 删除档案 | 确认删除该人员档案？此操作不可恢复 |
| 冻结账户 | 确认冻结该账户？用户将无法消费 |
| 设备解绑 | 确认解绑该设备？ |
| 批量操作 | 确认对选中的 N 条记录执行操作？ |
| 配置保存 | 配置将立即生效，确认保存？ |

---

## 4. 审计日志要求

### 4.1 必须审计的模块

| 模块 | 审计操作 |
|------|----------|
| hr | CREATE, UPDATE, DELETE, IMPORT, EXPORT |
| org | CREATE, UPDATE, DELETE, MOVE |
| approval | PASS, REJECT |
| account | ADJUST, FREEZE, UNFREEZE |
| trade | CORRECT |
| refund | APPROVE, REJECT |
| appeal | ACCEPT, REJECT, RESOLVE |
| blacklist | ADD, LIFT |
| dish | CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH |
| device | BIND, UNBIND, COMMAND, RESTART |
| system | CONFIG_UPDATE |
| rbac | ROLE_CREATE, ROLE_UPDATE, PERMISSION_GRANT |

### 4.2 审计日志结构

```json
{
  "id": "uuid",
  "traceId": "request-trace-id",
  "operatorId": "admin_id",
  "operatorName": "张三",
  "module": "hr",
  "action": "UPDATE",
  "targetType": "User",
  "targetId": "user_id",
  "targetName": "李四",
  "beforeValue": { "phone": "13800000001" },
  "afterValue": { "phone": "13800000002" },
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "deptId": "dept_id",
  "canteenId": "canteen_id",
  "siteId": "site_id",
  "createdAt": "2026-02-04T13:47:00Z"
}
```
