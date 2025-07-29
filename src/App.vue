<template>
  <div id="app">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 主要内容区域 -->
    <main>
      <RouterView />
    </main>

    <!-- 抽卡动画覆盖层 -->
    <DrawAnimation
      :show="uiStore.isGachaPlaying"
      :result="uiStore.gachaResult"
      @close="uiStore.endGacha"
      @continue="handleContinueDraw"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import Navbar from '@/components/layout/Navbar.vue'
import DrawAnimation from '@/components/draw/DrawAnimation.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

// 初始化应用
onMounted(() => {
  // 尝试从本地存储恢复用户登录状态
  authStore.checkAuth()
  console.log('MystiBox app initialized')
})

const handleContinueDraw = () => {
  // 继续抽取的逻辑
  uiStore.endGacha()
}
</script>