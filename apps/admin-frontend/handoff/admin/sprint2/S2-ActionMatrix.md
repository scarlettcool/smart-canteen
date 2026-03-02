# Sprint 2 动作矩阵 (Action Matrix)

| CaseID | 页面 | 按钮/动作 | 调用 API (Method+Path) | 权限点 | 成功反馈 | 失败反馈 | 审计 | data-testid | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ADM-S2-CONS-ACC-001 | 账户管理 | 列表查询 | `GET /consume/accounts` | `CONSUME_ACCOUNT_READ` | 列表渲染 | - | 否 | `page-account-management` | PASS |
| ADM-S2-CONS-ACC-002 | 账户管理 | 调账按钮 | - | `CONSUME_ACCOUNT_ADJUST` | 弹窗打开 | - | 否 | `btn-adjust-{staffId}` | PASS |
| ADM-S2-CONS-ACC-003 | 账户管理 | 确认执行 (调账) | `POST /consume/accounts/{id}/adjust` | `CONSUME_ACCOUNT_ADJUST` | 余额实时刷新 | 409: 重复提交 | 是 | `btn-submit-adjust` | PASS |
| ADM-S2-CONS-TRD-001 | 交易管理 | 冲正 | `POST /trades/{id}/correct` | `CONSUME_TRADE_CORRECT` | 状态标记 Corrected | 403: 账期已关 | 是 | `btn-trade-correct-{id}` | PASS |
| ADM-S2-CONS-RFD-001 | 退款审核 | 通过审批 | `POST /refunds/audit` | `CONSUME_REFUND_AUDIT` | 状态标记 Approved | 500: 支付网关异常 | 是 | `btn-approve-{id}` | PASS |
| ADM-S2-CONS-RFD-002 | 退款审核 | 驳回审批 | `POST /refunds/audit` | `CONSUME_REFUND_AUDIT` | 状态标记 Rejected | 400: 原因必填 | 是 | `btn-reject-{id}` | PASS |
| ADM-S2-CONS-RPT-001 | 报表中心 | 导出异步报表 | `GET /reports/{type}/export` | `CONSUME_REPORT_VIEW` | 任务创建提示 | 429: 排队中 | 是 | `btn-export-async` | PASS |
| ADM-S2-CONS-CFG-001 | 消费设置 | 保存全局配置 | `PUT /config/consumption` | `CONSUME_CONFIG_WRITE` | Toast: 策略已下发 | 400: 参数校验失败 | 是 | `btn-save-config` | PASS |
| ADM-S2-CONS-DEV-001 | 设备管理 | 远程重启 | `POST /devices/{id}/command` | `CONSUME_DEVICE_MANAGE` | Toast: 指令已入队 | 404: 设备不在线 | 是 | `btn-reboot-{id}` | PASS |
