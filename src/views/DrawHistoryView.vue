<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-text-primary mb-2">抽取历史</h1>
        <p class="text-neutral-text-secondary">查看您的所有抽取记录</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-neutral-text-secondary">加载中...</p>
      </div>

      <!-- 历史记录列表 -->
      <div v-else-if="drawHistory.length > 0" class="space-y-4">
        <div
          v-for="event in drawHistory"
          :key="event.id"
          class="glass-card p-6 hover:bg-white/5 transition-colors"
        >
          <!-- 事件头部信息 -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-lg">🎲</span>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-text-primary">
                  {{ event.series?.name || '未知系列' }}
                </h3>
                <p class="text-sm text-neutral-text-secondary">
                  {{ formatDate(event.createdAt) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-neutral-text-secondary">消耗积分</p>
              <p class="font-semibold text-accent-500">{{ event.cost }}</p>
            </div>
          </div>

          <!-- 抽取结果 -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div
              v-for="result in event.results || []"
              :key="result.id"
              class="relative group"
            >
              <!-- 宠物卡片 -->
              <div class="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <img
                  v-if="result.pet?.babyImageUrl"
                  :src="result.pet.babyImageUrl"
                  :alt="result.pet.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-4xl">🐾</span>
                </div>
                
                <!-- 稀有度角标 -->
                <div
                  :class="[
                    'absolute top-1 right-1 px-2 py-1 rounded text-xs font-bold text-white',
                    getRarityColor(result.pet?.rarity)
                  ]"
                >
                  {{ result.pet?.rarity || 'N' }}
                </div>
              </div>

              <!-- 宠物信息 -->
              <div class="mt-2 text-center">
                <p class="text-sm font-medium text-neutral-text-primary truncate">
                  {{ result.pet?.name || '未知宠物' }}
                </p>
              </div>

              <!-- 悬浮提示 -->
              <div class="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div class="text-center text-white p-2">
                  <p class="font-semibold">{{ result.pet?.name }}</p>
                  <p class="text-xs opacity-80">{{ result.pet?.rarity }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">📜</div>
        <h3 class="text-xl font-semibold mb-2">暂无抽取记录</h3>
        <p class="text-neutral-text-secondary mb-4">您还没有进行过任何抽取，快去商店试试手气吧！</p>
        <RouterLink to="/store" class="btn btn-primary">
          前往商店
        </RouterLink>
      </div>

      <!-- 分页 -->
      <div v-if="pagination.pages > 1" class="mt-8 flex justify-center">
        <div class="flex space-x-2">
          <button
            v-for="page in pagination.pages"
            :key="page"
            @click="loadHistory(page)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              page === pagination.page
                ? 'bg-primary-500 text-white'
                : 'bg-white/10 text-neutral-text-secondary hover:bg-white/20'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { drawApi } from '@/api/draw'
import type { DrawEvent } from '@/types'

// 响应式数据
const loading = ref(true)
const drawHistory = ref<DrawEvent[]>([])
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 1
})

// 加载抽取历史
const loadHistory = async (page = 1) => {
  try {
    loading.value = true
    const response = await drawApi.getDrawHistory(page, pagination.value.limit)
    
    drawHistory.value = response.data || []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    console.error('加载抽取历史失败:', error)
    drawHistory.value = []
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取稀有度颜色
const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case 'UR': return 'bg-gradient-to-r from-purple-500 to-pink-500'
    case 'SSR': return 'bg-gradient-to-r from-yellow-400 to-orange-500'
    case 'SR': return 'bg-gradient-to-r from-purple-400 to-blue-500'
    case 'R': return 'bg-gradient-to-r from-blue-400 to-cyan-500'
    case 'N': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

// 生命周期
onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-primary {
  @apply bg-primary-500 text-white hover:bg-primary-600;
}
</style>
