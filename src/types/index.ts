export interface User {
  id: string
  username: string
  role: 'USER' | 'ADMIN'
  points: number
  createdAt: string
  updatedAt: string
}

export interface Series {
  id: string
  name: string
  description?: string
  coverImageUrl?: string
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
  rarity: 'NORMAL' | 'RARE' | 'SR' | 'SSR'
  babyImageUrl: string
  adultImageUrl: string
  story?: string
  seriesId: string
  series?: Series
  createdAt: string
  updatedAt: string
}

export interface UserPet {
  id: string
  userId: string
  petId: string
  isAdult: boolean
  nickname?: string
  obtainedAt: string
  user?: User
  pet?: Pet
}

export interface DrawEvent {
  id: string
  userId: string
  seriesId: string
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