<template>
  <Transition name="modal" appear>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white p-6 max-w-md w-full mx-4 modal-enter"
        style="border-radius: var(--radius-xxl); box-shadow: var(--shadow-modal);"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s var(--ease-default);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-enter,
.modal-leave-to .modal-enter {
  transform: scale(0.95);
}

.modal-enter-to .modal-enter,
.modal-leave-from .modal-enter {
  transform: scale(1);
}
</style>
