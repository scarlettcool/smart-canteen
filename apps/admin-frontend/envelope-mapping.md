# 接口封包 (Envelope) 统一策略

### 1. 管理后台响应格式 (标准规范)
全系统统一采用 `AdminResponse`，不再区分微信端与 PC 端。

```json
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "traceId": "uuid-v4-string"
}
```

### 2. 微信端 (H5/Applet) 适配策略 (Anti-gravity 层)
若存量微信端需要 `success: boolean` 或不同 `errorCode`，由 BFF 层或网关层进行以下映射，**禁止修改后端核心业务代码**。

| 字段名 (SOT) | 微信端映射 | 说明 |
| :--- | :--- | :--- |
| `code == 0` | `success: true` | 映射为布尔值 |
| `code != 0` | `success: false` | 映射为布尔值 |
| `code` | `errorCode` | 直接透传或映射为微信特有 code |
| `traceId` | `requestId` | 保持一致，便于跨端查日志 |

### 3. 核心错误码对齐
*   `0`: 成功 (OK)
*   `40001`: 参数校验错误 (Validation Error)
*   `40100`: 未登录 (Unauthorized)
*   `40300`: 无权限 (Forbidden)
*   `40400`: 资源不存在 (Not Found)
*   `40901`: 数据冲突/重复 (Conflict)
*   `50000`: 服务器内部错误 (Internal Error)
