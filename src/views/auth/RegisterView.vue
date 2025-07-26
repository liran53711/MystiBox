<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="glass-card p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-2xl">M</span>
          </div>
          <h1 class="text-2xl font-bold text-neutral-text-primary">注册 MystiBox</h1>
          <p class="text-neutral-text-secondary mt-2">开始你的宠物收藏之旅！</p>
        </div>
        
        <form @submit.prevent="handleRegister">
          <div class="space-y-4">
            <BaseInput
              v-model="form.username"
              placeholder="用户名"
              required
            />
            <BaseInput
              v-model="form.password"
              type="password"
              placeholder="密码"
              required
            />
            <BaseInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
              required
            />
          </div>
          
          <div class="mt-6">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="authStore.isLoading"
              full-width
            >
              注册
            </BaseButton>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-neutral-text-secondary">
            已有账户？
            <RouterLink to="/login" class="text-accent-500 hover:text-accent-600 font-medium">
              立即登录
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('密码不一致')
    return
  }
  
  try {
    await authStore.register(form.value.username, form.value.password)
    router.push('/')
  } catch (error) {
    console.error('注册失败:', error)
  }
}
</script>
