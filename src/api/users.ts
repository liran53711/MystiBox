import { api } from './index'
import type { User } from '@/types'

export interface SearchUserResult {
  id: string
  username: string
  avatar: string
  isFriend: boolean
  requestSent: boolean
}

export const usersApi = {
  // 搜索用户
  async searchUsers(query: string): Promise<SearchUserResult[]> {
    const response = await api.get('/users/search', {
      params: { q: query }
    })
    return response.data
  },

  // 获取用户信息
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // 更新用户头像
  async updateAvatar(avatar: string): Promise<User> {
    const response = await api.patch('/users/avatar', { avatar })
    return response.data
  }
}
