# 退款审核页面规格书 (ADM-S2-CONS-RFD)

## 1. 页面基本信息
- **功能编号**: 15
- **路由路径**: `/consumption/trade/refund`
- **对应组件**: `RefundAudit.tsx`
- **权限点**: `CONSUME_REFUND_AUDIT`

## 2. 页面结构
### 2.1 状态页签 (Tabs)
- **待审核**: 统计 `status: 'pending'` 的数量。
- **已处理**: 展示已通过或已驳回的记录。

### 2.2 数据表格
- **列定义**:
  - `id`: 申请单号 (引用 `RefundApplication.id`)
  - `tradeId`: 关联交易号 (引用 `RefundApplication.tradeId`)
  - `applicant`: 申请人 (引用 `RefundApplication.applicant`)
  - `amount`: 退款金额 (引用 `RefundApplication.amount`)
  - `reason`: 申请原因 (引用 `RefundApplication.reason`)
  - `applyTime`: 申请时间 (引用 `RefundApplication.applyTime`)
  - `status`: 当前状态 (pending, approved, rejected)

## 3. 核心交互说明
### 3.1 审批详情 (S2-C15-02)
- 点击详情按钮打开侧滑抽屉或模态框，展示完整申请资料。

### 3.2 审批操作 (S2-C15-03, S2-C15-04)
- 【通过】: 弹出二次确认。点击确认后调用审批接口，成功后从“待审核”列表移除。
- 【驳回】: 弹出输入框要求填写“驳回原因”。
  - **原因必填校验**: 如果输入为空，拦截提交并提示 (S2-C15-05)。

### 3.3 并发保护 (S2-C15-06)
- 点击提交后，按钮进入 `loading` 状态并禁用，防止在网络延迟期间重复触发。

## 4. CaseID 映射表 (data-testid)
| CaseID | UI 元素 | TestID |
| :--- | :--- | :--- |
| S2-C15-01 | 页面容器 | `page-refund-audit` |
| S2-C15-02 | 详情按钮 | `btn-detail-{id}` |
| S2-C15-03 | 通过按钮 | `btn-approve-{id}` |
| S2-C15-04 | 驳回按钮 | `btn-reject-{id}` |
| S2-C15-05 | 驳回输入框 | `input-reject-reason` |
| S2-C15-06 | 确认提交按钮 | `btn-confirm-action` |
