@echo off
chcp 65001 >nul
title MystiBox 简易启动

echo.
echo ========================================
echo    MystiBox 简易启动 (Windows)
echo ========================================
echo.

echo 正在启动后端服务...
start /b cmd /c "cd backend && npm start"

echo 等待后端启动...
timeout /t 5 /nobreak >nul

echo 正在启动前端服务...
echo.
echo 🚀 服务启动中...
echo 📱 前端地址：http://localhost:3000
echo 🔧 后端地址：http://localhost:3003
echo.
echo 💡 按 Ctrl+C 可以停止服务
echo.

npm run dev

pause
