<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-text-primary mb-8">管理后台</h1>
    
    <div v-if="authStore.isAdmin">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral-text-secondary text-sm">总用户数</p>
              <p class="text-2xl font-bold text-neutral-text-primary">1,234</p>
            </div>
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span class="text-2xl">👥</span>
            </div>
          </div>
        </div>
        
        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral-text-secondary text-sm">盲盒系列</p>
              <p class="text-2xl font-bold text-neutral-text-primary">12</p>
            </div>
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📦</span>
            </div>
          </div>
        </div>
        
        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral-text-secondary text-sm">今日抽取</p>
              <p class="text-2xl font-bold text-neutral-text-primary">89</p>
            </div>
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🎲</span>
            </div>
          </div>
        </div>
        
        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral-text-secondary text-sm">总收入</p>
              <p class="text-2xl font-bold text-neutral-text-primary">45,678</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span class="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快速操作 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors" @click="$router.push('/admin/series')">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📦</span>
            </div>
            <div>
              <h3 class="font-semibold text-neutral-text-primary">系列管理</h3>
              <p class="text-sm text-neutral-text-secondary">管理盲盒系列和宠物</p>
            </div>
          </div>
        </div>
        
        <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <span class="text-2xl">👥</span>
            </div>
            <div>
              <h3 class="font-semibold text-neutral-text-primary">用户管理</h3>
              <p class="text-sm text-neutral-text-secondary">管理用户账户</p>
            </div>
          </div>
        </div>
        
        <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
            <div>
              <h3 class="font-semibold text-neutral-text-primary">数据统计</h3>
              <p class="text-sm text-neutral-text-secondary">查看详细统计</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold text-neutral-text-primary mb-2">权限不足</h2>
      <p class="text-neutral-text-secondary mb-6">您没有访问管理后台的权限</p>
      <BaseButton variant="primary" @click="$router.push('/')">
        返回首页
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import BaseButton from '@/components/base/BaseButton.vue'

const authStore = useAuthStore()
</script>
