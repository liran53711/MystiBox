const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../lib/jwt');
const { authenticate } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, email, points: 1000 }
    });

    const token = generateToken(user.id);
    res.json({
      user: {
        id: user.id,
        username: user.username,
        points: user.points,
        role: user.isAdmin ? 'ADMIN' : 'USER',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken(user.id);
    res.json({
      user: {
        id: user.id,
        username: user.username,
        points: user.points,
        role: user.isAdmin ? 'ADMIN' : 'USER',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户信息
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user.id,
      username: user.username,
      points: user.points,
      role: user.isAdmin ? 'ADMIN' : 'USER',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
