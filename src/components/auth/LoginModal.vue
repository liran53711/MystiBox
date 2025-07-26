<template>
  <BaseModal v-if="uiStore.isLoginModalOpen" @close="uiStore.closeLoginModal">
    <div class="p-6">
      <h2 class="text-2xl font-bold text-neutral-text-primary mb-6">登录</h2>
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
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login(form.value.username, form.value.password)
    uiStore.closeLoginModal()
  } catch (error) {
    console.error('登录失败:', error)
  }
}
</script>
