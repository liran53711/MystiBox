import { User, Series, Pet, UserPet, DrawEvent, ShowcasePost } from './index'

// 认证相关
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

// 抽卡相关
export interface DrawRequest {
  amount: 1 | 10
}

export interface DrawResponse {
  drawnPets: UserPet[]
  remainingPoints: number
}

// API 响应包装
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}