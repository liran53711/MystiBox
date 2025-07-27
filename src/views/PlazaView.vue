<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">宠物广场</h1>
      <div class="flex gap-4">
        <!-- 搜索框 -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索宠物或用户..."
          class="px-4 py-2 border rounded-lg w-64"
        />
        <!-- 筛选器 -->
        <select v-model="filterRarity" class="px-3 py-2 border rounded-lg">
          <option value="">全部稀有度</option>
          <option value="N">普通 (N)</option>
          <option value="R">稀有 (R)</option>
          <option value="SR">史诗 (SR)</option>
          <option value="SSR">传说 (SSR)</option>
          <option value="UR">神话 (UR)</option>
        </select>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in filteredPosts"
        :key="post.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- 用户信息 -->
        <div class="p-4 border-b">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold">{{ post.author.username[0].toUpperCase() }}</span>
            </div>
            <div>
              <h3 class="font-semibold">{{ post.author.username }}</h3>
              <p class="text-sm text-gray-500">{{ formatTime(post.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- 宠物图片 -->
        <div class="aspect-square relative">
          <img
            :src="post.userPet.status === 'ADULT' ? post.userPet.pet.adultImage : post.userPet.pet.babyImage"
            :alt="post.userPet.nickname || post.userPet.pet.name"
            class="w-full h-full object-cover"
          />
          <!-- 稀有度标识 -->
          <div class="absolute top-2 right-2">
            <span :class="getRarityClass(post.userPet.pet.rarity)" class="px-2 py-1 rounded text-xs font-bold text-white">
              {{ post.userPet.pet.rarity }}
            </span>
          </div>
          <!-- 状态标识 -->
          <div class="absolute top-2 left-2">
            <span :class="post.userPet.status === 'ADULT' ? 'bg-green-500' : 'bg-blue-500'" class="px-2 py-1 rounded text-xs font-bold text-white">
              {{ post.userPet.status === 'ADULT' ? '成体' : '幼体' }}
            </span>
          </div>
        </div>

        <!-- 帖子内容 -->
        <div class="p-4">
          <h4 class="font-bold text-lg mb-2">
            {{ post.userPet.nickname || post.userPet.pet.name }}
          </h4>
          <p class="text-gray-600 text-sm mb-4">{{ post.content || post.userPet.pet.story }}</p>

          <!-- 互动按钮 -->
          <div class="flex justify-between items-center">
            <div class="flex space-x-4">
              <button
                @click="toggleLike(post)"
                :class="post.isLiked ? 'text-red-500' : 'text-gray-500'"
                class="flex items-center space-x-1 hover:text-red-500 transition-colors"
              >
                <span>{{ post.isLiked ? '❤️' : '🤍' }}</span>
                <span class="text-sm">{{ post.likesCount }}</span>
              </button>
              <button
                @click="toggleComments(post)"
                class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <span>💬</span>
                <span class="text-sm">{{ post.commentsCount }}</span>
              </button>
            </div>
          </div>

          <!-- 评论区域 -->
          <div v-if="post.showComments" class="mt-4 pt-4 border-t">
            <!-- 评论列表 -->
            <div v-if="post.comments && post.comments.length > 0" class="space-y-3 mb-4">
              <div v-for="comment in post.comments" :key="comment.id" class="flex space-x-2">
                <div class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">{{ comment.author.username[0].toUpperCase() }}</span>
                </div>
                <div class="flex-1">
                  <div class="bg-gray-100 rounded-lg px-3 py-2">
                    <p class="text-sm font-semibold">{{ comment.author.username }}</p>
                    <p class="text-sm">{{ comment.content }}</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">{{ formatTime(comment.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- 评论输入框 -->
            <div class="flex space-x-2">
              <input
                v-model="post.newComment"
                type="text"
                placeholder="写个评论..."
                class="flex-1 px-3 py-2 border rounded-lg text-sm"
                @keyup.enter="addComment(post)"
              />
              <button
                @click="addComment(post)"
                class="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredPosts.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">🏛️</div>
      <h3 class="text-xl font-semibold mb-2">暂无分享</h3>
      <p class="text-gray-600 mb-4">还没有人分享宠物，快去我的宠物页面分享你的第一只宠物吧！</p>
      <RouterLink to="/my-pets" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
        我的宠物
      </RouterLink>
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
