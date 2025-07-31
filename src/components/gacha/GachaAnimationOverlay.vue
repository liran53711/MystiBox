<template>
  <Transition name="gacha-overlay" appear>
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex items-center justify-center"
      style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); backdrop-filter: blur(8px);"
    >
      <!-- 魔法粒子背景 -->
      <div class="magic-particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>

      <!-- 开盒动画容器 -->
      <div class="relative w-full h-full flex items-center justify-center">
        
        <!-- 阶段1: 盲盒登场 -->
        <div
          v-if="currentStep === 'falling'"
          class="gacha-box"
          :class="{ 'box-falling': isBoxFalling }"
        >
          <div class="box-3d" :class="getBoxTheme()">
            <div class="box-face box-front">
              <div class="box-decoration">
                <div class="series-emblem">{{ getSeriesEmoji() }}</div>
                <div class="box-pattern"></div>
              </div>
            </div>
            <div class="box-face box-back">
              <div class="box-decoration">
                <div class="box-pattern"></div>
              </div>
            </div>
            <div class="box-face box-left">
              <div class="box-decoration">
                <div class="box-pattern"></div>
              </div>
            </div>
            <div class="box-face box-right">
              <div class="box-decoration">
                <div class="box-pattern"></div>
              </div>
            </div>
            <div class="box-face box-top">
              <div class="box-decoration">
                <div class="ribbon"></div>
                <div class="bow"></div>
              </div>
            </div>
            <div class="box-face box-bottom"></div>
          </div>
        </div>

        <!-- 阶段2: 能量聚集 -->
        <div
          v-if="currentStep === 'glowing'"
          class="gacha-box-static"
          @click="openBox"
        >
          <div class="box-3d glowing" :class="getBoxTheme()">
            <div class="box-face box-front glowing-face">
              <div class="box-decoration">
                <div class="series-emblem glowing">{{ getSeriesEmoji() }}</div>
                <div class="box-pattern glowing"></div>
                <div class="energy-pulse"></div>
              </div>
            </div>
            <div class="box-face box-back glowing-face">
              <div class="box-decoration">
                <div class="box-pattern glowing"></div>
              </div>
            </div>
            <div class="box-face box-left glowing-face">
              <div class="box-decoration">
                <div class="box-pattern glowing"></div>
              </div>
            </div>
            <div class="box-face box-right glowing-face">
              <div class="box-decoration">
                <div class="box-pattern glowing"></div>
              </div>
            </div>
            <div class="box-face box-top glowing-face">
              <div class="box-decoration">
                <div class="ribbon glowing"></div>
                <div class="bow glowing"></div>
              </div>
            </div>
            <div class="box-face box-bottom"></div>
          </div>
          <div class="click-hint">✨ 点击开启 {{ getSeriesName() }} 神秘盲盒 ✨</div>
        </div>

        <!-- 阶段3: 开盒爆发 -->
        <div 
          v-if="currentStep === 'revealing'"
          class="reveal-container"
        >
          <!-- 光柱效果 -->
          <div 
            class="light-beam"
            :class="rarityLightClass"
          ></div>
          
          <!-- 粒子特效 (SSR/UR) -->
          <div 
            v-if="isHighRarity"
            class="particle-effects"
            :class="rarityParticleClass"
          ></div>
        </div>

        <!-- 阶段4: 宠物亮相 -->
        <div 
          v-if="currentStep === 'result'"
          class="result-container"
        >
          <!-- 宠物剪影到实体的过渡 -->
          <div class="pet-reveal">
            <img 
              :src="resultPet?.pet.babyImageUrl || ''"
              :alt="resultPet?.pet.name || ''"
              class="pet-image"
              :class="{ 'pet-appear': isPetVisible }"
            />
          </div>
          
          <!-- 结果卡片 -->
          <div class="result-card" :class="{ 'card-appear': isCardVisible }">
            <div class="rarity-badge" :class="getRarityBadgeClass(resultPet?.pet.rarity)">
              {{ resultPet?.pet.rarity }}
            </div>
            <h3 class="pet-name">{{ resultPet?.pet.name }}</h3>
            <p class="pet-story">{{ resultPet?.pet.story }}</p>
            
            <div class="action-buttons">
              <button 
                @click="drawAgain"
                class="btn btn-primary"
              >
                再抽一次
              </button>
              <button 
                @click="goToCollection"
                class="btn btn-secondary"
              >
                放入收藏
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useUiStore } from '@/store/ui'

interface Props {
  isVisible: boolean
  resultPet?: any
  rarity?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  drawAgain: []
  goToCollection: []
}>()

const uiStore = useUiStore()

// 动画状态
const currentStep = ref<'falling' | 'glowing' | 'revealing' | 'result'>('falling')
const isBoxFalling = ref(false)
const isPetVisible = ref(false)
const isCardVisible = ref(false)

// 稀有度相关
const isHighRarity = computed(() => {
  return props.rarity === 'SSR' || props.rarity === 'UR'
})

const rarityLightClass = computed(() => {
  const rarityMap = {
    'N': 'light-n',
    'R': 'light-r', 
    'SR': 'light-sr',
    'SSR': 'light-ssr',
    'UR': 'light-ur'
  }
  return rarityMap[props.rarity as keyof typeof rarityMap] || 'light-n'
})

const rarityParticleClass = computed(() => {
  const rarityMap = {
    'SSR': 'particles-ssr',
    'UR': 'particles-ur'
  }
  return rarityMap[props.rarity as keyof typeof rarityMap] || ''
})

// 获取稀有度徽章样式
const getRarityBadgeClass = (rarity: string) => {
  const classes = {
    'N': 'rarity-badge-n',
    'R': 'rarity-badge-r',
    'SR': 'rarity-badge-sr', 
    'SSR': 'rarity-badge-ssr',
    'UR': 'rarity-badge-ur'
  }
  return classes[rarity as keyof typeof classes] || classes['N']
}

// 动画序列控制
const startAnimation = async () => {
  // 阶段1: 盲盒落下 (0.3s - 1.0s)
  currentStep.value = 'falling'
  isBoxFalling.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 阶段2: 能量聚集 (1.0s - 2.5s)
  currentStep.value = 'glowing'
}

// 开盒操作
const openBox = async () => {
  // 阶段3: 开盒爆发 (2.5s - 3.5s)
  currentStep.value = 'revealing'
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 阶段4: 宠物亮相 (3.5s - 4.5s)
  currentStep.value = 'result'
  
  // 宠物出现动画
  setTimeout(() => {
    isPetVisible.value = true
  }, 200)
  
  // 卡片出现动画
  setTimeout(() => {
    isCardVisible.value = true
  }, 800)
}

// 按钮事件
const drawAgain = () => {
  emit('drawAgain')
  emit('close')
}

const goToCollection = () => {
  emit('goToCollection')
  emit('close')
}

// 生成粒子样式
const getParticleStyle = (index: number) => {
  const angle = (index * 18) % 360
  const distance = 200 + Math.random() * 300
  const x = Math.cos(angle * Math.PI / 180) * distance
  const y = Math.sin(angle * Math.PI / 180) * distance
  const delay = Math.random() * 2
  const duration = 3 + Math.random() * 2

  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

// 根据宠物系列获取盒子主题
const getBoxTheme = () => {
  if (!props.resultPet?.pet?.series?.name) return 'theme-default'

  const seriesName = props.resultPet.pet.series.name
  const themeMap: { [key: string]: string } = {
    '森林精灵系列': 'theme-forest',
    '海洋冒险系列': 'theme-ocean',
    '星空守护系列': 'theme-star',
    '樱花仙境系列': 'theme-sakura',
    '深海奇迹系列': 'theme-deep-sea',
    '魔法森林系列': 'theme-magic-forest',
    '星空幻想系列': 'theme-cosmic'
  }

  return themeMap[seriesName] || 'theme-default'
}

// 获取系列表情符号
const getSeriesEmoji = () => {
  if (!props.resultPet?.pet?.series?.name) return '🎁'

  const seriesName = props.resultPet.pet.series.name
  const emojiMap: { [key: string]: string } = {
    '森林精灵系列': '🌲',
    '海洋冒险系列': '🌊',
    '星空守护系列': '⭐',
    '樱花仙境系列': '🌸',
    '深海奇迹系列': '🐙',
    '魔法森林系列': '🦄',
    '星空幻想系列': '🌌'
  }

  return emojiMap[seriesName] || '🎁'
}

// 获取系列名称
const getSeriesName = () => {
  return props.resultPet?.pet?.series?.name || '神秘'
}

// 监听可见性变化
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    startAnimation()
  } else {
    // 重置状态
    currentStep.value = 'falling'
    isBoxFalling.value = false
    isPetVisible.value = false
    isCardVisible.value = false
  }
})
</script>

<style scoped>
/* 覆盖层动画 */
.gacha-overlay-enter-active,
.gacha-overlay-leave-active {
  transition: all 0.3s var(--ease-default);
}

.gacha-overlay-enter-from,
.gacha-overlay-leave-to {
  opacity: 0;
}

/* 魔法粒子效果 */
.magic-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
  box-shadow: 0 0 10px #FFD700;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

/* 3D盲盒样式 */
.gacha-box {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.box-3d {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.box-face {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
}

/* 默认主题 */
.theme-default .box-face {
  background: linear-gradient(135deg, #FFD700, #FFA500, #FF6347);
  border: 3px solid #FF4500;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.3);
}

/* 森林精灵系列 - 木质纹理 */
.theme-forest .box-face {
  background:
    linear-gradient(45deg, transparent 25%, rgba(139, 69, 19, 0.1) 25%, rgba(139, 69, 19, 0.1) 50%, transparent 50%, transparent 75%, rgba(139, 69, 19, 0.1) 75%),
    linear-gradient(135deg, #8B4513, #A0522D, #CD853F);
  border: 3px solid #654321;
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(139, 69, 19, 0.3);
}

/* 海洋冒险系列 - 毛玻璃质感 */
.theme-ocean .box-face {
  background:
    linear-gradient(135deg, rgba(0, 191, 255, 0.8), rgba(30, 144, 255, 0.8), rgba(0, 100, 200, 0.8));
  border: 3px solid rgba(0, 191, 255, 0.6);
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.4),
    0 0 30px rgba(0, 191, 255, 0.4);
}

/* 星空守护系列 - 金属合金质感 */
.theme-star .box-face {
  background:
    linear-gradient(135deg, #C0C0C0, #FFD700, #FFA500);
  border: 3px solid #B8860B;
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.5),
    0 0 30px rgba(255, 215, 0, 0.5);
  position: relative;
}

.theme-star .box-face::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  animation: metalShine 2s infinite;
}

/* 樱花仙境系列 - 粉色渐变 */
.theme-sakura .box-face {
  background:
    linear-gradient(135deg, #FFB6C1, #FFC0CB, #FF69B4);
  border: 3px solid #FF1493;
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.4),
    0 0 30px rgba(255, 182, 193, 0.5);
}

/* 深海奇迹系列 - 深蓝透明质感 */
.theme-deep-sea .box-face {
  background:
    linear-gradient(135deg, rgba(0, 0, 139, 0.8), rgba(25, 25, 112, 0.8), rgba(72, 61, 139, 0.8));
  border: 3px solid rgba(0, 0, 139, 0.6);
  backdrop-filter: blur(8px);
  box-shadow:
    inset 0 0 20px rgba(173, 216, 230, 0.3),
    0 0 30px rgba(0, 0, 139, 0.4);
}

/* 魔法森林系列 - 发光魔法质感 */
.theme-magic-forest .box-face {
  background:
    linear-gradient(135deg, #9370DB, #8A2BE2, #9932CC);
  border: 3px solid #8B008B;
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.3),
    0 0 30px rgba(147, 112, 219, 0.6);
  animation: magicGlow 2s ease-in-out infinite alternate;
}

/* 星空幻想系列 - 星空全息质感 */
.theme-cosmic .box-face {
  background:
    linear-gradient(135deg, #191970, #4B0082, #8A2BE2),
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
  border: 3px solid #4B0082;
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(75, 0, 130, 0.5);
  animation: cosmicShimmer 3s ease-in-out infinite;
}

.box-front { transform: translateZ(100px); }
.box-back { transform: translateZ(-100px) rotateY(180deg); }
.box-left { transform: rotateY(-90deg) translateZ(100px); }
.box-right { transform: rotateY(90deg) translateZ(100px); }
.box-top { transform: rotateX(90deg) translateZ(100px); }
.box-bottom { transform: rotateX(-90deg) translateZ(100px); }

/* 盲盒落下动画 */
.box-falling {
  animation: boxFall 1s var(--ease-default);
}

@keyframes boxFall {
  0% {
    transform: translateY(-100vh) rotateX(0deg) rotateY(0deg);
  }
  80% {
    transform: translateY(20px) rotateX(360deg) rotateY(180deg);
  }
  100% {
    transform: translateY(0) rotateX(360deg) rotateY(180deg);
  }
}

/* 盒子装饰元素 */
.box-decoration {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.series-emblem {
  font-size: 3rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.series-emblem.glowing {
  animation: emblomGlow 1s ease-in-out infinite alternate;
}

.box-pattern {
  position: absolute;
  inset: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.box-pattern.glowing {
  border-color: rgba(255, 255, 255, 0.8);
  animation: patternPulse 1.5s ease-in-out infinite;
}

.energy-pulse {
  position: absolute;
  inset: -10px;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  animation: energyPulse 1s ease-in-out infinite;
}

.ribbon {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 20px;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 10px;
  transform: translateY(-50%);
}

.ribbon.glowing {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
}

.bow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #FF6347, #FF4500);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.bow.glowing {
  box-shadow: 0 0 15px rgba(255, 99, 71, 0.8);
}

/* 发光效果 */
.glowing {
  animation: boxGlow 2s ease-in-out infinite;
}

.glowing-face {
  box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.5);
}

@keyframes boxGlow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

/* 点击提示 */
.click-hint {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  animation: pulse 2s ease-in-out infinite;
}

/* 光柱效果 */
.light-beam {
  position: absolute;
  width: 100px;
  height: 100vh;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: lightBeam 1s ease-out;
}

.light-n { background: linear-gradient(to top, transparent, var(--color-rarity-n), transparent); }
.light-r { background: linear-gradient(to top, transparent, var(--color-rarity-r), transparent); }
.light-sr { background: linear-gradient(to top, transparent, var(--color-rarity-sr), transparent); }
.light-ssr { background: linear-gradient(to top, transparent, var(--color-rarity-ssr), transparent); }
.light-ur { background: linear-gradient(to top, transparent, #ff6b6b, #4ecdc4, #45b7d1, transparent); }

@keyframes lightBeam {
  0% {
    opacity: 0;
    transform: translateX(-50%) scaleY(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scaleY(1);
  }
  100% {
    opacity: 0.8;
    transform: translateX(-50%) scaleY(1);
  }
}

/* 粒子特效 */
.particle-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particles-ssr {
  background: radial-gradient(circle, var(--color-rarity-ssr) 2px, transparent 2px);
  background-size: 50px 50px;
  animation: particleFloat 3s ease-out;
}

.particles-ur {
  background: radial-gradient(circle, #ff6b6b 2px, transparent 2px),
              radial-gradient(circle, #4ecdc4 2px, transparent 2px),
              radial-gradient(circle, #45b7d1 2px, transparent 2px);
  background-size: 30px 30px, 40px 40px, 50px 50px;
  animation: particleFloat 3s ease-out;
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

/* 宠物出现动画 */
.pet-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
  transition: all 1s var(--ease-bounce);
}

.pet-appear {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* 结果卡片 */
.result-card {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: white;
  padding: 30px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-modal);
  text-align: center;
  opacity: 0;
  transition: all 0.8s var(--ease-default);
}

.card-appear {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.rarity-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
}

.rarity-badge-n { background: var(--color-rarity-n); }
.rarity-badge-r { background: var(--color-rarity-r); }
.rarity-badge-sr { background: var(--color-rarity-sr); }
.rarity-badge-ssr { background: var(--color-rarity-ssr); }
.rarity-badge-ur { background: var(--color-rarity-ur); }

.pet-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--color-text-primary);
}

.pet-story {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 新增动画效果 */
@keyframes metalShine {
  0% { transform: translateX(-200px) skewX(-15deg); }
  100% { transform: translateX(200px) skewX(-15deg); }
}

@keyframes magicGlow {
  0% {
    box-shadow:
      inset 0 0 20px rgba(255, 255, 255, 0.3),
      0 0 30px rgba(147, 112, 219, 0.6);
  }
  100% {
    box-shadow:
      inset 0 0 40px rgba(255, 255, 255, 0.5),
      0 0 60px rgba(147, 112, 219, 1);
  }
}

@keyframes cosmicShimmer {
  0%, 100% {
    background-position: 0% 0%, 20% 20%, 80% 80%;
  }
  50% {
    background-position: 100% 100%, 60% 60%, 40% 40%;
  }
}

@keyframes emblomGlow {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    transform: scale(1);
  }
  100% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
}

@keyframes patternPulse {
  0%, 100% {
    border-color: rgba(255, 255, 255, 0.8);
    transform: scale(1);
  }
  50% {
    border-color: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }
}

@keyframes energyPulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
</style>
