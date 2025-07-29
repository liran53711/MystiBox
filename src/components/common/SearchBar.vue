<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @input="handleInput"
        @keyup.enter="handleSearch"
      />
      
      <!-- 搜索图标 -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- 清除按钮 -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- 搜索建议 -->
    <div 
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

interface Props {
  placeholder?: string
  suggestions?: string[]
  debounceDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...',
  suggestions: () => [],
  debounceDelay: 300
})

const emit = defineEmits<{
  search: [query: string]
  input: [query: string]
  clear: []
}>()

const searchQuery = ref('')
const showSuggestions = ref(false)

// 防抖搜索
const debouncedQuery = useDebounce(searchQuery, props.debounceDelay)

watch(debouncedQuery, (newQuery) => {
  emit('search', newQuery)
})

const handleInput = () => {
  emit('input', searchQuery.value)
  showSuggestions.value = searchQuery.value.length > 0 && props.suggestions.length > 0
}

const handleSearch = () => {
  emit('search', searchQuery.value)
  showSuggestions.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  showSuggestions.value = false
  emit('clear')
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  emit('search', suggestion)
}

// 点击外部关闭建议
const handleClickOutside = () => {
  showSuggestions.value = false
}

// 监听点击外部事件
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>
