#!/bin/bash

echo "========================================"
echo "   MystiBox 生产环境启动"
echo "========================================"
echo

# 检查并安装后端依赖
cd backend
if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install --production
fi

# 检查环境配置
if [ ! -f ".env" ]; then
    echo "创建生产环境配置..."
    cp .env.example .env
    echo "请编辑 backend/.env 文件配置生产环境参数"
fi

# 初始化数据库
if [ ! -f "prisma/dev.db" ]; then
    echo "初始化数据库..."
    npx prisma db push
    if [ -f "prisma/seed.js" ]; then
        node prisma/seed.js
    fi
fi

echo "启动后端服务..."
npm start &

cd ..

echo
echo "🚀 MystiBox 生产环境已启动！"
echo "📱 前端文件位置：./frontend/"
echo "🔧 后端服务：http://localhost:3003"
echo
echo "请将 frontend/ 目录部署到 Web 服务器"
echo "或使用 http-server 等工具提供静态文件服务"
echo
