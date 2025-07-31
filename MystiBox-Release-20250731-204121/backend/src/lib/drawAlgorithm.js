// 盲盒抽取算法
class DrawAlgorithm {
  
  // 基于概率的抽取算法
  static drawPet(pets) {
    // 验证概率总和
    const totalProbability = pets.reduce((sum, pet) => sum + pet.probability, 0);
    if (Math.abs(totalProbability - 1.0) > 0.001) {
      console.warn('概率总和不等于1:', totalProbability);
    }

    const random = Math.random();
    let cumulative = 0;

    for (const pet of pets) {
      cumulative += pet.probability;
      if (random <= cumulative) {
        return pet;
      }
    }

    // 兜底返回最后一个宠物
    return pets[pets.length - 1];
  }

  // 稀有度权重抽取
  static drawByRarity(pets) {
    const rarityWeights = {
      'COMMON': 0.6,     // 60%
      'RARE': 0.25,      // 25%
      'EPIC': 0.12,      // 12%
      'LEGENDARY': 0.03  // 3%
    };

    // 按稀有度分组
    const petsByRarity = pets.reduce((groups, pet) => {
      if (!groups[pet.rarity]) groups[pet.rarity] = [];
      groups[pet.rarity].push(pet);
      return groups;
    }, {});

    // 先抽取稀有度
    const random = Math.random();
    let cumulative = 0;
    let selectedRarity = 'COMMON';

    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulative += weight;
      if (random <= cumulative && petsByRarity[rarity]?.length > 0) {
        selectedRarity = rarity;
        break;
      }
    }

    // 在该稀有度中随机选择
    const rarityPets = petsByRarity[selectedRarity] || petsByRarity['COMMON'] || pets;
    return rarityPets[Math.floor(Math.random() * rarityPets.length)];
  }

  // 保底机制抽取
  static drawWithPity(pets, userDrawCount = 0) {
    const pityThreshold = 10; // 10次保底
    
    // 如果达到保底次数，强制给稀有宠物
    if (userDrawCount >= pityThreshold) {
      const rarePets = pets.filter(p => ['EPIC', 'LEGENDARY'].includes(p.rarity));
      if (rarePets.length > 0) {
        return rarePets[Math.floor(Math.random() * rarePets.length)];
      }
    }

    // 否则正常抽取
    return this.drawByRarity(pets);
  }

  // 闪光版本判定
  static isShiny() {
    return Math.random() < 0.05; // 5%概率闪光
  }

  // 综合抽取方法
  static performDraw(pets, options = {}) {
    const {
      algorithm = 'rarity', // 'probability' | 'rarity' | 'pity'
      userDrawCount = 0,
      enableShiny = true
    } = options;

    let selectedPet;

    switch (algorithm) {
      case 'probability':
        selectedPet = this.drawPet(pets);
        break;
      case 'pity':
        selectedPet = this.drawWithPity(pets, userDrawCount);
        break;
      case 'rarity':
      default:
        selectedPet = this.drawByRarity(pets);
        break;
    }

    const isShiny = enableShiny ? this.isShiny() : false;

    return {
      pet: selectedPet,
      isShiny,
      rarity: selectedPet.rarity
    };
  }
}

module.exports = DrawAlgorithm;
