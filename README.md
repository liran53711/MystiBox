# 🎮 MystiBox - 宠物盲盒Web应用

一个功能完整的宠物盲盒收集游戏，包含抽卡、收藏、社交、交易等丰富功能。

## 📋 目录

- [项目简介](#项目简介)
- [功能特色](#功能特色)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [安装与启动](#安装与启动)
- [数据库配置](#数据库配置)
- [Git操作指南](#git操作指南)
- [项目结构](#项目结构)
- [使用说明](#使用说明)
- [开发指南](#开发指南)

## 🎯 项目简介

MystiBox是一个现代化的宠物盲盒收集游戏，玩家可以：
- 🎲 抽取各种稀有度的可爱宠物
- 🏠 收藏和培养自己的宠物
- 🏛️ 在广场展示和交易宠物
- 👥 与好友聊天和互动
- 💰 通过各种活动获得积分

## ✨ 功能特色

### 🎪 核心功能
- **华丽开盒动画** - 4阶段沉浸式抽卡体验
- **完整积分系统** - 多种获得积分的方式
- **社交广场** - 宠物展示、点赞、评论、交易
- **好友聊天** - 实时聊天和物品赠送
- **宠物成长** - 喂养、进化、昵称设置

### 🎨 视觉体验
- **精美UI设计** - 按照专业设计规范实现
- **流畅动画效果** - 15+种交互动画
- **稀有度视觉差异** - N/R/SR/SSR/UR完整视觉语言
- **响应式设计** - 完美适配各种设备

## 🛠️ 技术栈

### 前端
- **Vue 3** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **Tailwind CSS** - 样式框架

### 后端
- **Node.js** + **Express** - 服务端框架
- **Prisma** - 数据库ORM
- **SQLite** - 轻量级数据库
- **JWT** - 身份认证
- **bcrypt** - 密码加密

## 📋 环境要求

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0
- **Git** >= 2.0.0

## 🚀 安装与启动

### 1. 克隆项目

```bash
# 克隆仓库
git clone <your-repository-url>
cd MystiBox

# 或者如果是新项目
git init
git remote add origin <your-repository-url>
```

### 2. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 3. 环境配置

在后端目录创建 `.env` 文件：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# JWT密钥 (请更改为随机字符串)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 服务端口
PORT=3003

# 前端URL (用于CORS)
FRONTEND_URL="http://localhost:3000"
```

### 4. 数据库初始化

```bash
# 进入后端目录
cd backend

# 生成Prisma客户端
npx prisma generate

# 运行数据库迁移
npx prisma db push

# (可选) 查看数据库
npx prisma studio
```

### 5. 启动服务

#### 方式一：分别启动前后端

```bash
# 终端1: 启动后端服务
cd backend
npm run dev
# 后端将在 http://localhost:3003 启动

# 终端2: 启动前端服务
cd ..  # 回到项目根目录
npm run dev
# 前端将在 http://localhost:3000 启动
```

#### 方式二：同时启动 (推荐)

```bash
# 在项目根目录
npm run dev:all
```

### 6. 访问应用

打开浏览器访问：http://localhost:3000
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

#### 2. 端口冲突
```bash
# 查看端口占用
lsof -i :3000
lsof -i :3003

# 杀死进程
kill -9 <PID>
```

#### 3. 数据库问题
```bash
# 重置数据库
cd backend
npx prisma db push --force-reset
```

#### 4. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🗄️ 数据库配置详解

### Prisma 常用命令

```bash
# 进入后端目录
cd backend

# 生成Prisma客户端
npx prisma generate

# 推送数据库schema变更
npx prisma db push

# 重置数据库
npx prisma db push --force-reset

# 查看数据库内容
npx prisma studio

# 格式化schema文件
npx prisma format
```

### 数据库结构

项目使用SQLite数据库，包含以下主要表：
- `users` - 用户信息
- `series` - 盲盒系列
- `pets` - 宠物信息
- `user_pets` - 用户拥有的宠物
- `draw_records` - 抽卡记录
- `friends` - 好友关系
- `friend_requests` - 好友申请
- `chat_messages` - 聊天消息

## 📝 Git操作指南

### 初次提交

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "feat: 初始化MystiBox项目"

# 推送到远程仓库
git push -u origin main
```

### 日常开发流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建功能分支 (可选)
git checkout -b feature/new-feature

# 3. 进行开发...

# 4. 添加更改
git add .

# 5. 提交更改
git commit -m "feat: 添加新功能"

# 6. 推送更改
git push origin main
# 或推送到功能分支
git push origin feature/new-feature
```

### 常用Git命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 查看差异
git diff

# 撤销工作区更改
git checkout -- <file>

# 撤销暂存区更改
git reset HEAD <file>

# 创建并切换分支
git checkout -b <branch-name>

# 合并分支
git merge <branch-name>

# 删除分支
git branch -d <branch-name>
```

### 提交信息规范

使用语义化提交信息：

```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

示例：
```bash
git commit -m "feat: 添加宠物交易功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "docs: 更新README文档"
```

## 📁 项目结构

```
MystiBox/
├── backend/                 # 后端代码
│   ├── prisma/             # 数据库schema和迁移
│   ├── src/                # 源代码
│   ├── .env                # 环境变量
│   └── package.json        # 后端依赖
├── src/                    # 前端源代码
│   ├── components/         # Vue组件
│   ├── views/             # 页面组件
│   ├── store/             # Pinia状态管理
│   ├── api/               # API接口
│   ├── assets/            # 静态资源
│   └── types/             # TypeScript类型定义
├── public/                # 公共静态文件
├── package.json           # 前端依赖
├── README.md             # 项目文档
└── 新宠物图片清单.md      # 宠物图片生成指南
```

## 🎮 使用说明

### 默认账户

**普通用户**：
- 用户名：`demo`
- 密码：`demo123`

**管理员**：
- 用户名：`admin`
- 密码：`admin123456`

### 基本操作流程

1. **注册/登录** - 创建账户或使用演示账户
2. **浏览商店** - 查看各种宠物系列
3. **抽取盲盒** - 体验华丽的开盒动画
4. **收藏宠物** - 在"我的宠物"页面管理收藏
5. **社交互动** - 在广场分享、点赞、交易宠物
6. **好友聊天** - 添加好友并进行聊天

### 积分获得方式

- 🍼 喂养宠物：+8积分 (每日每只限1次)
- 🦋 宠物进化：+50积分
- 📤 分享宠物：+25积分
- 💬 聊天消息：+1积分 (每日限50次)
- ❤️ 点赞帖子：+5积分
- 💭 发表评论：+3积分
- 🐾 宠物互动：+2积分 (每日限20次)
- 🎁 抽卡奖励：R+20, SR+50, SSR+100, UR+200积分

## 📞 支持与反馈

如果遇到问题或有建议，请：
1. 查看本文档的常见问题部分
2. 检查控制台错误信息
3. 创建GitHub Issue

## 📄 许可证

本项目仅供学习和演示使用。

---

**享受你的MystiBox宠物收集之旅！** 🎮✨

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
