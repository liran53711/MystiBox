<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-neutral-text-primary mb-8">宠物广场</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in mockPosts" :key="post.id" class="glass-card p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
            <span class="text-white font-semibold">{{ post.username[0] }}</span>
          </div>
          <div>
            <h3 class="font-semibold text-neutral-text-primary">{{ post.username }}</h3>
            <p class="text-sm text-neutral-text-secondary">{{ post.time }}</p>
          </div>
        </div>
        
        <div class="aspect-square bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg mb-4 flex items-center justify-center">
          <span class="text-4xl">{{ post.petEmoji }}</span>
        </div>
        
        <h4 class="font-semibold text-neutral-text-primary mb-2">{{ post.petName }}</h4>
        <p class="text-neutral-text-secondary text-sm mb-4">{{ post.description }}</p>
        
        <div class="flex justify-between items-center">
          <div class="flex space-x-4">
            <button class="flex items-center space-x-1 text-neutral-text-secondary hover:text-accent-500">
              <span>❤️</span>
              <span class="text-sm">{{ post.likes }}</span>
            </button>
            <button class="flex items-center space-x-1 text-neutral-text-secondary hover:text-accent-500">
              <span>💬</span>
              <span class="text-sm">{{ post.comments }}</span>
            </button>
          </div>
          <span :class="getRarityColor(post.rarity)" class="text-xs font-medium px-2 py-1 rounded">
            {{ post.rarity }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mockPosts = ref([
  {
    id: 1,
    username: '宠物爱好者',
    time: '2小时前',
    petName: '闪光小精灵',
    petEmoji: '✨',
    description: '今天抽到了闪光版本的小精灵，太幸运了！',
    likes: 24,
    comments: 8,
    rarity: '稀有'
  },
  {
    id: 2,
    username: '收藏家',
    time: '5小时前',
    petName: '深海水母',
    petEmoji: '🪼',
    description: '我的第一只传说级宠物，花了好多积分才抽到',
    likes: 56,
    comments: 15,
    rarity: '传说'
  },
  {
    id: 3,
    username: '新手玩家',
    time: '1天前',
    petName: '森林小鹿',
    petEmoji: '🦌',
    description: '刚开始玩就抽到了这么可爱的小鹿',
    likes: 12,
    comments: 3,
    rarity: '普通'
  }
])

const getRarityColor = (rarity: string) => {
  const colors = {
    '普通': 'bg-gray-100 text-gray-800',
    '稀有': 'bg-blue-100 text-blue-800',
    '史诗': 'bg-purple-100 text-purple-800',
    '传说': 'bg-yellow-100 text-yellow-800'
  }
  return colors[rarity as keyof typeof colors] || colors['普通']
}
</script>
