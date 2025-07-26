const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());

// 跨域配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use(limiter);

// 日志中间件
app.use(morgan('combined'));

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    message: 'MystiBox API服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  };

  // 如果是浏览器访问，返回HTML格式
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>MystiBox API Health Check</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .status { color: #28a745; font-size: 24px; font-weight: bold; }
          .info { margin: 10px 0; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 MystiBox API服务器</h1>
          <div class="status">✅ ${healthData.status} - ${healthData.message}</div>
          <div class="info"><strong>版本:</strong> ${healthData.version}</div>
          <div class="info"><strong>运行时间:</strong> ${Math.floor(healthData.uptime)}秒</div>
          <div class="info"><strong>时间戳:</strong> ${healthData.timestamp}</div>

          <h3>📋 可用的API接口:</h3>
          <ul>
            <li><a href="/health">GET /health</a> - 健康检查</li>
            <li><a href="/api/series">GET /api/series</a> - 获取盲盒系列</li>
            <li><a href="/api/auth">POST /api/auth/login</a> - 用户登录</li>
            <li><a href="/api/auth">POST /api/auth/register</a> - 用户注册</li>
          </ul>

          <h3>📊 原始JSON数据:</h3>
          <pre>${JSON.stringify(healthData, null, 2)}</pre>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json(healthData);
  }
});

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/series', require('./routes/series'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: '接口不存在',
    path: req.originalUrl 
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 MystiBox API服务器运行在端口 ${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
