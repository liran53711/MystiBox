@echo off
chcp 65001 >nul
title MystiBox 一键启动脚本

echo.
echo ========================================
echo    MystiBox 宠物盲盒游戏 一键启动
echo ========================================
echo.

:: 检查 Node.js 是否安装
echo [1/6] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未检测到 Node.js
    echo 请先安装 Node.js ^(版本 16.0.0 或更高^)
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本：%NODE_VERSION%

:: 检查 npm 是否可用
echo.
echo [2/6] 检查 npm 包管理器...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：npm 不可用
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm 版本：%NPM_VERSION%

:: 安装前端依赖
echo.
echo [3/6] 安装前端依赖...
if not exist "node_modules" (
    echo 正在安装前端依赖，请稍候...
    npm install
    if errorlevel 1 (
        echo ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 前端依赖安装完成
) else (
    echo ✅ 前端依赖已存在，跳过安装
)

:: 安装后端依赖
echo.
echo [4/6] 安装后端依赖...
cd backend
if not exist "node_modules" (
    echo 正在安装后端依赖，请稍候...
    npm install
    if errorlevel 1 (
        echo ❌ 后端依赖安装失败
        cd ..
        pause
        exit /b 1
    )
    echo ✅ 后端依赖安装完成
) else (
    echo ✅ 后端依赖已存在，跳过安装
)

:: 检查并创建环境配置文件
echo.
echo [5/7] 检查环境配置...
if not exist ".env" (
    echo 正在创建环境配置文件...
    copy .env.example .env >nul 2>&1
    if errorlevel 1 (
        echo 创建默认环境配置...
        echo DATABASE_URL="file:./dev.db" > .env
        echo JWT_SECRET="mystibox-jwt-secret-key-2024" >> .env
        echo PORT=3003 >> .env
        echo FRONTEND_URL="http://localhost:3000" >> .env
    )
    echo ✅ 环境配置文件创建完成
) else (
    echo ✅ 环境配置文件已存在
)

:: 初始化数据库
echo.
echo [6/7] 初始化数据库...
if not exist "prisma\dev.db" (
    echo 正在初始化数据库...
    npx prisma generate
    if errorlevel 1 (
        echo ❌ Prisma 客户端生成失败
        cd ..
        pause
        exit /b 1
    )
    npx prisma db push
    if errorlevel 1 (
        echo ❌ 数据库创建失败
        cd ..
        pause
        exit /b 1
    )
    if exist "prisma\seed.js" (
        echo 正在填充测试数据...
        node prisma\seed.js
    )
    echo ✅ 数据库初始化完成
) else (
    echo ✅ 数据库已存在，跳过初始化
    echo 正在更新 Prisma 客户端...
    npx prisma generate >nul 2>&1
)

cd ..

:: 启动服务
echo.
echo [7/7] 启动服务...
echo.
echo 🚀 正在启动 MystiBox 服务...
echo.
echo 📱 前端地址：http://localhost:3000
echo 🔧 后端地址：http://localhost:3003
echo.
echo 💡 提示：
echo    - 按 Ctrl+C 可以停止服务
echo    - 首次启动可能需要较长时间
echo    - 如遇问题请查看启动指南.md
echo.

:: 启动后端服务（后台运行）
echo 启动后端服务...
start /b cmd /c "cd backend && npm start"

:: 等待后端启动
timeout /t 3 /nobreak >nul

:: 启动前端服务
echo 启动前端服务...
echo.
echo ========================================
echo   服务启动完成！请在浏览器中访问：
echo   http://localhost:3000
echo ========================================
echo.

npm run dev

pause
