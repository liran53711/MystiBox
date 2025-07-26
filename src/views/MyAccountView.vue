<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-text-primary mb-8">个人中心</h1>
    
    <div v-if="authStore.isAuthenticated" class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 用户信息 -->
        <div class="lg:col-span-1">
          <div class="glass-card p-6">
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold text-2xl">{{ authStore.user?.username?.[0] || 'U' }}</span>
              </div>
              <h2 class="text-xl font-semibold text-neutral-text-primary">{{ authStore.user?.username || '用户' }}</h2>
              <p class="text-neutral-text-secondary">积分: {{ authStore.user?.points || 0 }}</p>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">宠物数量:</span>
                <span class="font-semibold">12</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">抽取次数:</span>
                <span class="font-semibold">45</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">注册时间:</span>
                <span class="font-semibold">2025-01-01</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 功能菜单 -->
        <div class="lg:col-span-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors" @click="$router.push('/my-pets')">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">🐾</span>
                </div>
                <div>
                  <h3 class="font-semibold text-neutral-text-primary">我的宠物</h3>
                  <p class="text-sm text-neutral-text-secondary">查看收藏的宠物</p>
                </div>
              </div>
            </div>
            
            <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors" @click="$router.push('/my-account/history')">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">📜</span>
                </div>
                <div>
                  <h3 class="font-semibold text-neutral-text-primary">抽取历史</h3>
                  <p class="text-sm text-neutral-text-secondary">查看抽取记录</p>
                </div>
              </div>
            </div>
            
            <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">⚙️</span>
                </div>
                <div>
                  <h3 class="font-semibold text-neutral-text-primary">账户设置</h3>
                  <p class="text-sm text-neutral-text-secondary">修改个人信息</p>
                </div>
              </div>
            </div>
            
            <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors" @click="handleLogout">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">🚪</span>
                </div>
                <div>
                  <h3 class="font-semibold text-neutral-text-primary">退出登录</h3>
                  <p class="text-sm text-neutral-text-secondary">安全退出账户</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold text-neutral-text-primary mb-2">请先登录</h2>
      <p class="text-neutral-text-secondary mb-6">登录后查看个人信息</p>
      <BaseButton variant="primary" @click="uiStore.openLoginModal">
        登录
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
