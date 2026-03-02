
# 封包适配技术说明 (Envelope Adapter)

## 1. 适配目标
兼容后端可能出现的两种主要 JSON 结构，并将其标准化为前端易读的 `UnifiedResponse`。

## 2. A 方案适配 (Standard Result)
```json
{
  "success": false,
  "data": null,
  "message": "余额不足",
  "errorCode": "E2001"
}
```
**转化结果**: `ok=false, errorCode=E2001, message="余额不足"`

## 3. B 方案适配 (Legacy/Common Code)
```json
{
  "code": 10001,
  "data": null,
  "message": "Unauthorized access",
  "traceId": "9b1deb4d-3b7d-4bad"
}
```
**转化结果**: `ok=false, errorCode=UNAUTHORIZED, traceId="...", message="..."`

## 4. 无包装直接返回 (Raw Data)
若返回数组或不含特定 Key 的对象，`apiClient` 将透传 `ok=true` 并直接返回该数据。
