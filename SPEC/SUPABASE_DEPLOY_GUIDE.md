# 🚀 Supabase 数据库接入指南（傻瓜式）

> 适合完全不懂技术的用户，按步骤操作即可

---

## 第一步：注册 Supabase（2-3分钟）

1. 打开浏览器，访问：https://supabase.com
2. 点击右上角 **"Start your project"** 按钮
3. 选择 **"Continue with GitHub"** 或 **"Continue with Google"**（用你的 Google 账号登录）
4. 登录后，点击 **"New Project"**
5. 填写信息：
   - **Organization**：选默认
   - **Project name**：填 `smart-canteen`（随便填）
   - **Database Password**：**设一个你记得住的密码**（很重要！记下来）
   - **Region**：选 `Southeast Asia (Singapore)` 或 `Northeast Asia (Tokyo)`
6. 点击 **"Create new project"**，等待约 2 分钟

---

## 第二步：获取数据库连接字符串（1分钟）

1. 项目创建好后，在左侧菜单找到 **"Settings"**（齿轮图标）
2. 点击 **"Database"**
3. 向下滚动找到 **"Connection string"** 区域
4. 选择 **"URI"** 标签
5. 复制那串以 `postgresql://` 开头的字符串
   - 看起来像这样：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **把 `[YOUR-PASSWORD]` 替换成你第一步设的密码**

> ⚠️ 注意：复制的字符串里有 `[YOUR-PASSWORD]` 占位符，必须替换成真实密码

---

## 第三步：告诉 AI 你的连接字符串

把你复制好的字符串（含真实密码）发给 AI，AI 会帮你：
- 自动更新配置文件
- 运行数据库初始化命令
- 创建所有表结构和初始数据

---

## 第四步（AI 来做）：运行迁移和种子数据

```bash
# AI 会帮你运行这些命令：
cd /Users/cocorui/Desktop/newtest/智慧食堂/apps/api
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

---

## 完成后你可以访问

| 服务 | 地址 |
|------|------|
| 后端 API | http://localhost:3038 |
| Admin 后台 | http://localhost:3039 |
| H5 前端 | http://localhost:3040 |
| 数据库管理 | Supabase 控制台（在线可视化） |

---

## 🎁 Supabase 免费额度（完全够用测试）

| 资源 | 免费额度 |
|------|----------|
| 数据库存储 | 500MB |
| 带宽 | 5GB/月 |
| API 请求 | 无限 |
| 数据库连接 | 60个并发 |

**测试和小规模使用完全免费！**
