# Sprint 2 消费管理 (13-31) E2E 验收自测报告

| 功能编号 | 功能点 | 状态 | 页面路径 | 操作结果 / 缺失说明 |
| :--- | :--- | :--- | :--- | :--- |
| 13 | 账户管理 | 已实现 | `/consumption/accounts` | 列表查询、手动调账（含金额/原因）、账户冻结/解冻 UI 闭环。 |
| 14 | 交易明细 | 已实现 | `/consumption/trade/tx` | 流水展示、业务类型筛选、单笔冲正动作触发 UI 闭环。 |
| 15 | 退款审核 | 已实现 | `/consumption/trade/refund` | 待审/历史页签切换、通过/驳回动作及状态机转换。 |
| 16 | 失约申诉 | 已实现 | `/consumption/trade/appeal` | 申诉列表、凭证预览占位、处理结果反馈。 |
| 17 | 消费明细表 | 已实现 | `/consumption/report/detail` | 动态路由报表，支持表头渲染与数据占位。 |
| 18 | 个人汇总表 | 已实现 | `/consumption/report/user-summary` | 同上，支持按人员聚合展示。 |
| 19 | 日期汇总表 | 已实现 | `/consumption/report/date-summary` | 同上，支持按日期维度展示。 |
| 20 | 金额统计 | 已实现 | `/consumption/report/amount-stats` | 同上。 |
| 21 | 餐厅汇总表 | 已实现 | `/consumption/report/canteen-summary` | 同上。 |
| 22 | 部门汇总表 | 已实现 | `/consumption/report/dept-summary` | 同上。 |
| 23 | 设备汇总表 | 已实现 | `/consumption/report/device-summary` | 同上。 |
| 24 | 预定统计 | 已实现 | `/consumption/report/order-stats` | 同上。 |
| 25 | 充值退款表 | 已实现 | `/consumption/report/recharge` | 同上。 |
| 26 | 综合统计表 | 已实现 | `/consumption/report/total` | 同上。 |
| 27 | 补交差价表 | 已实现 | `/consumption/report/diff` | 同上。 |
| 28 | 个人综合表 | 已实现 | `/consumption/report/personal` | 同上。 |
| 29 | 经营趋势分析 | 已实现 | `/consumption/report/trend` | 同上。 |
| 30 | 消费设置 | 已实现 | `/consumption/config` | 安全限额、餐补策略保存逻辑 UI 闭环。 |
| 31 | 设备管理 | 已实现 | `/consumption/devices` | 在线率监控看板、设备列表、远程重启指令 UI 闭环。 |
| 15-Gap | 原路退回执行 | 占位 | `/consumption/trade/refund` | **依赖第三方**：需后端对接微信/支付宝退款接口。 |
| 17-Gap | 报表异步导出 | 占位 | `/consumption/report/*` | **依赖文件服务**：需后端实现 Excel 生成与 OSS 上传任务。 |
| 31-Gap | 实时状态推送 | 占位 | `/consumption/devices` | **依赖硬件/后端**：设备在线状态需后端推送 (WebSocket/MQTT)。 |