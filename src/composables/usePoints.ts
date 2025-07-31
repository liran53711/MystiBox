import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'

// 积分奖励配置
export const POINTS_REWARDS = {
  // 社交互动
  LIKE_POST: 5,           // 点赞帖子
  RECEIVE_LIKE: 10,       // 收到点赞
  COMMENT: 3,             // 发表评论
  RECEIVE_COMMENT: 5,     // 收到评论
  CHAT_MESSAGE: 1,        // 发送聊天消息（每日上限50）
  SEND_GIFT: 15,          // 发送礼物
  RECEIVE_GIFT: 20,       // 收到礼物

  // 宠物互动
  FEED_PET: 8,            // 喂养宠物（每日每只宠物1次）
  PET_EVOLVE: 50,         // 宠物进化
  SHARE_PET: 25,          // 分享宠物到广场
  PET_INTERACTION: 2,     // 与他人宠物互动（拍拍摸摸）

  // 抽卡奖励
  DRAW_RARE: 20,          // 抽到R卡
  DRAW_SR: 50,            // 抽到SR卡
  DRAW_SSR: 100,          // 抽到SSR卡
  DRAW_UR: 200,           // 抽到UR卡

  // 每日任务
  DAILY_LOGIN: 30,        // 每日登录
  DAILY_DRAW: 10,         // 每日首次抽卡
  DAILY_SHARE: 15,        // 每日首次分享
  DAILY_CHAT: 20,         // 每日与好友聊天
}

// 每日限制
export const DAILY_LIMITS = {
  CHAT_MESSAGE: 50,       // 聊天消息积分上限
  FEED_PET: 1,           // 每只宠物每日喂养次数
  PET_INTERACTION: 20,    // 每日宠物互动次数
}

export function usePoints() {
  const authStore = useAuthStore()
  
  // 今日获得的积分记录（用于限制）
  const todayPoints = ref(new Map<string, number>())
  
  // 获取用户当前积分
  const currentPoints = computed(() => authStore.user?.points || 0)
  
  // 检查是否达到每日限制
  const checkDailyLimit = (action: string, limit: number): boolean => {
    const today = new Date().toDateString()
    const key = `${today}-${action}`
    const count = todayPoints.value.get(key) || 0
    return count < limit
  }
  
  // 增加每日计数
  const incrementDailyCount = (action: string) => {
    const today = new Date().toDateString()
    const key = `${today}-${action}`
    const count = todayPoints.value.get(key) || 0
    todayPoints.value.set(key, count + 1)
  }
  
  // 奖励积分
  const awardPoints = async (action: keyof typeof POINTS_REWARDS, multiplier: number = 1) => {
    if (!authStore.user) return false
    
    const points = POINTS_REWARDS[action] * multiplier
    
    // 检查每日限制
    if (action === 'CHAT_MESSAGE' && !checkDailyLimit('CHAT_MESSAGE', DAILY_LIMITS.CHAT_MESSAGE)) {
      return false
    }
    
    if (action === 'FEED_PET' && !checkDailyLimit('FEED_PET', DAILY_LIMITS.FEED_PET)) {
      return false
    }
    
    if (action === 'PET_INTERACTION' && !checkDailyLimit('PET_INTERACTION', DAILY_LIMITS.PET_INTERACTION)) {
      return false
    }
    
    // 增加积分
    authStore.user.points += points
    
    // 增加每日计数
    if (['CHAT_MESSAGE', 'FEED_PET', 'PET_INTERACTION'].includes(action)) {
      incrementDailyCount(action)
    }
    
    // 显示积分获得提示
    showPointsNotification(points, action)
    
    // 这里应该调用API保存到后端
    console.log(`获得积分: +${points} (${action})`)
    
    return true
  }
  
  // 消费积分
  const spendPoints = async (amount: number, reason: string): Promise<boolean> => {
    if (!authStore.user || authStore.user.points < amount) {
      return false
    }
    
    authStore.user.points -= amount
    console.log(`消费积分: -${amount} (${reason})`)
    
    // 这里应该调用API保存到后端
    return true
  }
  
  // 显示积分获得通知
  const showPointsNotification = (points: number, action: string) => {
    // 创建一个简单的通知
    const notification = document.createElement('div')
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300'
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-lg">💰</span>
        <span>+${points} 积分</span>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // 动画效果
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      notification.style.opacity = '0'
    }, 2000)
    
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 2500)
  }
  
  // 根据稀有度获得抽卡奖励
  const awardDrawPoints = async (rarity: string) => {
    const rarityMap: { [key: string]: keyof typeof POINTS_REWARDS } = {
      'R': 'DRAW_RARE',
      'SR': 'DRAW_SR', 
      'SSR': 'DRAW_SSR',
      'UR': 'DRAW_UR'
    }
    
    const action = rarityMap[rarity]
    if (action) {
      await awardPoints(action)
    }
  }
  
  // 每日登录奖励
  const claimDailyLogin = async (): Promise<boolean> => {
    const today = new Date().toDateString()
    const lastLogin = localStorage.getItem('lastLoginDate')
    
    if (lastLogin !== today) {
      localStorage.setItem('lastLoginDate', today)
      await awardPoints('DAILY_LOGIN')
      return true
    }
    
    return false
  }
  
  return {
    currentPoints,
    awardPoints,
    spendPoints,
    awardDrawPoints,
    claimDailyLogin,
    checkDailyLimit,
    POINTS_REWARDS,
    DAILY_LIMITS
  }
}
