import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authAPI } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  // Actions
  async function login(username: string, password: string) {
    isLoading.value = true
    try {
      const response = await authAPI.login({ username, password })
      user.value = response.user
      accessToken.value = response.accessToken
      
      // 存储到 localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(username: string, password: string) {
    isLoading.value = true
    try {
      const response = await authAPI.register({ username, password })
      user.value = response.user
      accessToken.value = response.accessToken
      
      // 存储到 localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  function checkAuth() {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        accessToken.value = token
        user.value = JSON.parse(userData)
      } catch (error) {
        // 如果解析失败，清除无效数据
        logout()
      }
    }
  }

  function deductPoints(amount: number) {
    if (user.value) {
      user.value.points -= amount
      // 同步更新 localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    accessToken,
    isLoading,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    deductPoints
  }
})