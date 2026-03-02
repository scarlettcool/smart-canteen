# Sprint 1 动作矩阵 (Action Matrix)

| CaseID | 页面 | 按钮/动作 | 调用 API (Method+Path) | 权限点 | 成功反馈 | 失败反馈 | 审计 | data-testid | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ADM-S1-PEO-ARCH-001 | 人员档案 | 确认保存 (新增) | `POST /people/archives` | `PEOPLE_ARCHIVE_WRITE` | Toast: 创建成功 | 409: 工号冲突 | 是 | `ADM-S1-PEO-ARCH-001` | PASS |
| ADM-S1-PEO-ARCH-002 | 人员档案 | 新增-取消 | - | - | 弹窗关闭 | - | 否 | `ADM-S1-PEO-ARCH-002` | PASS |
| ADM-S1-PEO-ARCH-003 | 人员档案 | 编辑-保存 | `PUT /people/archives/{id}` | `PEOPLE_ARCHIVE_WRITE` | Toast: 修改成功 | 400: 参数校验失败 | 是 | `ADM-S1-PEO-ARCH-003-{id}` | PASS |
| ADM-S1-PEO-ARCH-004 | 人员档案 | 查看详情 | `GET /people/archives/{id}` | `PEOPLE_ARCHIVE_READ` | 侧滑/弹窗展示 | 404: 档案不存在 | 否 | `ADM-S1-PEO-ARCH-004-{id}` | PASS |
| ADM-S1-PEO-ARCH-005 | 人员档案 | 删除 (软删) | `DELETE /people/archives/{id}` | `PEOPLE_ARCHIVE_WRITE` | 列表刷新 | 403: 无权限 | 是 | `ADM-S1-PEO-ARCH-005-{id}` | PASS |
| ADM-S1-PEO-ARCH-006 | 人员档案 | 批量导出 | `GET /people/export` | `PEOPLE_ARCHIVE_EXPORT` | 文件下载 | 429: 请求过载 | 是 | `ADM-S1-PEO-ARCH-006` | PASS |
| ADM-S1-PEO-AUD-001 | 注册审批 | 批量通过 | `POST /approvals/batch` | `PEOPLE_AUDIT_OPERATE` | 选中行消失 | 500: 系统错误 | 是 | `ADM-S1-PEO-AUD-001` | PASS |
| ADM-S1-PEO-AUD-002 | 注册审批 | 确认驳回 | `POST /approvals/batch` | `PEOPLE_AUDIT_OPERATE` | 选中行消失 | 400: 原因必填 | 是 | `ADM-S1-PEO-AUD-002` | PASS |
| ADM-S1-PEO-OPT-001 | 编号规则 | 保存并生效 | `POST /rules/id-generate` | `PEOPLE_CONFIG_ATTR` | Toast: 配置生效 | 400: 规则非法 | 是 | `ADM-S1-PEO-OPT-001` | PASS |
| ADM-S1-PEO-BL-001 | 黑名单 | 解除限制 | `PUT /blacklist/{id}/lift` | `PEOPLE_BLACKLIST_ADMIN` | 状态变为正常 | 403: 禁止操作 | 是 | `ADM-S1-PEO-BL-001` | PASS |
