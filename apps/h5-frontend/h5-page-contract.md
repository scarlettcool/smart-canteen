
# Page-Action-Feedback 交互契约表

| 页面 | 关键动作 (Action) | API Endpoint | 成功反馈 | 失败反馈 (error-codes) | 交互 QA 验收点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Home | 扫码支付 | `N/A` (终端交互) | Toast 识别成功 | `FORBIDDEN` -> Register | 未认证点击应弹拦截提示 |
| Menu | 立即扣款 | `/orders/checkout` | 弹窗展示取餐号 | `E2001` -> 充值引导 | 按钮点击后必须 disabled 防止双扣 |
| Wallet | 确认支付 (充值) | `/wallet/recharge` | 结果页展示 TxnId | `NET_ERROR` -> Toast | 弱网环境下应有 Spinner |
| Reserve | 提交预约 | `/reservations` | 业务成功 Toast | `E3001` -> 名额满提示 | 批量选择时总数显示需实时更新 |
| Coupons | 激活礼券 | `/coupons/activate` | Toast 激活成功 | `E1005` -> 红字提示 | 激活码空时按钮置灰 |
| Profile | 退出登录 | `Internal` | 重置 Storage + 首页 | `N/A` | 点击后清除所有缓存并强制刷页 |
| Profile | 更换头像 | `N/A` (Mock) | Toast 权限请求成功 | `N/A` | 弹出 ActionSheet 选择相机/相册 |
