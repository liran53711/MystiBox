import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ShowcasePost {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
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
  likesCount: number
  commentsCount: number
  isLiked: boolean
  showComments: boolean
  newComment: string
  comments: Array<{
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      username: string
    }
  }>
}

export const useShowcaseStore = defineStore('showcase', () => {
  // State
  const posts = ref<ShowcasePost[]>([])
  const isLoading = ref(false)

  // Actions
  const addPost = (postData: {
    userPet: any
    content: string
    allowSale: boolean
    salePrice?: number
    author: { id: string; username: string }
  }) => {
    const newPost: ShowcasePost = {
      id: Date.now().toString(),
      content: postData.content,
      createdAt: new Date().toISOString(),
      author: postData.author,
      userPet: {
        ...postData.userPet,
        forSale: postData.allowSale,
        price: postData.salePrice
      },
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      showComments: false,
      newComment: '',
      comments: []
    }

    posts.value.unshift(newPost) // 添加到开头
    return newPost
  }

  const likePost = (postId: string) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.isLiked = !post.isLiked
      post.likesCount += post.isLiked ? 1 : -1
    }
  }

  const addComment = (postId: string, content: string, author: { id: string; username: string }) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      const newComment = {
        id: Date.now().toString(),
        content,
        createdAt: new Date().toISOString(),
        author
      }
      post.comments.push(newComment)
      post.commentsCount++
      return newComment
    }
  }



  return {
    posts,
    isLoading,
    addPost,
    likePost,
    addComment
  }
})
