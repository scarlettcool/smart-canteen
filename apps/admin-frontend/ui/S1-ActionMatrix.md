# Sprint 1 全按钮动作矩阵 (PEO 1-12)

| CaseID | 页面 | UI元素 | 前置条件 | API (Method+Path) | 成功反馈 | 失败反馈 | 权限点 | data-testid |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ADM-S1-PEO-ARCH-001 | 人员档案 | 确认保存 | 表单校验通过 | `POST /people/archives` | Toast+刷新 | 409:工号冲突 | `PEOPLE_ARCHIVE_WRITE` | `ADM-S1-PEO-ARCH-001` |
| ADM-S1-PEO-ARCH-002 | 人员档案 | 新增-取消 | 无 | - | 关闭弹窗 | - | `PEOPLE_ARCHIVE_WRITE` | `ADM-S1-PEO-ARCH-002` |
| ADM-S1-PEO-ARCH-003 | 人员档案 | 编辑-保存 | 修改内容合法 | `PUT /people/archives/{id}` | Toast+刷新 | 400:字段非法 | `PEOPLE_ARCHIVE_WRITE` | `ADM-S1-PEO-ARCH-003-{id}` |
| ADM-S1-PEO-ARCH-004 | 人员档案 | 查看详情 | 无 | `GET /people/archives/{id}` | 弹窗展示 | 404:档案失效 | `PEOPLE_ARCHIVE_READ` | `ADM-S1-PEO-ARCH-004-{id}` |
| ADM-S1-PEO-ARCH-005 | 人员档案 | 删除 | 二次确认 | `DELETE /people/archives/{id}` | Toast+状态变动 | 403:无权删除 | `PEOPLE_ARCHIVE_WRITE` | `ADM-S1-PEO-ARCH-005-{id}` |
| ADM-S1-PEO-ARCH-006 | 人员档案 | 批量导出 | 无 | `GET /people/export` | 下载文件 | 429:频率限制 | `PEOPLE_ARCHIVE_EXPORT` | `ADM-S1-PEO-ARCH-006` |
| ADM-S1-PEO-ORG-001 | 组织架构 | 移动部门 | 选中节点 | `PUT /org/move` | 树刷新 | 403:循环引用 | `PEOPLE_ORG_MANAGE` | `ADM-S1-PEO-ORG-001` |
| ADM-S1-PEO-AUD-001 | 注册审批 | 批量通过 | 选中多行 | `POST /approvals/batch` | 行移除 | 500:系统错误 | `PEOPLE_AUDIT_OPERATE` | `ADM-S1-PEO-AUD-001` |
| ADM-S1-PEO-AUD-002 | 注册审批 | 确认驳回 | 原因必填 | `POST /approvals/batch` | Toast+行移除 | 400:原因缺失 | `PEOPLE_AUDIT_OPERATE` | `ADM-S1-PEO-AUD-002` |
| ADM-S1-PEO-OPT-001 | 编号规则 | 预览生成 | 输入合法 | `POST /rules/preview` | 预览值更新 | 400:语法错误 | `PEOPLE_CONFIG_ATTR` | `ADM-S1-PEO-OPT-001` |
| ADM-S1-PEO-BL-001 | 黑名单 | 解除限制 | 二次确认 | `PUT /blacklist/{id}/lift` | 状态恢复 | 403:无权限 | `PEOPLE_BLACKLIST_ADMIN` | `ADM-S1-PEO-BL-001` |