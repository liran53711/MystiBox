import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { socialAPI, type Friend, type FriendRequest, type ChatMessage, type Gift } from '@/api/social'

export const useSocialStore = defineStore('social', () => {
  // 状态
  const friends = ref<Friend[]>([])
  const friendRequests = ref<FriendRequest[]>([])
  const recentChats = ref<any[]>([])
  const receivedGifts = ref<Gift[]>([])
  const sentGifts = ref<Gift[]>([])
  const chatMessages = ref<{ [friendId: string]: ChatMessage[] }>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const pendingRequestsCount = computed(() => {
    return friendRequests.value.filter(req => req.status === 'PENDING').length
  })

  const unreadMessagesCount = computed(() => {
    return recentChats.value.reduce((total, chat) => total + chat.unreadCount, 0)
  })

  const pendingGiftsCount = computed(() => {
    return receivedGifts.value.filter(gift => !gift.claimed).length
  })

  // 好友管理
  const loadFriends = async () => {
    try {
      isLoading.value = true
      friends.value = await socialAPI.getFriends()
    } catch (err) {
      error.value = '加载好友列表失败'
      console.error('Failed to load friends:', err)
    } finally {
      isLoading.value = false
    }
  }

  const searchUsers = async (query: string) => {
    try {
      return await socialAPI.searchUsers(query)
    } catch (err) {
      error.value = '搜索用户失败'
      console.error('Failed to search users:', err)
      return []
    }
  }

  const sendFriendRequest = async (userId: string) => {
    try {
      const request = await socialAPI.sendFriendRequest(userId)
      return request
    } catch (err) {
      error.value = '发送好友请求失败'
      console.error('Failed to send friend request:', err)
      throw err
    }
  }

  const loadFriendRequests = async () => {
    try {
      friendRequests.value = await socialAPI.getFriendRequests()
    } catch (err) {
      error.value = '加载好友请求失败'
      console.error('Failed to load friend requests:', err)
    }
  }

  const acceptFriendRequest = async (requestId: string) => {
    try {
      await socialAPI.acceptFriendRequest(requestId)
      
      // 从请求列表中移除
      const requestIndex = friendRequests.value.findIndex(req => req.id === requestId)
      if (requestIndex > -1) {
        const request = friendRequests.value[requestIndex]
        friendRequests.value.splice(requestIndex, 1)
        
        // 添加到好友列表
        friends.value.push(request.sender)
      }
    } catch (err) {
      error.value = '接受好友请求失败'
      console.error('Failed to accept friend request:', err)
      throw err
    }
  }

  const rejectFriendRequest = async (requestId: string) => {
    try {
      await socialAPI.rejectFriendRequest(requestId)
      
      // 从请求列表中移除
      const requestIndex = friendRequests.value.findIndex(req => req.id === requestId)
      if (requestIndex > -1) {
        friendRequests.value.splice(requestIndex, 1)
      }
    } catch (err) {
      error.value = '拒绝好友请求失败'
      console.error('Failed to reject friend request:', err)
      throw err
    }
  }

  const removeFriend = async (friendId: string) => {
    try {
      await socialAPI.removeFriend(friendId)
      
      // 从好友列表中移除
      const friendIndex = friends.value.findIndex(friend => friend.id === friendId)
      if (friendIndex > -1) {
        friends.value.splice(friendIndex, 1)
      }
      
      // 清除聊天记录
      delete chatMessages.value[friendId]
      
      // 从最近聊天中移除
      const chatIndex = recentChats.value.findIndex(chat => chat.friendId === friendId)
      if (chatIndex > -1) {
        recentChats.value.splice(chatIndex, 1)
      }
    } catch (err) {
      error.value = '删除好友失败'
      console.error('Failed to remove friend:', err)
      throw err
    }
  }

  // 聊天功能
  const loadChatHistory = async (friendId: string, page = 1) => {
    try {
      const messages = await socialAPI.getChatHistory(friendId, page)
      
      if (page === 1) {
        chatMessages.value[friendId] = messages
      } else {
        // 加载更多消息时，插入到开头
        chatMessages.value[friendId] = [...messages, ...(chatMessages.value[friendId] || [])]
      }
      
      return messages
    } catch (err) {
      error.value = '加载聊天记录失败'
      console.error('Failed to load chat history:', err)
      return []
    }
  }

  const sendMessage = async (friendId: string, content: string) => {
    try {
      const message = await socialAPI.sendMessage(friendId, content)
      
      // 添加到聊天记录
      if (!chatMessages.value[friendId]) {
        chatMessages.value[friendId] = []
      }
      chatMessages.value[friendId].push(message)
      
      // 更新最近聊天
      const chatIndex = recentChats.value.findIndex(chat => chat.friendId === friendId)
      if (chatIndex > -1) {
        recentChats.value[chatIndex].lastMessage = content
        recentChats.value[chatIndex].lastMessageTime = message.createdAt
      }
      
      return message
    } catch (err) {
      error.value = '发送消息失败'
      console.error('Failed to send message:', err)
      throw err
    }
  }

  const loadRecentChats = async () => {
    try {
      recentChats.value = await socialAPI.getRecentChats()
    } catch (err) {
      error.value = '加载最近聊天失败'
      console.error('Failed to load recent chats:', err)
    }
  }

  const markMessagesAsRead = async (friendId: string) => {
    try {
      await socialAPI.markMessagesAsRead(friendId)
      
      // 更新未读数量
      const chatIndex = recentChats.value.findIndex(chat => chat.friendId === friendId)
      if (chatIndex > -1) {
        recentChats.value[chatIndex].unreadCount = 0
      }
    } catch (err) {
      console.error('Failed to mark messages as read:', err)
    }
  }

  // 礼物功能
  const sendGift = async (data: {
    recipientId: string
    type: 'pet' | 'box'
    itemId: string
    message?: string
  }) => {
    try {
      const gift = await socialAPI.sendGift(data)
      sentGifts.value.unshift(gift)
      return gift
    } catch (err) {
      error.value = '发送礼物失败'
      console.error('Failed to send gift:', err)
      throw err
    }
  }

  const loadReceivedGifts = async () => {
    try {
      receivedGifts.value = await socialAPI.getReceivedGifts()
    } catch (err) {
      error.value = '加载收到的礼物失败'
      console.error('Failed to load received gifts:', err)
    }
  }

  const loadSentGifts = async () => {
    try {
      sentGifts.value = await socialAPI.getSentGifts()
    } catch (err) {
      error.value = '加载发送的礼物失败'
      console.error('Failed to load sent gifts:', err)
    }
  }

  const claimGift = async (giftId: string) => {
    try {
      const result = await socialAPI.claimGift(giftId)
      
      // 更新礼物状态
      const giftIndex = receivedGifts.value.findIndex(gift => gift.id === giftId)
      if (giftIndex > -1) {
        receivedGifts.value[giftIndex].claimed = true
      }
      
      return result
    } catch (err) {
      error.value = '领取礼物失败'
      console.error('Failed to claim gift:', err)
      throw err
    }
  }

  // 在线状态
  const updateOnlineStatus = async (isOnline: boolean) => {
    try {
      await socialAPI.updateOnlineStatus(isOnline)
    } catch (err) {
      console.error('Failed to update online status:', err)
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 重置状态
  const reset = () => {
    friends.value = []
    friendRequests.value = []
    recentChats.value = []
    receivedGifts.value = []
    sentGifts.value = []
    chatMessages.value = {}
    isLoading.value = false
    error.value = null
  }

  return {
    // 状态
    friends,
    friendRequests,
    recentChats,
    receivedGifts,
    sentGifts,
    chatMessages,
    isLoading,
    error,

    // 计算属性
    pendingRequestsCount,
    unreadMessagesCount,
    pendingGiftsCount,

    // 方法
    loadFriends,
    searchUsers,
    sendFriendRequest,
    loadFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    loadChatHistory,
    sendMessage,
    loadRecentChats,
    markMessagesAsRead,
    sendGift,
    loadReceivedGifts,
    loadSentGifts,
    claimGift,
    updateOnlineStatus,
    clearError,
    reset
  }
})
