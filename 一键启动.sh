#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 打印标题
echo
echo "========================================"
echo "   MystiBox 宠物盲盒游戏 一键启动"
echo "========================================"
echo

# 检查 Node.js 是否安装
echo "[1/6] 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    print_error "未检测到 Node.js"
    echo "请先安装 Node.js (版本 16.0.0 或更高)"
    echo "下载地址：https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js 版本：$NODE_VERSION"

# 检查 npm 是否可用
echo
echo "[2/6] 检查 npm 包管理器..."
if ! command -v npm &> /dev/null; then
    print_error "npm 不可用"
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm 版本：$NPM_VERSION"

# 安装前端依赖
echo
echo "[3/6] 安装前端依赖..."
if [ ! -d "node_modules" ]; then
    print_info "正在安装前端依赖，请稍候..."
    npm install
    if [ $? -ne 0 ]; then
        print_warning "标准安装失败，尝试使用 --legacy-peer-deps..."
        npm install --legacy-peer-deps
        if [ $? -ne 0 ]; then
            print_error "前端依赖安装失败"
            exit 1
        fi
    fi
    print_success "前端依赖安装完成"
else
    print_success "前端依赖已存在，跳过安装"
fi

# 安装后端依赖
echo
echo "[4/6] 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    print_info "正在安装后端依赖，请稍候..."
    npm install
    if [ $? -ne 0 ]; then
        print_warning "标准安装失败，尝试使用 --legacy-peer-deps..."
        npm install --legacy-peer-deps
        if [ $? -ne 0 ]; then
            print_error "后端依赖安装失败"
            cd ..
            exit 1
        fi
    fi
    print_success "后端依赖安装完成"
else
    print_success "后端依赖已存在，跳过安装"
fi

# 检查并创建环境配置文件
echo
echo "[5/7] 检查环境配置..."
if [ ! -f ".env" ]; then
    print_info "正在创建环境配置文件..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        print_info "创建默认环境配置..."
        cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
JWT_SECRET="mystibox-jwt-secret-key-2024"
PORT=3003
FRONTEND_URL="http://localhost:3000"
EOF
    fi
    print_success "环境配置文件创建完成"
else
    print_success "环境配置文件已存在"
fi

# 初始化数据库
echo
echo "[6/7] 初始化数据库..."
if [ ! -f "prisma/dev.db" ]; then
    print_info "正在初始化数据库..."
    npx prisma generate
    if [ $? -ne 0 ]; then
        print_error "Prisma 客户端生成失败"
        cd ..
        exit 1
    fi
    npx prisma db push
    if [ $? -ne 0 ]; then
        print_error "数据库创建失败"
        cd ..
        exit 1
    fi
    if [ -f "prisma/seed.js" ]; then
        print_info "正在填充测试数据..."
        node prisma/seed.js
    fi
    print_success "数据库初始化完成"
else
    print_success "数据库已存在，跳过初始化"
    print_info "正在更新 Prisma 客户端..."
    npx prisma generate > /dev/null 2>&1
fi

cd ..

# 启动服务
echo
echo "[7/7] 启动服务..."
echo
print_info "🚀 正在启动 MystiBox 服务..."
echo
echo "📱 前端地址：http://localhost:3000"
echo "🔧 后端地址：http://localhost:3003"
echo
echo "💡 提示："
echo "   - 按 Ctrl+C 可以停止服务"
echo "   - 首次启动可能需要较长时间"
echo "   - 如遇问题请查看启动指南.md"
echo

# 创建临时脚本来启动后端
cat > start_backend.sh << 'EOF'
#!/bin/bash
cd backend
npm start
EOF

chmod +x start_backend.sh

# 启动后端服务（后台运行）
print_info "启动后端服务..."
./start_backend.sh &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务
print_info "启动前端服务..."
echo
echo "========================================"
echo "  服务启动完成！请在浏览器中访问："
echo "  http://localhost:3000"
echo "========================================"
echo

# 设置清理函数
cleanup() {
    echo
    print_info "正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    rm -f start_backend.sh
    print_success "服务已停止"
    exit 0
}

# 捕获中断信号
trap cleanup SIGINT SIGTERM

# 启动前端服务
npm run dev

# 清理
cleanup
