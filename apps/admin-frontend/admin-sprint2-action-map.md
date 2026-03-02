# Sprint 2 页面动作映射表 (Action Map)

| 页面 | 操作 | API (Path/Method) | 权限点 | 成功反馈 | 失败反馈 | 是否审计 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **账户管理** | 余额调整 (调账) | `/accounts/{id}/adjust` (POST) | `CONSUME_ACCOUNT_ADJUST` | Toast: 调账成功 | 提示: 409 (重复提交) / 400 (金额错误) | 是 |
| **账户管理** | 账户冻结/解冻 | `/accounts/{id}/status` (PUT) | `CONSUME_ACCOUNT_ADJUST` | 状态标签动态更新 | 提示: 403 (权限不足) | 是 |
| **交易管理** | 交易流水冲正 | `/trades/{id}/correct` (POST) | `CONSUME_TRADE_CORRECT` | 状态标记为 "Corrected" | 提示: 403 (账期已关不可冲正) | 是 |
| **退款审核** | 审批通过/驳回 | `/refunds/audit` (POST) | `CONSUME_REFUND_AUDIT` | 列表项移除 + 消息通知 | 提示: 500 (三方支付通信异常) | 是 |
| **失约申诉** | 申诉审核处理 | `/appeals/{id}/handle` (POST) | `CONSUME_APPEAL_HANDLE` | Toast: 已解除限制 | 提示: 400 (凭证不合规) | 是 |
| **报表中心** | 导出 Excel 报表 | `/reports/{type}/export` (GET) | `CONSUME_REPORT_VIEW` | 通知: 导出任务已在后台排队 | 提示: 429 (导出任务过多) | 是 |
| **消费设置** | 保存全局配置 | `/config/consumption` (PUT) | `CONSUME_CONFIG_WRITE` | 提示: 策略已更新并下发 | 提示: 400 (参数校验失败) | 是 |
| **设备管理** | 下发远程重启指令 | `/devices/{id}/command` (POST) | `CONSUME_DEVICE_MANAGE` | Toast: 指令已发送至设备 | 提示: 404 (设备不在线) | 是 |