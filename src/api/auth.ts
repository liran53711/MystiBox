import { api } from './index'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api'

export const authAPI = {
  // 用户登录
  login: (credentials: LoginRequest): Promise<AuthResponse> => {
    return api.post('/auth/login', credentials)
  },

  // 用户注册
  register: (userData: RegisterRequest): Promise<AuthResponse> => {
    return api.post('/auth/register', userData)
  },

  // 刷新 Token
  refreshToken: (): Promise<{ accessToken: string }> => {
    return api.post('/auth/refresh')
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return api.get('/auth/me')
  },
}