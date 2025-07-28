<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.8);">
    <!-- 开盒动画阶段 -->
    <div v-if="stage === 'opening'" class="text-center">
      <div class="relative">
        <!-- 盲盒 -->
        <div 
          class="w-48 h-48 mx-auto mb-8 relative transition-all duration-1000"
          :class="{ 'animate-bounce': isShaking }"
        >
          <div 
            class="w-full h-full rounded-lg shadow-2xl transition-all duration-1000"
            :style="{ 
              background: 'linear-gradient(135deg, var(--color-secondary), #FFE4B5)',
              transform: isShaking ? 'scale(1.1)' : 'scale(1)'
            }"
          >
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-6xl">🎁</span>
            </div>
            <!-- 光效 -->
            <div 
              v-if="isShaking" 
              class="absolute inset-0 rounded-lg animate-pulse"
              style="background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent);"
            ></div>
          </div>
        </div>
        
        <!-- 提示文字 -->
        <p class="text-white text-xl font-bold mb-4" style="font-family: var(--font-heading);">
          {{ openingText }}
        </p>
        
        <!-- 进度条 -->
        <div class="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 结果展示阶段 -->
    <div v-else-if="stage === 'result'" class="text-center">
      <!-- 背景光效 -->
      <div class="absolute inset-0 overflow-hidden">
        <div 
          v-for="i in 20" 
          :key="i"
          class="absolute animate-ping"
          :style="{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 2 + 's'
          }"
        >
          <div class="w-2 h-2 bg-yellow-400 rounded-full opacity-70"></div>
        </div>
      </div>

      <!-- 稀有度光环 -->
      <div class="relative mb-8">
        <div 
          class="w-64 h-64 mx-auto rounded-full flex items-center justify-center relative"
          :class="getRarityGlowClass(result?.pet?.rarity)"
        >
          <!-- 宠物图片 -->
          <div class="w-48 h-48 rounded-full overflow-hidden shadow-2xl animate-pulse">
            <img 
              :src="result?.pet?.babyImageUrl || result?.pet?.image" 
              :alt="result?.pet?.name"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- 稀有度环 -->
          <div class="absolute inset-0 rounded-full border-4 animate-spin-slow" :class="getRarityBorderClass(result?.pet?.rarity)"></div>
        </div>
      </div>

      <!-- 宠物信息 -->
      <div class="modal-content p-8 max-w-md mx-4">
        <h2 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-3xl); color: var(--color-text-primary); font-weight: 900;">
          🎉 恭喜获得
        </h2>
        
        <div class="mb-6">
          <h3 class="mb-2" style="font-family: var(--font-heading); font-size: var(--text-2xl); color: var(--color-text-primary); font-weight: 700;">
            {{ result?.pet?.name }}
          </h3>
          
          <!-- 稀有度标签 -->
          <div class="flex justify-center mb-4">
            <span 
              class="rarity-badge"
              :class="getRarityBadgeClass(result?.pet?.rarity)"
            >
              {{ getRarityText(result?.pet?.rarity) }}
            </span>
          </div>
          
          <p class="mb-4" style="color: var(--color-text-secondary); font-family: var(--font-body);">
            {{ result?.pet?.story }}
          </p>
          
          <!-- 星级显示 -->
          <div class="flex justify-center space-x-1 mb-6">
            <span 
              v-for="i in 5" 
              :key="i"
              class="text-2xl"
              :class="i <= getRarityLevel(result?.pet?.rarity) ? 'text-yellow-400' : 'text-gray-300'"
            >
              ⭐
            </span>
          </div>
        </div>

        <!-- 积分信息 -->
        <div class="mb-6 p-4 rounded-lg" style="background-color: var(--color-bg-primary);">
          <div class="flex justify-between items-center">
            <span style="color: var(--color-text-secondary);">消耗积分:</span>
            <span class="font-bold" style="color: var(--color-accent);">-{{ result?.pointsSpent }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="color: var(--color-text-secondary);">剩余积分:</span>
            <span class="font-bold" style="color: var(--color-success);">{{ result?.remainingPoints }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="space-y-3">
          <button 
            @click="handleContinue"
            class="w-full btn btn-primary"
            style="font-size: var(--text-lg);"
          >
            🎲 继续抽取
          </button>
          <button 
            @click="handleClose"
            class="w-full btn btn-secondary"
          >
            查看收藏
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  show: boolean
  result?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  continue: []
}>()

const stage = ref<'opening' | 'result'>('opening')
const progress = ref(0)
const isShaking = ref(false)
const openingText = ref('正在打开盲盒...')

const openingTexts = [
  '正在打开盲盒...',
  '感受神秘的力量...',
  '即将揭晓惊喜...',
  '准备迎接新伙伴...'
]

// 开盒动画逻辑
const startOpeningAnimation = () => {
  stage.value = 'opening'
  progress.value = 0
  isShaking.value = false
  
  // 进度条动画
  const progressInterval = setInterval(() => {
    progress.value += 2
    
    // 更换提示文字
    if (progress.value === 25) {
      openingText.value = openingTexts[1]
    } else if (progress.value === 50) {
      openingText.value = openingTexts[2]
      isShaking.value = true
    } else if (progress.value === 75) {
      openingText.value = openingTexts[3]
    }
    
    if (progress.value >= 100) {
      clearInterval(progressInterval)
      setTimeout(() => {
        stage.value = 'result'
      }, 500)
    }
  }, 50)
}

// 稀有度相关方法
const getRarityLevel = (rarity: string) => {
  const levels = { 'N': 1, 'R': 2, 'SR': 3, 'SSR': 4, 'UR': 5 }
  return levels[rarity as keyof typeof levels] || 1
}

const getRarityText = (rarity: string) => {
  const texts = { 'N': '普通', 'R': '稀有', 'SR': '史诗', 'SSR': '传说', 'UR': '神话' }
  return texts[rarity as keyof typeof texts] || '普通'
}

const getRarityBadgeClass = (rarity: string) => {
  const classes = {
    'N': 'rarity-badge-n',
    'R': 'rarity-badge-r', 
    'SR': 'rarity-badge-sr',
    'SSR': 'rarity-badge-ssr',
    'UR': 'rarity-badge-ur'
  }
  return classes[rarity as keyof typeof classes] || 'rarity-badge-n'
}

const getRarityGlowClass = (rarity: string) => {
  const classes = {
    'N': 'shadow-lg',
    'R': 'shadow-blue-500/50 shadow-2xl',
    'SR': 'shadow-purple-500/50 shadow-2xl',
    'SSR': 'shadow-yellow-500/50 shadow-2xl',
    'UR': 'shadow-red-500/50 shadow-2xl animate-pulse'
  }
  return classes[rarity as keyof typeof classes] || 'shadow-lg'
}

const getRarityBorderClass = (rarity: string) => {
  const classes = {
    'N': 'border-gray-400',
    'R': 'border-blue-400',
    'SR': 'border-purple-400', 
    'SSR': 'border-yellow-400',
    'UR': 'border-red-400'
  }
  return classes[rarity as keyof typeof classes] || 'border-gray-400'
}

const handleContinue = () => {
  emit('continue')
}

const handleClose = () => {
  emit('close')
}

// 监听show属性变化
watch(() => props.show, (newShow) => {
  if (newShow) {
    startOpeningAnimation()
  }
})
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
