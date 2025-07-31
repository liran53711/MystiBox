<template>
  <div
    class="card hover-lift cursor-pointer overflow-hidden card-stagger-in"
    @click="$emit('click', series)"
  >
    <!-- 系列封面图 -->
    <div class="aspect-[4/3] relative overflow-hidden group">
      <img
        :src="series.coverImageUrl"
        :alt="series.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <!-- 渐变覆盖层 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <!-- 魔法粒子效果 -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div class="absolute top-6 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 0.3s;"></div>
        <div class="absolute top-8 right-5 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style="animation-delay: 0.6s;"></div>
        <div class="absolute bottom-8 left-4 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style="animation-delay: 0.9s;"></div>
      </div>

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
        <span>{{ series.drawPrice || 100 }} 积分</span>
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
