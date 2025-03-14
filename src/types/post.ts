// Update the Reaction interface to use 'name' instead of 'type'
export interface Reaction {
  id: string
  name: string // Changed from 'type' to 'name'
  count: number
}

// Add the missing DatoCMSBlock type
export interface DatoCMSBlock {
  __typename: string
  id: string
  [key: string]: any
}

// Add Post interface for better type safety
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  date: string
  coverImage?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  author: {
    name: string
    picture?: {
      url: string
      alt?: string
    }
    biography?: string
    twitter?: string
    github?: string
    linkedin?: string
    facebook?: string
    website?: string
  }
  content?: {
    value: any
    blocks?: DatoCMSBlock[]
  }
  categories?: {
    id: string
    name: string
    slug: string
  }[]
  comments?: Comment[]
  reactions?: Reaction[]
}

// Add Comment interface
export interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: string
}

