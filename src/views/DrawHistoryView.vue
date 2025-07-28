<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        📜 抽取历史
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        回顾你的抽卡战绩
      </p>
    </div>

    <div v-if="authStore.isAuthenticated">
      <!-- 统计信息 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">🎲</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ mockHistory.length }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">总抽取次数</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">💰</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ totalSpent }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">总消耗积分</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">🐾</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ mockHistory.length }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">获得宠物</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">⭐</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ rareCount }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">稀有及以上</div>
        </div>
      </div>

      <div v-if="mockHistory.length > 0" class="space-y-4">
        <div v-for="record in mockHistory" :key="record.id" class="card p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-lg flex items-center justify-center" style="background: var(--color-secondary);">
                <span class="text-2xl">{{ record.petEmoji }}</span>
              </div>
              <div>
                <h3 class="font-semibold" style="color: var(--color-text-primary);">{{ record.petName }}</h3>
                <p style="color: var(--color-text-secondary);">{{ record.seriesName }}</p>
                <p class="text-sm" style="color: var(--color-text-secondary);">{{ record.time }}</p>
              </div>
            </div>

            <div class="text-right">
              <span class="rarity-badge mb-2" :class="getRarityBadgeClass(record.rarity)">
                {{ getRarityText(record.rarity) }}
              </span>
              <p class="text-sm" style="color: var(--color-text-secondary);">消耗 {{ record.cost }} 积分</p>
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
import { ref, computed } from 'vue'
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
    rarity: 'SSR',
    cost: 150,
    time: '2小时前'
  },
  {
    id: 2,
    petName: '海星宝宝',
    petEmoji: '⭐',
    seriesName: '海洋冒险系列',
    rarity: 'R',
    cost: 120,
    time: '1天前'
  },
  {
    id: 3,
    petName: '小精灵',
    petEmoji: '🧚‍♀️',
    seriesName: '森林精灵系列',
    rarity: 'N',
    cost: 100,
    time: '3天前'
  },
  {
    id: 4,
    petName: '森林守护者',
    petEmoji: '🌳',
    seriesName: '森林精灵系列',
    rarity: 'SR',
    cost: 100,
    time: '5天前'
  }
])

// 计算属性
const totalSpent = computed(() => mockHistory.value.reduce((sum, record) => sum + record.cost, 0))
const rareCount = computed(() => mockHistory.value.filter(record => ['R', 'SR', 'SSR', 'UR'].includes(record.rarity)).length)

const getRarityBadgeClass = (rarity: string) => {
  const classes = {
    'N': 'rarity-badge-n',
    'R': 'rarity-badge-r',
    'SR': 'rarity-badge-sr',
    'SSR': 'rarity-badge-ssr',
    'UR': 'rarity-badge-ur'
  }
  return classes[rarity as keyof typeof classes] || 'rarity-badge-n'
}

const getRarityText = (rarity: string) => {
  const texts = {
    'N': '普通',
    'R': '稀有',
    'SR': '史诗',
    'SSR': '传说',
    'UR': '神话'
  }
  return texts[rarity as keyof typeof texts] || '普通'
}
</script>
