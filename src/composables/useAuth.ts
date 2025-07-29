import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

/**
 * 认证相关的组合式函数
 */
export function useAuth() {
  const authStore = useAuthStore()

  // 计算属性
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)

  // 方法
  const login = async (username: string, password: string) => {
    return await authStore.login(username, password)
  }

  const register = async (username: string, password: string) => {
    return await authStore.register(username, password)
  }

  const logout = () => {
    authStore.logout()
  }

  const checkAuth = () => {
    authStore.checkAuth()
  }

  return {
    // 状态
    isAuthenticated,
    isAdmin,
    user,
    isLoading,
    // 方法
    login,
    register,
    logout,
    checkAuth
  }
}
