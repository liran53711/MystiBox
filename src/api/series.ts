import { api } from './index'
import type { Series } from '@/types'

export const seriesApi = {
  // 获取所有系列
  getAll: (): Promise<Series[]> => {
    return api.get('/series')
  },

  // 根据ID获取系列详情
  getById: (id: number): Promise<Series> => {
    return api.get(`/series/${id}`)
  },
}