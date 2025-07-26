<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-neutral-text-primary">系列管理</h1>
      <BaseButton variant="primary" @click="showCreateModal = true">
        新增系列
      </BaseButton>
    </div>
    
    <div v-if="authStore.isAdmin">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="series in mockSeries" :key="series.id" class="glass-card p-6">
          <div class="aspect-square bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg mb-4 flex items-center justify-center">
            <span class="text-4xl">{{ series.emoji }}</span>
          </div>
          
          <h3 class="text-xl font-semibold text-neutral-text-primary mb-2">{{ series.name }}</h3>
          <p class="text-neutral-text-secondary mb-4">{{ series.description }}</p>
          
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-neutral-text-secondary">价格:</span>
              <span class="font-semibold">{{ series.price }} 积分</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-neutral-text-secondary">宠物数量:</span>
              <span class="font-semibold">{{ series.petCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-neutral-text-secondary">状态:</span>
              <span :class="series.active ? 'text-green-500' : 'text-red-500'" class="font-semibold">
                {{ series.active ? '启用' : '禁用' }}
              </span>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <BaseButton variant="outline" size="sm" @click="editSeries(series)">
              编辑
            </BaseButton>
            <BaseButton 
              :variant="series.active ? 'danger' : 'primary'" 
              size="sm" 
              @click="toggleSeriesStatus(series)"
            >
              {{ series.active ? '禁用' : '启用' }}
            </BaseButton>
          </div>
        </div>
      </div>
      
      <!-- 创建系列模态框 -->
      <BaseModal v-if="showCreateModal" @close="showCreateModal = false">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-neutral-text-primary mb-6">新增系列</h2>
          <form @submit.prevent="createSeries">
            <div class="space-y-4">
              <BaseInput v-model="newSeries.name" placeholder="系列名称" required />
              <BaseInput v-model="newSeries.description" placeholder="系列描述" required />
              <BaseInput v-model="newSeries.price" type="number" placeholder="价格(积分)" required />
              <BaseInput v-model="newSeries.emoji" placeholder="表情符号" required />
            </div>
            <div class="mt-6 flex space-x-4">
              <BaseButton type="submit" variant="primary">创建</BaseButton>
              <BaseButton variant="outline" @click="showCreateModal = false">取消</BaseButton>
            </div>
          </form>
        </div>
      </BaseModal>
    </div>
    
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold text-neutral-text-primary mb-2">权限不足</h2>
      <p class="text-neutral-text-secondary">您没有访问此页面的权限</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const authStore = useAuthStore()

const showCreateModal = ref(false)
const newSeries = ref({
  name: '',
  description: '',
  price: '',
  emoji: ''
})

const mockSeries = ref([
  {
    id: 1,
    name: '森林精灵系列',
    description: '来自神秘森林的可爱精灵们',
    price: 100,
    petCount: 12,
    emoji: '🧚',
    active: true
  },
  {
    id: 2,
    name: '海洋冒险系列',
    description: '深海中的奇妙生物',
    price: 120,
    petCount: 15,
    emoji: '🐠',
    active: true
  },
  {
    id: 3,
    name: '星空守护系列',
    description: '来自星空的神秘守护者',
    price: 150,
    petCount: 10,
    emoji: '⭐',
    active: false
  }
])

const createSeries = () => {
  // 这里应该调用API创建系列
  console.log('创建系列:', newSeries.value)
  showCreateModal.value = false
  newSeries.value = { name: '', description: '', price: '', emoji: '' }
}

const editSeries = (series: any) => {
  console.log('编辑系列:', series)
}

const toggleSeriesStatus = (series: any) => {
  series.active = !series.active
  console.log('切换系列状态:', series)
}
</script>
