const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// 简单的测试路由
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MystiBox API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 测试系列数据
app.get('/api/series', (req, res) => {
  res.json([
    {
      id: 1,
      name: '森林精灵系列',
      description: '来自神秘森林的可爱精灵们，每一只都拥有独特的魔法能力',
      price: 100,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      isActive: true,
      pets: []
    },
    {
      id: 2,
      name: '海洋冒险系列',
      description: '深海中的奇妙生物，带你探索未知的海底世界',
      price: 120,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      isActive: true,
      pets: []
    }
  ]);
});

// 测试登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'testuser' && password === 'test123456') {
    res.json({
      user: {
        id: '1',
        username: 'testuser',
        points: 1000,
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      accessToken: 'test-token-' + Date.now()
    });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 MystiBox API服务器运行在端口 ${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
