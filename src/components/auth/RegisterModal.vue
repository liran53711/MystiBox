<template>
  <BaseModal :isOpen="uiStore.showRegisterModal" @close="uiStore.closeRegisterModal">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">注册</h2>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <BaseInput
          v-model="form.username"
          label="用户名"
          placeholder="请输入用户名"
          required
        />
        <BaseInput
          v-model="form.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
        <BaseInput
          v-model="form.confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          required
        />

        <div class="flex space-x-4 pt-4">
          <BaseButton
            type="button"
            variant="secondary"
            @click="uiStore.closeRegisterModal"
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
            注册
          </BaseButton>
        </div>
      </form>

      <p class="mt-4 text-sm text-gray-600">
        已有账号？
        <button @click="switchToLogin" class="text-blue-600 hover:underline">
          立即登录
        </button>
      </p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

const form = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  if (!form.value.username || !form.value.password || !form.value.confirmPassword) {
    errorMessage.value = '请填写所有字段'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '密码不一致'
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = '密码长度至少6位'
    return
  }

  try {
    await authStore.register(form.value.username, form.value.password)
    uiStore.closeRegisterModal()
    // 清空表单
    form.value = {
      username: '',
      password: '',
      confirmPassword: ''
    }
  } catch (error: any) {
    errorMessage.value = error.message || '注册失败，请重试'
  }
}

const switchToLogin = () => {
  uiStore.closeRegisterModal()
  uiStore.openLoginModal()
}
</script>
