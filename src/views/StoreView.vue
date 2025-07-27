<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-text-primary mb-8">盲盒商店</h1>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      <p class="mt-2 text-neutral-text-secondary">加载中...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="series in seriesList" :key="series.id" class="glass-card p-6">
        <div class="aspect-square rounded-lg mb-4 overflow-hidden">
          <img
            :src="series.image"
            :alt="series.name"
            class="w-full h-full object-cover"
          />
        </div>
        <h3 class="text-xl font-semibold text-neutral-text-primary mb-2">{{ series.name }}</h3>
        <p class="text-neutral-text-secondary mb-4">{{ series.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-accent-500">{{ series.price }} 积分</span>
          <BaseButton variant="primary" @click="$router.push(`/series/${series.id}`)">
            查看详情
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { seriesApi } from '@/api/series'
import BaseButton from '@/components/base/BaseButton.vue'
import type { Series } from '@/types'

const seriesList = ref<Series[]>([])
const loading = ref(true)

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
