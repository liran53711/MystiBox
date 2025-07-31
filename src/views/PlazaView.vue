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
        :data-post-id="post.id"
        class="card overflow-hidden card-stagger-in"
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
        <div class="aspect-square relative" :data-pet-id="post.id">
          <img
            :src="post.userPet.status === 'ADULT' ? post.userPet.pet.adultImageUrl : post.userPet.pet.babyImageUrl"
            :alt="post.userPet.nickname || post.userPet.pet.name"
            class="w-full h-full object-cover transition-transform duration-300"
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
                :class="[
                  'like-button flex items-center space-x-1 hover:text-red-500 transition-colors',
                  post.isLiked ? 'liked text-red-500' : 'text-gray-500'
                ]"
              >
                <span>{{ post.isLiked ? '❤️' : '🤍' }}</span>
                <span class="text-sm">{{ post._count?.likes || 0 }}</span>
              </button>
              <button
                @click="toggleComments(post)"
                class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <span>💬</span>
                <span class="text-sm">{{ post._count?.comments || 0 }}</span>
              </button>
              <button
                @click="interactWithPet(post)"
                class="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-colors"
              >
                <span>🐾</span>
                <span class="text-sm">拍拍</span>
              </button>
            </div>
            <div class="flex space-x-2">
              <button
                v-if="post.userPet.forSale"
                @click="buyPet(post)"
                class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
              >
                💰 {{ post.userPet.price }}积分
              </button>
              <button
                v-if="authStore.user?.id !== post.author.id"
                @click="openTradeModal(post)"
                class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              >
                🔄 交易
              </button>
            </div>
          </div>

          <!-- 评论区域 -->
          <div v-if="getPostUIState(post.id).showComments" class="mt-4 pt-4 border-t">
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
                v-model="getPostUIState(post.id).newComment"
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
import { useShowcaseStore } from '@/store/showcase'
import { usePoints } from '@/composables/usePoints'
import { showcaseApi, type ShowcasePost } from '@/api/showcase'

const authStore = useAuthStore()
const showcaseStore = useShowcaseStore()
const { awardPoints, spendPoints } = usePoints()

// 响应式数据
const searchQuery = ref('')
const filterRarity = ref('')
const sortBy = ref<'newest' | 'popular' | 'rarity'>('newest')
const posts = ref<ShowcasePost[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

// UI状态管理
const postUIStates = ref<Record<string, { showComments: boolean; newComment: string }>>({})

// 获取帖子UI状态
const getPostUIState = (postId: string) => {
  if (!postUIStates.value[postId]) {
    postUIStates.value[postId] = {
      showComments: false,
      newComment: ''
    }
  }
  return postUIStates.value[postId]
}

// 计算属性
const sortedAndFilteredPosts = computed(() => {
  let filtered = posts.value

  // 按稀有度筛选
  if (filterRarity.value) {
    filtered = filtered.filter(post => post.userPet.pet.rarity === filterRarity.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.userPet.pet.name.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.username.toLowerCase().includes(query)
    )
  }

  // 排序
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return (b._count?.likes || 0) - (a._count?.likes || 0)
      case 'rarity':
        const rarityOrder: Record<string, number> = { 'UR': 5, 'SSR': 4, 'SR': 3, 'R': 2, 'N': 1 }
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

const toggleLike = async (post: any) => {
  if (!authStore.isAuthenticated) {
    alert('请先登录')
    return
  }

  try {
    const result = await showcaseApi.toggleLike(post.id)

    // 更新本地状态
    post.isLiked = result.isLiked
    post._count.likes = result.likesCount

    // 如果是点赞操作，触发动画和奖励积分
    if (result.isLiked) {
      await awardPoints('LIKE_POST')

      // 触发点赞动画
      const likeButton = document.querySelector(`[data-post-id="${post.id}"] .like-button`)
      if (likeButton) {
        likeButton.classList.add('liked')
        setTimeout(() => {
          likeButton.classList.remove('liked')
          likeButton.classList.add('liked')
        }, 300)
      }
    }
  } catch (error: any) {
    console.error('点赞操作失败:', error)
    alert(error.response?.data?.message || '操作失败')
  }
}

const toggleComments = (post: any) => {
  const uiState = getPostUIState(post.id)
  uiState.showComments = !uiState.showComments
}

const addComment = async (post: any) => {
  if (!post.newComment.trim()) return

  // 使用 store 方法
  showcaseStore.addComment(
    post.id,
    post.newComment.trim(),
    {
      id: authStore.user?.id || 'anonymous',
      username: authStore.user?.username || '匿名用户'
    }
  )

  post.newComment = ''

  // 奖励评论积分
  await awardPoints('COMMENT')

  // 这里应该调用API添加评论
  console.log('添加评论:', post.id)
}

// 宠物互动功能
const interactWithPet = async (post: any) => {
  // 检查是否是自己的宠物
  if (authStore.user?.id === post.author.id) {
    alert('不能与自己的宠物互动哦！')
    return
  }

  // 奖励互动积分
  const success = await awardPoints('PET_INTERACTION')
  if (success) {
    // 添加互动动画效果
    const petElement = document.querySelector(`[data-pet-id="${post.id}"]`)
    if (petElement) {
      petElement.classList.add('pet-bounce')
      setTimeout(() => {
        petElement.classList.remove('pet-bounce')
      }, 600)
    }

    alert('你轻轻拍了拍这只可爱的宠物！获得了2积分！')
  } else {
    alert('今日互动次数已达上限！')
  }

  console.log('与宠物互动:', post.userPet.pet.name)
}

// 购买宠物功能
const buyPet = async (post: any) => {
  if (!authStore.user) {
    alert('请先登录！')
    return
  }

  if (authStore.user.id === post.author.id) {
    alert('不能购买自己的宠物！')
    return
  }

  const price = post.userPet.price || 500
  const confirmed = confirm(`确定要花费 ${price} 积分购买这只 ${post.userPet.pet.name} 吗？`)

  if (confirmed) {
    const success = await spendPoints(price, `购买宠物: ${post.userPet.pet.name}`)
    if (success) {
      alert(`购买成功！${post.userPet.pet.name} 现在是你的了！`)
      // 这里应该调用API转移宠物所有权
      console.log('购买宠物:', post.userPet)
    } else {
      alert('积分不足！')
    }
  }
}

// 打开交易模态框
const openTradeModal = (post: any) => {
  if (!authStore.user) {
    alert('请先登录！')
    return
  }

  if (authStore.user.id === post.author.id) {
    alert('不能与自己交易！')
    return
  }

  // 这里应该打开一个交易模态框
  const tradeOffer = prompt(`想要与 ${post.author.username} 交易什么？请输入你想要交换的宠物名称或积分数量：`)

  if (tradeOffer) {
    alert(`交易请求已发送给 ${post.author.username}！`)
    console.log('发起交易:', {
      from: authStore.user.username,
      to: post.author.username,
      targetPet: post.userPet.pet.name,
      offer: tradeOffer
    })
  }
}

// 数据加载函数
const loadPosts = async () => {
  try {
    loading.value = true
    const response = await showcaseApi.getPosts({
      page: currentPage.value,
      sortBy: sortBy.value,
      rarity: filterRarity.value || undefined,
      search: searchQuery.value || undefined
    })

    posts.value = response.posts
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('加载广场帖子失败:', error)
    posts.value = []
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadPosts()
})
</script>
