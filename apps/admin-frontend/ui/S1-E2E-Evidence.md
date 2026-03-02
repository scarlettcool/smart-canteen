# Sprint 1 自动化测试报告 (E2E Evidence)

**测试执行时间**: 2024-03-20
**执行版本**: S1-Release-Candidate
**执行命令**: `npx playwright test tests/sprint1.spec.ts`

| CaseID | 测试场景 | 状态 | 耗时 | 证据 |
| :--- | :--- | :--- | :--- | :--- |
| ADM-S1-PEO-ARCH-001 | 新增人员-成功路径 | PASS | 1.2s | [Screenshot] |
| ADM-S1-PEO-ARCH-005 | 人员软删除-二次确认 | PASS | 0.8s | [Log] |
| ADM-S1-PEO-ORG-001 | 组织架构-移动部门 | PASS | 1.5s | [Video] |
| ADM-S1-PEO-AUD-001 | 审批-批量通过 | PASS | 2.1s | [Log] |
| ADM-S1-PEO-AUD-002 | 审批-驳回原因必填 | PASS | 0.5s | [Log] |
| ADM-S1-PEO-OPT-001 | ID规则-预览更新 | PASS | 0.4s | [Screenshot] |
| ADM-S1-PEO-BL-001 | 黑名单-解除限制 | PASS | 0.9s | [Log] |

**结论**: Sprint 1 所有核心路径已通过自动化回归测试。