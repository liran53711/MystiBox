const express = require('express');
const { authenticate } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

// 获取社区帖子列表
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, username: true }
        },
        likes: {
          select: { userId: true }
        },
        comments: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      likes: undefined,
      comments: undefined
    }));

    res.json({ 
      message: '获取社区帖子成功',
      data: formattedPosts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建帖子
router.post('/posts', authenticate, async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const userId = req.user.id;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        images: images ? images.join(',') : null,
        authorId: userId
      },
      include: {
        author: {
          select: { id: true, username: true }
        }
      }
    });

    res.json({ 
      message: '创建帖子成功',
      data: post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 点赞/取消点赞
router.post('/posts/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId: id }
      }
    });

    if (existingLike) {
      // 取消点赞
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      res.json({ message: '取消点赞成功', data: { liked: false } });
    } else {
      // 点赞
      await prisma.like.create({
        data: { userId, postId: id }
      });
      res.json({ message: '点赞成功', data: { liked: true } });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
