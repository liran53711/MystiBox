<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- 宠物图片 -->
    <div class="aspect-square relative">
      <img 
        :src="pet.babyImageUrl"
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
        v-if="pet.rarity == 'UR' && !revealed"
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

const getRarityClass = (rarity: string) => {
  const classes = {
    'N': 'bg-gray-500',
    'R': 'bg-blue-500',
    'SR': 'bg-purple-500',
    'SSR': 'bg-yellow-500',
    'UR': 'bg-red-500'
  }
  return classes[rarity as keyof typeof classes] || classes['N']
}

const getRarityText = (rarity: string) => {
  return rarity || 'N'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
