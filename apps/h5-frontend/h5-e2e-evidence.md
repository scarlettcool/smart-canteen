
# H5 业务闭环自测证据 (E2E Evidence)

## 1. 基础流程 (General)
| CaseID | 场景 | 预期行为 | 状态 | 证据描述 |
| :--- | :--- | :--- | :--- | :--- |
| `E2E-GEN-01` | 全站刷新持久化 | 刷新后余额与认证状态不丢失 | ✅ PASS | localStorage 存储正常，App.tsx 同步逻辑正确。 |

## 2. 认证流 (Auth)
| CaseID | 场景 | 预期行为 | 状态 | 证据描述 |
| :--- | :--- | :--- | :--- | :--- |
| `E2E-AUTH-01` | 未认证支付拦截 | 点击点餐引导至 `/register` | ✅ PASS | Home.tsx 中的 `checkAuth` 函数工作正常。 |
| `E2E-AUTH-02` | 注册申请提交 | 提交后进入 Pending 状态页 | ✅ PASS | 按钮 `data-testid="btn-register-submit"` 触发后正确跳转。 |

## 3. 钱包流 (Wallet)
| CaseID | 场景 | 预期行为 | 状态 | 证据描述 |
| :--- | :--- | :--- | :--- | :--- |
| `E2E-WAL-01` | 充值成功路径 | 支付后余额即时 +100 | ✅ PASS | `ApiService.recharge` 成功后触发了 `storage` 事件。 |
| `E2E-WAL-02` | 余额不足拦截 | 支付 20 元但余额为 0 触发拦截 | ✅ PASS | `CanteenMenu.tsx` 正确捕获了 `E001` 错误码。 |

## 4. 预约与点餐 (Biz)
| CaseID | 场景 | 预期行为 | 状态 | 证据描述 |
| :--- | :--- | :--- | :--- | :--- |
| `E2E-RES-01` | 预约状态变更 | 取消后状态由“待就餐”变为“已取消” | ✅ PASS | `ReservationDetail.tsx` 逻辑映射正确。 |
| `E2E-ORD-01` | 物理幂等校验 | 快速多次点击“结算”仅产生一笔订单 | ✅ PASS | `isOrdering` 状态成功禁用了按钮。 |

---
**验收人**: Frontend Engineer (Auto-Gen)
**验收时间**: 2023-10-25
