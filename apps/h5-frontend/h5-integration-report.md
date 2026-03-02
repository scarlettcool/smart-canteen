
# H5 联调集成报告 (Integration Matrix)

| 页面文件 | 交互动作 | 前端函数 | API 路径 (OpenAPI) | 错误码映射 | E2E 用例 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CanteenMenu.tsx` | 立即支付 | `executePayment` | `POST /orders/checkout` | `E001` -> 充值引导 | `E2E-ORD-01` |
| `Wallet.tsx` | 确认充值 | `handleRecharge` | `POST /wallet/recharge` | `NET_ERROR` -> 重试 | `E2E-WAL-01` |
| `Reservation.tsx` | 提交预约 | `handleSubmit` | `POST /reservations` | `E3001` -> 日期已满 | `E2E-RES-01` |
| `Coupons.tsx` | 激活礼券 | `handleRedeem` | `POST /coupons/activate` | `E005` -> 码无效 | `E2E-CPN-01` |
| `Register.tsx` | 提交注册 | `handleSubmit` | `POST /auth/register` | `E1001` -> 工号不存在 | `E2E-REG-01` |
| `Profile.tsx` | 退出登录 | `handleLogout` | `Internal (LocalClear)` | `N/A` | `E2E-PRO-01` |

## 关键适配点
1. **统一 Header**: 所有请求已包含 `Authorization: Bearer` (若有) 及 `X-Request-Id` (Mutating 请求)。
2. **错误处理**: `E001` 自动关联 UI 跳转至 `/wallet`；`UNAUTHORIZED` 自动清理本地并跳转至首页。
