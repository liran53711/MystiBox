import { api } from './index'

export interface UserBox {
  id: string
  status: 'UNOPENED' | 'OPENED' | 'TRADING' | 'GIFTED'
  obtainedAt: string
  openedAt?: string
  series: {
    id: number
    name: string
    description: string
    coverImageUrl: string
    drawPrice: number
  }
  resultPet?: {
    id: string
    pet: {
      id: string
      name: string
      rarity: string
      babyImageUrl: string
      adultImageUrl: string
    }
  }
}

export interface BoxStats {
  totalBoxes: number
  openedBoxes: number
  tradingBoxes: number
  giftedBoxes: number
  totalValue: number
}

export interface PurchaseBoxResponse {
  success: boolean
  boxes: UserBox[]
  remainingPoints: number
  message: string
}

export interface OpenBoxResponse {
  success: boolean
  userPet: {
    id: string
    pet: {
      id: string
      name: string
      rarity: string
      babyImageUrl: string
      adultImageUrl: string
      story: string
    }
  }
  message: string
}

export const boxesApi = {
  // 获取用户的盲盒列表
  async getMyBoxes(params?: {
    status?: string
    seriesId?: number
  }): Promise<UserBox[]> {
    const response = await api.get('/boxes/my-boxes', { params })
    return response
  },

  // 购买盲盒
  async purchaseBoxes(seriesId: number, amount: number = 1): Promise<PurchaseBoxResponse> {
    const response = await api.post('/boxes/purchase', {
      seriesId,
      amount
    })
    return response
  },

  // 开封盲盒
  async openBox(boxId: string): Promise<OpenBoxResponse> {
    const response = await api.post(`/boxes/${boxId}/open`)
    return response
  },

  // 赠送盲盒
  async giftBox(boxId: string, recipientId: string, message?: string): Promise<{
    success: boolean
    message: string
  }> {
    const response = await api.post(`/boxes/${boxId}/gift`, {
      recipientId,
      message
    })
    return response
  },

  // 获取盲盒统计信息
  async getStats(): Promise<BoxStats> {
    const response = await api.get('/boxes/stats')
    return response
  }
}
