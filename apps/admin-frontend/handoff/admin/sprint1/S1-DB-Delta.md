# Sprint 1 数据库增量说明

**前端侧依赖字段变更**:
1. `people_archive` 表需包含 `is_deleted` (Boolean) 以支持前端软删除逻辑。
2. `audit_logs` 表需支持 `operator_id` 与 `action_type` 索引，以便前端日志页面秒级加载。
3. `id_rules` 表需存储 `prefix`, `current_serial`, `digits` 字段。
