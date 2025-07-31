<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        🏠 我的宠物收藏
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        共 {{ userPets.length }} 只可爱的伙伴
      </p>
    </div>

    <div v-if="authStore.isAuthenticated">
      <!-- 筛选器 -->
      <div class="card p-4 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="flex gap-4">
            <select v-model="filterRarity" class="input">
              <option value="">全部稀有度</option>
              <option value="N">普通 (N)</option>
              <option value="R">稀有 (R)</option>
              <option value="SR">史诗 (SR)</option>
              <option value="SSR">传说 (SSR)</option>
              <option value="UR">神话 (UR)</option>
            </select>

            <select v-model="filterStatus" class="input">
              <option value="">全部状态</option>
              <option value="BABY">幼体</option>
              <option value="ADULT">成体</option>
            </select>
          </div>

          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索宠物名称..."
              class="input w-full"
            />
          </div>
        </div>
      </div>

      <!-- 宠物网格 -->
      <div v-if="filteredPets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="userPet in filteredPets"
          :key="userPet.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- 宠物图片 -->
          <div class="aspect-square relative">
            <img
              :src="userPet.status === 'ADULT' ? userPet.pet?.adultImageUrl : userPet.pet?.babyImageUrl"
              :alt="userPet.nickname || userPet.pet?.name"
              class="w-full h-full object-cover"
            />
            <!-- 稀有度标识 -->
            <div class="absolute top-2 right-2">
              <span :class="getRarityClass(userPet.pet?.rarity || 'N')" class="px-2 py-1 rounded text-xs font-bold text-white">
                {{ getRarityText(userPet.pet?.rarity || 'N') }}
              </span>
            </div>
            <!-- 状态标识 -->
            <div class="absolute top-2 left-2">
              <span :class="userPet.status === 'ADULT' ? 'bg-green-500' : 'bg-blue-500'" class="px-2 py-1 rounded text-xs font-bold text-white">
                {{ userPet.status === 'ADULT' ? '成体' : '幼体' }}
              </span>
            </div>
          </div>

          <!-- 宠物信息 -->
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">
              {{ userPet.nickname || userPet.pet?.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-3">{{ userPet.pet?.story }}</p>

            <!-- 成长进度 -->
            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span>成长进度</span>
                <span>{{ userPet.growthValue || 0 }}/{{ userPet.maxGrowth || 100 }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: ((userPet.growthValue || 0) / (userPet.maxGrowth || 100) * 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-2">
              <button
                @click="openNicknameModal(userPet)"
                class="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                {{ userPet.nickname ? '改名' : '起名' }}
              </button>
              <button
                v-if="userPet.status === 'BABY' && (userPet.growthValue || 0) >= (userPet.maxGrowth || 100)"
                @click="evolvePet(userPet)"
                class="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors"
              >
                进化
              </button>
              <button
                v-else-if="userPet.status === 'BABY'"
                @click="feedPet(userPet)"
                :disabled="!canFeedToday(userPet)"
                class="flex-1 bg-yellow-500 text-white py-2 px-3 rounded text-sm hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {{ canFeedToday(userPet) ? '喂食' : '已喂食' }}
              </button>
              <button
                @click="sharePet(userPet)"
                class="flex-1 bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 transition-colors"
              >
                分享
              </button>
              <button
                @click="openGiftModal(userPet)"
                class="flex-1 bg-pink-500 text-white py-2 px-3 rounded text-sm hover:bg-pink-600 transition-colors"
              >
                赠送
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🎁</div>
        <h3 class="text-xl font-semibold mb-2">还没有宠物</h3>
        <p class="text-gray-600 mb-4">去商店抽取你的第一只宠物吧！</p>
        <RouterLink to="/store" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          前往商店
        </RouterLink>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold mb-2">请先登录</h2>
      <p class="text-gray-600 mb-6">登录后查看你的宠物收藏</p>
      <button @click="uiStore.openLoginModal" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
        登录
      </button>
    </div>

    <!-- 昵称设置模态框 -->
    <div v-if="showNicknameModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">设置宠物昵称</h3>
        <input
          v-model="newNickname"
          type="text"
          :placeholder="selectedPet?.pet?.name"
          class="w-full px-3 py-2 border rounded-lg mb-4"
          maxlength="20"
        />
        <div class="flex gap-2">
          <button
            @click="saveNickname"
            class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            保存
          </button>
          <button
            @click="closeNicknameModal"
            class="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 分享模态框 -->
  <ShareModal
    v-if="showShareModal && petToShare"
    :user-pet="petToShare"
    @close="closeShareModal"
    @share="handleShare"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { usePoints } from '@/composables/usePoints'
import { useUiStore } from '@/store/ui'
import { useShowcaseStore } from '@/store/showcase'
import ShareModal from '@/components/showcase/ShareModal.vue'
import type { UserPet } from '@/types'

const authStore = useAuthStore()
const uiStore = useUiStore()
const showcaseStore = useShowcaseStore()
const { awardPoints } = usePoints()

// 响应式数据
const userPets = ref<UserPet[]>([])
const filterRarity = ref('')
const filterStatus = ref('')
const searchQuery = ref('')
const showNicknameModal = ref(false)
const showShareModal = ref(false)
const selectedPet = ref<UserPet | null>(null)
const petToShare = ref<UserPet | null>(null)
const newNickname = ref('')



// 计算属性
const filteredPets = computed(() => {
  let filtered = userPets.value

  if (filterRarity.value) {
    filtered = filtered.filter(pet => pet.pet?.rarity === filterRarity.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(pet => pet.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(pet =>
      (pet.nickname || pet.pet?.name || '').toLowerCase().includes(query) ||
      (pet.pet?.name || '').toLowerCase().includes(query)
    )
  }

  return filtered
})

// 方法
const getRarityClass = (rarity: string) => {
  const classes = {
    'N': 'bg-gray-500',
    'R': 'bg-blue-500',
    'SR': 'bg-purple-500',
    'SSR': 'bg-yellow-500',
    'UR': 'bg-red-500'
  }
  return classes[rarity as keyof typeof classes] || classes['N']
}

const getRarityText = (rarity: string) => {
  return rarity || 'N'
}

const canFeedToday = (userPet: any) => {
  if (!userPet.lastInteractedAt) return true
  const lastFed = new Date(userPet.lastInteractedAt)
  const today = new Date()
  return lastFed.toDateString() !== today.toDateString()
}

const openNicknameModal = (userPet: any) => {
  selectedPet.value = userPet
  newNickname.value = userPet.nickname || ''
  showNicknameModal.value = true
}

const closeNicknameModal = () => {
  showNicknameModal.value = false
  selectedPet.value = null
  newNickname.value = ''
}

const saveNickname = () => {
  if (selectedPet.value) {
    selectedPet.value.nickname = newNickname.value.trim() || undefined
    // 这里应该调用API保存昵称
    console.log('保存昵称:', selectedPet.value.id, newNickname.value)
  }
  closeNicknameModal()
}

const feedPet = async (userPet: any) => {
  if (!canFeedToday(userPet)) return

  userPet.growthValue = Math.min(userPet.growthValue + 10, userPet.maxGrowth)
  userPet.lastInteractedAt = new Date().toISOString()

  // 奖励积分
  await awardPoints('FEED_PET')

  // 这里应该调用API更新宠物状态
  console.log('喂食宠物:', userPet.id)
}

const evolvePet = async (userPet: any) => {
  if (userPet.status === 'BABY' && userPet.growthValue >= userPet.maxGrowth) {
    userPet.status = 'ADULT'

    // 奖励进化积分
    await awardPoints('PET_EVOLVE')

    // 这里应该调用API更新宠物状态
    console.log('宠物进化:', userPet.id)
  }
}

const sharePet = (userPet: any) => {
  // 检查宠物是否为成体
  if (userPet.status !== 'ADULT') {
    alert('只有成体宠物才能分享到广场！')
    return
  }

  // 打开分享模态框
  petToShare.value = userPet
  showShareModal.value = true
}

const handleShare = async (shareData: any) => {
  try {
    // 添加到广场 store
    const newPost = showcaseStore.addPost({
      userPet: shareData.userPet,
      content: shareData.content,
      allowSale: shareData.allowSale,
      salePrice: shareData.salePrice,
      author: {
        id: authStore.user?.id || 'anonymous',
        username: authStore.user?.username || '匿名用户'
      }
    })

    console.log('分享宠物到广场:', newPost)

    alert('分享成功！你的宠物已经展示在广场上了！')

    // 可以跳转到广场查看
    // router.push('/plaza')
  } catch (error) {
    console.error('分享失败:', error)
    alert('分享失败，请重试')
  }
}

const closeShareModal = () => {
  showShareModal.value = false
  petToShare.value = null
}

const openGiftModal = (userPet: any) => {
  // 跳转到好友页面的赠送功能
  console.log('赠送宠物:', userPet.id)
  // 这里可以打开赠送模态框或跳转到好友页面
  window.location.href = '/friends'
}

// 获取用户宠物
const fetchUserPets = async () => {
  try {
    const { petsApi } = await import('@/api/pets')
    const pets = await petsApi.getUserPets()
    userPets.value = pets
  } catch (error) {
    console.error('获取宠物收藏失败:', error)
    userPets.value = []
  }
}

// 生命周期
onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserPets()
  }
})
</script>
