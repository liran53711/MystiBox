<template>
  <div class="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border flex flex-col z-50">
    <!-- 聊天窗口头部 -->
    <div class="flex items-center justify-between p-4 border-b" style="background: var(--color-primary); border-radius: 8px 8px 0 0;">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: var(--color-accent);">
          <span class="text-white font-bold text-sm">{{ friend.username[0].toUpperCase() }}</span>
        </div>
        <div>
          <h4 class="font-semibold text-white">{{ friend.username }}</h4>
          <p class="text-xs text-white opacity-80">
            <span :class="friend.isOnline ? 'text-green-300' : 'text-gray-300'">
              {{ friend.isOnline ? '在线' : '离线' }}
            </span>
          </p>
        </div>
      </div>
      <button @click="$emit('close')" class="text-white hover:text-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 消息列表 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
      <div v-if="messages.length === 0" class="text-center py-8">
        <div class="text-4xl mb-2">💬</div>
        <p class="text-sm" style="color: var(--color-text-secondary);">开始聊天吧！</p>
      </div>

      <div 
        v-for="message in messages" 
        :key="message.id"
        class="flex"
        :class="message.isOwn ? 'justify-end' : 'justify-start'"
      >
        <div 
          class="max-w-xs px-3 py-2 rounded-lg text-sm"
          :class="message.isOwn 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'"
        >
          <!-- 特殊消息类型：宠物/盲盒赠送 -->
          <div v-if="message.type === 'gift'" class="space-y-2">
            <div class="flex items-center space-x-2">
              <span class="text-lg">🎁</span>
              <span class="font-medium">{{ message.isOwn ? '你' : friend.username }}赠送了一个礼物</span>
            </div>
            
            <div v-if="message.gift.type === 'pet'" class="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded">
              <img :src="message.gift.item.pet.babyImageUrl" :alt="message.gift.item.pet.name" class="w-8 h-8 rounded object-cover" />
              <div>
                <p class="font-medium">{{ message.gift.item.nickname || message.gift.item.pet.name }}</p>
                <span class="rarity-badge text-xs" :class="getRarityBadgeClass(message.gift.item.pet.rarity)">
                  {{ message.gift.item.pet.rarity }}
                </span>
              </div>
            </div>
            
            <div v-else-if="message.gift.type === 'box'" class="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded">
              <img :src="message.gift.item.image" :alt="message.gift.item.name" class="w-8 h-8 rounded object-cover" />
              <div>
                <p class="font-medium">{{ message.gift.item.name }}</p>
                <p class="text-xs opacity-80">{{ message.gift.item.price }} 积分</p>
              </div>
            </div>
            
            <p v-if="message.gift.message" class="text-sm italic">
              "{{ message.gift.message }}"
            </p>
            
            <button
              v-if="!message.isOwn && !message.gift.claimed"
              @click="claimGift(message)"
              class="w-full py-2 px-3 bg-white bg-opacity-30 rounded text-sm font-medium hover:bg-opacity-40 transition-colors flex items-center justify-center space-x-1"
            >
              <span>✨</span>
              <span>点击领取</span>
            </button>
            <div v-else-if="message.gift.claimed" class="text-xs opacity-80 text-center py-1">
              <span class="inline-flex items-center space-x-1">
                <span>✅</span>
                <span>已领取</span>
              </span>
            </div>
            <div v-else-if="message.isOwn" class="text-xs opacity-80 text-center py-1">
              <span class="inline-flex items-center space-x-1">
                <span>🎁</span>
                <span>礼物已发送</span>
              </span>
            </div>
          </div>

          <!-- 普通文本消息 -->
          <div v-else>
            <p>{{ message.content }}</p>
          </div>

          <p class="text-xs opacity-70 mt-1">
            {{ formatTime(message.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="p-4 border-t">
      <!-- 快捷操作按钮 -->
      <div class="flex space-x-2 mb-3">
        <button
          @click="showGiftModal = true"
          class="flex items-center space-x-1 px-3 py-1 bg-pink-100 text-pink-600 rounded-lg text-xs hover:bg-pink-200 transition-colors"
        >
          <span>🎁</span>
          <span>赠送</span>
        </button>
        <button
          @click="showEmojiPicker = !showEmojiPicker"
          class="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg text-xs hover:bg-yellow-200 transition-colors"
        >
          <span>😊</span>
          <span>表情</span>
        </button>
      </div>

      <!-- 表情选择器 -->
      <div v-if="showEmojiPicker" class="mb-3 p-2 bg-gray-50 rounded-lg">
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in commonEmojis"
            :key="emoji"
            @click="addEmoji(emoji)"
            class="text-lg hover:bg-gray-200 rounded p-1 transition-colors"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <div class="flex space-x-2">
        <input
          v-model="newMessage"
          @keypress.enter="sendMessage"
          type="text"
          placeholder="输入消息..."
          class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </div>

    <!-- 赠送礼物模态框 -->
    <div v-if="showGiftModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">赠送给 {{ friend.username }}</h3>
          <button @click="closeGiftModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- 礼物类型选择 -->
          <div class="flex space-x-4">
            <button
              @click="giftType = 'pet'"
              class="flex-1 py-2 px-4 rounded-lg border transition-colors"
              :class="giftType === 'pet'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'"
            >
              🐾 宠物
            </button>
            <button
              @click="giftType = 'box'"
              class="flex-1 py-2 px-4 rounded-lg border transition-colors"
              :class="giftType === 'box'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'"
            >
              📦 盲盒
            </button>
          </div>

          <!-- 宠物选择 -->
          <div v-if="giftType === 'pet'" class="space-y-2 max-h-48 overflow-y-auto">
            <div
              v-for="pet in availablePets"
              :key="pet.id"
              @click="selectedGiftItem = pet"
              class="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors"
              :class="selectedGiftItem?.id === pet.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'"
            >
              <div class="w-12 h-12 rounded-lg overflow-hidden">
                <img :src="pet.pet.babyImageUrl" :alt="pet.pet.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <h4 class="font-medium">{{ pet.nickname || pet.pet.name }}</h4>
                <div class="flex items-center space-x-2">
                  <span class="rarity-badge text-xs" :class="getRarityBadgeClass(pet.pet.rarity)">
                    {{ pet.pet.rarity }}
                  </span>
                  <span class="text-xs text-gray-500">{{ pet.status === 'ADULT' ? '成体' : '幼体' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 盲盒选择 -->
          <div v-else class="space-y-2 max-h-48 overflow-y-auto">
            <div
              v-for="series in availableSeries"
              :key="series.id"
              @click="selectedGiftItem = series"
              class="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors"
              :class="selectedGiftItem?.id === series.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'"
            >
              <div class="flex items-center space-x-3">
                <img :src="series.image" :alt="series.name" class="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h4 class="font-medium">{{ series.name }}</h4>
                  <p class="text-sm text-gray-600">{{ series.price }} 积分</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 赠送留言 -->
          <textarea
            v-model="giftMessage"
            placeholder="写点什么给你的朋友..."
            class="w-full p-3 border rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500"
            rows="3"
          ></textarea>

          <!-- 操作按钮 -->
          <div class="flex space-x-2">
            <button
              @click="sendGiftMessage"
              :disabled="!selectedGiftItem"
              class="flex-1 py-2 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              🎁 发送礼物
            </button>
            <button
              @click="closeGiftModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'

interface Props {
  friend: {
    id: string
    username: string
    isOnline: boolean
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const showGiftModal = ref(false)
const showEmojiPicker = ref(false)
const giftType = ref<'pet' | 'box'>('pet')
const selectedGiftItem = ref<any>(null)
const giftMessage = ref('')

// 常用表情
const commonEmojis = [
  '😊', '😂', '🥰', '😍', '🤔', '😅', '😭', '🥺',
  '👍', '👎', '❤️', '💕', '🎉', '🎊', '🔥', '⭐'
]

// 模拟可赠送的宠物数据
const availablePets = ref([
  {
    id: '1',
    nickname: '小可爱',
    status: 'ADULT',
    pet: {
      id: '1',
      name: '小精灵',
      rarity: 'R',
      babyImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
    }
  },
  {
    id: '2',
    nickname: null,
    status: 'BABY',
    pet: {
      id: '2',
      name: '海星宝宝',
      rarity: 'N',
      babyImageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=300&fit=crop'
    }
  }
])

// 模拟可赠送的盲盒系列
const availableSeries = ref([
  {
    id: 1,
    name: '森林精灵系列',
    price: 100,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: '海洋冒险系列',
    price: 120,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop'
  }
])

// 模拟消息数据
const messages = ref([
  {
    id: '1',
    content: '嗨！你好',
    isOwn: false,
    type: 'text',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    content: '你好！最近怎么样？',
    isOwn: true,
    type: 'text',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    type: 'gift',
    isOwn: false,
    gift: {
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
      message: '送给你一只可爱的小精灵！',
      claimed: false
    },
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
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
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}小时前`
    } else {
      return date.toLocaleDateString()
    }
  }
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const message = {
    id: Date.now().toString(),
    content: newMessage.value.trim(),
    isOwn: true,
    type: 'text',
    createdAt: new Date().toISOString()
  }

  messages.value.push(message)
  newMessage.value = ''

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  // 模拟对方回复
  setTimeout(() => {
    const replies = [
      '哈哈，有趣！',
      '我也这么想',
      '真的吗？',
      '太棒了！',
      '😊'
    ]
    
    const reply = {
      id: (Date.now() + 1).toString(),
      content: replies[Math.floor(Math.random() * replies.length)],
      isOwn: false,
      type: 'text',
      createdAt: new Date().toISOString()
    }

    messages.value.push(reply)
    
    nextTick(() => {
      scrollToBottom()
    })
  }, 1000 + Math.random() * 2000)
}

const claimGift = (message: any) => {
  message.gift.claimed = true

  // 这里应该调用API领取礼物
  console.log('领取礼物:', message.gift)

  // 添加系统消息
  const systemMessage = {
    id: Date.now().toString(),
    content: '礼物已领取到你的收藏中！',
    isOwn: true,
    type: 'text',
    createdAt: new Date().toISOString()
  }

  messages.value.push(systemMessage)

  nextTick(() => {
    scrollToBottom()
  })
}

const addEmoji = (emoji: string) => {
  newMessage.value += emoji
  showEmojiPicker.value = false
}

const closeGiftModal = () => {
  showGiftModal.value = false
  giftType.value = 'pet'
  selectedGiftItem.value = null
  giftMessage.value = ''
}

const sendGiftMessage = () => {
  if (!selectedGiftItem.value) return

  // 创建礼物消息
  const giftMessage = {
    id: Date.now().toString(),
    type: 'gift',
    isOwn: true,
    gift: {
      type: giftType.value,
      item: selectedGiftItem.value,
      message: giftMessage.value || undefined,
      claimed: false
    },
    createdAt: new Date().toISOString()
  }

  messages.value.push(giftMessage)

  // 这里应该调用API发送礼物
  console.log('发送礼物:', {
    to: props.friend.username,
    type: giftType.value,
    item: selectedGiftItem.value,
    message: giftMessage.value
  })

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  // 关闭模态框
  closeGiftModal()

  // 模拟对方收到礼物的确认消息
  setTimeout(() => {
    const confirmMessage = {
      id: (Date.now() + 1).toString(),
      content: `收到了你的${giftType.value === 'pet' ? '宠物' : '盲盒'}！谢谢！🎁`,
      isOwn: false,
      type: 'text',
      createdAt: new Date().toISOString()
    }

    messages.value.push(confirmMessage)

    nextTick(() => {
      scrollToBottom()
    })
  }, 2000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动到底部
watch(() => messages.value.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// 组件挂载时滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
