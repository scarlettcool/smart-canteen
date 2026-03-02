# 账户管理页面规格书 (ADM-S2-CONS-ACC)

## 1. 页面基本信息
- **功能编号**: 13
- **路由路径**: `/consumption/accounts`
- **对应组件**: `AccountManagement.tsx`
- **权限点**: `CONSUME_ACCOUNT_READ`, `CONSUME_ACCOUNT_ADJUST`

## 2. 页面结构
### 2.1 统计概览 (Header)
- **展示字段**: 总账户数、总余额、今日调账笔数。

### 2.2 筛选区域
- **搜索框**: 支持工号、姓名模糊查询。
- **部门下拉**: 引用 `Department` 列表。
- **状态下拉**: `active` (正常), `frozen` (冻结)。

### 2.3 数据表格
- **列定义**:
  - `staffId`: 工号 (引用 `UserArchive.staffId`)
  - `name`: 姓名 (引用 `UserArchive.name`)
  - `deptName`: 部门 (引用 `UserArchive.deptName`)
  - `balance`: 余额 (引用 `UserArchive.balance`, 格式化为 ¥0.00)
  - `status`: 状态 (引用 `UserArchive.status`, 映射: 正常/冻结)
  - `lastTx`: 最后变动时间
- **操作列**:
  - 【详情】: `S2-C13-02`
  - 【调账】: `S2-C13-03`

## 3. 核心交互说明
### 3.1 调账弹窗 (S2-C13-03)
- **调账类型**: 
  - 手动充值 (`recharge`): `S2-C13-04`
  - 手动扣款 (`deduction`): `S2-C13-05`
- **输入校验**:
  - 金额: `amount > 0` (S2-C13-06)
  - 扣款拦截: 如果 `type === 'deduction'` 且 `amount > balance`，拦截并提示“余额不足” (修复 S2-C13-05)
  - 原因: `reason` 必填，不少于 5 字 (S2-C13-07)
- **提交行为**:
  - 开启 `loading` 禁用按钮 (S2-C13-11)
  - 携带 `X-Request-ID` (UUID) 保证幂等
  - 成功后关闭弹窗，**局部刷新表格数据** (修复 S2-C13-10)

## 4. CaseID 映射表 (data-testid)
| CaseID | UI 元素 | TestID |
| :--- | :--- | :--- |
| S2-C13-01 | 页面容器 | `page-account-management` |
| S2-C13-02 | 详情按钮 | `btn-detail-{staffId}` |
| S2-C13-03 | 调账按钮 | `btn-adjust-{staffId}` |
| S2-C13-04 | 充值 Tab | `tab-recharge` |
| S2-C13-05 | 扣款 Tab | `tab-deduction` |
| S2-C13-08 | 提交按钮 | `btn-submit-adjust` |
| S2-C13-10 | 余额单元格 | `cell-balance-{staffId}` |
