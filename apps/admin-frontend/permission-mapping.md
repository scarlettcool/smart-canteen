# Sprint 1: 统一权限体系定义

### 1. 权限编码真值 (Code SOT)
后端统一采用 `PEOPLE_***` 大写蛇形命名作为唯一鉴权标识。

| 模块 | 权限编码 (Backend Code) | 页面元素控制 (Frontend Action) |
| :--- | :--- | :--- |
| 人员档案 | `PEOPLE_ARCHIVE_READ` | 查看列表、详情 |
| | `PEOPLE_ARCHIVE_WRITE` | 新增、修改、软删、禁用 |
| | `PEOPLE_ARCHIVE_IMPORT` | 上传 Excel、预录转正 |
| | `PEOPLE_ARCHIVE_EXPORT` | 点击导出按钮 |
| 组织架构 | `PEOPLE_ORG_READ` | 查看架构树 |
| | `PEOPLE_ORG_MANAGE` | 新增部门、移动节点、设负责人 |
| | `PEOPLE_ORG_AUDIT` | 查看架构变更历史 |
| 注册审批 | `PEOPLE_AUDIT_READ` | 查看申请列表、证件照 |
| | `PEOPLE_AUDIT_OPERATE` | 执行通过/驳回 |
| 人事配置 | `PEOPLE_CONFIG_ATTR` | 修改字段、字典、工号规则 |
| 黑名单 | `PEOPLE_BLACKLIST_READ` | 查看受限名录 |
| | `PEOPLE_BLACKLIST_ADMIN` | 强制拉黑、解除限制 |

### 2. 角色授权策略 (Default Policy)
*   **超级管理员 (SuperAdmin)**: 拥有 `PEOPLE_*` 全量权限，受“系统设置-管理员设置”保护，不可被普通人事删除。
*   **人事主管 (HR_Manager)**: 拥有 `ARCHIVE`、`ORG`、`AUDIT` 的所有 WRITE/MANAGE 权限。
*   **食堂管理员 (Canteen_Mgr)**: 仅拥有 `PEOPLE_ARCHIVE_READ` (仅限本餐厅所属域) 与 `PEOPLE_BLACKLIST_READ`。

### 3. 数据域隔离占位
*   查询接口均支持 `canteenId` 可选参数。
*   无此权限的人员尝试访问将触发 `40300` 错误。
