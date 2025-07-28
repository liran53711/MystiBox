<template>
  <nav class="sticky top-0 z-40 mb-8" style="background-color: var(--color-primary); box-shadow: var(--shadow-card);">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--color-accent);">
            <span class="text-white font-bold text-xl">🎁</span>
          </div>
          <span class="font-bold text-xl text-white" style="font-family: var(--font-heading);">MystiBox</span>
        </RouterLink>
        
        <!-- 导航菜单 -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            to="/"
            class="text-white hover:text-yellow-200 transition-colors font-medium"
            style="font-family: var(--font-body);"
          >
            首页
          </RouterLink>
          <RouterLink
            to="/store"
            class="text-white hover:text-yellow-200 transition-colors font-medium"
            style="font-family: var(--font-body);"
          >
            盲盒商店
          </RouterLink>
          <RouterLink
            to="/plaza"
            class="text-white hover:text-yellow-200 transition-colors font-medium"
            style="font-family: var(--font-body);"
          >
            宠物广场
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/my-pets"
            class="text-white hover:text-yellow-200 transition-colors font-medium"
            style="font-family: var(--font-body);"
          >
            我的收藏
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/history"
            class="text-white hover:text-yellow-200 transition-colors font-medium"
            style="font-family: var(--font-body);"
          >
            抽取历史
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/friends"
            class="text-white hover:text-yellow-200 transition-colors font-medium relative"
            style="font-family: var(--font-body);"
          >
            好友
            <!-- 好友请求提醒 -->
            <span
              v-if="friendRequestsCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ friendRequestsCount > 9 ? '9+' : friendRequestsCount }}
            </span>
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/gifts"
            class="text-white hover:text-yellow-200 transition-colors font-medium relative"
            style="font-family: var(--font-body);"
          >
            礼物
            <!-- 未领取礼物提醒 -->
            <span
              v-if="pendingGiftsCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ pendingGiftsCount > 9 ? '9+' : pendingGiftsCount }}
            </span>
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated && authStore.user?.role === 'ADMIN'"
            to="/admin"
            class="text-white hover:text-yellow-200 transition-colors font-medium"
            style="font-family: var(--font-body);"
          >
            管理后台
          </RouterLink>
        </div>
        
        <!-- 用户菜单 -->
        <div class="flex items-center space-x-4">
          <!-- 积分显示 -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
            <span class="text-yellow-300 text-lg">💰</span>
            <span class="font-semibold text-white">{{ authStore.user?.points || 0 }}</span>
          </div>

          <!-- 登录/用户菜单 -->
          <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-3">
            <button
              @click="uiStore.openLoginModal"
              class="btn btn-secondary text-white border-white hover:bg-white hover:text-blue-600"
            >
              登录
            </button>
          </div>
          
          <div v-else class="relative" ref="userMenuRef">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 hover:bg-white/30 transition-colors"
            >
              <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: var(--color-accent);">
                <span class="text-white font-semibold text-sm">{{ authStore.user?.username.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="font-medium text-white">{{ authStore.user?.username }}</span>
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useSocialStore } from '@/store/social'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()
const socialStore = useSocialStore()

const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// 计算提醒数量
const friendRequestsCount = computed(() => socialStore.pendingRequestsCount)
const pendingGiftsCount = computed(() => socialStore.pendingGiftsCount)

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