const http = require('http');
const url = require('url');

// 简单的内存数据库
const users = [
  { id: 1, username: 'admin', password: 'admin123456', points: 10000, role: 'ADMIN' },
  { id: 2, username: 'testuser', password: 'test123456', points: 1000, role: 'USER' },
  { id: 3, username: 'demo', password: '123456', points: 2000, role: 'USER' }
];

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// 简单的JWT生成（仅用于测试）
function generateToken(userId) {
  return `token_${userId}_${Date.now()}`;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // 设置CORS头
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  // 处理OPTIONS请求
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 解析请求体
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let requestData = {};
    try {
      if (body) requestData = JSON.parse(body);
    } catch (e) {
      // 忽略解析错误
    }

    // 路由处理
    if (path === '/api/v1/auth/login' && method === 'POST') {
      const { username, password } = requestData;
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        const token = generateToken(user.id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          user: {
            id: user.id,
            username: user.username,
            points: user.points,
            role: user.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          accessToken: token
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '用户名或密码错误' }));
      }
    }
    else if (path === '/api/v1/auth/register' && method === 'POST') {
      const { username, password } = requestData;

      if (users.find(u => u.username === username)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '用户名已存在' }));
        return;
      }

      const newUser = {
        id: users.length + 1,
        username,
        password,
        points: 1000,
        role: 'USER'
      };
      users.push(newUser);

      const token = generateToken(newUser.id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        user: {
          id: newUser.id,
          username: newUser.username,
          points: newUser.points,
          role: newUser.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        accessToken: token
      }));
    }
    else if (path === '/api/v1/auth/me' && method === 'GET') {
      // 简单的token验证
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const userId = token.split('_')[1];
        const user = users.find(u => u.id == userId);

        if (user) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            id: user.id,
            username: user.username,
            points: user.points,
            role: user.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '无效的token' }));
        }
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '缺少认证token' }));
      }
    }
    else if (path === '/api/v1/series' && method === 'GET') {
      // 返回模拟的系列数据
      const mockSeries = [
        {
          id: 1,
          name: '森林精灵系列',
          description: '来自神秘森林的可爱精灵们，每一只都拥有独特的魔法能力',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
          price: 100,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pets: [
            { id: '1', name: '小精灵', rarity: 'N', story: '来自森林的小精灵' },
            { id: '2', name: '森林守护者', rarity: 'R', story: '守护森林的精灵' },
            { id: '3', name: '古树之灵', rarity: 'SR', story: '千年古树的灵魂' },
            { id: '4', name: '森林女王', rarity: 'SSR', story: '森林的统治者' }
          ]
        },
        {
          id: 2,
          name: '海洋冒险系列',
          description: '深海中的奇妙生物，带你探索未知的海底世界',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
          price: 120,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pets: [
            { id: '5', name: '小海星', rarity: 'N', story: '可爱的小海星' },
            { id: '6', name: '珊瑚精灵', rarity: 'R', story: '珊瑚礁的守护者' },
            { id: '7', name: '深海巨兽', rarity: 'SR', story: '深海的神秘生物' },
            { id: '8', name: '海洋之王', rarity: 'SSR', story: '统治海洋的王者' }
          ]
        },
        {
          id: 3,
          name: '星空守护系列',
          description: '来自星空的神秘守护者，守护着宇宙的秘密',
          image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
          price: 150,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pets: [
            { id: '9', name: '星光精灵', rarity: 'N', story: '闪烁的星光精灵' },
            { id: '10', name: '月亮守护者', rarity: 'R', story: '守护月亮的精灵' },
            { id: '11', name: '星座之灵', rarity: 'SR', story: '星座的化身' },
            { id: '12', name: '宇宙之神', rarity: 'SSR', story: '宇宙的创造者' }
          ]
        }
      ];

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockSeries));
    }
    else if (path.startsWith('/api/v1/series/') && method === 'GET') {
      // 获取单个系列详情
      const seriesId = parseInt(path.split('/')[4]);
      const mockSeries = [
        {
          id: 1,
          name: '森林精灵系列',
          description: '来自神秘森林的可爱精灵们，每一只都拥有独特的魔法能力',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
          price: 100,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pets: [
            { id: '1', name: '小精灵', rarity: 'N', story: '来自森林的小精灵', babyImageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop' },
            { id: '2', name: '森林守护者', rarity: 'R', story: '守护森林的精灵', babyImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
            { id: '3', name: '古树之灵', rarity: 'SR', story: '千年古树的灵魂', babyImageUrl: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400&h=400&fit=crop' },
            { id: '4', name: '森林女王', rarity: 'SSR', story: '森林的统治者', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' }
          ]
        },
        {
          id: 2,
          name: '海洋冒险系列',
          description: '深海中的奇妙生物，带你探索未知的海底世界',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
          price: 120,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pets: [
            { id: '5', name: '小海星', rarity: 'N', story: '可爱的小海星', babyImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop' },
            { id: '6', name: '珊瑚精灵', rarity: 'R', story: '珊瑚礁的守护者', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
            { id: '7', name: '深海巨兽', rarity: 'SR', story: '深海的神秘生物', babyImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop' },
            { id: '8', name: '海洋之王', rarity: 'SSR', story: '统治海洋的王者', babyImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop' }
          ]
        },
        {
          id: 3,
          name: '星空守护系列',
          description: '来自星空的神秘守护者，守护着宇宙的秘密',
          image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
          price: 150,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pets: [
            { id: '9', name: '星光精灵', rarity: 'N', story: '闪烁的星光精灵', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
            { id: '10', name: '月亮守护者', rarity: 'R', story: '守护月亮的精灵', babyImageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop' },
            { id: '11', name: '星座之灵', rarity: 'SR', story: '星座的化身', babyImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
            { id: '12', name: '宇宙之神', rarity: 'SSR', story: '宇宙的创造者', babyImageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop' }
          ]
        }
      ];

      const series = mockSeries.find(s => s.id === seriesId);
      if (series) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(series));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '系列不存在' }));
      }
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '接口不存在' }));
    }
  });
});

const PORT = 3003;
server.listen(PORT, () => {
  console.log(`🚀 临时后端服务器启动成功！`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔑 测试账户:`);
  console.log(`   - 用户名: demo, 密码: 123456`);
  console.log(`   - 用户名: admin, 密码: admin123456`);
  console.log(`   - 用户名: testuser, 密码: test123456`);
});