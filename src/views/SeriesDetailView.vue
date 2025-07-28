<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--color-accent);"></div>
      <p class="mt-2" style="color: var(--color-text-secondary);">加载中...</p>
    </div>

    <!-- 系列详情 -->
    <div v-else-if="series" class="max-w-6xl mx-auto">
      <!-- 返回按钮 -->
      <button
        @click="$router.push('/store')"
        class="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>返回商店</span>
      </button>

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
          <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-3xl); color: var(--color-text-primary); font-weight: 900;">
            {{ series.name }}
          </h1>
          <p class="mb-6" style="color: var(--color-text-secondary); font-family: var(--font-body); font-size: var(--text-lg);">
            {{ series.description }}
          </p>

          <div class="card p-6 mb-6">
            <h3 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-xl); color: var(--color-text-primary); font-weight: 700;">
              💎 系列信息
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span style="color: var(--color-text-secondary);">抽取价格:</span>
                <span class="font-bold" style="color: var(--color-accent); font-size: var(--text-lg);">
                  💰 {{ series.price }} 积分
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span style="color: var(--color-text-secondary);">宠物数量:</span>
                <span class="font-semibold">🐾 {{ series.pets?.length || 0 }} 只</span>
              </div>
              <div class="flex justify-between items-center">
                <span style="color: var(--color-text-secondary);">稀有度范围:</span>
                <span class="font-semibold">⭐ N ~ UR</span>
              </div>
            </div>
          </div>

          <!-- 用户积分显示 -->
          <div v-if="authStore.isAuthenticated" class="card p-4 mb-6" style="background: linear-gradient(135deg, var(--color-secondary), #FFE4B5);">
            <div class="flex items-center justify-between">
              <span style="color: var(--color-text-primary); font-weight: 600;">💰 我的积分:</span>
              <span class="font-bold text-2xl" style="color: var(--color-accent);">{{ authStore.user?.points || 0 }}</span>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mb-4 p-4 rounded-lg" style="background-color: #FEF2F2; border: 1px solid #FECACA;">
            <p class="text-sm" style="color: var(--color-error);">{{ errorMessage }}</p>
          </div>

          <!-- 抽取按钮 -->
          <button
            v-if="authStore.isAuthenticated"
            :disabled="!canDraw || isDrawing"
            class="w-full btn btn-primary mb-4"
            style="font-size: var(--text-xl); padding: 20px; font-weight: 700;"
            @click="handleDraw"
          >
            <span v-if="isDrawing" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              抽取中...
            </span>
            <span v-else class="flex items-center justify-center">
              🎲 抽取盲盒 ({{ series.price }} 积分)
            </span>
          </button>

          <!-- 未登录提示 -->
          <div v-else class="text-center card p-6">
            <p class="text-neutral-text-secondary mb-4">请先登录才能抽取盲盒</p>
            <BaseButton variant="primary" @click="uiStore.openLoginModal">
              立即登录
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- 抽卡动画 -->
      <DrawAnimation
        :show="!!drawResult"
        :result="drawResult"
        @close="handleAnimationClose"
        @continue="handleContinueDraw"
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
import DrawAnimation from '@/components/draw/DrawAnimation.vue'
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

// 处理动画关闭
const handleAnimationClose = () => {
  drawResult.value = null
}

// 处理继续抽取
const handleContinueDraw = () => {
  drawResult.value = null
  // 可以在这里添加继续抽取的逻辑
}

onMounted(() => {
  loadSeries()
})
</script>
