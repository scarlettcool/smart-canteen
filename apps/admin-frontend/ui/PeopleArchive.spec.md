# 人员档案管理页面规格书 (ADM-S1-PEO-ARCH)

## 1. 页面基本信息
- **路由**: `/people/archive/list`
- **权限**: `PEOPLE_ARCHIVE_READ`, `PEOPLE_ARCHIVE_WRITE`, `PEOPLE_ARCHIVE_EXPORT`
- **主要实体**: `UserArchive` (引用 types.ts)

## 2. 结构定义
### 2.1 筛选器
- **部门**: 下拉选择 (Department Tree)
- **状态**: `active` | `suspended` | `resigned`
- **余额预警**: 勾选框 (`balance < threshold`)

### 2.2 数据表格 (Columns)
- `staffId`: 工号 (String)
- `name`: 姓名 (String)
- `deptName`: 部门 (String)
- `phone`: 手机 (Masked)
- `balance`: 账户余额 (Decimal)
- `status`: 状态 (Enum)
- `createTime`: 入库时间 (DateTime)

## 3. 动作矩阵 (Action Matrix)
| CaseID | 动作 | 预期行为 | 契约字段 |
| :--- | :--- | :--- | :--- |
| ADM-S1-PEO-ARCH-001 | 新增提交 | 成功后列表刷新 + Toast | `Person` |
| ADM-S1-PEO-ARCH-002 | 新增-取消 | 关闭弹窗，无数据变动 | - |
| ADM-S1-PEO-ARCH-003 | 编辑-保存 | 更新现有记录 | `Person` |
| ADM-S1-PEO-ARCH-004 | 详情查看 | 侧滑/弹窗展示全量字段 | `Person` |
| ADM-S1-PEO-ARCH-005 | 删除 (软删) | 二次确认 -> 状态变 `resigned` | `isDeleted` |
| ADM-S1-PEO-ARCH-006 | 批量导出 | 异步任务触发 | `export_job_id` |
| ADM-S1-PEO-ARCH-007 | 模板下载 | 下载 `.xlsx` 模板 | - |
| ADM-S1-PEO-ARCH-008 | 导入-提交 | 解析文件并报告结果 | `ImportJob` |

## 4. 校验规则
- `staffId`: 唯一性校验 (40901)
- `phone`: 格式校验 (Regular Expression)
