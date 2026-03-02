# 注册审批页面规格书 (ADM-S1-PEO-AUD)

## 1. 页面基本信息
- **路由**: `/people/archive/approval`
- **权限**: `PEOPLE_AUDIT_OPERATE`, `PEOPLE_AUDIT_READ`

## 2. 结构定义
### 2.1 统计栏
- 展示 `Pending` 状态的申请总数。

### 2.2 数据表格 (Columns)
- `id`: 申请 ID
- `name`: 申请人
- `phone`: 手机号
- `deptName`: 预选部门
- `submitTime`: 提交时间
- `status`: 状态 (pending | passed | rejected)

## 3. 动作矩阵 (Action Matrix)
| CaseID | 动作 | 预期行为 | 校验/约束 |
| :--- | :--- | :--- | :--- |
| ADM-S1-PEO-AUD-001 | 批量通过 (T04) | 勾选多行 -> 提示确认 -> 生成档案 | 必须选中记录 |
| ADM-S1-PEO-AUD-002 | 驳回提交 (T05) | 输入驳回原因 -> 提交 | `reason` 必填 |
| ADM-S1-PEO-AUD-003 | 单条通过 | 单行操作 -> 状态变更 | - |
| ADM-S1-PEO-AUD-004 | 查看资料 | 弹窗展示证件照与手机号 | - |

## 4. 交互细节
- 驳回弹窗需强制拦截空输入。
- 通过操作需触发后端自动建档逻辑。
