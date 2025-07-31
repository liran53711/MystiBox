# 🎮 MystiBox - 神秘宠物盲盒收藏游戏

<div align="center">

![MystiBox Logo](https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=MystiBox)

**一个现代化的宠物盲盒收集游戏平台**

[![Vue 3](https://img.shields.io/badge/Vue-3.4.0-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.12.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

</div>

## 📋 项目信息

**前后端代码库地址**：https://github.com/liran53711/MystiBox.git

**打包平台说明**：macOS

**额外实现的功能描述**：
- 🎁 **完整积分兑换系统** - 多样化积分获得方式（喂养+8、进化+50、分享+25、聊天+1、点赞+5、评论+3、互动+2、抽卡奖励等），支持积分消费购买盲盒和道具
- 🐱 **宠物喂养及互动功能** - 宠物成长系统（幼体→成体）、多维度状态管理（饥饿度、快乐度、健康度）、个性化昵称设置、丰富的互动动画效果
- 👫 **好友互赠宠物功能** - 完整好友系统、实时聊天通讯、宠物和盲盒赠送、在线状态显示、赠送历史记录管理

## ✨ 项目特色

- 🎲 **沉浸式抽卡体验** - 华丽的4阶段开盒动画，营造悬念感
- 🐾 **完整宠物系统** - 从幼体到成体的成长过程，支持喂养和互动
- 👥 **丰富社交功能** - 好友系统、实时聊天、宠物展示和互赠
- 💎 **稀有度系统** - N/R/SR/SSR/UR 五个稀有度等级
- 🏪 **积分商城** - 多样化的积分获得和消费方式
- 📱 **响应式设计** - 完美适配桌面和移动端

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 一键启动

#### Windows 用户
```bash
# 双击运行
一键启动.bat
```

#### macOS/Linux 用户
```bash
# 在终端中运行
./一键启动.sh
```

### 访问应用
启动成功后，在浏览器中访问：**http://localhost:3000**

### 测试账户
- **管理员**：admin / admin123456
- **普通用户**：demo / demo123

## 📦 项目打包

### 什么是打包？
打包是将开发环境的源代码转换为生产环境可部署代码的过程：
- **前端打包**：将 Vue 组件、TypeScript、CSS 编译成浏览器可运行的静态文件
- **后端打包**：将 Node.js 应用及依赖打包成可部署的生产环境代码

### 如何打包项目？

#### 方法一：使用打包脚本（推荐）
```bash
# macOS/Linux 用户
./打包脚本.sh
```

#### 方法二：手动打包
```bash
# 1. 安装依赖（如遇依赖冲突，使用 --legacy-peer-deps）
npm install --legacy-peer-deps
cd backend && npm install --legacy-peer-deps && cd ..

# 2. 打包前端
npm run build

# 3. 准备后端生产环境
cd backend
npx prisma generate
cd ..
```

### 常见问题
如果遇到 `ERESOLVE unable to resolve dependency tree` 错误，请使用：
```bash
npm install --legacy-peer-deps
```

### 打包输出
- **前端**：`dist/` 目录 - 可部署到任何 Web 服务器的静态文件
- **后端**：生产环境就绪的 Node.js 应用
- **发布包**：包含完整部署文件的压缩包

### 打包文件说明
打包后的文件结构：
```
dist/                    # 前端静态文件
├── index.html          # 主页面
├── assets/             # 静态资源
│   ├── *.js           # JavaScript 文件
│   ├── *.css          # 样式文件
│   └── images/        # 图片资源
└── ...

MystiBox-Release/       # 完整发布包
├── frontend/          # 前端打包文件
├── backend/           # 后端源码
├── 启动生产环境.sh    # 生产环境启动脚本
└── 部署说明.md        # 部署文档
```

### 部署方式
1. **静态部署**：将 `dist/` 目录部署到 Nginx、Apache 等 Web 服务器
2. **Node.js 部署**：使用 `http-server` 等工具提供静态文件服务
3. **云平台部署**：支持 Vercel、Netlify、GitHub Pages 等平台

## 📖 详细文档

- 📋 [启动指南](./启动指南.md) - 详细的安装和启动说明
- 📊 [作业总结](./作业总结.md) - 项目功能完成情况和评分说明

## 🛠️ 技术栈

### 前端
- **框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **样式**：Tailwind CSS
- **HTTP 客户端**：Axios

### 后端
- **运行时**：Node.js
- **框架**：Express.js
- **数据库 ORM**：Prisma
- **数据库**：SQLite (开发) / PostgreSQL (生产)
- **身份认证**：JWT + bcrypt
- **安全**：Helmet, CORS

## 🎯 核心功能

### 基础功能 (8项)
- ✅ 多用户注册、登录
- ✅ 盲盒管理 (管理员)
- ✅ 盲盒抽取
- ✅ 盲盒订单管理
- ✅ 盲盒列表查看
- ✅ 盲盒详情查看
- ✅ 玩家秀 (社区分享)
- ✅ 盲盒搜索

### 附加功能
- 🎁 **积分兑换系统** - 多样化积分获得和消费
- 🐱 **宠物喂养互动** - 成长系统、昵称设置、互动动画
- 👫 **好友互赠功能** - 好友系统、实时聊天、宠物赠送

## 📱 页面导航

- **首页** - 项目介绍和快速导航
- **盲盒商店** - 浏览和购买盲盒系列
- **我的宠物** - 管理收集的宠物，喂养互动
- **宠物广场** - 社区分享，查看其他玩家的宠物
- **好友系统** - 添加好友，实时聊天，互赠礼物
- **个人中心** - 账户信息，抽取历史，积分管理
- **管理后台** - 系列管理，用户管理 (仅管理员)

## 🎨 设计亮点

### 用户体验
- 🎭 **沉浸式动画** - 15+ 种流畅的交互动画效果
- 📱 **响应式布局** - 完美适配各种屏幕尺寸
- ⚡ **性能优化** - 代码分割、懒加载、骨架屏
- 🎯 **直观操作** - 简洁明了的用户界面

### 技术特色
- 🔒 **安全可靠** - JWT认证、密码加密、SQL注入防护
- 🏗️ **架构清晰** - 组件化设计、模块化开发
- 📊 **数据完整** - 完善的数据模型和关系设计
- 🔧 **易于维护** - TypeScript类型安全、ESLint代码规范

## 🏆 项目成果

本项目完整实现了所有基础功能和多项附加功能，展现了现代 Web 开发的最佳实践：

- **功能完整度**：100% 完成所有基础功能
- **代码质量**：TypeScript + ESLint 保证代码质量
- **用户体验**：精美的界面设计和流畅的交互体验
- **技术架构**：清晰的前后端分离架构
- **安全性**：完善的身份认证和数据保护

## 📞 技术支持

如果在使用过程中遇到问题：

1. 查看 [启动指南](./启动指南.md) 中的故障排除部分
2. 确保满足环境要求 (Node.js >= 16.0.0)
3. 检查端口 3000 和 3003 是否被占用
4. 尝试清除缓存重新安装依赖

## 📄 许可证

本项目仅用于学习和演示目的。

---

<div align="center">

**🎮 开始您的宠物收集之旅吧！**

Made with ❤️ by MystiBox Team

</div>
