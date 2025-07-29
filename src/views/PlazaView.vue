<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        🏛️ 宠物广场
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        分享你的宠物，发现更多惊喜
      </p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card p-4 mb-8">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索宠物或用户..."
            class="input w-full"
          />
        </div>
        <div class="flex gap-4">
          <select v-model="filterRarity" class="input">
            <option value="">全部稀有度</option>
            <option value="N">普通 (N)</option>
            <option value="R">稀有 (R)</option>
            <option value="SR">史诗 (SR)</option>
            <option value="SSR">传说 (SSR)</option>
            <option value="UR">神话 (UR)</option>
          </select>
          <select v-model="sortBy" class="input">
            <option value="newest">最新发布</option>
            <option value="popular">最受欢迎</option>
            <option value="rarity">按稀有度</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in sortedAndFilteredPosts"
        :key="post.id"
        class="card overflow-hidden"
      >
        <!-- 用户信息 -->
        <div class="p-4 border-b" style="border-color: var(--color-border);">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: var(--color-accent);">
              <span class="text-white font-semibold">{{ post.author.username[0].toUpperCase() }}</span>
            </div>
            <div>
              <h3 class="font-semibold" style="color: var(--color-text-primary);">{{ post.author.username }}</h3>
              <p class="text-sm" style="color: var(--color-text-secondary);">{{ formatTime(post.createdAt) }}</p>
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
            <span class="rarity-badge" :class="getRarityBadgeClass(post.userPet.pet.rarity)">
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
    <div v-if="sortedAndFilteredPosts.length === 0" class="text-center py-16">
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

// 响应式数据
const posts = ref([])
const searchQuery = ref('')
const filterRarity = ref('')
const sortBy = ref('newest')

// 模拟数据
const mockPosts = [
  {
    id: '1',
    content: '今天抽到了我的第一只森林精灵，太开心了！',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
    author: {
      id: '1',
      username: '宠物爱好者'
    },
    userPet: {
      id: '1',
      nickname: '小绿',
      status: 'BABY',
      pet: {
        id: '1',
        name: '小精灵',
        rarity: 'N',
        story: '来自森林的小精灵',
        babyImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
        adultImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
      }
    },
    likesCount: 24,
    commentsCount: 8,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: [
      {
        id: '1',
        content: '好可爱啊！',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        author: { id: '2', username: '路人甲' }
      },
      {
        id: '2',
        content: '恭喜恭喜！',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        author: { id: '3', username: '收藏家' }
      }
    ]
  },
  {
    id: '2',
    content: '我的星星宝宝终于进化成成体了！看看这华丽的形态！',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5小时前
    author: {
      id: '2',
      username: '星空收藏家'
    },
    userPet: {
      id: '2',
      nickname: '星辰',
      status: 'ADULT',
      pet: {
        id: '3',
        name: '小星星',
        rarity: 'SR',
        story: '闪闪发光的小星星',
        babyImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop',
        adultImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop'
      }
    },
    likesCount: 56,
    commentsCount: 15,
    isLiked: true,
    showComments: false,
    newComment: '',
    comments: []
  },
  {
    id: '3',
    content: '新手第一抽就是稀有度！运气太好了！',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1天前
    author: {
      id: '3',
      username: '新手玩家'
    },
    userPet: {
      id: '3',
      nickname: null,
      status: 'BABY',
      pet: {
        id: '2',
        name: '森林守护者',
        rarity: 'R',
        story: '守护森林的精灵',
        babyImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
        adultImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
      }
    },
    likesCount: 12,
    commentsCount: 3,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: []
  }
]

// 计算属性
const sortedAndFilteredPosts = computed(() => {
  let filtered = posts.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.author.username.toLowerCase().includes(query) ||
      (post.userPet.nickname || post.userPet.pet.name).toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    )
  }

  // 稀有度筛选
  if (filterRarity.value) {
    filtered = filtered.filter(post => post.userPet.pet.rarity === filterRarity.value)
  }

  // 排序
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return b.likesCount - a.likesCount
      case 'rarity':
        const rarityOrder = { 'UR': 5, 'SSR': 4, 'SR': 3, 'R': 2, 'N': 1 }
        return (rarityOrder[b.userPet.pet.rarity] || 1) - (rarityOrder[a.userPet.pet.rarity] || 1)
      default:
        return 0
    }
  })

  return sorted
})

// 方法
const getRarityBadgeClass = (rarity: string) => {
  const classes = {
    'N': 'rarity-badge-n',
    'R': 'rarity-badge-r',
    'SR': 'rarity-badge-sr',
    'SSR': 'rarity-badge-ssr',
    'UR': 'rarity-badge-ur'
  }
  return classes[rarity as keyof typeof classes] || classes['N']
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return '刚刚'
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}天前`
  }
}

const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likesCount += post.isLiked ? 1 : -1
  // 这里应该调用API更新点赞状态
  console.log('点赞状态:', post.id, post.isLiked)
}

const toggleComments = (post: any) => {
  post.showComments = !post.showComments
}

const addComment = (post: any) => {
  if (!post.newComment.trim()) return

  const newComment = {
    id: Date.now().toString(),
    content: post.newComment.trim(),
    createdAt: new Date().toISOString(),
    author: {
      id: authStore.user?.id || 'anonymous',
      username: authStore.user?.username || '匿名用户'
    }
  }

  post.comments.push(newComment)
  post.commentsCount++
  post.newComment = ''

  // 这里应该调用API添加评论
  console.log('添加评论:', post.id, newComment)
}

// 生命周期
onMounted(() => {
  // 这里应该从API获取帖子数据
  posts.value = mockPosts
})
</script>
