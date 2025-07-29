# MystiBox - 神秘宠物盲盒收藏游戏

🎮 一个基于Vue 3 + Node.js的宠物盲盒收藏游戏，支持抽卡、宠物收藏、社区分享等功能。

## 📋 项目概述

MystiBox是一个全栈Web应用，包含：
- **前端**：Vue 3 + TypeScript + Tailwind CSS
- **后端**：Node.js + Express + Prisma + SQLite
- **功能**：用户认证、盲盒抽卡、宠物收藏、社区分享、管理后台

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 2. 启动项目

#### 方法一：分别启动（推荐）

**启动后端服务器：**
```bash
# 在项目根目录下
cd backend
npm run dev
```
后端将运行在：http://localhost:3003

**启动前端服务器：**
```bash
# 新开一个终端，在项目根目录下
npm run dev
```
前端将运行在：http://localhost:3000

#### 方法二：一键启动
```bash
# 在项目根目录下（如果配置了并发启动脚本）
npm run start:all
```

### 3. 访问应用

打开浏览器访问：**http://localhost:3000**

## 🌐 页面导航

### 主要页面

| 页面 | URL | 功能描述 |
|------|-----|----------|
| 🏠 主页 | http://localhost:3000 | 欢迎页面，项目介绍 |
| 🛍️ 盲盒商店 | http://localhost:3000/store | 浏览系列，进行抽卡 |
| 🐾 我的宠物 | http://localhost:3000/my-pets | 查看收藏，宠物管理 |
| 🎮 宠物广场 | http://localhost:3000/plaza | 社区分享，查看他人宠物 |
| 👤 个人中心 | http://localhost:3000/account | 用户信息，抽卡历史 |
| 🔧 管理后台 | http://localhost:3000/admin | 系列管理（需管理员权限） |

### API接口

| 接口 | URL | 功能 |
|------|-----|------|
| 健康检查 | http://localhost:3003/health | 检查后端服务状态 |
| 用户认证 | http://localhost:3003/api/v1/auth/* | 登录注册相关 |
| 盲盒系列 | http://localhost:3003/api/v1/series/* | 系列和宠物数据 |
| 抽卡功能 | http://localhost:3003/api/v1/draw/* | 抽卡相关接口 |

## 🛠️ 开发管理

### 前端开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 后端开发

```bash
cd backend

# 启动开发服务器（自动重启）
npm run dev

# 启动生产服务器
npm start

# 数据库操作
npm run db:migrate    # 运行数据库迁移
npm run db:seed      # 填充测试数据
npm run db:reset     # 重置数据库
```

### 数据库管理

```bash
cd backend

# 查看数据库
npx prisma studio

# 生成Prisma客户端
npx prisma generate

# 推送数据库变更
npx prisma db push
```

## 🔧 故障排除

### 常见问题

#### 1. 页面空白/无法加载
```bash
# 重启前端服务器
# 按 Ctrl+C 停止服务器，然后重新运行
npm run dev
```

#### 2. 后端连接失败
```bash
# 检查后端是否运行
curl http://localhost:3003/health

# 重启后端服务器
cd backend
npm run dev
```

#### 3. 端口被占用
```bash
# 查看端口占用
lsof -i :3000  # 前端端口
lsof -i :3003  # 后端端口

# 杀死占用进程
kill -9 <PID>
```

#### 4. TypeScript编译错误
```bash
# 清除缓存重新启动
rm -rf node_modules/.vite
npm run dev
```

#### 5. 数据库问题
```bash
cd backend
# 重置数据库
npm run db:reset
# 重新填充数据
npm run db:seed
```

### 开发工具

#### 浏览器开发者工具
- 按 `F12` 打开开发者工具
- `Console` 标签查看JavaScript错误
- `Network` 标签查看API请求
- `Application` 标签查看本地存储

#### VS Code推荐插件
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- Prisma

## 📁 项目结构

```
MystiBox/
├── src/                    # 前端源码
│   ├── api/               # API请求封装
│   ├── components/        # Vue组件
│   ├── composables/       # 组合式函数
│   ├── router/           # 路由配置
│   ├── store/            # 状态管理
│   ├── types/            # TypeScript类型
│   ├── utils/            # 工具函数
│   └── views/            # 页面组件
├── backend/               # 后端源码
│   ├── src/              # 后端逻辑
│   ├── prisma/           # 数据库配置
│   └── package.json      # 后端依赖
├── public/               # 静态资源
└── package.json          # 前端依赖
```

## 🎯 使用指南

### 新用户体验流程

1. **访问主页** → http://localhost:3000
2. **注册账号** → 点击右上角"登录"按钮
3. **浏览商店** → 点击"开始探索"进入盲盒商店
4. **进行抽卡** → 选择系列，点击"单抽"或"十连抽"
5. **查看收藏** → 导航栏点击"我的宠物"
6. **社区分享** → 导航栏点击"宠物广场"

### 管理员功能

1. **访问后台** → http://localhost:3000/admin
2. **系列管理** → 添加/编辑盲盒系列
3. **宠物管理** → 管理系列中的宠物
4. **用户管理** → 查看用户信息和统计

## 📞 技术支持

如果遇到问题：

1. **检查控制台错误** → 浏览器F12查看Console
2. **查看服务器日志** → 终端中的错误信息
3. **重启服务** → 按照故障排除步骤操作
4. **清除缓存** → 浏览器强制刷新 (Ctrl+Shift+R)

---

🎉 **现在你可以开始体验MystiBox的神秘宠物世界了！**
