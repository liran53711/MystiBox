export interface User {
  id: string
  username: string
  role: 'USER' | 'ADMIN'
  points: number
  avatar: string
  createdAt: string
  updatedAt: string
}

export interface Series {
  id: number
  name: string
  description: string
  coverImageUrl: string
  drawPrice: number
  isActive: boolean
  availableFrom?: string
  availableUntil?: string
  createdAt: string
  updatedAt: string
  pets?: Pet[]
}

export interface Pet {
  id: string
  name: string
  description?: string
  rarity: 'N' | 'R' | 'SR' | 'SSR' | 'UR' // 稀有度等级
  image?: string
  babyImageUrl: string // 幼体图片
  adultImageUrl: string // 成体图片
  story: string
  seriesId: number
  series?: Series
  createdAt: string
  updatedAt: string
}

export interface DrawResult {
  id: string
  userId: string
  petId: string
  nickname?: string
  status: 'BABY' | 'ADULT'
  growthValue: number
  maxGrowth: number
  isAdult: boolean
  lastFedAt?: string
  createdAt: string
  pet: Pet
  pointsSpent: number
  remainingPoints?: number
}

export interface UserPet {
  id: string
  userId: string
  petId: string
  isAdult: boolean
  nickname?: string
  obtainedAt?: string
  createdAt: string
  // 宠物成长相关属性
  status: 'BABY' | 'ADULT'
  growthValue: number
  maxGrowth: number
  lastFedAt?: string | null
  user?: User
  pet: Pet & {
    series: Series
  }
}

export interface DrawEvent {
  id: string
  userId: string
  seriesId: number
  amount: number
  totalCost: number
  createdAt: string
  user?: User
  series?: Series
  results?: UserPet[]
}

export interface ShowcasePost {
  id: string
  userId: string
  userPetId: string
  caption?: string
  createdAt: string
  user?: User
  userPet?: UserPet
  likes?: Like[]
  comments?: Comment[]
  _count?: {
    likes: number
    comments: number
  }
}

export interface Like {
  id: string
  userId: string
  showcasePostId: string
  createdAt: string
  user?: User
}

export interface Comment {
  id: string
  userId: string
  showcasePostId: string
  content: string
  createdAt: string
  user?: User
}