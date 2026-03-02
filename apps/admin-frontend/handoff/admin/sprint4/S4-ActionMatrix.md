# Sprint 4 动作矩阵 (Action Matrix - System 42-54)

| CaseID | 页面 | 按钮/动作 | 调用 API | 权限点 | 成功反馈 | 失败反馈 | 审计 | 测试状态 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ADM-S4-SYS-LOG-001 | 操作日志 | 导出日志 | `GET /system/logs/export` | `SYS_LOG_EXPORT` | 文件下载 | 401: 未授权 | 否 | PASS |
| ADM-S4-SYS-ROLE-001 | 角色管理 | 新增角色 | `POST /system/roles` | `SYS_ROLE_WRITE` | 列表刷新 | 409: 编码重复 | 是 | PASS |
| ADM-S4-SYS-ROLE-002 | 角色管理 | 分配权限 | `PUT /system/roles/{id}/perms` | `SYS_ROLE_WRITE` | Toast: 权限已更新 | 400: 参数错误 | 是 | PASS |
| ADM-S4-SYS-ADMIN-001 | 管理员设置 | 重置密码 | `POST /system/admins/{id}/reset-pwd` | `SYS_ADMIN_WRITE` | 弹出新密码 | 403: 禁止操作超管 | 是 | PASS |
| ADM-S4-SYS-WXP-001 | 微信配置 | 测试连接 | `GET /system/wechat/test` | `SYS_CONFIG_WRITE` | Toast: 连接成功 | 502: 网关超时 | 否 | PASS |
