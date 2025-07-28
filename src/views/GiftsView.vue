<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        🎁 礼物中心
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        管理你的礼物收发记录
      </p>
    </div>

    <div v-if="!authStore.isAuthenticated" class="text-center py-16">
      <div class="text-6xl mb-4">🔒</div>
      <h3 class="text-xl font-semibold mb-2">请先登录</h3>
      <p class="text-gray-600 mb-4">登录后查看你的礼物记录</p>
      <button @click="uiStore.openLoginModal" class="btn btn-primary">
        登录
      </button>
    </div>

    <div v-else>
      <!-- 统计信息 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">📥</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ receivedGifts.length }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">收到的礼物</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">📤</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ sentGifts.length }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">发送的礼物</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">⏳</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ pendingGifts }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">待领取礼物</div>
        </div>
      </div>

      <!-- 选项卡 -->
      <div class="card mb-8">
        <div class="border-b" style="border-color: var(--color-border);">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- 收到的礼物 -->
          <div v-if="activeTab === 'received'">
            <div v-if="receivedGifts.length === 0" class="text-center py-16">
              <div class="text-6xl mb-4">📥</div>
              <h3 class="text-xl font-semibold mb-2">暂无收到的礼物</h3>
              <p class="text-gray-600">当朋友送你礼物时，会在这里显示</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="gift in receivedGifts" :key="gift.id" class="card p-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-4">
                    <!-- 礼物图片 -->
                    <div class="w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        :src="gift.type === 'pet' ? gift.item.pet.babyImageUrl : gift.item.image" 
                        :alt="gift.type === 'pet' ? gift.item.pet.name : gift.item.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <h4 class="font-semibold" style="color: var(--color-text-primary);">
                          {{ gift.type === 'pet' ? (gift.item.nickname || gift.item.pet.name) : gift.item.name }}
                        </h4>
                        <span v-if="gift.type === 'pet'" class="rarity-badge text-xs" :class="getRarityBadgeClass(gift.item.pet.rarity)">
                          {{ gift.item.pet.rarity }}
                        </span>
                        <span v-else class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          盲盒
                        </span>
                      </div>
                      
                      <p class="text-sm mb-2" style="color: var(--color-text-secondary);">
                        来自 <span class="font-medium">{{ gift.sender.username }}</span>
                      </p>
                      
                      <p v-if="gift.message" class="text-sm italic mb-2" style="color: var(--color-text-secondary);">
                        "{{ gift.message }}"
                      </p>
                      
                      <p class="text-xs" style="color: var(--color-text-secondary);">
                        {{ formatTime(gift.createdAt) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-col space-y-2">
                    <button 
                      v-if="!gift.claimed"
                      @click="claimGift(gift)"
                      class="btn btn-primary text-sm"
                    >
                      ✅ 领取
                    </button>
                    <span v-else class="text-sm text-green-600 font-medium">
                      已领取
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 发送的礼物 -->
          <div v-else-if="activeTab === 'sent'">
            <div v-if="sentGifts.length === 0" class="text-center py-16">
              <div class="text-6xl mb-4">📤</div>
              <h3 class="text-xl font-semibold mb-2">暂无发送的礼物</h3>
              <p class="text-gray-600">快去给朋友送个礼物吧！</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="gift in sentGifts" :key="gift.id" class="card p-4">
                <div class="flex items-start space-x-4">
                  <!-- 礼物图片 -->
                  <div class="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      :src="gift.type === 'pet' ? gift.item.pet.babyImageUrl : gift.item.image" 
                      :alt="gift.type === 'pet' ? gift.item.pet.name : gift.item.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h4 class="font-semibold" style="color: var(--color-text-primary);">
                        {{ gift.type === 'pet' ? (gift.item.nickname || gift.item.pet.name) : gift.item.name }}
                      </h4>
                      <span v-if="gift.type === 'pet'" class="rarity-badge text-xs" :class="getRarityBadgeClass(gift.item.pet.rarity)">
                        {{ gift.item.pet.rarity }}
                      </span>
                      <span v-else class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        盲盒
                      </span>
                    </div>
                    
                    <p class="text-sm mb-2" style="color: var(--color-text-secondary);">
                      送给 <span class="font-medium">{{ gift.recipient.username }}</span>
                    </p>
                    
                    <p v-if="gift.message" class="text-sm italic mb-2" style="color: var(--color-text-secondary);">
                      "{{ gift.message }}"
                    </p>
                    
                    <div class="flex items-center justify-between">
                      <p class="text-xs" style="color: var(--color-text-secondary);">
                        {{ formatTime(gift.createdAt) }}
                      </p>
                      <span 
                        class="text-xs px-2 py-1 rounded"
                        :class="gift.claimed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ gift.claimed ? '已领取' : '待领取' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 领取成功模态框 -->
    <div v-if="showClaimModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content p-6 max-w-md w-full mx-4 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-lg font-bold mb-4">礼物领取成功！</h3>
        <div v-if="claimedGift" class="mb-6">
          <div class="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden">
            <img 
              :src="claimedGift.type === 'pet' ? claimedGift.item.pet.babyImageUrl : claimedGift.item.image" 
              :alt="claimedGift.type === 'pet' ? claimedGift.item.pet.name : claimedGift.item.name"
              class="w-full h-full object-cover"
            />
          </div>
          <h4 class="font-semibold mb-2">
            {{ claimedGift.type === 'pet' ? (claimedGift.item.nickname || claimedGift.item.pet.name) : claimedGift.item.name }}
          </h4>
          <p class="text-sm" style="color: var(--color-text-secondary);">
            {{ claimedGift.type === 'pet' ? '已添加到你的宠物收藏' : '盲盒已添加到你的背包' }}
          </p>
        </div>
        <button @click="showClaimModal = false" class="btn btn-primary">
          太棒了！
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()

// 响应式数据
const activeTab = ref('received')
const showClaimModal = ref(false)
const claimedGift = ref(null)

const tabs = [
  { id: 'received', name: '收到的礼物' },
  { id: 'sent', name: '发送的礼物' }
]

// 模拟数据
const receivedGifts = ref([
  {
    id: '1',
    type: 'pet',
    item: {
      id: '1',
      nickname: '小可爱',
      pet: {
        id: '1',
        name: '小精灵',
        rarity: 'R',
        babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
      }
    },
    sender: { id: '2', username: 'player1' },
    message: '送给你一只可爱的小精灵！',
    claimed: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    type: 'box',
    item: {
      id: 1,
      name: '森林精灵系列',
      price: 100,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop'
    },
    sender: { id: '3', username: 'collector' },
    message: '希望你能抽到好宠物！',
    claimed: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
])

const sentGifts = ref([
  {
    id: '3',
    type: 'pet',
    item: {
      id: '2',
      nickname: '小蓝',
      pet: {
        id: '2',
        name: '海星宝宝',
        rarity: 'N',
        babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop'
      }
    },
    recipient: { id: '4', username: 'petlover' },
    message: '这只海星很可爱，送给你！',
    claimed: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
])

// 计算属性
const pendingGifts = computed(() => {
  return receivedGifts.value.filter(gift => !gift.claimed).length
})

// 方法
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

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return '刚刚'
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays}天前`
    } else {
      return date.toLocaleDateString()
    }
  }
}

const claimGift = (gift: any) => {
  gift.claimed = true
  claimedGift.value = gift
  showClaimModal.value = true
  
  // 这里应该调用API领取礼物
  console.log('领取礼物:', gift)
  
  // 如果是宠物，添加到用户收藏
  if (gift.type === 'pet') {
    // 调用API添加宠物到用户收藏
  } else if (gift.type === 'box') {
    // 调用API添加盲盒到用户背包或直接抽取
  }
}
</script>
