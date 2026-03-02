# 智慧食堂系统路由映射表 (Sprint 1-2 完整版)

| 序号 | 业务模块 | 菜单路径 | 路由 Path | 对应组件 | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 人事管理 | 人事资料 > 人员档案 | `/people/archive/list` | `PeopleArchiveList` | 已交付 |
| 2 | 人事管理 | 人事资料 > 组织架构 | `/people/archive/org` | `OrgStructure` | 已交付 |
| 3 | 人事管理 | 人事资料 > 注册审批 | `/people/archive/approval` | `RegApproval` | 已交付 |
| 4 | 人事管理 | 人事资料 > 预录资料 | `/people/archive/prerecord` | `PreRecordedData` | 已交付 |
| 5-8 | 人事管理 | 人事报表 | `/people/report/*` | `PeopleReports` | 已交付 |
| 9-11 | 人事管理 | 人事选项 | `/people/option/*` | `PeopleOptions` | 已交付 |
| 12 | 人事管理 | 人事选项 > 黑名单管理 | `/people/option/blacklist` | `Blacklist` | 已交付 |
| 13 | 消费管理 | 账户管理 | `/consumption/accounts` | `AccountManagement` | 已交付 |
| 14 | 消费管理 | 交易明细 | `/consumption/trade/tx` | `TradeManagement` | 已交付 |
| 15 | 消费管理 | 退款审核 | `/consumption/trade/refund` | `RefundAudit` | 已交付 |
| 16 | 消费管理 | 失约申诉 | `/consumption/trade/appeal` | `AppealProcess` | 已交付 |
| 17-29| 消费管理 | 报表中心 | `/consumption/report/:type` | `ReportCenter` | 已交付 |
| 30 | 消费管理 | 消费设置 | `/consumption/config` | `ConsumptionConfig` | 已交付 |
| 31 | 消费管理 | 设备管理 | `/consumption/devices` | `DeviceManagement` | 已交付 |