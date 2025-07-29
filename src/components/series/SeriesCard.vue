<template>
  <div 
    class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
    @click="$emit('click', series)"
  >
    <!-- 系列封面图 -->
    <div class="aspect-[4/3] relative overflow-hidden">
      <img 
        :src="series.image" 
        :alt="series.name"
        class="w-full h-full object-cover"
      />
      <!-- 加载状态 -->
      <div v-if="loading" class="absolute inset-0 bg-gray-200 animate-pulse"></div>
    </div>
    
    <!-- 系列信息 -->
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2 text-gray-800">{{ series.name }}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ series.description }}</p>
      
      <!-- 系列统计 -->
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>共 {{ series.petCount || 0 }} 款</span>
        <span>{{ series.price || 100 }} 积分</span>
      </div>
      
      <!-- 稀有度预览 -->
      <div class="flex gap-1 mt-2">
        <div 
          v-for="rarity in availableRarities" 
          :key="rarity"
          :class="getRarityClass(rarity)"
          class="w-2 h-2 rounded-full"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Series } from '@/types'

interface Props {
  series: Series
  loading?: boolean
}

defineProps<Props>()
defineEmits<{
  click: [series: Series]
}>()

// 模拟可用稀有度
const availableRarities = [1, 2, 3, 4] // N, R, SR, SSR

const getRarityClass = (rarity: number) => {
  const classes = {
    1: 'bg-gray-400',    // N
    2: 'bg-blue-400',    // R
    3: 'bg-purple-400',  // SR
    4: 'bg-yellow-400',  // SSR
    5: 'bg-red-400'      // UR
  }
  return classes[rarity as keyof typeof classes] || classes[1]
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
