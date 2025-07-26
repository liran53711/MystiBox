<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-text-primary mb-8">盲盒商店</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="series in mockSeries" :key="series.id" class="glass-card p-6">
        <div class="aspect-square bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg mb-4 flex items-center justify-center">
          <span class="text-4xl">{{ series.emoji }}</span>
        </div>
        <h3 class="text-xl font-semibold text-neutral-text-primary mb-2">{{ series.name }}</h3>
        <p class="text-neutral-text-secondary mb-4">{{ series.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-accent-500">{{ series.price }} 积分</span>
          <BaseButton variant="primary" @click="$router.push(`/series/${series.id}`)">
            查看详情
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

const mockSeries = ref([
  {
    id: 1,
    name: '森林精灵系列',
    description: '来自神秘森林的可爱精灵们',
    price: 100,
    emoji: '🧚'
  },
  {
    id: 2,
    name: '海洋冒险系列',
    description: '深海中的奇妙生物',
    price: 120,
    emoji: '🐠'
  },
  {
    id: 3,
    name: '星空守护系列',
    description: '来自星空的神秘守护者',
    price: 150,
    emoji: '⭐'
  }
])
</script>
