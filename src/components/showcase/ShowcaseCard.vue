<template>
  <div 
    class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
    @click="$emit('click', post)"
  >
    <!-- 宠物图片 -->
    <div class="aspect-square relative">
      <img 
        :src="post.userPet?.pet?.adultImage || post.userPet?.pet?.image" 
        :alt="post.userPet?.nickname || post.userPet?.pet?.name"
        class="w-full h-full object-cover"
      />
      
      <!-- 稀有度标识 -->
      <div class="absolute top-2 right-2">
        <span 
          :class="getRarityClass(post.userPet?.pet?.rarity || 1)" 
          class="px-2 py-1 rounded text-xs font-bold text-white"
        >
          {{ getRarityText(post.userPet?.pet?.rarity || 1) }}
        </span>
      </div>
    </div>
    
    <!-- 分享内容 -->
    <div class="p-4">
      <p class="text-gray-800 text-sm mb-3 line-clamp-3">{{ post.caption }}</p>
      
      <!-- 用户信息和互动 -->
      <div class="flex items-center justify-between">
        <!-- 用户信息 -->
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span class="text-xs font-bold text-gray-600">
              {{ post.user?.username?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="text-xs text-gray-600">{{ post.user?.username }}</span>
        </div>
        
        <!-- 互动统计 -->
        <div class="flex items-center space-x-3 text-xs text-gray-500">
          <!-- 点赞 -->
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <span>{{ post._count?.likes || 0 }}</span>
          </div>
          
          <!-- 评论 -->
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{{ post._count?.comments || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShowcasePost } from '@/types'

interface Props {
  post: ShowcasePost
}

defineProps<Props>()
defineEmits<{
  click: [post: ShowcasePost]
}>()

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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
