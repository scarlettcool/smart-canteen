# E2E Test Fixtures

This directory contains fixture files for E2E tests.

## Files

| File | Purpose |
|------|---------|
| `import-personnel-test.xlsx` | Test file for personnel import with valid and invalid rows |
| `downloaded-template.xlsx` | Downloaded template (generated during test) |

## Import Test File Structure

The `import-personnel-test.xlsx` should contain:

### Sheet 1: Valid Records
| 姓名 | 工号 | 手机号 | 部门 |
|------|------|--------|------|
| 张三 | E00000001 | 13800000001 | 技术部 |
| 李四 | E00000002 | 13800000002 | 财务部 |

### Sheet 2: Invalid Records (for error testing)
| 姓名 | 工号 | 手机号 | 部门 | 预期错误 |
|------|------|--------|------|----------|
| | E00000003 | 13800000003 | 技术部 | 姓名必填 |
| 王五 | | 13800000004 | 技术部 | 工号必填 |
| 赵六 | E00000005 | 123 | 技术部 | 手机格式错误 |

## Creating Test Files

For CI, create a Node.js script to generate Excel files:

```javascript
const XLSX = require('xlsx');

const validData = [
  { 姓名: '测试员工1', 工号: 'E10000001', 手机号: '13800000001', 部门: '技术部' },
  { 姓名: '测试员工2', 工号: 'E10000002', 手机号: '13800000002', 部门: '财务部' },
];

const invalidData = [
  { 姓名: '', 工号: 'E10000003', 手机号: '13800000003', 部门: '技术部' },
  { 姓名: '测试员工4', 工号: '', 手机号: '13800000004', 部门: '技术部' },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(validData), 'ValidData');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invalidData), 'InvalidData');
XLSX.writeFile(wb, 'import-personnel-test.xlsx');
```
