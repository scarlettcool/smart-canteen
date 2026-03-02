# Sprint 1: 页面-动作-真实接口对照表

| 业务模块 | 页面动作 | 真实接口 Path (Prefix: /api/admin) | 成功反馈方式 | 失败/ErrorCode |
| :--- | :--- | :--- | :--- | :--- |
| **1 人员档案** | 获取列表 | `GET /people/archives` | 列表渲染 + Loading 消失 | `40100` / `40300` |
| | 新增/修改档案 | `POST/PUT /people/archives` | 全局 Toast "操作成功" | `40901` (工号冲突) |
| | 批量导入 | `POST /people/import` | 进度条/任务 jobId 轮询 | `42201` (部分失败) |
| **2 组织架构** | 获取架构树 | `GET /org/tree` | 树形节点展开 | `40400` (根节点丢失) |
| | 移动部门 | `PUT /org/move` | 确认弹窗消失 + 树刷新 | `40300` (无权操作) |
| **3 注册审批** | 批量通过/驳回 | `POST /approvals/batch` | 操作行状态更新为"已处理" | `40001` (驳回原因必填) |
| **4 预录资料** | 转正入库 | `POST /pre-records/convert` | 跳转/标记为已入库 | `40901` (手机号已存在) |
| **6 统计分析** | 刷新看板 | `GET /reports/stats/overview` | 图表动画重绘 | `50000` (聚合超时) |
| **11 编号规则** | 规则预览 | `POST /rules/id-generate/preview` | 预览框实时显示生成结果 | `40001` (表达式错误) |
| **12 黑名单** | 解除限制 | `PUT /blacklist/:id/lift` | 状态变为"正常" | `40300` (操作受限) |
