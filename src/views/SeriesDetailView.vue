<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="series" class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 系列图片 -->
        <div class="aspect-square bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
          <span class="text-8xl">{{ series.emoji }}</span>
        </div>
        
        <!-- 系列信息 -->
        <div>
          <h1 class="text-3xl font-bold text-neutral-text-primary mb-4">{{ series.name }}</h1>
          <p class="text-neutral-text-secondary mb-6">{{ series.description }}</p>
          
          <div class="glass-card p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-text-primary mb-4">系列信息</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">价格:</span>
                <span class="font-semibold text-accent-500">{{ series.price }} 积分</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">宠物数量:</span>
                <span class="font-semibold">{{ series.petCount }} 只</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">稀有度:</span>
                <span class="font-semibold">普通 - 传说</span>
              </div>
            </div>
          </div>
          
          <BaseButton variant="primary" size="lg" full-width @click="handleDraw">
            抽取盲盒 ({{ series.price }} 积分)
          </BaseButton>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <p class="text-neutral-text-secondary">系列不存在</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const seriesId = computed(() => Number(route.params.id))

const mockSeriesData = {
  1: { id: 1, name: '森林精灵系列', description: '来自神秘森林的可爱精灵们，每一只都拥有独特的魔法能力', price: 100, petCount: 12, emoji: '🧚' },
  2: { id: 2, name: '海洋冒险系列', description: '深海中的奇妙生物，带你探索未知的海底世界', price: 120, petCount: 15, emoji: '🐠' },
  3: { id: 3, name: '星空守护系列', description: '来自星空的神秘守护者，守护着宇宙的秘密', price: 150, petCount: 10, emoji: '⭐' }
}

const series = computed(() => mockSeriesData[seriesId.value as keyof typeof mockSeriesData])

const handleDraw = () => {
  alert('抽取功能暂未实现，需要后端支持')
}
</script>
