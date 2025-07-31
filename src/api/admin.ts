import { apiClient } from './client'

export const adminApi = {
  // 初始化管理员
  initAdmin: () => {
    return apiClient.post('/admin/init-admin')
  },

  // 获取统计数据
  getStats: () => {
    return apiClient.get('/admin/stats')
  },

  getUserStats: () => {
    return apiClient.get('/admin/stats/users')
  },

  getSeriesStats: () => {
    return apiClient.get('/admin/stats/series')
  },

  getPetStats: () => {
    return apiClient.get('/admin/stats/pets')
  },

  getDrawStats: () => {
    return apiClient.get('/admin/stats/draws')
  },

  // 获取用户列表
  getUsers: () => {
    return apiClient.get('/admin/users')
  },

  // 获取系列列表
  getSeries: () => {
    return apiClient.get('/admin/series')
  }
}
