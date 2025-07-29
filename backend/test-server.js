const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

console.log('Starting test server...');

// 中间件
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'OK',
    message: 'MystiBox API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 系列数据
app.get('/api/series', (req, res) => {
  console.log('Series data requested');
  res.json([
    {
      id: 1,
      name: '森林精灵系列',
      description: '来自神秘森林的可爱精灵们',
      price: 100,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      isActive: true
    }
  ]);
});

// 登录
app.post('/api/auth/login', (req, res) => {
  console.log('Login requested:', req.body);
  const { username, password } = req.body;
  
  if (username === 'demo' && password === 'demo123') {
    res.json({
      user: {
        id: '1',
        username: 'demo',
        points: 1000,
        role: 'USER'
      },
      accessToken: 'test-token-' + Date.now()
    });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 测试服务器运行在端口 ${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;
