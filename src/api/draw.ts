import { api } from './index'
import type { DrawResult } from '@/types'

export const drawApi = {
  // 抽取宠物
  async drawPet(seriesId: number): Promise<DrawResult> {
    const response = await api.post(`/draw/${seriesId}`)
    return response.data
  },

  // 获取抽取历史
  async getDrawHistory(page = 1, limit = 20) {
    const response = await api.get('/draw/history', {
      params: { page, limit }
    })
    return response.data
  }
}
