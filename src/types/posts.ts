interface DatoCMSStructuredTextDocument {
    type: string
    children: Array<{
      type: string
      level?: number
      code?: string
      children?: Array<{
        type: string
        value?: string
      }>
    }>
  }
  
  interface DatoCMSStructuredTextValue {
    schema: string
    document: DatoCMSStructuredTextDocument
  }
  
  interface DatoCMSImageBlock {
    __typename: "ImageBlockRecord"
    id: string
    image: {
      url: string
      alt?: string
      width?: number
      height?: number
    }
  }
  
  export interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    date: string
    content?: {
      value: DatoCMSStructuredTextValue
      blocks: DatoCMSImageBlock[]
    }
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
      facebook?: string
      linkedin?: string
      github?: string
    }
    categories?: Array<{
      id: string
      name: string
      slug: string
    }>
  }
  
  