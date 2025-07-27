import axios from 'axios'
import { useAuthStore } from '@/store/auth'

// 使用模拟数据而不是真实后端
const USE_MOCK_API = true

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
      { id: '1', name: '小精灵', rarity: 1, description: '来自森林的小精灵', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop' },
      { id: '2', name: '森林守护者', rarity: 2, description: '守护森林的精灵', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop' },
      { id: '3', name: '古树之灵', rarity: 3, description: '千年古树的灵魂', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop' },
      { id: '4', name: '森林女王', rarity: 4, description: '森林的统治者', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop' }
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
      { id: '5', name: '小海星', rarity: 1, description: '可爱的小海星', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop' },
      { id: '6', name: '珊瑚精灵', rarity: 2, description: '珊瑚礁的守护者', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop' },
      { id: '7', name: '深海巨兽', rarity: 3, description: '深海的神秘生物', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop' },
      { id: '8', name: '海洋之王', rarity: 4, description: '统治海洋的王者', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop' }
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
      { id: '9', name: '小星星', rarity: 1, description: '闪闪发光的小星星', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop' },
      { id: '10', name: '月亮精灵', rarity: 2, description: '月光下的精灵', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop' },
      { id: '11', name: '星座守护者', rarity: 3, description: '守护星座的使者', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop' },
      { id: '12', name: '宇宙之神', rarity: 5, description: '创造宇宙的神明', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop' }
    ]
  }
]

// 真实API客户端
const realApiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
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

// 响应拦截器 - 处理错误
realApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
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
          (username === 'testuser' && password === 'test123456')) {
        const user = {
          id: '1',
          username: username,
          email: `${username}@example.com`,
          points: 1000,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockUsers.set('1', user)
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
      const rarityWeights = { 1: 50, 2: 30, 3: 15, 4: 4, 5: 1 }
      const random = Math.random() * 100
      let targetRarity = 1
      let cumulative = 0

      for (const [rarity, weight] of Object.entries(rarityWeights)) {
        cumulative += weight
        if (random <= cumulative) {
          targetRarity = parseInt(rarity)
          break
        }
      }

      // 从该稀有度中随机选择宠物
      const availablePets = series.pets.filter(p => p.rarity === targetRarity)
      const finalPets = availablePets.length > 0 ? availablePets : series.pets.filter(p => p.rarity === 1)
      const pet = finalPets[Math.floor(Math.random() * finalPets.length)]

      // 扣除积分
      authStore.user.points -= series.price

      return {
        pet: pet,
        isNew: Math.random() > 0.3, // 70% 概率是新宠物
        pointsSpent: series.price,
        remainingPoints: authStore.user.points
      }
    }

    throw new Error(`Mock API: POST ${url} not implemented`)
  }
}

// 导出API客户端
export const api = USE_MOCK_API ? mockApiClient : realApiClient