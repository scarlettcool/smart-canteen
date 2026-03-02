# 智慧食堂数据库模型设计 (V3.1)

## 1. 用户与认证 (User & Auth)
### `users` (员工主表)
- `id`: UUID (PK)
- `staff_id`: VARCHAR(20) (UNIQUE, 员工工号)
- `name`: VARCHAR(50) (姓名)
- `phone`: VARCHAR(11) (手机号)
- `department_id`: INT (关联部门)
- `reg_status`: ENUM('none', 'pending', 'success', 'rejected') (审核状态)
- `balance`: DECIMAL(12, 2) (DEFAULT 0.00, 账户余额)
- `created_at`: TIMESTAMP

## 2. 资源管理 (Canteen & Dishes)
### `canteens` (食堂表)
- `id`: INT (PK)
- `name`: VARCHAR(100)
- `location`: TEXT
- `is_open`: BOOLEAN (营业状态)
- `open_hours`: JSON (营业时间段配置)

### `dishes` (菜品表)
- `id`: UUID (PK)
- `canteen_id`: INT (FK)
- `name`: VARCHAR(100)
- `category`: VARCHAR(50) (分类：精品套餐、小炒等)
- `price`: DECIMAL(8, 2)
- `stock`: INT (当日库存)
- `tags`: JSON (标签：热销、推荐)
- `is_available`: BOOLEAN

## 3. 交易与流水 (Transactions)
### `wallet_logs` (账务流水表)
- `id`: UUID (PK, 外部流水号)
- `user_id`: UUID (FK)
- `amount`: DECIMAL(12, 2) (金额，正为存，负为取)
- `type`: ENUM('recharge', 'payment', 'refund')
- `related_order_id`: UUID (关联业务单号)
- `balance_after`: DECIMAL(12, 2) (变动后余额，审计用)

### `orders` (点餐订单表)
- `id`: UUID (PK)
- `user_id`: UUID (FK)
- `canteen_id`: INT (FK)
- `total_amount`: DECIMAL(12, 2)
- `status`: ENUM('pending', 'paid', 'completed', 'cancelled')
- `pickup_code`: VARCHAR(10) (取餐码)

## 4. 预约与排队 (Reservations & Queue)
### `reservations` (预约表)
- `id`: UUID (PK)
- `user_id`: UUID (FK)
- `meal_date`: DATE
- `meal_type`: ENUM('breakfast', 'lunch', 'dinner')
- `status`: ENUM('pending', 'used', 'expired', 'cancelled')

### `queues` (排队表)
- `id`: UUID (PK)
- `service_type`: VARCHAR(20) (如: barber)
- `queue_number`: VARCHAR(10) (如: A12)
- `status`: ENUM('waiting', 'calling', 'finished', 'skipped')

## 5. 数据约束与索引
- **唯一约束**: `users.staff_id` 确保工号唯一。
- **复合索引**: `reservations(user_id, meal_date)` 提高用户记录查询速度。
- **精度控制**: 金额统一使用 `DECIMAL(12, 2)`，禁止使用 `FLOAT`。
