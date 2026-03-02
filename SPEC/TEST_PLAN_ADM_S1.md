# Admin Frontend Test Plan - Sprint 1 & 2 Focus

## 1. People Archive Management (人员档案管理)
**Page:** `/people/archive` (人员档案)

| ID | Component | Action | Expected Result | Status |
|----|-----------|--------|-----------------|--------|
| P1-1 | **Header** | Check Page Title | Display "人员档案管理" | ✅ |
| P1-2 | **Header** | Click "批量导出" | Alert "批量导出功能已触发 (Mock)" | ✅ |
| P1-3 | **Header** | Click "Excel导入" | Alert "Excel导入功能待实现" | ✅ |
| P1-4 | **Header** | Click "新增档案" | Open "新增人员档案" Modal | ✅ |
| P1-5 | **Add Modal** | Submit Empty | Alert "请填写必要信息" | ✅ |
| P1-6 | **Add Modal** | Submit Valid Data | Create success, Modal close, List refresh | ✅ |
| P1-7 | **List** | Check Columns | StaffId, Name, Phone, Status (Active=Green) | ✅ |
| P1-8 | **Row Action** | Click "Detail" (Eye) | Open "人员详情" Modal, Fields are Read-only | ✅ |
| P1-9 | **Detail Modal**| Click "Close" | Modal closes | ✅ |
| P1-10| **Row Action** | Click "Edit" (Pencil) | Open "编辑人员档案" Modal, Fields pre-filled | ✅ |
| P1-11| **Edit Modal** | Modify Name & Save | Update success, List reflects change | ✅ |
| P1-12| **Row Action** | Click "Delete" (Trash) | Show Confirm Dialog | ✅ |
| P1-13| **Row Action** | Confirm Delete | Delete success, Row removed from list | ✅ |

## 2. Account Management (账户余额管理)
**Page:** `/consumption/accounts` (账户余额)

| ID | Component | Action | Expected Result | Status |
|----|-----------|--------|-----------------|--------|
| A1-1 | **Header** | Check Page Title | Display "账户余额管理" | ✅ |
| A1-2 | **Search** | Enter Keyword & Enter | Filtered list displayed | ✅ |
| A1-3 | **List** | Check Balance Column | Format `¥0.00`, colored | ✅ |
| A1-4 | **Row Action** | Click "Detail" (Eye) | Alert with Name & Balance | ✅ |
| A1-5 | **Row Action** | Click "调账" (Adjust) | Open "账户调账" Modal | ✅ |
| A1-6 | **Adjust Modal** | Check Current Balance | Display correct value | ✅ |
| A1-7 | **Adjust Modal** | Select "手动充值" | Tab active, "确认执行" button blue | ✅ |
| A1-8 | **Adjust Modal** | Validation (Empty/Neg) | Alert "请输入有效的大于 0 的金额" | ✅ |
| A1-9 | **Adjust Modal** | Validation (Short Reason)| Alert "请填写简单的调账原因" | ✅ |
| A1-10| **Adjust Modal** | Submit Recharge | Success Alert, Modal Close, Balance Increase | ✅ |
| A1-11| **Adjust Modal** | Select "手动扣款" | Tab active, "确认执行" button red | ✅ |
| A1-12| **Adjust Modal** | Validation (Overdraft) | Alert "余额不足" | ✅ |
| A1-13| **Adjust Modal** | Submit Deduction | Success Alert, Balance Decrease | ✅ |

## 3. Trade Management (交易明细)
**Page:** `/consumption/trades` (交易明细)

| ID | Component | Action | Expected Result | Status |
|----|-----------|--------|-----------------|--------|
| T1-1 | **List** | Check Data Load | Rows displayed | ✅ |
| T1-2 | **Header** | Click "导出" | Alert "导出任务已提交" | ✅ |
| T1-3 | **Row Action** | Click "详情" | Alert "详情" | ✅ |
| T1-4 | **Row Action** | Click "冲正" (Correct) | Prompt for reason | ✅ |
| T1-5 | **Correct** | Submit Reason | Success Alert, Status becomes "corrected" | ✅ |
