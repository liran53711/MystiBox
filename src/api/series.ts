import { apiClient } from './index'
import type { Series, DrawRequest, DrawResponse } from '@/types'

export const seriesAPI = {
  // 获取所有系列
  getAll: (): Promise<Series[]> => {
    return apiClient.get('/series')
  },

  // 根据ID获取系列详情
  getById: (id: string): Promise<Series> => {
    return apiClient.get(`/series/${id}`)
  },

  // 抽取盲盒
  draw: (seriesId: string, drawData: DrawRequest): Promise<DrawResponse> => {
    return apiClient.post(`/series/${seriesId}/draw`, drawData)
  },
}