<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="glass-card max-w-md w-full p-6 relative">
      <!-- 关闭按钮 -->
      <button 
        @click="$emit('close')"
        class="absolute top-4 right-4 text-neutral-text-secondary hover:text-neutral-text-primary"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- 恭喜标题 -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-neutral-text-primary mb-2">🎉 恭喜获得</h2>
        <div class="text-lg font-semibold" :class="rarityColorClass">
          {{ rarityText }}
        </div>
      </div>

      <!-- 宠物展示 -->
      <div class="text-center mb-6">
        <div class="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
          <img 
            :src="result.pet.image" 
            :alt="result.pet.name"
            class="w-full h-full object-cover"
          />
        </div>
        <h3 class="text-xl font-bold text-neutral-text-primary mb-2">{{ result.pet.name }}</h3>
        <p class="text-neutral-text-secondary text-sm">{{ result.pet.description }}</p>
      </div>

      <!-- 稀有度指示器 -->
      <div class="mb-6">
        <div class="flex justify-center space-x-1">
          <div 
            v-for="i in 5" 
            :key="i"
            class="w-3 h-3 rounded-full"
            :class="i <= result.pet.rarity ? rarityColorClass : 'bg-gray-300'"
          ></div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-3">
        <BaseButton variant="secondary" class="flex-1" @click="$emit('close')">
          继续抽取
        </BaseButton>
        <BaseButton variant="primary" class="flex-1" @click="goToCollection">
          查看收藏
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import type { DrawResult } from '@/types'

interface Props {
  result: DrawResult
}

const props = defineProps<Props>()
const router = useRouter()

defineEmits<{
  close: []
}>()

// 稀有度文本和颜色
const rarityText = computed(() => {
  const rarityMap = {
    1: '普通',
    2: '稀有',
    3: '史诗',
    4: '传说',
    5: '神话'
  }
  return rarityMap[props.result.pet.rarity as keyof typeof rarityMap] || '未知'
})

const rarityColorClass = computed(() => {
  const colorMap = {
    1: 'text-gray-500',
    2: 'text-green-500',
    3: 'text-blue-500',
    4: 'text-purple-500',
    5: 'text-yellow-500'
  }
  return colorMap[props.result.pet.rarity as keyof typeof colorMap] || 'text-gray-500'
})

// 前往收藏页面
const goToCollection = () => {
  router.push('/collection')
}
</script>
