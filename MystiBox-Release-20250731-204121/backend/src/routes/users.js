const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 搜索用户
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    // 搜索用户名包含查询字符串的用户
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: q.trim(),
          mode: 'insensitive'
        },
        NOT: {
          id: currentUserId // 排除当前用户
        }
      },
      select: {
        id: true,
        username: true,
        avatar: true
      },
      take: 10 // 限制结果数量
    });

    // 检查每个用户的好友状态
    const userIds = users.map(user => user.id);

    // 查询好友关系
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: { in: userIds } },
          { user2Id: currentUserId, user1Id: { in: userIds } }
        ]
      }
    });

    // 查询待处理的好友请求
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: currentUserId,
        recipientId: { in: userIds },
        status: 'PENDING'
      }
    });

    // 构建结果
    const results = users.map(user => {
      const isFriend = friendships.some(f =>
        (f.user1Id === currentUserId && f.user2Id === user.id) ||
        (f.user2Id === currentUserId && f.user1Id === user.id)
      );

      const requestSent = friendRequests.some(r => r.recipientId === user.id);

      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        isFriend,
        requestSent
      };
    });

    res.json(results);
  } catch (error) {
    console.error('搜索用户失败:', error);
    res.status(500).json({ message: '搜索失败' });
  }
});

// 获取用户信息
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatar: true,
        points: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

// 更新用户头像
router.patch('/avatar', authenticate, async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user.id;

    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ message: '无效的头像' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        username: true,
        avatar: true,
        points: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('更新头像失败:', error);
    res.status(500).json({ message: '更新头像失败' });
  }
});

module.exports = router;
