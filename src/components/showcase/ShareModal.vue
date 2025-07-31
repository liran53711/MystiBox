<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">分享到广场</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 宠物预览 -->
      <div class="mb-4 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-3">
          <div class="w-16 h-16 rounded-lg overflow-hidden">
            <img 
              :src="userPet.status === 'ADULT' ? userPet.pet.adultImageUrl : userPet.pet.babyImageUrl" 
              :alt="userPet.nickname || userPet.pet.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 class="font-semibold">{{ userPet.nickname || userPet.pet.name }}</h4>
            <div class="flex items-center space-x-2">
              <span class="rarity-badge text-xs" :class="getRarityBadgeClass(userPet.pet.rarity)">
                {{ userPet.pet.rarity }}
              </span>
              <span class="text-xs text-gray-500">{{ userPet.status === 'ADULT' ? '成体' : '幼体' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分享内容输入 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          为你的小伙伴写点什么吧...
        </label>
        <textarea
          v-model="shareContent"
          :placeholder="`我的${userPet.nickname || userPet.pet.name}已经长大啦！`"
          class="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
          maxlength="200"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">
          {{ shareContent.length }}/200
        </div>
      </div>

      <!-- 分享选项 -->
      <div class="mb-4">
        <label class="flex items-center space-x-2">
          <input 
            v-model="allowSale" 
            type="checkbox" 
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm">允许其他玩家购买</span>
        </label>
        
        <div v-if="allowSale" class="mt-2 ml-6">
          <label class="block text-sm text-gray-600 mb-1">售价（积分）</label>
          <input
            v-model.number="salePrice"
            type="number"
            min="1"
            max="10000"
            class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <!-- 按钮 -->
      <div class="flex gap-2">
        <button
          @click="handleShare"
          :disabled="isSharing"
          class="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {{ isSharing ? '分享中...' : '🌟 分享到广场' }}
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePoints } from '@/composables/usePoints'

interface Props {
  userPet: {
    id: string
    nickname?: string
    status: 'BABY' | 'ADULT'
    pet: {
      name: string
      rarity: string
      babyImageUrl: string
      adultImageUrl: string
    }
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  share: [data: {
    userPet: any
    content: string
    allowSale: boolean
    salePrice?: number
  }]
}>()

const { awardPoints } = usePoints()

// 响应式数据
const shareContent = ref('')
const allowSale = ref(false)
const salePrice = ref(500)
const isSharing = ref(false)

// 获取稀有度样式
const getRarityBadgeClass = (rarity: string) => {
  const classes = {
    'N': 'bg-gray-500 text-white',
    'R': 'bg-blue-500 text-white',
    'SR': 'bg-purple-500 text-white',
    'SSR': 'bg-yellow-500 text-white',
    'UR': 'bg-red-500 text-white'
  }
  return classes[rarity as keyof typeof classes] || classes['N']
}

// 处理分享
const handleShare = async () => {
  isSharing.value = true
  
  try {
    // 奖励分享积分
    await awardPoints('SHARE_PET')
    
    // 发送分享数据
    emit('share', {
      userPet: props.userPet,
      content: shareContent.value || `我的${props.userPet.nickname || props.userPet.pet.name}已经长大啦！`,
      allowSale: allowSale.value,
      salePrice: allowSale.value ? salePrice.value : undefined
    })
    
    // 关闭模态框
    emit('close')
  } catch (error) {
    console.error('分享失败:', error)
    alert('分享失败，请重试')
  } finally {
    isSharing.value = false
  }
}
</script>

<style scoped>
.rarity-badge {
  @apply px-2 py-1 rounded text-xs font-bold;
}
</style>
