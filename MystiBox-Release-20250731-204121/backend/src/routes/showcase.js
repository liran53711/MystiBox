const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 获取广场帖子列表
router.get('/posts', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'newest',
      rarity,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // 构建查询条件
    const where = {};

    if (rarity) {
      where.userPet = {
        pet: {
          rarity: rarity
        }
      };
    }

    if (search) {
      where.OR = [
        {
          content: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          author: {
            username: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          userPet: {
            OR: [
              {
                nickname: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                pet: {
                  name: {
                    contains: search,
                    mode: 'insensitive'
                  }
                }
              }
            ]
          }
        }
      ];
    }

    // 构建排序条件
    let orderBy = {};
    switch (sortBy) {
      case 'popular':
        orderBy = {
          likes: {
            _count: 'desc'
          }
        };
        break;
      case 'rarity':
        orderBy = {
          userPet: {
            pet: {
              rarity: 'desc'
            }
          }
        };
        break;
      default: // newest
        orderBy = {
          createdAt: 'desc'
        };
    }

    // 获取帖子列表
    const posts = await prisma.showcasePost.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        userPet: {
          include: {
            pet: {
              select: {
                id: true,
                name: true,
                rarity: true,
                story: true,
                babyImageUrl: true,
                adultImageUrl: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        likes: req.user ? {
          where: {
            userId: req.user.id
          },
          select: {
            id: true
          }
        } : false
      }
    });

    // 获取总数
    const total = await prisma.showcasePost.count({ where });

    // 处理返回数据
    const processedPosts = posts.map(post => ({
      ...post,
      isLiked: req.user ? post.likes.length > 0 : false,
      likes: undefined // 移除likes数组，只保留isLiked状态
    }));

    res.json({
      posts: processedPosts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / take)
    });
  } catch (error) {
    console.error('获取广场帖子失败:', error);
    res.status(500).json({ message: '获取帖子失败' });
  }
});

// 创建新帖子
router.post('/posts', authenticate, async (req, res) => {
  try {
    const { userPetId, content, allowSale = false, salePrice } = req.body;
    const userId = req.user.id;

    if (!userPetId || !content) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    // 检查宠物是否属于当前用户且为成体
    const userPet = await prisma.userPet.findFirst({
      where: {
        id: userPetId,
        userId,
        status: 'ADULT'
      }
    });

    if (!userPet) {
      return res.status(404).json({ message: '宠物不存在或不是成体' });
    }

    // 检查该宠物是否已经分享过
    const existingPost = await prisma.showcasePost.findUnique({
      where: { userPetId }
    });

    if (existingPost) {
      return res.status(400).json({ message: '该宠物已经分享过了' });
    }

    // 创建帖子
    const post = await prisma.showcasePost.create({
      data: {
        content,
        authorId: userId,
        userPetId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        userPet: {
          include: {
            pet: {
              select: {
                id: true,
                name: true,
                rarity: true,
                story: true,
                babyImageUrl: true,
                adultImageUrl: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    // 如果允许出售，更新宠物的出售状态
    if (allowSale && salePrice) {
      // TODO: 实现宠物出售功能
    }

    res.json({
      ...post,
      isLiked: false
    });
  } catch (error) {
    console.error('创建帖子失败:', error);
    res.status(500).json({ message: '创建帖子失败' });
  }
});

// 点赞/取消点赞帖子
router.post('/posts/:postId/like', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // 检查帖子是否存在
    const post = await prisma.showcasePost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    // 检查是否已经点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    let isLiked;
    if (existingLike) {
      // 取消点赞
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      isLiked = false;
    } else {
      // 点赞
      await prisma.like.create({
        data: {
          userId,
          postId
        }
      });
      isLiked = true;
    }

    // 获取最新的点赞数
    const likesCount = await prisma.like.count({
      where: { postId }
    });

    res.json({
      isLiked,
      likesCount
    });
  } catch (error) {
    console.error('点赞操作失败:', error);
    res.status(500).json({ message: '点赞操作失败' });
  }
});

// 获取帖子评论
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.json(comments);
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ message: '获取评论失败' });
  }
});

// 添加评论
router.post('/posts/:postId/comments', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    // 检查帖子是否存在
    const post = await prisma.showcasePost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: userId,
        postId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.json(comment);
  } catch (error) {
    console.error('添加评论失败:', error);
    res.status(500).json({ message: '添加评论失败' });
  }
});

// 删除帖子（管理员或作者）
router.delete('/posts/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const post = await prisma.showcasePost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    // 检查权限：只有作者或管理员可以删除
    if (post.authorId !== userId && !isAdmin) {
      return res.status(403).json({ message: '没有权限删除此帖子' });
    }

    await prisma.showcasePost.delete({
      where: { id: postId }
    });

    res.json({ message: '帖子已删除' });
  } catch (error) {
    console.error('删除帖子失败:', error);
    res.status(500).json({ message: '删除帖子失败' });
  }
});

// 删除评论（管理员或作者）
router.delete('/comments/:commentId', authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 检查权限：只有作者或管理员可以删除
    if (comment.authorId !== userId && !isAdmin) {
      return res.status(403).json({ message: '没有权限删除此评论' });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({ message: '删除评论失败' });
  }
});

module.exports = router;
