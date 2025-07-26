<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="glass-card p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-2xl">M</span>
          </div>
          <h1 class="text-2xl font-bold text-neutral-text-primary">登录 MystiBox</h1>
          <p class="text-neutral-text-secondary mt-2">欢迎回来！</p>
        </div>
        
        <form @submit.prevent="handleLogin">
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
          </div>
          
          <div class="mt-6">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="authStore.isLoading"
              full-width
            >
              登录
            </BaseButton>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-neutral-text-secondary">
            还没有账户？
            <RouterLink to="/register" class="text-accent-500 hover:text-accent-600 font-medium">
              立即注册
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
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login(form.value.username, form.value.password)
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
  }
}
</script>
