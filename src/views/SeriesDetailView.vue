<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      <p class="mt-2 text-neutral-text-secondary">加载中...</p>
    </div>

    <!-- 系列详情 -->
    <div v-else-if="series" class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 系列图片 -->
        <div class="aspect-square rounded-lg overflow-hidden">
          <img
            :src="series.image"
            :alt="series.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- 系列信息 -->
        <div>
          <h1 class="text-3xl font-bold text-neutral-text-primary mb-4">{{ series.name }}</h1>
          <p class="text-neutral-text-secondary mb-6">{{ series.description }}</p>

          <div class="glass-card p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-text-primary mb-4">系列信息</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">价格:</span>
                <span class="font-semibold text-accent-500">{{ series.price }} 积分</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">宠物数量:</span>
                <span class="font-semibold">{{ series.pets?.length || 0 }} 只</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-text-secondary">稀有度:</span>
                <span class="font-semibold">普通 - 传说</span>
              </div>
            </div>
          </div>

          <!-- 用户积分显示 -->
          <div v-if="authStore.isAuthenticated" class="glass-card p-4 mb-6">
            <div class="flex items-center justify-between">
              <span class="text-neutral-text-secondary">我的积分:</span>
              <span class="font-bold text-lg text-yellow-500">{{ authStore.user?.points || 0 }}</span>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>

          <!-- 抽取按钮 -->
          <BaseButton
            v-if="authStore.isAuthenticated"
            variant="primary"
            size="lg"
            :loading="isDrawing"
            :disabled="!canDraw"
            class="w-full"
            @click="handleDraw"
          >
            {{ isDrawing ? '抽取中...' : `抽取盲盒 (${series.price} 积分)` }}
          </BaseButton>

          <!-- 未登录提示 -->
          <div v-else class="text-center">
            <p class="text-neutral-text-secondary mb-4">请先登录才能抽取盲盒</p>
            <BaseButton variant="primary" @click="uiStore.openLoginModal">
              立即登录
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- 抽取结果模态框 -->
      <DrawResultModal
        v-if="drawResult"
        :result="drawResult"
        @close="drawResult = null"
      />
    </div>

    <!-- 系列不存在 -->
    <div v-else class="text-center py-16">
      <p class="text-neutral-text-secondary">系列不存在</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import DrawResultModal from '@/components/DrawResultModal.vue'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { seriesApi } from '@/api/series'
import { drawApi } from '@/api/draw'
import type { Series, DrawResult } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUIStore()

const seriesId = computed(() => Number(route.params.id))
const series = ref<Series | null>(null)
const loading = ref(true)
const isDrawing = ref(false)
const errorMessage = ref('')
const drawResult = ref<DrawResult | null>(null)

// 检查是否可以抽取
const canDraw = computed(() => {
  if (!authStore.isAuthenticated || !series.value) return false
  return (authStore.user?.points || 0) >= series.value.price
})

// 加载系列详情
const loadSeries = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const data = await seriesApi.getById(seriesId.value)
    series.value = data
  } catch (error) {
    console.error('Failed to load series:', error)
    errorMessage.value = '加载系列信息失败'
  } finally {
    loading.value = false
  }
}

// 处理抽取
const handleDraw = async () => {
  if (!series.value || !authStore.isAuthenticated) return

  try {
    isDrawing.value = true
    errorMessage.value = ''

    const result = await drawApi.drawPet(series.value.id)
    drawResult.value = result

    // 更新用户积分
    await authStore.refreshUser()
  } catch (error: any) {
    console.error('Draw failed:', error)
    errorMessage.value = error.response?.data?.message || '抽取失败，请重试'
  } finally {
    isDrawing.value = false
  }
}

onMounted(() => {
  loadSeries()
})
</script>
