<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold text-red-500">测试页面</h1>
    <p class="text-lg mt-4">如果你能看到这个页面，说明Vue正在工作</p>
    <div class="mt-4 p-4 bg-blue-100 rounded">
      <p>当前时间: {{ currentTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentTime = ref('')

onMounted(() => {
  currentTime.value = new Date().toLocaleString()
})
</script>
