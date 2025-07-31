import { api } from './index'

export interface ShowcasePost {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  userPet: {
    id: string
    nickname?: string
    status: 'BABY' | 'ADULT'
    forSale: boolean
    price?: number
    pet: {
      id: string
      name: string
      rarity: string
      story: string
      babyImageUrl: string
      adultImageUrl: string
    }
  }
  _count: {
    likes: number
    comments: number
  }
  isLiked: boolean
  comments?: ShowcaseComment[]
}

export interface ShowcaseComment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    avatar?: string
  }
}

export interface CreatePostRequest {
  userPetId: string
  content: string
  allowSale?: boolean
  salePrice?: number
}

export const showcaseApi = {
  // 获取广场帖子列表
  async getPosts(params?: {
    page?: number
    limit?: number
    sortBy?: 'newest' | 'popular' | 'rarity'
    rarity?: string
    search?: string
  }): Promise<{
    posts: ShowcasePost[]
    total: number
    page: number
    totalPages: number
  }> {
    const response = await api.get('/showcase/posts', { params })
    return response
  },

  // 创建新帖子
  async createPost(data: CreatePostRequest): Promise<ShowcasePost> {
    const response = await api.post('/showcase/posts', data)
    return response
  },

  // 点赞/取消点赞帖子
  async toggleLike(postId: string): Promise<{
    isLiked: boolean
    likesCount: number
  }> {
    const response = await api.post(`/showcase/posts/${postId}/like`)
    return response
  },

  // 获取帖子评论
  async getComments(postId: string): Promise<ShowcaseComment[]> {
    const response = await api.get(`/showcase/posts/${postId}/comments`)
    return response
  },

  // 添加评论
  async addComment(postId: string, content: string): Promise<ShowcaseComment> {
    const response = await api.post(`/showcase/posts/${postId}/comments`, {
      content
    })
    return response
  },

  // 删除帖子（管理员或作者）
  async deletePost(postId: string): Promise<void> {
    await api.delete(`/showcase/posts/${postId}`)
  },

  // 删除评论（管理员或作者）
  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/showcase/comments/${commentId}`)
  }
}
