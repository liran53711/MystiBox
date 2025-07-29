<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- 宠物图片 -->
    <div class="aspect-square relative">
      <img 
        :src="pet.image" 
        :alt="pet.name"
        class="w-full h-full object-cover"
      />
      
      <!-- 稀有度标识 -->
      <div class="absolute top-2 right-2">
        <span 
          :class="getRarityClass(pet.rarity)" 
          class="px-2 py-1 rounded text-xs font-bold text-white"
        >
          {{ getRarityText(pet.rarity) }}
        </span>
      </div>
      
      <!-- 神秘遮罩（高稀有度） -->
      <div 
        v-if="pet.rarity >= 3 && !revealed"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
        @click="revealed = true"
      >
        <div class="text-white text-center">
          <div class="text-4xl mb-2">❓</div>
          <div class="text-sm">点击预览</div>
        </div>
      </div>
    </div>
    
    <!-- 宠物信息 -->
    <div class="p-3">
      <h4 class="font-semibold text-sm mb-1">{{ pet.name }}</h4>
      <p class="text-xs text-gray-600 line-clamp-2">{{ pet.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Pet } from '@/types'

interface Props {
  pet: Pet
}

defineProps<Props>()

const revealed = ref(false)

const getRarityClass = (rarity: number) => {
  const classes = {
    1: 'bg-gray-500',    // N
    2: 'bg-blue-500',    // R
    3: 'bg-purple-500',  // SR
    4: 'bg-yellow-500',  // SSR
    5: 'bg-red-500'      // UR
  }
  return classes[rarity as keyof typeof classes] || classes[1]
}

const getRarityText = (rarity: number) => {
  const texts = {
    1: 'N',
    2: 'R', 
    3: 'SR',
    4: 'SSR',
    5: 'UR'
  }
  return texts[rarity as keyof typeof texts] || 'N'
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
