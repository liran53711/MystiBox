<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl focus:ring-accent-500',
    secondary: 'bg-white/20 hover:bg-white/30 text-neutral-text-primary border border-white/30 backdrop-blur-md focus:ring-white/50',
    danger: 'bg-error hover:bg-red-600 text-white shadow-lg hover:shadow-xl focus:ring-error',
    ghost: 'text-neutral-text-primary hover:bg-white/10 focus:ring-white/50',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const widthClass = props.fullWidth ? 'w-full' : ''
  const disabledClass = (props.disabled || props.loading) ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : ''
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    widthClass,
    disabledClass,
  ].join(' ')
})
</script>