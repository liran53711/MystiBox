<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        👥 好友系统
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        与朋友一起分享宠物收藏的乐趣
      </p>
    </div>

    <div v-if="!authStore.isAuthenticated" class="text-center py-16">
      <div class="text-6xl mb-4">🔒</div>
      <h3 class="text-xl font-semibold mb-2">请先登录</h3>
      <p class="text-gray-600 mb-4">登录后查看你的好友列表</p>
      <button @click="uiStore.openLoginModal" class="btn btn-primary">
        登录
      </button>
    </div>

    <div v-else>
      <!-- 功能选项卡 -->
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
          <!-- 好友列表 -->
          <div v-if="activeTab === 'friends'">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold" style="color: var(--color-text-primary);">我的好友 ({{ friends.length }})</h3>
              <button @click="showAddFriendModal = true" class="btn btn-primary">
                ➕ 添加好友
              </button>
            </div>

            <div v-if="friends.length === 0" class="text-center py-16">
              <div class="text-6xl mb-4">👥</div>
              <h3 class="text-xl font-semibold mb-2">还没有好友</h3>
              <p class="text-gray-600 mb-4">快去添加一些朋友吧！</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="friend in friends" :key="friend.id" class="card p-4">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: var(--color-accent);">
                    <span class="text-white font-bold">{{ friend.username[0].toUpperCase() }}</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold" style="color: var(--color-text-primary);">{{ friend.username }}</h4>
                    <p class="text-sm" style="color: var(--color-text-secondary);">
                      <span :class="friend.isOnline ? 'text-green-500' : 'text-gray-400'">
                        {{ friend.isOnline ? '在线' : '离线' }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button @click="openChat(friend)" class="flex-1 btn btn-primary text-sm">
                    💬 聊天
                  </button>
                  <button @click="openGiftModal(friend)" class="flex-1 btn btn-secondary text-sm">
                    🎁 赠送
                  </button>
                  <button
                    @click="removeFriend(friend)"
                    class="btn text-sm px-3"
                    style="background-color: #fee; color: #dc2626; border: 1px solid #fecaca;"
                    title="删除好友"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 好友请求 -->
          <div v-else-if="activeTab === 'requests'">
            <h3 class="text-lg font-semibold mb-6" style="color: var(--color-text-primary);">好友请求</h3>
            
            <div v-if="friendRequests.length === 0" class="text-center py-16">
              <div class="text-6xl mb-4">📬</div>
              <h3 class="text-xl font-semibold mb-2">暂无好友请求</h3>
              <p class="text-gray-600">当有人想加你为好友时，会在这里显示</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="request in friendRequests" :key="request.id" class="card p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: var(--color-accent);">
                      <span class="text-white font-bold">{{ request.sender.username[0].toUpperCase() }}</span>
                    </div>
                    <div>
                      <h4 class="font-semibold" style="color: var(--color-text-primary);">{{ request.sender.username }}</h4>
                      <p class="text-sm" style="color: var(--color-text-secondary);">{{ formatTime(request.createdAt) }}</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="acceptFriendRequest(request)" class="btn btn-primary text-sm">
                      ✅ 接受
                    </button>
                    <button @click="rejectFriendRequest(request)" class="btn btn-secondary text-sm">
                      ❌ 拒绝
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 聊天记录 -->
          <div v-else-if="activeTab === 'chats'">
            <h3 class="text-lg font-semibold mb-6" style="color: var(--color-text-primary);">最近聊天</h3>
            
            <div v-if="recentChats.length === 0" class="text-center py-16">
              <div class="text-6xl mb-4">💬</div>
              <h3 class="text-xl font-semibold mb-2">暂无聊天记录</h3>
              <p class="text-gray-600">与好友开始聊天吧！</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="chat in recentChats" 
                :key="chat.friendId" 
                @click="openChat(chat.friend)"
                class="card p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: var(--color-accent);">
                    <span class="text-white font-bold">{{ chat.friend.username[0].toUpperCase() }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <h4 class="font-semibold" style="color: var(--color-text-primary);">{{ chat.friend.username }}</h4>
                      <span class="text-xs" style="color: var(--color-text-secondary);">{{ formatTime(chat.lastMessageTime) }}</span>
                    </div>
                    <p class="text-sm truncate" style="color: var(--color-text-secondary);">{{ chat.lastMessage }}</p>
                  </div>
                  <div v-if="chat.unreadCount > 0" class="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style="background: var(--color-accent);">
                    {{ chat.unreadCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加好友模态框 -->
    <div v-if="showAddFriendModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">添加好友</h3>
        <div class="space-y-4">
          <input
            v-model="searchUsername"
            type="text"
            placeholder="输入用户名搜索..."
            class="input w-full"
            @input="searchUsers"
            @focus="loadAllUsers"
          />
          
          <div v-if="searchResults.length > 0" class="space-y-2 max-h-48 overflow-y-auto">
            <div 
              v-for="user in searchResults" 
              :key="user.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg" style="background: var(--color-accent);">
                  <span v-if="user.avatar">{{ user.avatar }}</span>
                  <span v-else class="text-white font-bold text-sm">{{ user.username[0].toUpperCase() }}</span>
                </div>
                <span class="font-medium">{{ user.username }}</span>
              </div>
              <button 
                @click="sendFriendRequest(user)" 
                :disabled="user.isFriend || user.requestSent"
                class="btn btn-primary text-sm"
              >
                {{ user.isFriend ? '已是好友' : user.requestSent ? '已发送' : '添加' }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="showAddFriendModal = false" class="flex-1 btn btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 赠送模态框 -->
    <div v-if="showGiftModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">赠送给 {{ selectedFriend?.username }}</h3>
        <div class="space-y-4">
          <div class="flex space-x-4">
            <button 
              @click="giftType = 'pet'"
              class="flex-1 btn"
              :class="giftType === 'pet' ? 'btn-primary' : 'btn-secondary'"
            >
              🐾 宠物
            </button>
            <button 
              @click="giftType = 'box'"
              class="flex-1 btn"
              :class="giftType === 'box' ? 'btn-primary' : 'btn-secondary'"
            >
              📦 盲盒
            </button>
          </div>

          <div v-if="giftType === 'pet'" class="space-y-2 max-h-48 overflow-y-auto">
            <div 
              v-for="pet in giftablePets" 
              :key="pet.id"
              @click="selectedGiftPet = pet"
              class="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer"
              :class="selectedGiftPet?.id === pet.id ? 'border-blue-500 bg-blue-50' : ''"
            >
              <div class="w-12 h-12 rounded-lg overflow-hidden">
                <img :src="pet.pet.babyImageUrl" :alt="pet.pet.name" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-medium">{{ pet.nickname || pet.pet.name }}</h4>
                <span class="rarity-badge text-xs" :class="getRarityBadgeClass(pet.pet.rarity)">
                  {{ pet.pet.rarity }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="space-y-2">
            <div 
              v-for="series in availableSeries" 
              :key="series.id"
              @click="selectedGiftSeries = series"
              class="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
              :class="selectedGiftSeries?.id === series.id ? 'border-blue-500 bg-blue-50' : ''"
            >
              <div class="flex items-center space-x-3">
                <img :src="series.coverImageUrl" :alt="series.name" class="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h4 class="font-medium">{{ series.name }}</h4>
                  <p class="text-sm text-gray-600">{{ series.drawPrice }} 积分</p>
                </div>
              </div>
            </div>
          </div>

          <textarea 
            v-model="giftMessage" 
            placeholder="写点什么给你的朋友..." 
            class="input w-full h-20 resize-none"
          ></textarea>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="sendGift" class="flex-1 btn btn-primary">🎁 赠送</button>
          <button @click="closeGiftModal" class="flex-1 btn btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <ChatWindow
      v-if="showChatWindow && chatFriend"
      :friend="chatFriend"
      @close="closeChatWindow"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import ChatWindow from '@/components/social/ChatWindow.vue'
import type { Friend, FriendRequest } from '@/api/social'
import type { SearchUserResult } from '@/api/users'
import type { UserPet, Series } from '@/types'

const authStore = useAuthStore()
const uiStore = useUiStore()

// 响应式数据
const activeTab = ref('friends')
const showAddFriendModal = ref(false)
const showGiftModal = ref(false)
const showChatWindow = ref(false)
const searchUsername = ref('')
const searchResults = ref<SearchUserResult[]>([])
const selectedFriend = ref<Friend | null>(null)
const chatFriend = ref<Friend | null>(null)
const giftType = ref<'pet' | 'box'>('pet')
const selectedGiftPet = ref<UserPet | null>(null)
const selectedGiftSeries = ref<Series | null>(null)
const giftMessage = ref('')

const tabs = [
  { id: 'friends', name: '好友列表' },
  { id: 'requests', name: '好友请求' },
  { id: 'chats', name: '聊天记录' }
]

// 响应式数据
const friends = ref<Friend[]>([])
const friendRequests = ref<FriendRequest[]>([])
const loading = ref(true)

const recentChats = ref([
  {
    friendId: '1',
    friend: { id: '1', username: 'player1', isOnline: true },
    lastMessage: '你的新宠物好可爱！',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 2
  }
])

const giftablePets = ref<UserPet[]>([
  {
    id: '1',
    userId: 'current-user',
    petId: '1',
    isAdult: false,
    nickname: '小可爱',
    createdAt: new Date().toISOString(),
    status: 'BABY' as const,
    growthValue: 50,
    maxGrowth: 100,
    pet: {
      id: '1',
      name: '小精灵',
      description: '可爱的小精灵',
      rarity: 'N' as const,
      babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      adultImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      story: '森林中的小精灵',
      seriesId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      series: {
        id: 1,
        name: '森林精灵系列',
        description: '来自神秘森林的精灵们',
        coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop',
        drawPrice: 100,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }
])

const availableSeries = ref<Series[]>([
  {
    id: 1,
    name: '森林精灵系列',
    description: '来自神秘森林的精灵们',
    coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop',
    drawPrice: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
])

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
    return `${diffInDays}天前`
  }
}

const loadAllUsers = async () => {
  if (searchResults.value.length === 0) {
    try {
      const { usersApi } = await import('@/api/users')
      const results = await usersApi.searchUsers('')
      searchResults.value = results
    } catch (error) {
      console.error('加载用户列表失败:', error)
    }
  }
}

const searchUsers = async () => {
  if (!searchUsername.value.trim()) {
    await loadAllUsers()
    return
  }

  try {
    const { usersApi } = await import('@/api/users')
    const results = await usersApi.searchUsers(searchUsername.value.trim())
    searchResults.value = results
  } catch (error) {
    console.error('搜索用户失败:', error)
    searchResults.value = []
  }
}

const sendFriendRequest = async (user: SearchUserResult) => {
  try {
    const { socialAPI } = await import('@/api/social')
    await socialAPI.sendFriendRequest(user.id)
    user.requestSent = true
    alert(`已向 ${user.username} 发送好友请求！`)
  } catch (error: any) {
    console.error('发送好友请求失败:', error)
    alert(error.response?.data?.message || '发送好友请求失败')
  }
}

const acceptFriendRequest = async (request: FriendRequest) => {
  try {
    const { socialAPI } = await import('@/api/social')
    await socialAPI.acceptFriendRequest(request.id)

    friends.value.push({
      id: request.sender.id,
      username: request.sender.username,
      isOnline: Math.random() > 0.5,
      avatar: request.sender.avatar
    })

    const index = friendRequests.value.findIndex(r => r.id === request.id)
    if (index > -1) {
      friendRequests.value.splice(index, 1)
    }

    alert(`已接受 ${request.sender.username} 的好友请求！`)
  } catch (error: any) {
    console.error('接受好友请求失败:', error)
    alert(error.response?.data?.message || '接受好友请求失败')
  }
}

const rejectFriendRequest = async (request: FriendRequest) => {
  try {
    const { socialAPI } = await import('@/api/social')
    await socialAPI.rejectFriendRequest(request.id)

    const index = friendRequests.value.findIndex(r => r.id === request.id)
    if (index > -1) {
      friendRequests.value.splice(index, 1)
    }

    alert(`已拒绝 ${request.sender.username} 的好友请求`)
  } catch (error: any) {
    console.error('拒绝好友请求失败:', error)
    alert(error.response?.data?.message || '拒绝好友请求失败')
  }
}

const removeFriend = (friend: Friend) => {
  if (confirm(`确定要删除好友 ${friend.username} 吗？`)) {
    const index = friends.value.findIndex(f => f.id === friend.id)
    if (index > -1) {
      friends.value.splice(index, 1)
    }
    console.log('删除好友:', friend.username)
  }
}

const openChat = (friend: Friend) => {
  chatFriend.value = friend
  showChatWindow.value = true
}

const closeChatWindow = () => {
  showChatWindow.value = false
  chatFriend.value = null
}

const openGiftModal = (friend: Friend) => {
  selectedFriend.value = friend
  showGiftModal.value = true
}

const closeGiftModal = () => {
  showGiftModal.value = false
  selectedFriend.value = null
  selectedGiftPet.value = null
  selectedGiftSeries.value = null
  giftMessage.value = ''
  giftType.value = 'pet'
}

const sendGift = () => {
  if (giftType.value === 'pet' && !selectedGiftPet.value) {
    alert('请选择要赠送的宠物')
    return
  }
  
  if (giftType.value === 'box' && !selectedGiftSeries.value) {
    alert('请选择要赠送的盲盒系列')
    return
  }
  
  console.log('赠送礼物:', {
    to: selectedFriend.value?.username,
    type: giftType.value,
    item: giftType.value === 'pet' ? selectedGiftPet.value : selectedGiftSeries.value,
    message: giftMessage.value
  })
  
  alert('礼物已发送！')
  closeGiftModal()
}

// 数据加载函数
const loadFriends = async () => {
  try {
    const { socialAPI } = await import('@/api/social')
    friends.value = await socialAPI.getFriends()
  } catch (error) {
    console.error('加载好友列表失败:', error)
  }
}

const loadFriendRequests = async () => {
  try {
    const { socialAPI } = await import('@/api/social')
    friendRequests.value = await socialAPI.getFriendRequests()
  } catch (error) {
    console.error('加载好友请求失败:', error)
  }
}

// 生命周期
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    return
  }

  try {
    loading.value = true
    await Promise.all([
      loadFriends(),
      loadFriendRequests()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>
