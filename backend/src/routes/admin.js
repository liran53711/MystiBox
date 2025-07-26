const express = require('express');
const router = express.Router();

// 获取管理后台统计数据
router.get('/dashboard', async (req, res) => {
  try {
    // TODO: 从数据库获取统计数据
    const mockStats = {
      totalUsers: 1234,
      totalSeries: 12,
      todayDraws: 89,
      totalRevenue: 45678
    };
    
    res.json({ 
      message: '获取管理后台数据成功',
      data: mockStats 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 管理系列
router.get('/series', async (req, res) => {
  try {
    // TODO: 获取所有系列（包括禁用的）
    res.json({ 
      message: '获取管理系列功能开发中...',
      data: [] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新系列
router.post('/series', async (req, res) => {
  try {
    // TODO: 创建新系列
    res.json({ 
      message: '创建系列功能开发中...',
      data: null 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新系列
router.put('/series/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: 更新系列
    res.json({ 
      message: `更新系列${id}功能开发中...`,
      data: null 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除系列
router.delete('/series/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: 删除系列
    res.json({ 
      message: `删除系列${id}功能开发中...`,
      data: null 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
