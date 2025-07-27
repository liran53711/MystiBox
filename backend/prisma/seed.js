const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始数据库种子数据初始化...');

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      points: 10000,
      role: 'ADMIN',
    },
  });
  console.log('✅ 管理员用户创建完成:', admin.username);

  // 创建测试用户
  const testPassword = await bcrypt.hash('test123456', 10);
  const testUser = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      password: testPassword,
      points: 1000,
      role: 'USER',
    },
  });
  console.log('✅ 测试用户创建完成:', testUser.username);

  // 创建盲盒系列
  const forestSeries = await prisma.series.upsert({
    where: { name: '森林精灵系列' },
    update: {},
    create: {
      name: '森林精灵系列',
      description: '来自神秘森林的可爱精灵们，每一只都拥有独特的魔法能力',
      drawPrice: 100,
      coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      isActive: true,
    },
  });

  const oceanSeries = await prisma.series.upsert({
    where: { name: '海洋冒险系列' },
    update: {},
    create: {
      name: '海洋冒险系列',
      description: '深海中的奇妙生物，带你探索未知的海底世界',
      drawPrice: 120,
      coverImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      isActive: true,
    },
  });

  const starSeries = await prisma.series.upsert({
    where: { name: '星空守护系列' },
    update: {},
    create: {
      name: '星空守护系列',
      description: '来自星空的神秘守护者，守护着宇宙的秘密',
      drawPrice: 150,
      coverImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
      isActive: true,
    },
  });

  console.log('✅ 盲盒系列创建完成');

  // 创建宠物数据
  await prisma.pet.createMany({
    data: [
      // 森林精灵系列
      { name: '小精灵', rarity: 'N', seriesId: forestSeries.id, story: '来自森林的小精灵', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
      { name: '森林守护者', rarity: 'R', seriesId: forestSeries.id, story: '守护森林的精灵', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
      { name: '古树之灵', rarity: 'SR', seriesId: forestSeries.id, story: '千年古树的灵魂', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
      { name: '森林女王', rarity: 'SSR', seriesId: forestSeries.id, story: '森林的统治者', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },

      // 海洋冒险系列
      { name: '小海星', rarity: 'N', seriesId: oceanSeries.id, story: '可爱的小海星', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { name: '珊瑚精灵', rarity: 'R', seriesId: oceanSeries.id, story: '珊瑚礁的守护者', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { name: '深海巨兽', rarity: 'SR', seriesId: oceanSeries.id, story: '深海的神秘生物', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { name: '海洋之王', rarity: 'SSR', seriesId: oceanSeries.id, story: '统治海洋的王者', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },

      // 星空守护系列
      { name: '小星星', rarity: 'N', seriesId: starSeries.id, story: '闪闪发光的小星星', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { name: '月亮精灵', rarity: 'R', seriesId: starSeries.id, story: '月光下的精灵', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { name: '星座守护者', rarity: 'SR', seriesId: starSeries.id, story: '守护星座的使者', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { name: '宇宙之神', rarity: 'UR', seriesId: starSeries.id, story: '创造宇宙的神明', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
    ]
  });

  console.log('✅ 宠物数据创建完成');

  console.log('🎉 数据库种子数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
