# Sprint 1 路由映射表 (PEO 模块 1-12)

| 功能编号 | 业务模块 | 菜单路径 | 路由 Path | 对应组件 | 依赖权限 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 人事管理 | 人事资料 > 人员档案 | `/people/archive/list` | `PeopleArchiveList` | `PEOPLE_ARCHIVE_READ` |
| 2 | 人事管理 | 人事资料 > 组织架构 | `/people/archive/org` | `OrgStructure` | `PEOPLE_ORG_READ` |
| 3 | 人事管理 | 人事资料 > 注册审批 | `/people/archive/approval` | `RegApproval` | `PEOPLE_AUDIT_READ` |
| 4 | 人事管理 | 人事资料 > 预录资料 | `/people/archive/prerecord` | `PreRecordedData` | `PEOPLE_ARCHIVE_IMPORT` |
| 5 | 人事管理 | 人事报表 > 离职人员表 | `/people/report/resigned` | `PeopleReports` | `PEOPLE_REPORT_READ` |
| 6 | 人事管理 | 人事报表 > 统计分析 | `/people/report/stats` | `PeopleStats` | `PEOPLE_REPORT_READ` |
| 7 | 人事管理 | 人事报表 > 近期生日人员表 | `/people/report/birthday` | `PeopleReports` | `PEOPLE_REPORT_READ` |
| 8 | 人事管理 | 人事报表 > 退休人员表 | `/people/report/retired` | `PeopleReports` | `PEOPLE_REPORT_READ` |
| 9 | 人事管理 | 人事选项 > 自定义属性 | `/people/option/attr` | `PeopleOptions` | `PEOPLE_CONFIG_ATTR` |
| 10 | 人事管理 | 人事选项 > 自定义选项 | `/people/option/dict` | `PeopleOptions` | `PEOPLE_CONFIG_ATTR` |
| 11 | 人事管理 | 人事选项 > 人员编号规则 | `/people/option/id-rule` | `PeopleOptions` | `PEOPLE_CONFIG_ATTR` |
| 12 | 人事管理 | 人事选项 > 黑名单管理 | `/people/option/blacklist` | `Blacklist` | `PEOPLE_BLACKLIST_READ` |