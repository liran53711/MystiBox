<template>
  <nav class="glass-card sticky top-0 z-40 mb-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-xl">M</span>
          </div>
          <span class="font-title font-bold text-xl text-neutral-text-primary">MystiBox</span>
        </RouterLink>
        
        <!-- 导航菜单 -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            to="/"
            class="nav-link"
            active-class="nav-link-active"
          >
            首页
          </RouterLink>
          <RouterLink
            to="/store"
            class="nav-link"
            active-class="nav-link-active"
          >
            盲盒商店
          </RouterLink>
          <RouterLink
            to="/plaza"
            class="nav-link"
            active-class="nav-link-active"
          >
            宠物广场
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/my-pets"
            class="nav-link"
            active-class="nav-link-active"
          >
            我的收藏
          </RouterLink>
        </div>
        
        <!-- 用户菜单 -->
        <div class="flex items-center space-x-4">
          <!-- 积分显示 -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
            <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
            </svg>
            <span class="font-semibold text-neutral-text-primary">{{ authStore.user?.points || 0 }}</span>
          </div>
          
          <!-- 登录/用户菜单 -->
          <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-3">
            <BaseButton variant="ghost" size="sm" @click="uiStore.openLoginModal">
              登录
            </BaseButton>
            <BaseButton variant="primary" size="sm" @click="uiStore.openRegisterModal">
              注册
            </BaseButton>
          </div>
          
          <div v-else class="relative" ref="userMenuRef">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 hover:bg-white/30 transition-colors"
            >
              <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-sm">{{ authStore.user?.username.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="font-medium text-neutral-text-primary">{{ authStore.user?.username }}</span>
              <svg class="w-4 h-4 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- 用户下拉菜单 -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg py-2"
              >
                <RouterLink
                  to="/my-account"
                  class="block px-4 py-2 text-sm text-neutral-text-primary hover:bg-white/20 transition-colors"
                  @click="showUserMenu = false"
                >
                  个人中心
                </RouterLink>
                <RouterLink
                  to="/my-account/history"
                  class="block px-4 py-2 text-sm text-neutral-text-primary hover:bg-white/20 transition-colors"
                  @click="showUserMenu = false"
                >
                  抽取历史
                </RouterLink>
                <div v-if="authStore.isAdmin" class="border-t border-white/20 my-2"></div>
                <RouterLink
                  v-if="authStore.isAdmin"
                  to="/admin"
                  class="block px-4 py-2 text-sm text-neutral-text-primary hover:bg-white/20 transition-colors"
                  @click="showUserMenu = false"
                >
                  管理后台
                </RouterLink>
                <div class="border-t border-white/20 my-2"></div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-error hover:bg-white/20 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 登录模态框 -->
    <LoginModal />
    <!-- 注册模态框 -->
    <RegisterModal />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import BaseButton from '@/components/base/BaseButton.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
}

// 点击外部关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  @apply text-neutral-text-secondary hover:text-neutral-text-primary font-medium transition-colors duration-200 relative;
}

.nav-link-active {
  @apply text-accent-500;
}

.nav-link-active::after {
  content: '';
  @apply absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-500 rounded-full;
}
</style>