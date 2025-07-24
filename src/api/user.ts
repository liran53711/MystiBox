import { apiClient } from './index'
import type { UserPet, DrawEvent } from '@/types'

export const userAPI = {
  // 获取用户的宠物收藏
  getMyPets: (): Promise<UserPet[]> => {
    return apiClient.get('/user/pets')
  },

  // 获取抽取历史
  getDrawHistory: (): Promise<DrawEvent[]> => {
    return apiClient.get('/user/draw-history')
  },

  // 更新宠物昵称
  updatePetNickname: (petId: string, nickname: string): Promise<UserPet> => {
    return apiClient.patch(`/user/pets/${petId}`, { nickname })
  },

  // 进化宠物
  evolvePet: (petId: string): Promise<UserPet> => {
    return apiClient.post(`/user/pets/${petId}/evolve`)
  },
}