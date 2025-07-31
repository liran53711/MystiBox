const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// 获取用户的宠物收藏
router.get('/my-collection', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const userPets = await prisma.userPet.findMany({
      where: { userId },
      include: {
        pet: {
          include: {
            series: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 转换数据格式以匹配前端期望
    const formattedPets = userPets.map(userPet => ({
      id: userPet.id,
      userId: userPet.userId,
      petId: userPet.petId,
      nickname: userPet.nickname,
      status: userPet.status,
      growthValue: userPet.growthValue,
      maxGrowth: userPet.maxGrowth || 100,
      isAdult: userPet.status === 'ADULT',
      lastFedAt: userPet.lastFedAt,
      createdAt: userPet.createdAt,
      pet: {
        id: userPet.pet.id,
        name: userPet.pet.name,
        rarity: userPet.pet.rarity,
        story: userPet.pet.story,
        babyImageUrl: userPet.pet.babyImageUrl,
        adultImageUrl: userPet.pet.adultImageUrl,
        series: {
          id: userPet.pet.series.id,
          name: userPet.pet.series.name
        }
      }
    }));

    res.json(formattedPets);
  } catch (error) {
    console.error('获取用户宠物失败:', error);
    res.status(500).json({ message: '获取宠物收藏失败' });
  }
});

// 更新宠物昵称
router.patch('/:userPetId/nickname', authenticate, async (req, res) => {
  try {
    const { userPetId } = req.params;
    const { nickname } = req.body;
    const userId = req.user.id;

    // 验证宠物是否属于当前用户
    const userPet = await prisma.userPet.findFirst({
      where: {
        id: userPetId,
        userId: userId
      }
    });

    if (!userPet) {
      return res.status(404).json({ message: '宠物不存在或不属于您' });
    }

    const updatedPet = await prisma.userPet.update({
      where: { id: userPetId },
      data: { nickname },
      include: {
        pet: {
          include: {
            series: true
          }
        }
      }
    });

    res.json(updatedPet);
  } catch (error) {
    console.error('更新宠物昵称失败:', error);
    res.status(500).json({ message: '更新昵称失败' });
  }
});

// 获取抽取历史
router.get('/draw-history', async (req, res) => {
  try {
    // TODO: 从数据库获取抽取历史
    res.json({ 
      message: '获取抽取历史功能开发中...',
      data: [] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
