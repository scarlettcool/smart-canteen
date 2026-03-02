# Sprint 1 自动化验收证据 (E2E Evidence)

**执行环境**: Playwright Headless
**报告路径**: `reports/sprint1/e2e.html`

| CaseID | 测试描述 | 结果 | 截图证据 |
| :--- | :--- | :--- | :--- |
| ADM-S1-PEO-ARCH-001 | 新增档案-成功流 | PASS | s1_arch_001.png |
| ADM-S1-PEO-ARCH-005 | 软删除-二次确认流 | PASS | s1_arch_005.png |
| ADM-S1-PEO-AUD-002 | 驳回-原因必填校验 | PASS | s1_aud_002.png |
| ADM-S1-PEO-ORG-001 | 组织架构-实时重绘 | PASS | s1_org_001.png |

**执行命令**: `npx playwright test --grep @Sprint1`
