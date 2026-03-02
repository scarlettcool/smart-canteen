# Sprint 2 全按钮动作矩阵 (CONS 13-31)

| CaseID | 页面 | UI元素 | 前置条件 | API (Method+Path) | 权限点 | data-testid | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ADM-S2-CONS-ACC-001 | 账户管理 | 列表查询 | 无 | `GET /consume/accounts` | `CONSUME_ACCOUNT_READ` | `page-account-management` | PASS |
| ADM-S2-CONS-ACC-002 | 账户管理 | 调账按钮 | 无 | - | `CONSUME_ACCOUNT_ADJUST` | `btn-adjust-{id}` | PASS |
| ADM-S2-CONS-ACC-003 | 账户管理 | 确认调账 | 原因>=5字, 金额>0 | `POST /consume/accounts/{id}/adjust` | `CONSUME_ACCOUNT_ADJUST` | `btn-submit-adjust` | PASS |
| ADM-S2-CONS-ACC-004 | 账户管理 | 调账-余额刷新 | 提交成功 | - | `CONSUME_ACCOUNT_ADJUST` | `cell-balance-{id}` | PASS |
| ADM-S2-CONS-ACC-005 | 账户管理 | 调账-扣款拦截 | 金额>余额 | - | `CONSUME_ACCOUNT_ADJUST` | `tab-deduction` | PASS |
| ADM-S2-CONS-TRD-001 | 交易管理 | 冲正动作 | 未冲正记录 | `POST /trades/{id}/correct` | `CONSUME_TRADE_CORRECT` | `btn-trade-correct-{id}` | PASS |
| ADM-S2-CONS-RFD-001 | 退款审核 | 通过审批 | 待审记录 | `POST /refunds/audit` | `CONSUME_REFUND_AUDIT` | `btn-approve-{id}` | PASS |
| ADM-S2-CONS-RFD-002 | 退款审核 | 驳回审批 | 原因必填 | `POST /refunds/audit` | `CONSUME_REFUND_AUDIT` | `btn-reject-{id}` | PASS |
| ADM-S2-CONS-RPT-001 | 报表中心 | 异步导出 | 选中范围 | `GET /reports/{type}/export` | `CONSUME_REPORT_VIEW` | `btn-export-async` | PASS |
| ADM-S2-CONS-CFG-001 | 消费设置 | 保存配置 | 数据合法 | `PUT /config/consumption` | `CONSUME_CONFIG_WRITE` | `btn-save-config` | PASS |
| ADM-S2-CONS-DEV-001 | 设备管理 | 远程重启 | 设备在线 | `POST /devices/{id}/command` | `CONSUME_DEVICE_MANAGE` | `btn-reboot-{id}` | PASS |