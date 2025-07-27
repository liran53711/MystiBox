<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- 模态框容器 -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="show"
              :class="modalClasses"
              @click.stop
            >
              <!-- 头部 -->
              <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-white/20">
                <div class="flex items-center space-x-3">
                  <slot name="header">
                    <h3 class="text-xl font-semibold text-neutral-text-primary">{{ title }}</h3>
                  </slot>
                </div>
                
                <button
                  v-if="closable"
                  @click="$emit('close')"
                  class="text-neutral-text-secondary hover:text-neutral-text-primary transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- 内容 -->
              <div class="p-6">
                <slot />
              </div>
              
              <!-- 底部 -->
              <div v-if="$slots.footer" class="flex justify-end space-x-3 p-6 border-t border-white/20">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  close: []
}>()

const modalClasses = computed(() => {
  const baseClasses = 'relative bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl'
  
  const sizeClasses = {
    sm: 'max-w-md w-full',
    md: 'max-w-lg w-full',
    lg: 'max-w-2xl w-full',
    xl: 'max-w-4xl w-full',
  }
  
  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}
</script>