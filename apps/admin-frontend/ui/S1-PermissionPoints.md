# Sprint 1 权限点映射表

| 权限编码 | 描述 | 关联 CaseID | 映射组件/按钮 |
| :--- | :--- | :--- | :--- |
| `PEOPLE_ARCHIVE_READ` | 查看人员档案 | ADM-S1-PEO-ARCH-004 | 列表操作-详情 |
| `PEOPLE_ARCHIVE_WRITE` | 操作人员档案 | ADM-S1-PEO-ARCH-001, 002, 003, 005 | 新增、修改、删除 |
| `PEOPLE_ARCHIVE_EXPORT` | 导出人员档案 | ADM-S1-PEO-ARCH-006 | 列表工具栏-导出 |
| `PEOPLE_ORG_READ` | 查看组织架构 | - | 侧边栏-组织架构菜单 |
| `PEOPLE_ORG_MANAGE` | 维护组织架构 | ADM-S1-PEO-ORG-001 | 树节点拖拽、编辑按钮 |
| `PEOPLE_AUDIT_READ` | 查看注册申请 | ADM-S1-PEO-AUD-004 | 注册审批列表 |
| `PEOPLE_AUDIT_OPERATE` | 执行注册审批 | ADM-S1-PEO-AUD-001, 002, 003 | 批量通过、驳回 |
| `PEOPLE_CONFIG_ATTR` | 配置人事选项 | ADM-S1-PEO-OPT-001 | 属性修改、规则保存 |
| `PEOPLE_BLACKLIST_READ` | 查看黑名单 | - | 黑名单管理列表 |
| `PEOPLE_BLACKLIST_ADMIN` | 操作黑名单 | ADM-S1-PEO-BL-001 | 解除限制、拉入黑名单 |