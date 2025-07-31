<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        📦 盲盒驿站
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        管理你的盲盒收藏，开封、交易、赠送
      </p>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">📦</div>
        <div class="text-2xl font-bold" style="color: var(--color-text-primary);">{{ totalBoxes }}</div>
        <div class="text-sm" style="color: var(--color-text-secondary);">未开封盲盒</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">✨</div>
        <div class="text-2xl font-bold" style="color: var(--color-text-primary);">{{ totalValue }}</div>
        <div class="text-sm" style="color: var(--color-text-secondary);">总价值</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">🎁</div>
        <div class="text-2xl font-bold" style="color: var(--color-text-primary);">{{ pendingGifts }}</div>
        <div class="text-sm" style="color: var(--color-text-secondary);">待处理礼物</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">🔄</div>
        <div class="text-2xl font-bold" style="color: var(--color-text-primary);">{{ tradingBoxes }}</div>
        <div class="text-sm" style="color: var(--color-text-secondary);">交易中</div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="card p-4 mb-8">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索盲盒系列..."
            class="input w-full"
          />
        </div>
        <div class="flex gap-4">
          <select v-model="filterSeries" class="input">
            <option value="">全部系列</option>
            <option v-for="series in availableSeries" :key="series.id" :value="series.id">
              {{ series.name }}
            </option>
          </select>
          <select v-model="sortBy" class="input">
            <option value="newest">最新获得</option>
            <option value="oldest">最早获得</option>
            <option value="value">按价值排序</option>
            <option value="series">按系列排序</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--color-accent);"></div>
      <p class="mt-2" style="color: var(--color-text-secondary);">加载中...</p>
    </div>

    <!-- 盲盒列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="box in filteredBoxes"
        :key="box.id"
        class="card overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- 盲盒图片 -->
        <div class="aspect-square relative">
          <img
            :src="box.series.coverImageUrl"
            :alt="box.series.name"
            class="w-full h-full object-cover"
          />
          <!-- 系列标识 -->
          <div class="absolute top-2 left-2">
            <span class="bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
              {{ box.series.name }}
            </span>
          </div>
          <!-- 价值标识 -->
          <div class="absolute top-2 right-2">
            <span class="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              💰{{ box.series.drawPrice }}
            </span>
          </div>
          <!-- 状态标识 -->
          <div v-if="box.status !== 'UNOPENED'" class="absolute bottom-2 left-2">
            <span 
              :class="getStatusClass(box.status)"
              class="px-2 py-1 rounded text-xs font-bold text-white"
            >
              {{ getStatusText(box.status) }}
            </span>
          </div>
        </div>

        <!-- 盲盒信息 -->
        <div class="p-4">
          <h3 class="font-semibold mb-2" style="color: var(--color-text-primary);">
            {{ box.series.name }}
          </h3>
          <p class="text-sm mb-3" style="color: var(--color-text-secondary);">
            获得时间：{{ formatTime(box.obtainedAt) }}
          </p>

          <!-- 操作按钮 -->
          <div class="flex gap-2">
            <button
              v-if="box.status === 'UNOPENED'"
              @click="openBox(box)"
              class="flex-1 btn btn-primary text-sm"
            >
              🎁 开封
            </button>
            <button
              v-if="box.status === 'UNOPENED'"
              @click="showTradeModal(box)"
              class="btn btn-secondary text-sm"
            >
              🔄 交易
            </button>
            <button
              v-if="box.status === 'UNOPENED'"
              @click="showGiftModal(box)"
              class="btn btn-secondary text-sm"
            >
              🎁 赠送
            </button>
            <button
              v-if="box.status === 'TRADING'"
              @click="cancelTrade(box)"
              class="btn btn-warning text-sm"
            >
              ❌ 撤销交易
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredBoxes.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">📦</div>
      <h3 class="text-xl font-semibold mb-2">暂无盲盒</h3>
      <p class="text-gray-600 mb-4">去商店购买一些盲盒吧！</p>
      <RouterLink to="/store" class="btn btn-primary">
        前往商店
      </RouterLink>
    </div>

    <!-- 开封动画模态框 -->
    <div v-if="showOpenModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="text-6xl mb-4">🎁</div>
          <h3 class="text-xl font-semibold mb-4">开封盲盒</h3>
          <p class="text-gray-600 mb-6">确定要开封这个 {{ selectedBox?.series.name }} 盲盒吗？</p>
          <div class="flex gap-4">
            <button @click="confirmOpenBox" class="flex-1 btn btn-primary">
              确认开封
            </button>
            <button @click="showOpenModal = false" class="flex-1 btn btn-secondary">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易模态框 -->
    <div v-if="showTradeModalFlag" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="text-6xl mb-4">🔄</div>
          <h3 class="text-xl font-semibold mb-4">交易盲盒</h3>
          <p class="text-gray-600 mb-6">将 {{ selectedBox?.series.name }} 盲盒发起交易</p>
          <div class="mb-4">
            <input
              v-model="tradeMessage"
              type="text"
              placeholder="交易说明（可选）"
              class="input w-full"
            />
          </div>
          <div class="flex gap-4">
            <button @click="confirmTrade" class="flex-1 btn btn-primary">
              发起交易
            </button>
            <button @click="showTradeModalFlag = false" class="flex-1 btn btn-secondary">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 赠送模态框 -->
    <div v-if="showGiftModalFlag" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="text-6xl mb-4">🎁</div>
          <h3 class="text-xl font-semibold mb-4">赠送盲盒</h3>
          <p class="text-gray-600 mb-6">将 {{ selectedBox?.series.name }} 盲盒赠送给好友</p>
          <div class="mb-4">
            <select v-model="selectedFriend" class="input w-full">
              <option value="">选择好友</option>
              <option v-for="friend in friends" :key="friend.id" :value="friend.id">
                {{ friend.username }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <input
              v-model="giftMessage"
              type="text"
              placeholder="赠送留言（可选）"
              class="input w-full"
            />
          </div>
          <div class="flex gap-4">
            <button @click="confirmGift" class="flex-1 btn btn-primary" :disabled="!selectedFriend">
              确认赠送
            </button>
            <button @click="showGiftModalFlag = false" class="flex-1 btn btn-secondary">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { boxesApi, type UserBox, type BoxStats } from '@/api/boxes'
import { socialAPI } from '@/api/social'

const authStore = useAuthStore()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const filterSeries = ref('')
const sortBy = ref('newest')
const showOpenModal = ref(false)
const showTradeModalFlag = ref(false)
const showGiftModalFlag = ref(false)
const selectedBox = ref<any>(null)
const tradeMessage = ref('')
const giftMessage = ref('')
const selectedFriend = ref('')

// 响应式数据
const boxes = ref<UserBox[]>([])
const stats = ref<BoxStats>({
  totalBoxes: 0,
  openedBoxes: 0,
  tradingBoxes: 0,
  giftedBoxes: 0,
  totalValue: 0
})
const friends = ref<any[]>([])
const loading = ref(true)

// 计算属性
const availableSeries = computed(() => {
  const seriesMap = new Map()
  boxes.value.forEach(box => {
    if (!seriesMap.has(box.series.id)) {
      seriesMap.set(box.series.id, box.series)
    }
  })
  return Array.from(seriesMap.values())
})

const filteredBoxes = computed(() => {
  let filtered = boxes.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(box =>
      box.series.name.toLowerCase().includes(query)
    )
  }

  // 系列筛选
  if (filterSeries.value) {
    filtered = filtered.filter(box => box.series.id.toString() === filterSeries.value)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime()
      case 'oldest':
        return new Date(a.obtainedAt).getTime() - new Date(b.obtainedAt).getTime()
      case 'value':
        return b.series.drawPrice - a.series.drawPrice
      case 'series':
        return a.series.name.localeCompare(b.series.name)
      default:
        return 0
    }
  })

  return filtered
})

const totalBoxes = computed(() => stats.value.totalBoxes)
const totalValue = computed(() => stats.value.totalValue)
const pendingGifts = computed(() => 0) // TODO: 实现礼物系统
const tradingBoxes = computed(() => stats.value.tradingBoxes)

// 方法
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'TRADING':
      return 'bg-blue-500'
    case 'GIFTED':
      return 'bg-green-500'
    case 'OPENED':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'TRADING':
      return '交易中'
    case 'GIFTED':
      return '已赠送'
    case 'OPENED':
      return '已开封'
    default:
      return '未知'
  }
}

const openBox = (box: any) => {
  selectedBox.value = box
  showOpenModal.value = true
}

const confirmOpenBox = async () => {
  if (!selectedBox.value) return

  try {
    const result = await boxesApi.openBox(selectedBox.value.id)

    alert(result.message)

    // 更新盲盒状态
    selectedBox.value.status = 'OPENED'
    showOpenModal.value = false
    selectedBox.value = null

    // 重新加载数据
    await loadBoxes()
    await loadStats()

    // 跳转到我的宠物页面
    router.push('/my-pets')
  } catch (error: any) {
    console.error('开封失败:', error)
    alert(error.response?.data?.message || '开封失败，请稍后重试')
  }
}

const showTradeModal = (box: any) => {
  selectedBox.value = box
  showTradeModalFlag.value = true
}

const confirmTrade = async () => {
  if (!selectedBox.value) return

  try {
    // TODO: 调用交易API
    console.log('发起交易:', selectedBox.value.id, tradeMessage.value)

    // 更新状态
    selectedBox.value.status = 'TRADING'
    showTradeModalFlag.value = false
    selectedBox.value = null
    tradeMessage.value = ''

    // 重新加载数据
    await loadBoxes()
    await loadStats()

    alert('交易请求已发布到广场！')
  } catch (error) {
    console.error('发起交易失败:', error)
    alert('发起交易失败，请稍后重试')
  }
}

const cancelTrade = async (box: any) => {
  if (!confirm('确定要撤销这个交易吗？')) return

  try {
    // TODO: 调用撤销交易API
    console.log('撤销交易:', box.id)

    // 更新状态
    box.status = 'UNOPENED'

    // 重新加载数据
    await loadBoxes()
    await loadStats()

    alert('交易已撤销！')
  } catch (error: any) {
    console.error('撤销交易失败:', error)
    alert(error.response?.data?.message || '撤销交易失败，请稍后重试')
  }
}

const showGiftModal = (box: any) => {
  selectedBox.value = box
  showGiftModalFlag.value = true
}

const confirmGift = async () => {
  if (!selectedBox.value || !selectedFriend.value) return

  try {
    const result = await boxesApi.giftBox(
      selectedBox.value.id,
      selectedFriend.value,
      giftMessage.value
    )

    alert(result.message)

    // 重新加载数据
    await loadBoxes()
    await loadStats()

    showGiftModalFlag.value = false
    selectedBox.value = null
    selectedFriend.value = ''
    giftMessage.value = ''
  } catch (error: any) {
    console.error('赠送失败:', error)
    alert(error.response?.data?.message || '赠送失败，请稍后重试')
  }
}

// 数据加载函数
const loadBoxes = async () => {
  try {
    boxes.value = await boxesApi.getMyBoxes()
  } catch (error) {
    console.error('加载盲盒列表失败:', error)
  }
}

const loadStats = async () => {
  try {
    stats.value = await boxesApi.getStats()
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

const loadFriends = async () => {
  try {
    const { socialAPI } = await import('@/api/social')
    friends.value = await socialAPI.getFriends()
  } catch (error) {
    console.error('加载好友列表失败:', error)
  }
}

// 生命周期
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    loading.value = true
    await Promise.all([
      loadBoxes(),
      loadStats(),
      loadFriends()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-card);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-secondary);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background: var(--color-secondary-dark);
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.input {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
</style>
