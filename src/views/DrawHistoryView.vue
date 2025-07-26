<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-text-primary mb-8">抽取历史</h1>
    
    <div v-if="authStore.isAuthenticated">
      <div v-if="mockHistory.length > 0" class="space-y-4">
        <div v-for="record in mockHistory" :key="record.id" class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">{{ record.petEmoji }}</span>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-text-primary">{{ record.petName }}</h3>
                <p class="text-neutral-text-secondary">{{ record.seriesName }}</p>
                <p class="text-sm text-neutral-text-secondary">{{ record.time }}</p>
              </div>
            </div>
            
            <div class="text-right">
              <span :class="getRarityColor(record.rarity)" class="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2">
                {{ record.rarity }}
              </span>
              <p class="text-neutral-text-secondary text-sm">消耗 {{ record.cost }} 积分</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">📜</div>
        <h2 class="text-2xl font-semibold text-neutral-text-primary mb-2">暂无抽取记录</h2>
        <p class="text-neutral-text-secondary mb-6">去商店抽取你的第一只宠物吧！</p>
        <BaseButton variant="primary" @click="$router.push('/store')">
          前往商店
        </BaseButton>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold text-neutral-text-primary mb-2">请先登录</h2>
      <p class="text-neutral-text-secondary mb-6">登录后查看抽取历史</p>
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

const mockHistory = ref([
  {
    id: 1,
    petName: '月光守护者',
    petEmoji: '🌙',
    seriesName: '星空守护系列',
    rarity: '传说',
    cost: 150,
    time: '2025-01-20 14:30'
  },
  {
    id: 2,
    petName: '海星宝宝',
    petEmoji: '⭐',
    seriesName: '海洋冒险系列',
    rarity: '稀有',
    cost: 120,
    time: '2025-01-19 16:45'
  },
  {
    id: 3,
    petName: '小精灵',
    petEmoji: '🧚‍♀️',
    seriesName: '森林精灵系列',
    rarity: '普通',
    cost: 100,
    time: '2025-01-18 10:15'
  }
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
