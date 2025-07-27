<template>
  <BaseModal :isOpen="uiStore.showLoginModal" @close="uiStore.closeLoginModal">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">登录</h2>

      <!-- 演示账号提示 -->
      <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-left">
        <p class="text-sm text-blue-700">
          <strong>演示账号：</strong>用户名: demo，密码: demo123
        </p>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput
          v-model="username"
          label="用户名"
          placeholder="请输入用户名"
          required
        />

        <BaseInput
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />

        <div class="flex space-x-4 pt-4">
          <BaseButton
            type="button"
            variant="secondary"
            @click="uiStore.closeLoginModal"
            class="flex-1"
          >
            取消
          </BaseButton>

          <BaseButton
            type="submit"
            variant="primary"
            :loading="authStore.isLoading"
            class="flex-1"
          >
            登录
          </BaseButton>
        </div>
      </form>

      <p class="mt-4 text-sm text-gray-600">
        还没有账号？
        <button @click="switchToRegister" class="text-blue-600 hover:underline">
          立即注册
        </button>
      </p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import BaseModal from '../base/BaseModal.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  if (!username.value || !password.value) {
    errorMessage.value = '请填写用户名和密码'
    return
  }

  try {
    await authStore.login(username.value, password.value)
    uiStore.closeLoginModal()
    // 清空表单
    username.value = ''
    password.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || error.message || '登录失败，请重试'
  }
}

const switchToRegister = () => {
  uiStore.closeLoginModal()
  uiStore.openRegisterModal()
}
</script>