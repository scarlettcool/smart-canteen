# Sprint 3 动作矩阵 (Action Matrix - Dishes 32-41)

| CaseID | 页面 | 按钮/动作 | 调用 API | 权限点 | 成功反馈 | 失败反馈 | 审计 | 测试状态 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ADM-S3-DISH-PUB-001 | 菜品发布 | 确认发布 | `POST /dishes/publish` | `DISH_PUBLISH_WRITE` | Toast: 发布成功 | 400: 日期冲突 | 是 | PASS |
| ADM-S3-DISH-ARCH-001 | 菜品资料 | 新增菜品 | `POST /dishes` | `DISH_ARCHIVE_WRITE` | 列表刷新 | 400: 参数缺失 | 是 | PASS |
| ADM-S3-DISH-ARCH-002 | 菜品资料 | 下架菜品 | `PUT /dishes/{id}/status` | `DISH_ARCHIVE_WRITE` | 状态变更为下架 | 403: 权限不足 | 是 | PASS |
| ADM-S3-DISH-RULE-001 | 消费规则 | 保存规则 | `PUT /dishes/rules` | `DISH_RULE_WRITE` | Toast: 规则已生效 | 400: 逻辑冲突 | 是 | PASS |
| ADM-S3-DISH-RES-001 | 订餐管理 | 导出订单 | `GET /dishes/reservations/export` | `DISH_RES_READ` | 文件下载 | 429: 频率限制 | 否 | PASS |
| ADM-S3-DISH-FBK-001 | 意见箱 | 回复意见 | `POST /dishes/feedback/{id}/reply` | `DISH_FEEDBACK_REPLY` | 标记为已回复 | 500: 发送失败 | 是 | PASS |
