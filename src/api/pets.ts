import { api } from './index'
import type { UserPet } from '@/types'

export const petsApi = {
  // 获取用户的宠物收藏
  async getUserPets(): Promise<UserPet[]> {
    const response = await api.get('/pets/my-collection')
    return response
  },

  // 更新宠物昵称
  async updateNickname(userPetId: string, nickname: string): Promise<UserPet> {
    const response = await api.patch(`/pets/${userPetId}/nickname`, { nickname })
    return response
  },

  // 喂养宠物
  async feedPet(userPetId: string): Promise<UserPet> {
    const response = await api.post(`/pets/${userPetId}/feed`)
    return response
  },

  // 进化宠物
  async evolvePet(userPetId: string): Promise<UserPet> {
    const response = await api.post(`/pets/${userPetId}/evolve`)
    return response
  }
}
