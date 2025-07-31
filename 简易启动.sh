#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo
echo "========================================"
echo "   MystiBox 简易启动 (macOS/Linux)"
echo "========================================"
echo

echo -e "${BLUE}正在启动后端服务...${NC}"
cd backend
npm start &
BACKEND_PID=$!
cd ..

echo -e "${BLUE}等待后端启动...${NC}"
sleep 5

echo -e "${BLUE}正在启动前端服务...${NC}"
echo
echo "🚀 服务启动中..."
echo "📱 前端地址：http://localhost:3000"
echo "🔧 后端地址：http://localhost:3003"
echo
echo "💡 按 Ctrl+C 可以停止服务"
echo

# 设置清理函数
cleanup() {
    echo
    echo -e "${BLUE}正在停止服务...${NC}"
    kill $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}服务已停止${NC}"
    exit 0
}

# 捕获中断信号
trap cleanup SIGINT SIGTERM

# 启动前端服务
npm run dev

# 清理
cleanup
