<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">选择头像</h3>
        <button 
          @click="$emit('close')" 
          class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
          title="关闭"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 当前头像预览 -->
      <div class="text-center mb-6">
        <div class="w-20 h-20 mx-auto mb-2 text-6xl">{{ selectedAvatar }}</div>
        <p class="text-sm text-gray-600">当前选择的头像</p>
      </div>

      <!-- 头像分类 -->
      <div class="mb-4">
        <div class="flex space-x-2 mb-3">
          <button
            v-for="category in avatarCategories"
            :key="category.name"
            @click="activeCategory = category.name"
            class="px-3 py-1 rounded-lg text-sm transition-colors"
            :class="activeCategory === category.name
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- 头像网格 -->
      <div class="grid grid-cols-6 gap-2 mb-6">
        <button
          v-for="avatar in currentAvatars"
          :key="avatar"
          @click="selectedAvatar = avatar"
          class="w-12 h-12 text-2xl rounded-lg border-2 transition-all duration-200 hover:scale-110"
          :class="selectedAvatar === avatar
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'"
        >
          {{ avatar }}
        </button>
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-2">
        <button
          @click="handleConfirm"
          class="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          确认选择
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
import { ref, computed } from 'vue'

interface Props {
  currentAvatar?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  select: [avatar: string]
}>()

// 响应式数据
const selectedAvatar = ref(props.currentAvatar || '😊')
const activeCategory = ref('faces')

// 头像分类
const avatarCategories = [
  {
    name: 'faces',
    label: '表情',
    avatars: [
      '😊', '😄', '😁', '😆', '😅', '🤣',
      '😂', '🙂', '🙃', '😉', '😇', '🥰',
      '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '🤪', '😝', '🤑',
      '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
      '😐', '😑', '😶', '😏', '😒', '🙄'
    ]
  },
  {
    name: 'animals',
    label: '动物',
    avatars: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊',
      '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
      '🐷', '🐸', '🐵', '🐔', '🐧', '🐦',
      '🐤', '🐣', '🐥', '🦆', '🦅', '🦉',
      '🦇', '🐺', '🐗', '🐴', '🦄', '🐝',
      '🐛', '🦋', '🐌', '🐞', '🐜', '🦗'
    ]
  },
  {
    name: 'nature',
    label: '自然',
    avatars: [
      '🌸', '🌺', '🌻', '🌷', '🌹', '🥀',
      '🌾', '🌿', '🍀', '🍃', '🌱', '🌲',
      '🌳', '🌴', '🌵', '🌶️', '🍄', '🌰',
      '🌙', '⭐', '🌟', '✨', '⚡', '🔥',
      '💧', '🌈', '☀️', '⛅', '☁️', '❄️',
      '⛄', '🌊', '💎', '🌍', '🌎', '🌏'
    ]
  },
  {
    name: 'food',
    label: '食物',
    avatars: [
      '🍎', '🍊', '🍋', '🍌', '🍉', '🍇',
      '🍓', '🍈', '🍒', '🍑', '🥭', '🍍',
      '🥥', '🥝', '🍅', '🍆', '🥑', '🥦',
      '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠',
      '🥐', '🍞', '🥖', '🥨', '🧀', '🥚',
      '🍳', '🥞', '🧇', '🥓', '🍗', '🍖'
    ]
  },
  {
    name: 'objects',
    label: '物品',
    avatars: [
      '⚽', '🏀', '🏈', '⚾', '🎾', '🏐',
      '🏓', '🏸', '🥅', '🎯', '🎮', '🕹️',
      '🎲', '🧩', '🎭', '🎨', '🎬', '🎤',
      '🎧', '🎼', '🎹', '🥁', '🎷', '🎺',
      '🎸', '🎻', '🎪', '🎨', '🖌️', '🖍️',
      '📚', '📖', '📝', '✏️', '🖊️', '🖋️'
    ]
  }
]

// 计算属性
const currentAvatars = computed(() => {
  const category = avatarCategories.find(cat => cat.name === activeCategory.value)
  return category?.avatars || []
})

// 方法
const handleConfirm = () => {
  emit('select', selectedAvatar.value)
  emit('close')
}
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
