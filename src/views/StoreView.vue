<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        🛍️ 盲盒商店
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        今天想遇见谁呢？
      </p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card p-4 mb-8">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索系列名称或描述..."
            class="input w-full"
          />
        </div>
        <div class="flex gap-4">
          <select v-model="sortBy" class="input">
            <option value="name">按名称排序</option>
            <option value="price">按价格排序</option>
            <option value="petCount">按宠物数量排序</option>
          </select>
          <select v-model="filterPrice" class="input">
            <option value="">全部价格</option>
            <option value="low">100积分以下</option>
            <option value="medium">100-150积分</option>
            <option value="high">150积分以上</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--color-accent);"></div>
      <p class="mt-2" style="color: var(--color-text-secondary);">加载中...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="series in filteredAndSortedSeries"
        :key="series.id"
        class="card p-6 cursor-pointer"
        @click="$router.push(`/series/${series.id}`)"
      >
        <div class="aspect-square rounded-lg mb-4 overflow-hidden">
          <img
            :src="series.image"
            :alt="series.name"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <h3 class="mb-2" style="font-family: var(--font-heading); font-size: var(--text-xl); color: var(--color-text-primary); font-weight: 700;">
          {{ series.name }}
        </h3>
        <p class="mb-4" style="color: var(--color-text-secondary); font-family: var(--font-body);">
          {{ series.description }}
        </p>
        <div class="flex justify-between items-center">
          <span class="font-bold" style="font-size: var(--text-lg); color: var(--color-accent);">
            💰 {{ series.price }} 积分
          </span>
          <span class="text-sm" style="color: var(--color-text-secondary);">
            {{ series.petCount || 0 }} 只宠物
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { seriesApi } from '@/api/series'
import type { Series } from '@/types'

const seriesList = ref<Series[]>([])
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('name')
const filterPrice = ref('')

// 计算属性：筛选和排序后的系列
const filteredAndSortedSeries = computed(() => {
  let filtered = seriesList.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(series =>
      series.name.toLowerCase().includes(query) ||
      series.description?.toLowerCase().includes(query)
    )
  }

  // 价格筛选
  if (filterPrice.value) {
    filtered = filtered.filter(series => {
      switch (filterPrice.value) {
        case 'low':
          return series.price < 100
        case 'medium':
          return series.price >= 100 && series.price <= 150
        case 'high':
          return series.price > 150
        default:
          return true
      }
    })
  }

  // 排序
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return a.price - b.price
      case 'petCount':
        return (b.petCount || 0) - (a.petCount || 0)
      default:
        return 0
    }
  })

  return sorted
})

onMounted(async () => {
  try {
    seriesList.value = await seriesApi.getAll()
  } catch (error) {
    console.error('加载系列失败:', error)
  } finally {
    loading.value = false
  }
})
</script>
