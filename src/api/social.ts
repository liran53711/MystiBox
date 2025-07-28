import { apiClient } from './index'

export interface Friend {
  id: string
  username: string
  isOnline: boolean
  avatar?: string
}

export interface FriendRequest {
  id: string
  sender: Friend
  recipient: Friend
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  recipientId: string
  content: string
  type: 'text' | 'gift'
  gift?: {
    type: 'pet' | 'box'
    item: any
    message?: string
    claimed: boolean
  }
  createdAt: string
}

export interface Gift {
  id: string
  type: 'pet' | 'box'
  item: any
  sender: Friend
  recipient: Friend
  message?: string
  claimed: boolean
  createdAt: string
}

export const socialAPI = {
  // 好友管理
  getFriends: (): Promise<Friend[]> => {
    return apiClient.get('/social/friends')
  },

  searchUsers: (query: string): Promise<Friend[]> => {
    return apiClient.get(`/social/users/search?q=${encodeURIComponent(query)}`)
  },

  sendFriendRequest: (userId: string): Promise<FriendRequest> => {
    return apiClient.post('/social/friend-requests', { userId })
  },

  getFriendRequests: (): Promise<FriendRequest[]> => {
    return apiClient.get('/social/friend-requests')
  },

  acceptFriendRequest: (requestId: string): Promise<void> => {
    return apiClient.post(`/social/friend-requests/${requestId}/accept`)
  },

  rejectFriendRequest: (requestId: string): Promise<void> => {
    return apiClient.post(`/social/friend-requests/${requestId}/reject`)
  },

  removeFriend: (friendId: string): Promise<void> => {
    return apiClient.delete(`/social/friends/${friendId}`)
  },

  // 聊天功能
  getChatHistory: (friendId: string, page = 1, limit = 50): Promise<ChatMessage[]> => {
    return apiClient.get(`/social/chats/${friendId}?page=${page}&limit=${limit}`)
  },

  sendMessage: (friendId: string, content: string): Promise<ChatMessage> => {
    return apiClient.post(`/social/chats/${friendId}/messages`, { content })
  },

  getRecentChats: (): Promise<{
    friendId: string
    friend: Friend
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
  }[]> => {
    return apiClient.get('/social/chats/recent')
  },

  markMessagesAsRead: (friendId: string): Promise<void> => {
    return apiClient.post(`/social/chats/${friendId}/read`)
  },

  // 礼物功能
  sendGift: (data: {
    recipientId: string
    type: 'pet' | 'box'
    itemId: string
    message?: string
  }): Promise<Gift> => {
    return apiClient.post('/social/gifts', data)
  },

  getReceivedGifts: (): Promise<Gift[]> => {
    return apiClient.get('/social/gifts/received')
  },

  getSentGifts: (): Promise<Gift[]> => {
    return apiClient.get('/social/gifts/sent')
  },

  claimGift: (giftId: string): Promise<{
    success: boolean
    item: any
  }> => {
    return apiClient.post(`/social/gifts/${giftId}/claim`)
  },

  // 在线状态
  updateOnlineStatus: (isOnline: boolean): Promise<void> => {
    return apiClient.post('/social/status', { isOnline })
  },

  getFriendStatus: (friendId: string): Promise<{ isOnline: boolean, lastSeen?: string }> => {
    return apiClient.get(`/social/friends/${friendId}/status`)
  }
}
