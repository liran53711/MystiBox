<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-text-primary mb-8">我的宠物收藏</h1>
    
    <div v-if="authStore.isAuthenticated">
      <div v-if="mockPets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="pet in mockPets" :key="pet.id" class="glass-card p-4">
          <div class="aspect-square bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg mb-3 flex items-center justify-center">
            <span class="text-3xl">{{ pet.emoji }}</span>
          </div>
          <h3 class="font-semibold text-neutral-text-primary mb-1">{{ pet.name }}</h3>
          <p class="text-sm text-neutral-text-secondary mb-2">{{ pet.series }}</p>
          <div class="flex justify-between items-center">
            <span :class="getRarityColor(pet.rarity)" class="text-xs font-medium px-2 py-1 rounded">
              {{ pet.rarity }}
            </span>
            <span class="text-xs text-neutral-text-secondary">Lv.{{ pet.level }}</span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">📦</div>
        <h2 class="text-2xl font-semibold text-neutral-text-primary mb-2">还没有宠物</h2>
        <p class="text-neutral-text-secondary mb-6">去商店抽取你的第一只宠物吧！</p>
        <BaseButton variant="primary" @click="$router.push('/store')">
          前往商店
        </BaseButton>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold text-neutral-text-primary mb-2">请先登录</h2>
      <p class="text-neutral-text-secondary mb-6">登录后查看你的宠物收藏</p>
      <BaseButton variant="primary" @click="uiStore.openLoginModal">
        登录
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import BaseButton from '@/components/base/BaseButton.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

const mockPets = ref([
  { id: 1, name: '小精灵', series: '森林精灵系列', rarity: '普通', level: 5, emoji: '🧚‍♀️' },
  { id: 2, name: '海星宝宝', series: '海洋冒险系列', rarity: '稀有', level: 3, emoji: '⭐' },
  { id: 3, name: '月光守护者', series: '星空守护系列', rarity: '传说', level: 8, emoji: '🌙' }
])

const getRarityColor = (rarity: string) => {
  const colors = {
    '普通': 'bg-gray-100 text-gray-800',
    '稀有': 'bg-blue-100 text-blue-800',
    '史诗': 'bg-purple-100 text-purple-800',
    '传说': 'bg-yellow-100 text-yellow-800'
  }
  return colors[rarity as keyof typeof colors] || colors['普通']
}
</script>
