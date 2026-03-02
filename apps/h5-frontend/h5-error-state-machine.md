
# 错误码映射与业务状态机规范

## 1. 响应转换映射 (Response Mapping)
后端封包 (B 方案) `code` 将按以下规则映射至内部 `errorCode`：
- `0` -> `SUCCESS`
- `401` / `10001` -> `UNAUTHORIZED` (触发会话清除)
- `10002` -> `FORBIDDEN` (权限不足)
- `20001` -> `E2001` (余额不足)
- `30001` -> `E3001` (预约已满)
- `500` -> `SERVER_ERROR`

## 2. 核心状态机 (Core States)

### 2.1 员工认证流
- `Status: None` -> 填写 Form -> 提交后 `Status: Pending`
- `Status: Pending` -> (后台审核) -> `Status: Success` (全权限) / `Status: Rejected` (退回 Form)

### 2.2 支付原子性流
- `Start` -> 检查本地余额 -> `Checkout Call` -> 注入 `requestId` -> 等待 `800ms` -> `Success` (扣除本地余额) / `Fail` (回滚本地/提示充值)

## 3. 幂等性保障
- 客户端在 `apiClient.ts` 中通过 `crypto.randomUUID()` 对所有修改类请求注入 `X-Request-Id`。
- 若前端收到 `DUPLICATE_SUBMIT (429)`，将静默忽略或 Toast 提示“正在处理中”。
