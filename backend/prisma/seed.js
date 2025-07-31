const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子数据...');

  // 清理现有数据（保留系列和宠物）
  await prisma.showcasePost.deleteMany();
  await prisma.userBox.deleteMany();
  await prisma.userPet.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.friendRequest.deleteMany();
  await prisma.drawEvent.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.gift.deleteMany();

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        points: 10000,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    }),
    prisma.user.upsert({
      where: { username: 'Alice' },
      update: {},
      create: {
        username: 'Alice',
        password: hashedPassword,
        points: 5000,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      }
    }),
    prisma.user.upsert({
      where: { username: 'Bob' },
      update: {},
      create: {
        username: 'Bob',
        password: hashedPassword,
        points: 3000,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    }),
    prisma.user.upsert({
      where: { username: 'Charlie' },
      update: {},
      create: {
        username: 'Charlie',
        password: hashedPassword,
        points: 2000,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      }
    }),
    prisma.user.upsert({
      where: { username: 'Diana' },
      update: {},
      create: {
        username: 'Diana',
        password: hashedPassword,
        points: 4000,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    })
  ]);

  console.log('创建了用户:', users.map(u => u.username));

  // 创建好友关系（所有用户互为好友）
  const friendships = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      friendships.push(
        prisma.friendship.create({
          data: {
            user1Id: users[i].id,
            user2Id: users[j].id
          }
        })
      );
    }
  }
  await Promise.all(friendships);
  console.log('创建了好友关系');

  // 获取所有系列和宠物
  const series = await prisma.series.findMany({
    include: { pets: true }
  });

  if (series.length === 0) {
    console.log('没有找到系列数据，请先运行系列和宠物的种子数据');
    return;
  }

  // 为每个用户创建宠物
  for (const user of users) {
    for (const seriesItem of series) {
      for (const pet of seriesItem.pets) {
        // 随机决定宠物状态
        const status = Math.random() > 0.5 ? 'ADULT' : 'BABY';
        const growthValue = status === 'ADULT' ? 100 : Math.floor(Math.random() * 80);

        await prisma.userPet.create({
          data: {
            userId: user.id,
            petId: pet.id,
            status,
            growthValue,
            maxGrowth: 100,
            nickname: Math.random() > 0.7 ? `${pet.name}${Math.floor(Math.random() * 100)}` : null,
            lastInteractedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : null
          }
        });
      }
    }

    // 为每个用户创建盲盒
    for (const seriesItem of series) {
      const boxCount = Math.floor(Math.random() * 3) + 1; // 1-3个盲盒
      for (let i = 0; i < boxCount; i++) {
        await prisma.userBox.create({
          data: {
            userId: user.id,
            seriesId: seriesItem.id,
            status: 'UNOPENED',
            obtainedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // 过去7天内随机时间
          }
        });
      }
    }
  }

  console.log('为所有用户创建了宠物和盲盒');

  // 为每个用户在广场展示一只随机宠物
  for (const user of users) {
    const userPets = await prisma.userPet.findMany({
      where: {
        userId: user.id,
        status: 'ADULT' // 只展示成体宠物
      }
    });

    if (userPets.length > 0) {
      const randomPet = userPets[Math.floor(Math.random() * userPets.length)];
      const contents = [
        '我的新宠物太可爱了！',
        '终于养成了这只宠物！',
        '分享一下我的珍藏宠物~',
        '这只宠物陪伴了我很久',
        '大家觉得我的宠物怎么样？',
        '今天心情不错，分享个宠物',
        '这是我最喜欢的宠物之一'
      ];

      await prisma.showcasePost.create({
        data: {
          content: contents[Math.floor(Math.random() * contents.length)],
          authorId: user.id,
          userPetId: randomPet.id,
          createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) // 过去3天内随机时间
        }
      });
    }
  }

  console.log('为所有用户创建了广场展示');

  // 为广场帖子添加一些点赞和评论
  const posts = await prisma.showcasePost.findMany();
  const comments = [
    '太可爱了！',
    '好羡慕啊！',
    '这只宠物真漂亮',
    '我也想要一只',
    '养得真好！',
    '颜值很高呢',
    '好想摸摸'
  ];

  for (const post of posts) {
    // 随机添加点赞
    const likeUsers = users.filter(() => Math.random() > 0.5);
    for (const likeUser of likeUsers) {
      if (likeUser.id !== post.authorId) {
        await prisma.like.create({
          data: {
            userId: likeUser.id,
            postId: post.id
          }
        });
      }
    }

    // 随机添加评论
    const commentUsers = users.filter(() => Math.random() > 0.7);
    for (const commentUser of commentUsers) {
      if (commentUser.id !== post.authorId) {
        await prisma.comment.create({
          data: {
            content: comments[Math.floor(Math.random() * comments.length)],
            authorId: commentUser.id,
            postId: post.id,
            createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }
  }

  console.log('为广场帖子添加了点赞和评论');

  // 创建一些抽卡记录
  for (const user of users) {
    const drawCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < drawCount; i++) {
      const randomSeries = series[Math.floor(Math.random() * series.length)];
      await prisma.drawEvent.create({
        data: {
          userId: user.id,
          seriesId: randomSeries.id,
          amount: 1,
          cost: randomSeries.drawPrice,
          createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  console.log('创建了抽卡记录');

  console.log('数据库种子数据完成！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
