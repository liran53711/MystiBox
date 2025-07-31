const express = require('express');
const { authenticate } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const DrawAlgorithm = require('../lib/drawAlgorithm');
const router = express.Router();

// 获取所有盲盒系列
router.get('/', async (req, res) => {
  try {
    const series = await prisma.series.findMany({
      where: { isActive: true },
      include: {
        pets: {
          select: { id: true }
        }
      }
    });

    const seriesWithCount = series.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: s.drawPrice,
      image: s.coverImageUrl,
      isActive: s.isActive,
      petCount: s.pets.length,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));

    // 直接返回系列数组，不包装在data字段中
    res.json(seriesWithCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个系列详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const series = await prisma.series.findUnique({
      where: { id: parseInt(id) },
      include: {
        pets: true
      }
    });

    if (!series) {
      return res.status(404).json({ error: '系列不存在' });
    }

    // 格式化返回数据
    const formattedSeries = {
      id: series.id,
      name: series.name,
      description: series.description,
      price: series.drawPrice,
      image: series.coverImageUrl,
      isActive: series.isActive,
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
      pets: series.pets.map(pet => ({
        id: pet.id,
        name: pet.name,
        rarity: pet.rarity,
        story: pet.story,
        babyImage: pet.babyImageUrl,
        adultImage: pet.adultImageUrl
      }))
    };

    res.json(formattedSeries);
  } catch (error) {
    console.error('获取系列详情失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 抽取盲盒
router.post('/:id/draw', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const series = await prisma.series.findUnique({
      where: { id, isActive: true },
      include: { pets: true }
    });

    if (!series) {
      return res.status(404).json({ error: '系列不存在或已禁用' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.points < series.price) {
      return res.status(400).json({ error: '积分不足' });
    }

    // 获取用户抽取次数（用于保底机制）
    const userDrawCount = await prisma.drawEvent.count({
      where: { userId, seriesId: id }
    });

    // 使用抽取算法
    const drawResult = DrawAlgorithm.performDraw(series.pets, {
      algorithm: 'rarity',
      userDrawCount,
      enableShiny: true
    });

    const selectedPet = drawResult.pet;
    const isShiny = drawResult.isShiny;

    // 数据库事务
    const result = await prisma.$transaction(async (tx) => {
      // 扣除积分
      await tx.user.update({
        where: { id: userId },
        data: { points: { decrement: series.price } }
      });

      // 创建抽取记录
      const drawEvent = await tx.drawEvent.create({
        data: {
          userId,
          seriesId: id,
          petId: selectedPet.id,
          cost: series.price,
          isShiny
        }
      });

      // 添加宠物到用户收藏
      await tx.userPet.upsert({
        where: {
          userId_petId: { userId, petId: selectedPet.id }
        },
        update: { level: { increment: 1 } },
        create: {
          userId,
          petId: selectedPet.id,
          level: 1,
          isShiny
        }
      });

      return { drawEvent, pet: selectedPet };
    });

    res.json({
      message: isShiny ? '恭喜！抽到闪光宠物！✨' : '抽取成功！',
      data: {
        pet: {
          ...result.pet,
          isShiny,
          rarity: selectedPet.rarity
        },
        remainingPoints: user.points - series.price,
        drawCount: userDrawCount + 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
