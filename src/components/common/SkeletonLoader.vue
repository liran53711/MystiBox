<template>
  <div class="animate-pulse">
    <!-- 卡片骨架屏 -->
    <div v-if="type === 'card'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- 图片区域 -->
      <div class="aspect-[4/3] bg-gray-200"></div>
      <!-- 内容区域 -->
      <div class="p-4">
        <div class="h-4 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div class="flex justify-between">
          <div class="h-3 bg-gray-200 rounded w-16"></div>
          <div class="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
    
    <!-- 列表项骨架屏 -->
    <div v-else-if="type === 'list'" class="flex items-center space-x-4 p-4">
      <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div class="flex-1">
        <div class="h-4 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
    
    <!-- 文本骨架屏 -->
    <div v-else-if="type === 'text'" class="space-y-2">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    
    <!-- 自定义骨架屏 -->
    <div v-else class="space-y-3">
      <div 
        v-for="i in count" 
        :key="i"
        :class="customClass"
        class="bg-gray-200 rounded"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'card' | 'list' | 'text' | 'custom'
  count?: number
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  type: 'card',
  count: 3,
  customClass: 'h-4'
})
</script>
