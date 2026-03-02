# Sprint 1 路由与组件映射表 (Personnel Management 1-12)

| 编号 | 页面名称 | 路由路径 | 对应组件 | 依赖权限点 | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 人员档案 | `/people/archive/list` | `PeopleArchiveList` | `PEOPLE_ARCHIVE_READ` | 冻结 |
| 2 | 组织架构 | `/people/archive/org` | `OrgStructure` | `PEOPLE_ORG_READ` | 冻结 |
| 3 | 注册审批 | `/people/archive/approval` | `RegApproval` | `PEOPLE_AUDIT_READ` | 冻结 |
| 4 | 预录资料 | `/people/archive/prerecord` | `PreRecordedData` | `PEOPLE_ARCHIVE_IMPORT` | 冻结 |
| 5 | 离职人员表 | `/people/report/resigned` | `PeopleReports` | `PEOPLE_REPORT_READ` | 冻结 |
| 6 | 统计分析 | `/people/report/stats` | `PeopleStats` | `PEOPLE_REPORT_READ` | 冻结 |
| 7 | 近期生日表 | `/people/report/birthday` | `PeopleReports` | `PEOPLE_REPORT_READ` | 冻结 |
| 8 | 退休人员表 | `/people/report/retired` | `PeopleReports` | `PEOPLE_REPORT_READ` | 冻结 |
| 9 | 自定义属性 | `/people/option/attr` | `PeopleOptions` | `PEOPLE_CONFIG_ATTR` | 冻结 |
| 10 | 自定义选项 | `/people/option/dict` | `PeopleOptions` | `PEOPLE_CONFIG_ATTR` | 冻结 |
| 11 | 人员编号规则 | `/people/option/id-rule` | `PeopleOptions` | `PEOPLE_CONFIG_ATTR` | 冻结 |
| 12 | 黑名单管理 | `/people/option/blacklist` | `Blacklist` | `PEOPLE_BLACKLIST_READ` | 冻结 |
