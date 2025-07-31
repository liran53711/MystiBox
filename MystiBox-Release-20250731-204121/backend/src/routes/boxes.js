const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 获取用户的盲盒列表
router.get('/my-boxes', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, seriesId } = req.query;

    const where = {
      userId,
      ...(status && { status }),
      ...(seriesId && { seriesId: parseInt(seriesId) })
    };

    const boxes = await prisma.userBox.findMany({
      where,
      include: {
        series: {
          select: {
            id: true,
            name: true,
            description: true,
            coverImageUrl: true,
            drawPrice: true
          }
        },
        resultPet: {
          include: {
            pet: {
              select: {
                id: true,
                name: true,
                rarity: true,
                babyImageUrl: true,
                adultImageUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        obtainedAt: 'desc'
      }
    });

    res.json(boxes);
  } catch (error) {
    console.error('获取盲盒列表失败:', error);
    res.status(500).json({ message: '获取盲盒列表失败' });
  }
});

// 开封盲盒
router.post('/:boxId/open', authenticate, async (req, res) => {
  try {
    const { boxId } = req.params;
    const userId = req.user.id;

    // 检查盲盒是否存在且属于当前用户
    const box = await prisma.userBox.findFirst({
      where: {
        id: boxId,
        userId,
        status: 'UNOPENED'
      },
      include: {
        series: {
          include: {
            pets: true
          }
        }
      }
    });

    if (!box) {
      return res.status(404).json({ message: '盲盒不存在或已开封' });
    }

    // 随机选择一只宠物（简单的随机算法）
    const pets = box.series.pets;
    if (pets.length === 0) {
      return res.status(400).json({ message: '该系列暂无宠物' });
    }

    // 根据稀有度权重随机选择
    const rarityWeights = {
      'N': 50,   // 50%
      'R': 30,   // 30%
      'SR': 15,  // 15%
      'SSR': 4,  // 4%
      'UR': 1    // 1%
    };

    const weightedPets = [];
    pets.forEach(pet => {
      const weight = rarityWeights[pet.rarity] || 1;
      for (let i = 0; i < weight; i++) {
        weightedPets.push(pet);
      }
    });

    const randomPet = weightedPets[Math.floor(Math.random() * weightedPets.length)];

    // 创建用户宠物
    const userPet = await prisma.userPet.create({
      data: {
        userId,
        petId: randomPet.id,
        status: 'BABY',
        growthValue: 0,
        maxGrowth: 100
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            rarity: true,
            babyImageUrl: true,
            adultImageUrl: true,
            story: true
          }
        }
      }
    });

    // 更新盲盒状态
    await prisma.userBox.update({
      where: { id: boxId },
      data: {
        status: 'OPENED',
        openedAt: new Date(),
        resultPetId: userPet.id
      }
    });

    res.json({
      success: true,
      userPet,
      message: `恭喜！你获得了一只 ${randomPet.rarity} 级的 ${randomPet.name}！`
    });
  } catch (error) {
    console.error('开封盲盒失败:', error);
    res.status(500).json({ message: '开封盲盒失败' });
  }
});

// 购买盲盒（从商店购买后存入驿站）
router.post('/purchase', authenticate, async (req, res) => {
  try {
    const { seriesId, amount = 1 } = req.body;
    const userId = req.user.id;

    if (!seriesId || amount < 1 || amount > 10) {
      return res.status(400).json({ message: '无效的参数' });
    }

    // 获取系列信息
    const series = await prisma.series.findUnique({
      where: { id: parseInt(seriesId) }
    });

    if (!series || !series.isActive) {
      return res.status(404).json({ message: '系列不存在或已下架' });
    }

    const totalCost = series.drawPrice * amount;

    // 检查用户积分
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user.points < totalCost) {
      return res.status(400).json({ message: '积分不足' });
    }

    // 开始事务
    const result = await prisma.$transaction(async (tx) => {
      // 扣除积分
      await tx.user.update({
        where: { id: userId },
        data: { points: user.points - totalCost }
      });

      // 创建盲盒
      const boxes = [];
      for (let i = 0; i < amount; i++) {
        const box = await tx.userBox.create({
          data: {
            userId,
            seriesId: parseInt(seriesId),
            status: 'UNOPENED'
          },
          include: {
            series: {
              select: {
                id: true,
                name: true,
                description: true,
                coverImageUrl: true,
                drawPrice: true
              }
            }
          }
        });
        boxes.push(box);
      }

      // 记录抽卡事件
      await tx.drawEvent.create({
        data: {
          userId,
          seriesId: parseInt(seriesId),
          amount,
          cost: totalCost
        }
      });

      return { boxes, remainingPoints: user.points - totalCost };
    });

    res.json({
      success: true,
      boxes: result.boxes,
      remainingPoints: result.remainingPoints,
      message: `成功购买 ${amount} 个盲盒！已存入盲盒驿站`
    });
  } catch (error) {
    console.error('购买盲盒失败:', error);
    res.status(500).json({ message: '购买盲盒失败' });
  }
});

// 赠送盲盒
router.post('/:boxId/gift', authenticate, async (req, res) => {
  try {
    const { boxId } = req.params;
    const { recipientId, message } = req.body;
    const senderId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: '请选择接收者' });
    }

    // 检查盲盒是否存在且属于当前用户
    const box = await prisma.userBox.findFirst({
      where: {
        id: boxId,
        userId: senderId,
        status: 'UNOPENED'
      },
      include: {
        series: true
      }
    });

    if (!box) {
      return res.status(404).json({ message: '盲盒不存在或无法赠送' });
    }

    // 检查接收者是否存在
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (!recipient) {
      return res.status(404).json({ message: '接收者不存在' });
    }

    // 开始事务
    await prisma.$transaction(async (tx) => {
      // 转移盲盒所有权
      await tx.userBox.update({
        where: { id: boxId },
        data: {
          userId: recipientId,
          status: 'UNOPENED' // 保持未开封状态
        }
      });

      // 创建礼物记录
      await tx.gift.create({
        data: {
          type: 'BOX',
          senderId,
          recipientId,
          userBoxId: boxId,
          message: message || `赠送了一个 ${box.series.name} 盲盒`,
          claimed: true // 盲盒直接转移，标记为已领取
        }
      });
    });

    res.json({
      success: true,
      message: `成功将盲盒赠送给 ${recipient.username}！`
    });
  } catch (error) {
    console.error('赠送盲盒失败:', error);
    res.status(500).json({ message: '赠送盲盒失败' });
  }
});

// 获取盲盒统计信息
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await prisma.userBox.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        id: true
      }
    });

    // 计算总价值需要通过关联查询
    const userBoxes = await prisma.userBox.findMany({
      where: { userId },
      include: {
        series: {
          select: {
            drawPrice: true
          }
        }
      }
    });

    const totalValue = userBoxes.reduce((sum, box) => sum + (box.series.drawPrice || 0), 0);

    // 转换统计数据格式
    const statusCounts = {
      UNOPENED: 0,
      OPENED: 0,
      TRADING: 0,
      GIFTED: 0
    };

    stats.forEach(stat => {
      statusCounts[stat.status] = stat._count.id;
    });

    res.json({
      totalBoxes: statusCounts.UNOPENED,
      openedBoxes: statusCounts.OPENED,
      tradingBoxes: statusCounts.TRADING,
      giftedBoxes: statusCounts.GIFTED,
      totalValue: totalValue
    });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({ message: '获取统计信息失败' });
  }
});

module.exports = router;
