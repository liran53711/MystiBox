<template>
  <div id="app" class="min-h-screen" style="background-color: var(--color-bg-primary);">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <Footer />

    <!-- 登录模态框 -->
    <LoginModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import LoginModal from '@/components/auth/LoginModal.vue'

const authStore = useAuthStore()

onMounted(() => {
  // 应用启动时检查用户登录状态
  authStore.checkAuth()
})
</script>