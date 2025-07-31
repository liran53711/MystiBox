import axios from 'axios'
import { useAuthStore } from '@/store/auth'

// 使用模拟数据而不是真实后端
const USE_MOCK_API = false

// 模拟数据
const mockUsers = new Map()
const mockSeries = [
  {
    id: 1,
    name: '森林精灵系列',
    description: '来自神秘森林的可爱精灵们，每一只都拥有独特的魔法能力',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    price: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pets: [
      { id: '1', name: '小精灵', rarity: 'N', story: '来自森林的小精灵', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
      { id: '2', name: '森林守护者', rarity: 'R', story: '守护森林的精灵', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
      { id: '3', name: '古树之灵', rarity: 'SR', story: '千年古树的灵魂', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
      { id: '4', name: '森林女王', rarity: 'SSR', story: '森林的统治者', babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' }
    ]
  },
  {
    id: 2,
    name: '海洋冒险系列',
    description: '深海中的奇妙生物，带你探索未知的海底世界',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    price: 120,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pets: [
      { id: '5', name: '小海星', rarity: 'N', story: '可爱的小海星', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { id: '6', name: '珊瑚精灵', rarity: 'R', story: '珊瑚礁的守护者', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { id: '7', name: '深海巨兽', rarity: 'SR', story: '深海的神秘生物', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { id: '8', name: '海洋之王', rarity: 'SSR', story: '统治海洋的王者', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' }
    ]
  },
  {
    id: 3,
    name: '星空守护系列',
    description: '来自星空的神秘守护者，守护着宇宙的秘密',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
    price: 150,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pets: [
      { id: '9', name: '小星星', rarity: 'N', story: '闪闪发光的小星星', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { id: '10', name: '月亮精灵', rarity: 'R', story: '月光下的精灵', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { id: '11', name: '星座守护者', rarity: 'SR', story: '守护星座的使者', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { id: '12', name: '宇宙之神', rarity: 'UR', story: '创造宇宙的神明', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' }
    ]
  },
  {
    id: 4,
    name: '樱花仙境系列',
    description: '春日樱花飞舞的梦幻世界，每一片花瓣都承载着美好的愿望',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=400&fit=crop',
    price: 120,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pets: [
      { id: '13', name: '樱花精灵', rarity: 'R', story: '在樱花树下诞生的可爱精灵', babyImageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=400&fit=crop' },
      { id: '14', name: '春风仙子', rarity: 'SR', story: '掌控春风与花瓣的仙子', babyImageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=400&fit=crop' },
      { id: '15', name: '樱花女王', rarity: 'SSR', story: '统治樱花仙境的高贵女王', babyImageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=400&fit=crop' }
    ]
  },
  {
    id: 5,
    name: '深海奇迹系列',
    description: '探索神秘深海的奇妙生物，发现海洋深处的无尽宝藏',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop',
    price: 110,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pets: [
      { id: '16', name: '珊瑚小鱼', rarity: 'N', story: '生活在珊瑚礁中的小鱼', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { id: '17', name: '海月水母', rarity: 'R', story: '如月光般美丽的水母', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' },
      { id: '18', name: '海龙王子', rarity: 'SSR', story: '深海王国的高贵王子', babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop' }
    ]
  },
  {
    id: 6,
    name: '星空幻想系列',
    description: '来自遥远星空的神秘使者，带着宇宙的智慧与力量',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
    price: 160,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pets: [
      { id: '19', name: '星尘小精灵', rarity: 'N', story: '由星尘凝聚而成的小精灵', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { id: '20', name: '月光独角兽', rarity: 'SR', story: '沐浴在月光下的神圣独角兽', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' },
      { id: '21', name: '星座守护者', rarity: 'UR', story: '掌控星座命运的古老守护者', babyImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop' }
    ]
  },
  {
    id: 7,
    name: '魔法森林系列',
    description: '充满魔法的古老森林，每一个角落都隐藏着神奇的生物',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    price: 130,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pets: [
      { id: '22', name: '蘑菇小妖', rarity: 'N', story: '住在蘑菇屋里的可爱小妖', babyImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
      { id: '23', name: '森林守护神', rarity: 'SSR', story: '守护整片森林的古老神灵', babyImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop', adultImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' }
    ]
  }
]

// 真实API客户端
const getApiBaseURL = () => {
  // 在开发环境中，自动检测后端地址
  if (import.meta.env.DEV) {
    // 如果前端运行在非localhost地址，后端也应该在同一个主机上
    const currentHost = window.location.hostname
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      return `http://${currentHost}:3003/api`
    }
  }
  return 'http://localhost:3003/api'
}

const realApiClient = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证token
realApiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

// 错误处理工具函数
const handleApiError = (error: any) => {
  const status = error.response?.status
  const message = error.response?.data?.message || error.message
  const url = error.config?.url || 'unknown'

  // 根据错误类型决定是否记录到控制台
  const shouldLog = (status: number, url: string) => {
    // 不记录这些常见的非关键错误
    const silentErrors = [
      '/api/social/friends',
      '/api/social/friend-requests',
      '/api/boxes/stats'
    ]

    // 404错误且是已知的可选API，不记录
    if (status === 404 && silentErrors.some(path => url.includes(path))) {
      return false
    }

    // 401错误通常是认证问题，只在开发环境记录
    if (status === 401 && import.meta.env.PROD) {
      return false
    }

    return true
  }

  // 只在需要时记录错误
  if (shouldLog(status, url)) {
    console.error(`API错误 [${status}] ${url}:`, message)
  }

  return { status, message, url }
}

// 响应拦截器 - 处理错误
realApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorInfo = handleApiError(error)

    if (errorInfo.status === 401) {
      // 只有在特定情况下才自动登出
      const authStore = useAuthStore()
      const errorMessage = errorInfo.message || ''

      // 如果是token过期或无效，才自动登出
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        console.log('Token无效，自动登出')
        authStore.logout()
      }
    }

    return Promise.reject(error)
  }
)

// 模拟API客户端
const mockApiClient = {
  async get(url: string) {
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟

    if (url === '/series') {
      return mockSeries
    }

    if (url.startsWith('/series/')) {
      const id = parseInt(url.split('/')[2])
      return mockSeries.find(s => s.id === id)
    }

    if (url === '/auth/me') {
      const authStore = useAuthStore()
      if (!authStore.accessToken) {
        throw new Error('Unauthorized')
      }
      return authStore.user
    }

    throw new Error(`Mock API: GET ${url} not implemented`)
  },

  async post(url: string, data?: any) {
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟

    if (url === '/auth/login') {
      const { username, password } = data
      if ((username === 'demo' && password === 'demo123') ||
          (username === 'testuser' && password === 'test123456') ||
          (username === 'admin' && password === 'admin123456')) {
        const user = {
          id: username === 'admin' ? 'admin' : '1',
          username: username,
          email: `${username}@example.com`,
          points: username === 'admin' ? 10000 : (username === 'demo' ? 5000 : 1000),
          role: username === 'admin' ? 'ADMIN' : 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockUsers.set(user.id, user)
        return {
          user,
          accessToken: 'mock-token-' + Date.now()
        }
      }
      throw new Error('用户名或密码错误')
    }

    if (url === '/auth/register') {
      const { username, password } = data
      if (mockUsers.has(username)) {
        throw new Error('用户名已存在')
      }
      const user = {
        id: Date.now().toString(),
        username,
        email: `${username}@example.com`,
        points: 500,
        role: 'USER',
        createdAt: new Date().toISOString()
      }
      mockUsers.set(user.id, user)
      return {
        user,
        accessToken: 'mock-token-' + Date.now()
      }
    }

    if (url.startsWith('/draw/')) {
      const seriesId = parseInt(url.split('/')[2])
      const series = mockSeries.find(s => s.id === seriesId)
      if (!series) {
        throw new Error('系列不存在')
      }

      // 检查用户积分
      const authStore = useAuthStore()
      if (!authStore.user || authStore.user.points < series.price) {
        throw new Error('积分不足')
      }

      // 模拟抽取逻辑 - 基于稀有度权重
      const rarityWeights = { 'N': 50, 'R': 30, 'SR': 15, 'SSR': 4, 'UR': 1 }
      const random = Math.random() * 100
      let targetRarity = 'N'
      let cumulative = 0

      for (const [rarity, weight] of Object.entries(rarityWeights)) {
        cumulative += weight
        if (random <= cumulative) {
          targetRarity = rarity
          break
        }
      }

      // 从该稀有度中随机选择宠物
      const availablePets = series.pets.filter(p => p.rarity === targetRarity)
      const finalPets = availablePets.length > 0 ? availablePets : series.pets.filter(p => p.rarity === 'N')
      const pet = finalPets[Math.floor(Math.random() * finalPets.length)]

      // 扣除积分
      authStore.user.points -= series.price

      // 根据稀有度奖励积分
      const rarityBonusPoints = {
        'N': 0,
        'R': 20,
        'SR': 50,
        'SSR': 100,
        'UR': 200
      }

      const bonusPoints = rarityBonusPoints[targetRarity] || 0
      if (bonusPoints > 0) {
        authStore.user.points += bonusPoints
      }

      return {
        pet: pet,
        isNew: Math.random() > 0.3, // 70% 概率是新宠物
        pointsSpent: series.price,
        remainingPoints: authStore.user.points,
        bonusPoints: bonusPoints,
        rarity: targetRarity
      }
    }

    throw new Error(`Mock API: POST ${url} not implemented`)
  }
}

// 导出API客户端
export const api = USE_MOCK_API ? mockApiClient : realApiClient
export const apiClient = api // 为了兼容性，同时导出 apiClient