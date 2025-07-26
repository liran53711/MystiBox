const express = require('express');
const router = express.Router();

// 获取所有盲盒系列
router.get('/', async (req, res) => {
  try {
    // TODO: 从数据库获取系列数据
    const mockSeries = [
      {
        id: 1,
        name: '森林精灵系列',
        description: '来自神秘森林的可爱精灵们',
        price: 100,
        petCount: 12,
        emoji: '🧚',
        active: true
      },
      {
        id: 2,
        name: '海洋冒险系列',
        description: '深海中的奇妙生物',
        price: 120,
        petCount: 15,
        emoji: '🐠',
        active: true
      },
      {
        id: 3,
        name: '星空守护系列',
        description: '来自星空的神秘守护者',
        price: 150,
        petCount: 10,
        emoji: '⭐',
        active: true
      }
    ];

    const responseData = {
      message: '获取系列列表成功',
      data: mockSeries
    };

    // 如果是浏览器访问，返回HTML格式
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>MystiBox 盲盒系列</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .series-card { border: 1px solid #ddd; margin: 15px 0; padding: 20px; border-radius: 8px; background: #f8f9fa; }
            .emoji { font-size: 2em; margin-right: 10px; }
            .price { color: #28a745; font-weight: bold; }
            pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📦 MystiBox 盲盒系列</h1>
            <p><strong>状态:</strong> ✅ ${responseData.message}</p>

            <h2>🎁 可用系列:</h2>
            ${mockSeries.map(series => `
              <div class="series-card">
                <h3><span class="emoji">${series.emoji}</span>${series.name}</h3>
                <p><strong>描述:</strong> ${series.description}</p>
                <p><strong>价格:</strong> <span class="price">${series.price} 积分</span></p>
                <p><strong>宠物数量:</strong> ${series.petCount} 只</p>
                <p><strong>状态:</strong> ${series.active ? '✅ 启用' : '❌ 禁用'}</p>
              </div>
            `).join('')}

            <h3>📊 原始JSON数据:</h3>
            <pre>${JSON.stringify(responseData, null, 2)}</pre>

            <p><a href="/health">← 返回健康检查</a></p>
          </div>
        </body>
        </html>
      `);
    } else {
      res.json(responseData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个系列详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: 从数据库获取系列详情
    res.json({ 
      message: `获取系列${id}详情功能开发中...`,
      data: null 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 抽取盲盒
router.post('/:id/draw', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: 实现抽取逻辑
    res.json({ 
      message: `系列${id}抽取功能开发中...`,
      data: null 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
