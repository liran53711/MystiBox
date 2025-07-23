// 模拟API - 临时数据
const mockAPI = {
    // 获取热门盲盒
    getFeaturedBoxes: async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: '神秘宝箱',
                        description: '包含各种稀有物品的神秘盲盒',
                        price: 29.99,
                        stock: 100,
                        category: 'mystery',
                        rarity: 'common'
                    },
                    {
                        id: 2,
                        name: '传奇宝箱',
                        description: '极其稀有的传奇级盲盒',
                        price: 99.99,
                        stock: 10,
                        category: 'legendary',
                        rarity: 'legendary'
                    },
                    {
                        id: 3,
                        name: '史诗宝箱',
                        description: '史诗级物品收集盒',
                        price: 59.99,
                        stock: 25,
                        category: 'epic',
                        rarity: 'epic'
                    }
                ]);
            }, 500);
        });
    },

    // 获取所有盲盒
    getAllBoxes: async () => {
        return mockAPI.getFeaturedBoxes();
    },

    // 获取盲盒详情
    getBoxDetails: async (boxId) => {
        const boxes = await mockAPI.getAllBoxes();
        return boxes.find(box => box.id === boxId);
    },

    // 获取盲盒物品
    getBoxItems: async (boxId) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { name: '神秘水晶', rarity: 'rare', probability: 0.3 },
                    { name: '魔法药水', rarity: 'common', probability: 0.5 },
                    { name: '传奇武器', rarity: 'legendary', probability: 0.05 },
                    { name: '史诗护甲', rarity: 'epic', probability: 0.15 }
                ]);
            }, 300);
        });
    },

    // 购买盲盒
    buyBox: async (userId, boxId) => {
        return new Promise(resolve => {
            setTimeout(() => {
                // 模拟随机抽取
                const items = [
                    { name: '神秘水晶', rarity: 'rare', description: '闪闪发光的神秘水晶' },
                    { name: '魔法药水', rarity: 'common', description: '恢复生命值的魔法药水' },
                    { name: '传奇武器', rarity: 'legendary', description: '威力无穷的传奇武器' },
                    { name: '史诗护甲', rarity: 'epic', description: '防御力极强的史诗护甲' }
                ];
                
                const randomItem = items[Math.floor(Math.random() * items.length)];
                
                resolve({
                    success: true,
                    item: randomItem,
                    newBalance: 970.01
                });
            }, 1000);
        });
    }
};
