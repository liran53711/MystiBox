import { api } from './index'
import type { DrawResult } from '@/types'

export const drawApi = {
  // 抽取宠物
  async drawPet(seriesId: number): Promise<DrawResult> {
    console.log('发送抽卡请求:', seriesId)
    const response = await api.post(`/draw/${seriesId}`)
    console.log('抽卡API响应:', response)
    // API拦截器已经返回了response.data，所以这里直接返回response
    return response
  },

  // 获取抽取历史
  async getDrawHistory(page = 1, limit = 20) {
    const response = await api.get('/draw/history', {
      params: { page, limit }
    })
    // API拦截器已经返回了response.data，所以这里直接返回response
    return response
  }
}
