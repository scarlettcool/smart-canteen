# 系统权限点清单 (Sprint 1-2 完整版)

| 模块 | 权限编码 (Backend Code) | 描述 |
| :--- | :--- | :--- |
| **人员管理** | `PEOPLE_ARCHIVE_READ` | 查看人员档案列表及详情 |
| | `PEOPLE_ARCHIVE_WRITE` | 新增、修改、软删人员档案 |
| | `PEOPLE_ARCHIVE_IMPORT` | 执行 Excel 批量导入与预录转正 |
| | `PEOPLE_ORG_MANAGE` | 调整组织架构层级及负责人 |
| | `PEOPLE_AUDIT_OPERATE` | 执行注册申请的通过或驳回 |
| | `PEOPLE_CONFIG_ATTR` | 修改自定义属性、字典及编号规则 |
| | `PEOPLE_BLACKLIST_ADMIN` | 拉入/解除黑名单限制 |
| **消费管理** | `CONSUME_ACCOUNT_READ` | 查看账户余额、变动流水 |
| | `CONSUME_ACCOUNT_ADJUST` | 执行手动调账、充值及账户冻结 |
| | `CONSUME_TRADE_READ` | 查看全量交易明细报表 |
| | `CONSUME_TRADE_CORRECT` | 执行交易流水冲正 (Correcting) |
| | `CONSUME_REFUND_AUDIT` | 审核退款申请 |
| | `CONSUME_APPEAL_HANDLE` | 处理失约申诉 |
| | `CONSUME_REPORT_VIEW` | 查看报表中心所有报表类型 |
| | `CONSUME_CONFIG_WRITE` | 修改全局消费限额与餐补策略 |
| | `CONSUME_DEVICE_MANAGE` | 绑定设备、下发远程指令 |