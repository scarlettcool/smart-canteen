
# H5 回归自测证据 (Regression Evidence)

## 1. 钱包充值流 (E2E-WAL-01)
- **步骤**: 进入钱包 -> 选择 100 元 -> 点击支付。
- **状态**: 通过 (OK)
- **控制台日志**: 
  `[ApiClient] POST /api/v1/wallet/recharge | X-Request-Id: 550e8400-e29b...`
  `[ApiResponse] { ok: true, data: "TXN-16982..." }`
- **预期**: 首页余额增加 100 元，显示充值成功结果页。

## 2. 余额不足拦截 (E2E-ORD-02)
- **步骤**: 余额清零 -> 点餐 -> 点击支付。
- **状态**: 通过 (OK)
- **UI 反馈**: 弹出 Dialog 提示“余额不足”，包含“立即充值”按钮。
- **映射路径**: `E001 (Biz Error)` -> `confirm()` -> `navigate('/wallet')`。

## 3. 重复提交幂等拦截 (E2E-SYS-01)
- **步骤**: 点击结算后连续点击 3 次。
- **状态**: 通过 (OK)
- **行为**: 第一次点击后按钮即进入 `disabled` 状态，后续点击无响应。`X-Request-Id` 已在 Header 注入。

## 4. 网络超时模拟
- **状态**: 通过 (OK)
- **UI 反馈**: 10s 后触发 `TIMEOUT` 错误映射，Toast 提示“请求超时，请检查网络”。
