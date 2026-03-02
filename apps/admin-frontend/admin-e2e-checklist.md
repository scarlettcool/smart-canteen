# Sprint 1-2 E2E 验收与静态自检映射表

## 1. 静态自检映射表 (前端动作与 API 对照)

| 页面 | 触发按钮/操作 | 触发 API (Prefix: /api/admin) | 权限点 | 成功反馈 | 失败反馈 | 审计日志 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **人员列表** | 新增档案 | `POST /people/archives` | `PEOPLE_ARCHIVE_WRITE` | Toast + 列表刷新 | 409: 工号冲突 | 是 |
| **注册审批** | 批量通过 | `POST /approvals/batch` | `PEOPLE_AUDIT_OPERATE` | 已选行移除 | 400: 参数缺失 | 是 |
| **组织架构** | 移动部门 | `PUT /org/move` | `PEOPLE_ORG_MANAGE` | 树形节点重绘 | 403: 无权修改 | 是 |
| **账户管理** | 执行调账 | `POST /consume/accounts/:id/adjust` | `CONSUME_ACCOUNT_ADJUST` | 弹窗关闭+余额更新 | 409: 重复提交 | 是 |
| **交易管理** | 冲正 | `POST /consume/trades/:id/correct` | `CONSUME_TRADE_CORRECT` | 状态标记 Corrected | 403: 账期已关 | 是 |
| **退款审核** | 通过并执行 | `POST /consume/refunds/audit` | `CONSUME_REFUND_AUDIT` | 记录移除+异步通知 | 500: 网关异常 | 是 |
| **报表中心** | 导出 Excel | `GET /consume/reports/:type/export` | `CONSUME_REPORT_VIEW` | 弹出 "任务已创建" | 429: 请求频繁 | 是 |
| **消费设置** | 保存全局配置 | `PUT /consume/config` | `CONSUME_CONFIG_WRITE` | 按钮 Loading 结束 | 400: 格式非法 | 是 |
| **设备管理** | 重启设备 | `POST /consume/devices/:id/command` | `CONSUME_DEVICE_MANAGE` | Toast: 指令已下发 | 404: 设备不在线 | 是 |

## 2. 功能验收状态汇总

### Sprint 1 (1-12)
- [x] 人员档案管理 (1): 支持增删改查。
- [x] 组织架构 (2): 支持树形管理与负责人设置。
- [x] 注册审批 (3): 支持批量操作与驳回校验。
- [x] 黑名单管控 (12): 支持全链路拦截 UI 逻辑。

### Sprint 2 (13-31)
- [x] 账户/流水 (13-14): 幂等调账 UI 闭环。
- [x] 退款审核 (15): 审批状态机 UI 闭环。
- [x] 报表中心 (17-29): 13 类报表展示及导出触发闭环。
- [x] 消费设置 (30): 全局策略保存闭环。
- [x] 设备管理 (31): 指令下发反馈闭环。

---
**验收结论**: Sprint 1 & 2 前端功能已达到冻结标准，契约完整，可支持与 Antigravity 后端联调。