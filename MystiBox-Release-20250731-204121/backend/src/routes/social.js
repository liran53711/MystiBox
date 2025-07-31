const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 获取好友列表
router.get('/friends', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // 查找用户的好友关系
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            avatar: true,
            createdAt: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            avatar: true,
            createdAt: true
          }
        }
      }
    });

    // 格式化好友列表
    const friends = friendships.map(friendship => {
      const friend = friendship.user1Id === userId ? friendship.user2 : friendship.user1;
      return {
        id: friend.id,
        username: friend.username,
        avatar: friend.avatar,
        status: 'online', // 简化处理，实际应该查询用户在线状态
        lastSeen: new Date().toISOString(),
        createdAt: friend.createdAt
      };
    });

    res.json(friends);
  } catch (error) {
    console.error('获取好友列表失败:', error);
    res.status(500).json({ message: '获取好友列表失败' });
  }
});

// 搜索用户
router.get('/users/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } }, // 排除自己
          {
            username: {
              contains: q.trim(),
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        createdAt: true
      },
      take: 10
    });

    res.json(users);
  } catch (error) {
    console.error('搜索用户失败:', error);
    res.status(500).json({ message: '搜索用户失败' });
  }
});

// 发送好友请求
router.post('/friend-requests', authenticate, async (req, res) => {
  try {
    const { userId: targetUserId } = req.body;
    const userId = req.user.id;

    if (userId === targetUserId) {
      return res.status(400).json({ message: '不能添加自己为好友' });
    }

    // 检查是否已经是好友
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: targetUserId },
          { user1Id: targetUserId, user2Id: userId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({ message: '已经是好友了' });
    }

    // 检查是否已有待处理的好友请求
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, recipientId: targetUserId },
          { senderId: targetUserId, recipientId: userId }
        ],
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: '好友请求已存在' });
    }

    // 创建好友请求
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: userId,
        recipientId: targetUserId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      id: friendRequest.id,
      from: friendRequest.sender,
      to: friendRequest.recipient,
      status: friendRequest.status,
      createdAt: friendRequest.createdAt
    });
  } catch (error) {
    console.error('发送好友请求失败:', error);
    res.status(500).json({ message: '发送好友请求失败' });
  }
});

// 获取好友请求列表
router.get('/friend-requests', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        recipientId: userId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedRequests = friendRequests.map(request => ({
      id: request.id,
      from: request.sender,
      status: request.status,
      createdAt: request.createdAt
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error('获取好友请求失败:', error);
    res.status(500).json({ message: '获取好友请求失败' });
  }
});

// 接受好友请求
router.post('/friend-requests/:requestId/accept', authenticate, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return res.status(404).json({ message: '好友请求不存在' });
    }

    if (friendRequest.recipientId !== userId) {
      return res.status(403).json({ message: '无权限操作此请求' });
    }

    if (friendRequest.status !== 'PENDING') {
      return res.status(400).json({ message: '请求已处理' });
    }

    // 使用事务处理：更新请求状态并创建好友关系
    await prisma.$transaction(async (tx) => {
      // 更新好友请求状态
      await tx.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
      });

      // 创建好友关系（确保user1Id < user2Id以避免重复）
      const user1Id = friendRequest.senderId < friendRequest.recipientId ? friendRequest.senderId : friendRequest.recipientId;
      const user2Id = friendRequest.senderId < friendRequest.recipientId ? friendRequest.recipientId : friendRequest.senderId;

      await tx.friendship.create({
        data: {
          user1Id: user1Id,
          user2Id: user2Id
        }
      });
    });

    res.json({ message: '好友请求已接受' });
  } catch (error) {
    console.error('接受好友请求失败:', error);
    res.status(500).json({ message: '接受好友请求失败' });
  }
});

// 拒绝好友请求
router.post('/friend-requests/:requestId/reject', authenticate, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return res.status(404).json({ message: '好友请求不存在' });
    }

    if (friendRequest.recipientId !== userId) {
      return res.status(403).json({ message: '无权限操作此请求' });
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' }
    });

    res.json({ message: '好友请求已拒绝' });
  } catch (error) {
    console.error('拒绝好友请求失败:', error);
    res.status(500).json({ message: '拒绝好友请求失败' });
  }
});

// 删除好友
router.delete('/friends/:friendId', authenticate, async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId },
          { user1Id: friendId, user2Id: userId }
        ]
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: '好友关系不存在' });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id }
    });

    res.json({ message: '好友已删除' });
  } catch (error) {
    console.error('删除好友失败:', error);
    res.status(500).json({ message: '删除好友失败' });
  }
});

module.exports = router;
