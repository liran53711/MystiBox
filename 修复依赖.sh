#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo
echo "========================================"
echo "   MystiBox 依赖修复脚本"
echo "========================================"
echo

echo -e "${BLUE}此脚本将修复常见的依赖冲突问题${NC}"
echo

# 修复前端依赖
echo -e "${BLUE}[1/3] 修复前端依赖...${NC}"
echo -e "${YELLOW}清理前端依赖...${NC}"
rm -rf node_modules package-lock.json

echo -e "${YELLOW}重新安装前端依赖...${NC}"
npm install --legacy-peer-deps
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 前端依赖修复完成${NC}"
else
    echo -e "${RED}❌ 前端依赖修复失败${NC}"
    exit 1
fi

# 修复后端依赖
echo
echo -e "${BLUE}[2/3] 修复后端依赖...${NC}"
cd backend
echo -e "${YELLOW}清理后端依赖...${NC}"
rm -rf node_modules package-lock.json

echo -e "${YELLOW}重新安装后端依赖...${NC}"
npm install --legacy-peer-deps
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 后端依赖修复完成${NC}"
else
    echo -e "${RED}❌ 后端依赖修复失败${NC}"
    exit 1
fi
cd ..

# 测试构建
echo
echo -e "${BLUE}[3/3] 测试构建...${NC}"
echo -e "${YELLOW}测试前端构建...${NC}"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 前端构建测试通过${NC}"
else
    echo -e "${RED}❌ 前端构建测试失败${NC}"
    echo -e "${YELLOW}请检查构建错误信息：${NC}"
    npm run build
    exit 1
fi

echo
echo "========================================"
echo -e "${GREEN}   依赖修复完成！${NC}"
echo "========================================"
echo
echo -e "${GREEN}✅ 前端依赖已修复${NC}"
echo -e "${GREEN}✅ 后端依赖已修复${NC}"
echo -e "${GREEN}✅ 构建测试通过${NC}"
echo
echo "现在您可以："
echo "1. 运行 ./一键启动.sh 启动项目"
echo "2. 运行 ./打包脚本.sh 打包项目"
echo "3. 运行 npm run dev 启动开发服务器"
echo
