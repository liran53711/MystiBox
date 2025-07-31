const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 初始化管理员账户（仅在没有管理员时可用）
router.post('/init-admin', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // 检查是否已有管理员
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return res.status(400).json({ message: '管理员已存在' });
    }

    // 将当前用户设为管理员
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' }
    });

    res.json({ message: '管理员权限设置成功' });
  } catch (error) {
    console.error('设置管理员失败:', error);
    res.status(500).json({ message: '设置管理员失败' });
  }
});

// 以下路由需要管理员权限
router.use(requireAdmin);

// 获取统计数据
router.get('/stats/users', async (_req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/series', async (_req, res) => {
  try {
    const count = await prisma.series.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/pets', async (_req, res) => {
  try {
    const count = await prisma.pet.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/draws', async (_req, res) => {
  try {
    const count = await prisma.drawEvent.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取所有用户
router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        points: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 管理系列
router.get('/series', async (_req, res) => {
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
