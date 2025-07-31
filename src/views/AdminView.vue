<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="mb-4" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        🛠️ 管理后台
      </h1>
      <p style="font-size: var(--text-lg); color: var(--color-text-secondary); font-family: var(--font-body);">
        系统管理和数据统计
      </p>
    </div>

    <!-- 权限检查 -->
    <div v-if="!isAdmin" class="text-center py-16">
      <div class="text-6xl mb-4">🚫</div>
      <h3 class="text-xl font-semibold mb-2">访问被拒绝</h3>
      <p class="text-gray-600 mb-4">您没有管理员权限</p>

      <!-- 管理员初始化按钮 -->
      <div class="mb-4">
        <button
          @click="initializeAdmin"
          :disabled="initializingAdmin"
          class="btn btn-secondary mr-4"
        >
          {{ initializingAdmin ? '初始化中...' : '初始化为管理员' }}
        </button>
        <p class="text-sm text-gray-500 mt-2">
          如果系统还没有管理员，您可以将自己设置为管理员
        </p>
      </div>

      <RouterLink to="/" class="btn btn-primary">
        返回首页
      </RouterLink>
    </div>

    <div v-else>
      <!-- 统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">👥</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ stats.totalUsers }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">总用户数</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">📦</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ stats.totalSeries }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">系列数量</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">🐾</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ stats.totalPets }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">宠物种类</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl mb-2">🎲</div>
          <div class="text-2xl font-bold" style="color: var(--color-accent);">{{ stats.totalDraws }}</div>
          <div class="text-sm" style="color: var(--color-text-secondary);">总抽取次数</div>
        </div>
      </div>

      <!-- 管理选项卡 -->
      <div class="card mb-8">
        <div class="border-b" style="border-color: var(--color-border);">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- 系列管理 -->
          <div v-if="activeTab === 'series'">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold" style="color: var(--color-text-primary);">系列管理</h3>
              <button @click="showCreateSeriesModal = true" class="btn btn-primary">
                ➕ 新增系列
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b" style="border-color: var(--color-border);">
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">ID</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">名称</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">价格</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">状态</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">宠物数</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="series in seriesList" :key="series.id" class="border-b" style="border-color: var(--color-border);">
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ series.id }}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center space-x-3">
                        <img :src="series.image" :alt="series.name" class="w-10 h-10 rounded object-cover" />
                        <span style="color: var(--color-text-primary);">{{ series.name }}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ series.price }} 积分</td>
                    <td class="py-3 px-4">
                      <span 
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="series.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ series.isActive ? '启用' : '禁用' }}
                      </span>
                    </td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ series.petCount || 0 }}</td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <button @click="editSeries(series)" class="text-blue-600 hover:text-blue-800 text-sm">编辑</button>
                        <button 
                          @click="toggleSeriesStatus(series)" 
                          class="text-sm"
                          :class="series.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                        >
                          {{ series.isActive ? '禁用' : '启用' }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 用户管理 -->
          <div v-else-if="activeTab === 'users'">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold" style="color: var(--color-text-primary);">用户管理</h3>
              <div class="flex space-x-2">
                <input 
                  v-model="userSearchQuery" 
                  type="text" 
                  placeholder="搜索用户..." 
                  class="input"
                />
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b" style="border-color: var(--color-border);">
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">ID</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">用户名</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">积分</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">角色</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">注册时间</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id" class="border-b" style="border-color: var(--color-border);">
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ user.id }}</td>
                    <td class="py-3 px-4" style="color: var(--color-text-primary);">{{ user.username }}</td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ user.points }}</td>
                    <td class="py-3 px-4">
                      <span 
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
                      >
                        {{ user.role === 'ADMIN' ? '管理员' : '用户' }}
                      </span>
                    </td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ formatDate(user.createdAt) }}</td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <button @click="adjustUserPoints(user)" class="text-blue-600 hover:text-blue-800 text-sm">调整积分</button>
                        <button
                          v-if="user.role !== 'ADMIN'"
                          @click="toggleUserRole(user)"
                          class="text-green-600 hover:text-green-800 text-sm"
                        >
                          设为管理员
                        </button>
                        <button
                          v-if="user.role !== 'ADMIN'"
                          @click="freezeUser(user)"
                          class="text-red-600 hover:text-red-800 text-sm"
                        >
                          {{ user.status === 'FROZEN' ? '解冻' : '冻结' }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 广场管理 -->
          <div v-else-if="activeTab === 'plaza'">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold" style="color: var(--color-text-primary);">广场管理</h3>
              <div class="flex space-x-2">
                <input
                  v-model="postSearchQuery"
                  type="text"
                  placeholder="搜索帖子..."
                  class="input"
                />
                <select v-model="postFilterStatus" class="input">
                  <option value="">全部状态</option>
                  <option value="ACTIVE">正常</option>
                  <option value="HIDDEN">已隐藏</option>
                  <option value="DELETED">已删除</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b" style="border-color: var(--color-border);">
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">ID</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">作者</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">内容</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">点赞数</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">评论数</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">发布时间</th>
                    <th class="text-left py-3 px-4 font-medium" style="color: var(--color-text-primary);">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in filteredPosts" :key="post.id" class="border-b" style="border-color: var(--color-border);">
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ post.id.slice(0, 8) }}...</td>
                    <td class="py-3 px-4" style="color: var(--color-text-primary);">{{ post.author.username }}</td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">
                      <div class="max-w-xs truncate">{{ post.content }}</div>
                    </td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ post._count.likes }}</td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ post._count.comments }}</td>
                    <td class="py-3 px-4" style="color: var(--color-text-secondary);">{{ formatDate(post.createdAt) }}</td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <button @click="viewPost(post)" class="text-blue-600 hover:text-blue-800 text-sm">查看</button>
                        <button @click="deletePost(post)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredPosts.length === 0" class="text-center py-8">
              <div class="text-4xl mb-2">📝</div>
              <p style="color: var(--color-text-secondary);">暂无帖子数据</p>
            </div>
          </div>

          <!-- 数据统计 -->
          <div v-else-if="activeTab === 'analytics'">
            <h3 class="text-lg font-semibold mb-6" style="color: var(--color-text-primary);">数据统计</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 抽取统计 -->
              <div class="card p-6">
                <h4 class="font-semibold mb-4" style="color: var(--color-text-primary);">抽取统计</h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span style="color: var(--color-text-secondary);">今日抽取:</span>
                    <span class="font-semibold">{{ analytics.todayDraws }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span style="color: var(--color-text-secondary);">本周抽取:</span>
                    <span class="font-semibold">{{ analytics.weekDraws }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span style="color: var(--color-text-secondary);">本月抽取:</span>
                    <span class="font-semibold">{{ analytics.monthDraws }}</span>
                  </div>
                </div>
              </div>

              <!-- 稀有度分布 -->
              <div class="card p-6">
                <h4 class="font-semibold mb-4" style="color: var(--color-text-primary);">稀有度分布</h4>
                <div class="space-y-3">
                  <div v-for="(count, rarity) in analytics.rarityDistribution" :key="rarity" class="flex justify-between">
                    <span style="color: var(--color-text-secondary);">{{ getRarityText(rarity) }}:</span>
                    <span class="font-semibold">{{ count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建系列模态框 -->
    <div v-if="showCreateSeriesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">创建新系列</h3>
        <div class="space-y-4">
          <input v-model="newSeries.name" type="text" placeholder="系列名称" class="input w-full" />
          <textarea v-model="newSeries.description" placeholder="系列描述" class="input w-full h-24 resize-none"></textarea>
          <input v-model="newSeries.price" type="number" placeholder="抽取价格" class="input w-full" />
          <input v-model="newSeries.image" type="url" placeholder="系列图片URL" class="input w-full" />
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="createSeries" class="flex-1 btn btn-primary">创建</button>
          <button @click="showCreateSeriesModal = false" class="flex-1 btn btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { adminApi } from '@/api/admin'

const authStore = useAuthStore()

// 权限检查
const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

// 响应式数据
const activeTab = ref('series')
const showCreateSeriesModal = ref(false)
const userSearchQuery = ref('')
const postSearchQuery = ref('')
const postFilterStatus = ref('')

const tabs = [
  { id: 'series', name: '系列管理' },
  { id: 'users', name: '用户管理' },
  { id: 'plaza', name: '广场管理' },
  { id: 'analytics', name: '数据统计' }
]

// 响应式数据
const stats = ref({
  totalUsers: 0,
  totalSeries: 0,
  totalPets: 0,
  totalDraws: 0
})

const seriesList = ref<any[]>([])
const usersList = ref<any[]>([])
const postsList = ref<any[]>([])
const loading = ref(true)
const initializingAdmin = ref(false)

const analytics = ref({
  todayDraws: 45,
  weekDraws: 312,
  monthDraws: 1456,
  rarityDistribution: {
    'N': 720,
    'R': 432,
    'SR': 216,
    'SSR': 72,
    'UR': 16
  }
})

const newSeries = ref({
  name: '',
  description: '',
  price: 100,
  image: ''
})

// 计算属性
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return usersList.value
  
  const query = userSearchQuery.value.toLowerCase()
  return usersList.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.id.toLowerCase().includes(query)
  )
})

// 方法
const getRarityText = (rarity: string) => {
  const texts = { 'N': '普通', 'R': '稀有', 'SR': '史诗', 'SSR': '传说', 'UR': '神话' }
  return texts[rarity as keyof typeof texts] || '普通'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const editSeries = (series: any) => {
  console.log('编辑系列:', series)
  // 实现编辑逻辑
}

const toggleSeriesStatus = (series: any) => {
  series.isActive = !series.isActive
  console.log('切换系列状态:', series)
}

const createSeries = () => {
  if (!newSeries.value.name || !newSeries.value.description) {
    alert('请填写完整信息')
    return
  }
  
  const series = {
    id: Date.now(),
    ...newSeries.value,
    isActive: true,
    petCount: 0
  }
  
  seriesList.value.push(series)
  showCreateSeriesModal.value = false
  
  // 重置表单
  newSeries.value = { name: '', description: '', price: 100, image: '' }
}

const adjustUserPoints = (user: any) => {
  const points = prompt('请输入要调整的积分数量（正数为增加，负数为减少）:')
  if (points !== null) {
    const adjustment = parseInt(points)
    if (!isNaN(adjustment)) {
      user.points += adjustment
      console.log('调整用户积分:', user, adjustment)
    }
  }
}

const toggleUserRole = (user: any) => {
  if (confirm(`确定要将 ${user.username} 设为管理员吗？`)) {
    user.role = 'ADMIN'
    console.log('设置用户为管理员:', user)
  }
}

const freezeUser = (user: any) => {
  const action = user.status === 'FROZEN' ? '解冻' : '冻结'
  if (confirm(`确定要${action}用户 ${user.username} 吗？`)) {
    user.status = user.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN'
    console.log(`${action}用户:`, user)
  }
}

const filteredPosts = computed(() => {
  let filtered = postsList.value

  if (postSearchQuery.value) {
    const query = postSearchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.content.toLowerCase().includes(query) ||
      post.author.username.toLowerCase().includes(query)
    )
  }

  if (postFilterStatus.value) {
    filtered = filtered.filter(post => post.status === postFilterStatus.value)
  }

  return filtered
})

const viewPost = (post: any) => {
  console.log('查看帖子:', post)
  // 可以打开帖子详情模态框
}

const deletePost = async (post: any) => {
  if (confirm(`确定要删除这条帖子吗？\n内容: ${post.content.slice(0, 50)}...`)) {
    try {
      const { showcaseApi } = await import('@/api/showcase')
      await showcaseApi.deletePost(post.id)

      // 从列表中移除
      const index = postsList.value.findIndex(p => p.id === post.id)
      if (index > -1) {
        postsList.value.splice(index, 1)
      }

      alert('帖子已删除')
    } catch (error: any) {
      console.error('删除帖子失败:', error)
      alert(error.response?.data?.message || '删除失败')
    }
  }
}

// 管理员初始化
const initializeAdmin = async () => {
  try {
    initializingAdmin.value = true
    await adminApi.initAdmin()

    // 重新获取用户信息以更新角色
    await authStore.refreshUser()

    alert('管理员权限设置成功！页面将刷新。')
    window.location.reload()
  } catch (error: any) {
    console.error('初始化管理员失败:', error)
    alert(error.response?.data?.message || '初始化失败')
  } finally {
    initializingAdmin.value = false
  }
}

// 数据加载函数
const loadStats = async () => {
  try {
    const headers = {
      'Authorization': `Bearer ${authStore.accessToken}`,
      'Content-Type': 'application/json'
    }

    // 加载统计数据
    const [usersCount, seriesCount, petsCount, drawsCount] = await Promise.all([
      fetch('/api/admin/stats/users', { headers }).then(r => r.json()),
      fetch('/api/admin/stats/series', { headers }).then(r => r.json()),
      fetch('/api/admin/stats/pets', { headers }).then(r => r.json()),
      fetch('/api/admin/stats/draws', { headers }).then(r => r.json())
    ])

    stats.value = {
      totalUsers: usersCount.count || 0,
      totalSeries: seriesCount.count || 0,
      totalPets: petsCount.count || 0,
      totalDraws: drawsCount.count || 0
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadSeries = async () => {
  try {
    const { seriesApi } = await import('@/api/series')
    const series = await seriesApi.getAll()
    seriesList.value = series.map((s: any) => ({
      ...s,
      image: s.coverImageUrl,
      price: s.drawPrice,
      petCount: s._count?.pets || 0
    }))
  } catch (error) {
    console.error('加载系列数据失败:', error)
  }
}

const loadUsers = async () => {
  try {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) {
      usersList.value = await response.json()
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

const loadPosts = async () => {
  try {
    const { showcaseApi } = await import('@/api/showcase')
    const response = await showcaseApi.getPosts({ limit: 100 })
    postsList.value = response.posts
  } catch (error) {
    console.error('加载帖子数据失败:', error)
  }
}

// 生命周期
onMounted(async () => {
  if (!isAdmin.value) return

  try {
    loading.value = true
    await Promise.all([
      loadStats(),
      loadSeries(),
      loadUsers(),
      loadPosts()
    ])
  } catch (error) {
    console.error('加载管理员数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>
