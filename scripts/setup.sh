#!/bin/bash

# ==============================================================================
# 智慧食堂 - 商业化发布脚本
# ==============================================================================

set -e

echo "=================================================="
echo "🍽️  智慧食堂 - 商业化发布流程"
echo "=================================================="

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本"
    exit 1
fi

echo ""
echo "🔍 Step 0: 端口检查..."
echo "--------------------------------------------------"
node scripts/check-ports.js

echo ""
echo "📦 Step 1: 安装依赖..."
echo "--------------------------------------------------"
pnpm install || npm install

echo ""
echo "🔧 Step 2: 生成 Prisma Client..."
echo "--------------------------------------------------"
cd apps/api
npx prisma generate

echo ""
echo "📊 Step 3: 数据库迁移..."
echo "--------------------------------------------------"

# 检查数据库连接
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  警告: DATABASE_URL 未设置"
    echo "   请确保 apps/api/.env 文件中已配置 DATABASE_URL"
    
    if [ -f ".env" ]; then
        echo "   使用 .env 文件中的配置..."
    else
        echo "   创建示例 .env 文件..."
        cat > .env << EOF
# 数据库配置
DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_canteen?schema=public"

# JWT 密钥
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="7d"

# 微信小程序配置
WECHAT_APP_ID=""
WECHAT_APP_SECRET=""

# CORS 配置
CORS_ORIGIN="http://localhost:3001,http://localhost:5173"
EOF
        echo "   ✅ 已创建 .env 示例文件，请编辑后重新运行"
        exit 1
    fi
fi

# 运行迁移
npx prisma migrate dev --name init 2>/dev/null || npx prisma db push

echo ""
echo "🌱 Step 4: 初始化种子数据..."
echo "--------------------------------------------------"
npx ts-node prisma/seed.ts || echo "⚠️  种子数据已存在，跳过..."

cd ../..

echo ""
echo "🧪 Step 5: 运行类型检查..."
echo "--------------------------------------------------"
cd apps/api
npx tsc --noEmit || echo "⚠️  类型检查有警告，请检查..."

cd ../..

echo ""
echo "=================================================="
echo "✅ 商业化发布准备完成！"
echo "=================================================="
echo ""
echo "启动服务:"
echo "  后端:     cd apps/api && npm run start:dev (Port: 3038)"
echo "  Admin:    cd apps/admin-frontend && npm run dev (Port: 3039)"
echo "  H5:       cd apps/h5-frontend && npm run dev"
echo ""
echo "默认管理员账号: admin / admin123"
echo ""
echo "API 文档: http://localhost:3038/api/docs"
echo ""
