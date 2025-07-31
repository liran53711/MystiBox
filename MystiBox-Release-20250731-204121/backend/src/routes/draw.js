const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 稀有度权重配置
const RARITY_WEIGHTS = {
  'N': 50,   // 普通 50%
  'R': 30,   // 稀有 30%
  'SR': 15,  // 史诗 15%
  'SSR': 4,  // 传说 4%
  'UR': 1    // 神话 1%
};

// 根据权重随机选择稀有度
function getRandomRarity() {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    random -= weight;
    if (random <= 0) {
      return rarity;
    }
  }

  return 'N'; // 默认返回普通
}

// 抽取宠物
router.post('/:seriesId', authenticate, async (req, res) => {
  try {
    const { seriesId } = req.params;
    const userId = req.user.id;

    // 获取系列信息
    const series = await prisma.series.findUnique({
      where: { id: parseInt(seriesId) },
      include: { pets: true }
    });

    if (!series) {
      return res.status(404).json({ message: '系列不存在' });
    }

    if (!series.isActive) {
      return res.status(400).json({ message: '该系列暂未开放' });
    }

    // 检查用户积分
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user.points < series.drawPrice) {
      return res.status(400).json({ message: '积分不足' });
    }

    // 随机选择稀有度
    const targetRarity = getRandomRarity();
    
    // 从该系列中筛选出对应稀有度的宠物
    const availablePets = series.pets.filter(pet => pet.rarity === targetRarity);
    
    // 如果没有对应稀有度的宠物，降级到普通稀有度
    const finalPets = availablePets.length > 0 ? availablePets : series.pets.filter(pet => pet.rarity === 'N');
    
    if (finalPets.length === 0) {
      return res.status(400).json({ message: '该系列暂无可抽取的宠物' });
    }

    // 随机选择一只宠物
    const randomPet = finalPets[Math.floor(Math.random() * finalPets.length)];

    // 开始事务
    const result = await prisma.$transaction(async (tx) => {
      // 记录抽取事件
      const drawEvent = await tx.drawEvent.create({
        data: {
          userId: userId,
          seriesId: parseInt(seriesId),
          amount: 1,
          cost: series.drawPrice
        }
      });

      // 扣除积分
      await tx.user.update({
        where: { id: userId },
        data: { points: { decrement: series.drawPrice } }
      });

      // 创建用户宠物实例（每次抽取都创建新实例）
      const userPet = await tx.userPet.create({
        data: {
          userId: userId,
          petId: randomPet.id,
          drawEventId: drawEvent.id,
          status: 'BABY',
          growthValue: 0
        }
      });

      // 获取更新后的用户信息
      const updatedUser = await tx.user.findUnique({
        where: { id: userId }
      });

      return {
        pet: {
          id: randomPet.id,
          name: randomPet.name,
          rarity: randomPet.rarity,
          story: randomPet.story,
          image: randomPet.babyImageUrl, // 新获得的宠物显示幼体形态
          userPetId: userPet.id
        },
        isNew: true, // 每次抽取都是新的实例
        pointsSpent: series.drawPrice,
        remainingPoints: updatedUser.points
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Draw error:', error);
    res.status(500).json({ message: '抽取失败，请重试' });
  }
});

// 获取抽取历史
router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [drawEvents, total] = await Promise.all([
      prisma.drawEvent.findMany({
        where: { userId },
        include: {
          series: true,
          results: {
            include: {
              pet: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.drawEvent.count({
        where: { userId }
      })
    ]);

    res.json({
      data: drawEvents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get draw history error:', error);
    res.status(500).json({ message: '获取抽取历史失败' });
  }
});

module.exports = router;
