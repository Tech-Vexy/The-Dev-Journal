import { GraphQLClient } from "graphql-request"
import { cache } from "react"

const API_TOKEN = process.env.DATOCMS_API_TOKEN
const API_URL = "https://graphql.datocms.com"
const IS_DEVELOPMENT = process.env.NODE_ENV === "development"

if (!API_TOKEN) {
  console.warn("Warning: DATOCMS_API_TOKEN environment variable is not set")
}

// Create a cached GraphQL client
const getClient = cache(() => {
  return new GraphQLClient(API_URL, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    fetch: async (url, options) => {
      // Add cache control headers for CDN caching
      const customOptions = {
        ...options,
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
      return fetch(url, customOptions)
    },
  })
})

// Cache the GraphQL requests using React's cache function
export const getAllPosts = cache(async () => {
  // Only use mock data in development when API token is missing
  if (!API_TOKEN && IS_DEVELOPMENT) {
    console.warn("Using mock data because DATOCMS_API_TOKEN is not set (development mode)")
    return getMockPosts()
  }

  // In production, we should have an API token
  if (!API_TOKEN && !IS_DEVELOPMENT) {
    console.error("DATOCMS_API_TOKEN is not set in production environment")
    return []
  }

  const query = `
  query AllPosts {
    allPosts(orderBy: date_DESC) {
      id
      title
      slug
      excerpt
      date
      coverImage {
        url
        alt
        width
        height
      }
      author {
        name
      }
      categories {
        id
        name
        slug
      }
    }
  }
`

  try {
    const client = getClient()
    const data = await client.request(query)

    // Handle case where categories field doesn't exist in DatoCMS schema
    if (data.allPosts) {
      data.allPosts = data.allPosts.map((post) => {
        if (!post.categories) {
          post.categories = []
        }
        post.reactions = []
        return post
      })
    }

    return data.allPosts
  } catch (error) {
    console.error("Error fetching posts:", error)

    // Only use mock data as fallback in development
    if (IS_DEVELOPMENT) {
      console.error("Using mock data as fallback in development mode")
      return getMockPosts()
    }

    // In production, return empty array instead of mock data
    console.error("Please check that your DATOCMS_API_TOKEN is correct and has the necessary permissions")
    return []
  }
})

export const getPostBySlug = cache(async (slug: string) => {
  // Only use mock data in development when API token is missing
  if (!API_TOKEN && IS_DEVELOPMENT) {
    console.warn("Using mock data because DATOCMS_API_TOKEN is not set (development mode)")
    const mockPosts = getMockPosts()
    return mockPosts.find((post) => post.slug === slug) || null
  }

  // In production, we should have an API token
  if (!API_TOKEN && !IS_DEVELOPMENT) {
    console.error("DATOCMS_API_TOKEN is not set in production environment")
    return null
  }

  // Modified query to include comments and reactions
  const query = `
  query PostBySlug($slug: String!) {
    post(filter: {slug: {eq: $slug}}) {
      id
      title
      slug
      excerpt
      date
      content {
        value
        blocks {
          __typename
          ... on ImageBlockRecord {
            id
            image {
              url
              alt
              width
              height
            }
          }
            
        }
      }
      coverImage {
        url
        alt
        width
        height
      }
      author {
        name
        picture {
          url
          alt
        }
        biography
        twitter
        linkedin
        facebook
        github
      }
      categories {
        id
        name
        slug
      }
    }
  }
`

  try {
    const client = getClient()
    const data = await client.request(query, { slug })

    // Handle case where categories field doesn't exist in DatoCMS schema
    if (data.post) {
      if (!data.post.categories) {
        data.post.categories = []
      }

      // Initialize empty arrays for comments and reactions
      data.post.comments = []
      data.post.reactions = []
    }

    return data.post
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)

    // Only use mock data as fallback in development
    if (IS_DEVELOPMENT) {
      console.error("Using mock data as fallback in development mode")
      const mockPosts = getMockPosts()
      return mockPosts.find((post) => post.slug === slug) || null
    }

    // In production, return null instead of mock data
    return null
  }
})

// New function to add a comment to a post
export async function addComment(postId: string, authorName: string, content: string) {
  if (!API_TOKEN) {
    console.error("DATOCMS_API_TOKEN is not set")
    return null
  }

  const mutation = `
    mutation CreateComment($postId: ItemId!, $authorName: String!, $content: String!) {
      createComment(data: {
        post: { connect: { id: $postId } }
        authorName: $authorName
        content: $content
      }) {
        id
        authorName
        content
        createdAt
      }
    }
  `

  try {
    const client = new GraphQLClient(API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "X-Include-Drafts": "true",
      },
    })

    const data = await client.request(mutation, { postId, authorName, content })
    return data.createComment
  } catch (error) {
    console.error("Error adding comment:", error)
    return null
  }
}

// New function to add or update a reaction to a post
export async function updateReaction(postId: string, reactionName: string, increment = true) {
  if (!API_TOKEN) {
    console.error("DATOCMS_API_TOKEN is not set")
    return null
  }

  // First, check if the reaction already exists
  const query = `
  query GetReaction($postId: ItemId!) {
    allReactions(filter: { post: { eq: $postId } }) {
      id
      name
      count
    }
  }
`

  try {
    const client = new GraphQLClient(API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "X-Include-Drafts": "true",
      },
    })

    const data = await client.request(query, { postId })

    if (data.allReactions && data.allReactions.length > 0) {
      // Find the reaction with the matching name
      const reaction = data.allReactions.find((r) => r.name === reactionName)

      if (reaction) {
        // Update existing reaction
        const newCount = increment ? reaction.count + 1 : Math.max(0, reaction.count - 1)

        const updateMutation = `
          mutation UpdateReaction($id: ItemId!, $count: IntType!) {
            updateReaction(input: { id: $id, count: $count }) {
              id
              name
              count
            }
          }
        `

        const updateData = await client.request(updateMutation, {
          id: reaction.id,
          count: newCount,
        })

        return updateData.updateReaction
      } else if (increment) {
        // Create new reaction if incrementing
        const createMutation = `
          mutation CreateReaction($postId: ItemId!, $name: String!) {
            createReaction(data: {
              post: { connect: { id: $postId } }
              name: $name
              count: 1
            }) {
              id
              name
              count
            }
          }
        `

        const createData = await client.request(createMutation, { postId, name: reactionName })
        return createData.createReaction
      }
    } else if (increment) {
      // Create new reaction if incrementing
      const createMutation = `
        mutation CreateReaction($postId: ItemId!, $name: String!) {
          createReaction(data: {
            post: { connect: { id: $postId } }
            name: $name
            count: 1
          }) {
            id
            name
            count
          }
        }
      `

      const createData = await client.request(createMutation, { postId, name: reactionName })
      return createData.createReaction
    }

    return null
  } catch (error) {
    console.error("Error updating reaction:", error)
    return null
  }
}

export const getAllCategories = cache(async () => {
  // Only use mock data in development when API token is missing
  if (!API_TOKEN && IS_DEVELOPMENT) {
    console.warn("Using mock data because DATOCMS_API_TOKEN is not set (development mode)")
    return getMockCategories()
  }

  // In production, we should have an API token
  if (!API_TOKEN && !IS_DEVELOPMENT) {
    console.error("DATOCMS_API_TOKEN is not set in production environment")
    return []
  }

  const query = `
    query AllCategories {
      allCategories {
        id
        name
        slug
        description
      }
    }
  `

  try {
    const client = getClient()
    const data = await client.request(query)
    return data.allCategories || []
  } catch (error) {
    console.error("Error fetching categories:", error)

    // If the error is because the categories model doesn't exist
    if (error.message && error.message.includes("allCategories")) {
      console.warn("The 'Category' model might not exist in your DatoCMS schema")
      return []
    }

    // Only use mock data as fallback in development
    if (IS_DEVELOPMENT) {
      console.error("Using mock data as fallback in development mode")
      return getMockCategories()
    }

    // In production, return empty array instead of mock data
    console.error("Please check that your DATOCMS_API_TOKEN is correct and has the necessary permissions")
    return []
  }
})

// Update the getMockPosts function to include comments and reactions
function getMockPosts() {
  // Only return mock data in development
  if (!IS_DEVELOPMENT) {
    console.error("Attempted to use mock data in production environment")
    return []
  }

  return [
    {
      id: "1",
      title: "Getting Started with Next.js",
      slug: "getting-started-with-nextjs",
      excerpt: "Learn how to build modern web applications with Next.js",
      date: new Date().toISOString(),
      coverImage: {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Next.js Logo",
        width: 800,
        height: 600,
      },
      author: {
        name: "John Doe",
        biography:
          "Full-stack developer with a passion for React and Next.js. I love building modern web applications and sharing my knowledge with the community.",
        picture: {
          url: "/placeholder.svg?height=100&width=100",
          alt: "John Doe",
        },
        email: "john@example.com",
        website: "https://johndoe.dev",
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        facebook: "https://facebook.com/johndoe",
      },
      categories: [
        {
          id: "1",
          name: "Next.js",
          slug: "nextjs",
        },
        {
          id: "2",
          name: "React",
          slug: "react",
        },
      ],
      comments: [
        {
          id: "c1",
          content: "Great article! This helped me understand Next.js better.",
          authorName: "Alice Johnson",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "c2",
          content: "I'm looking forward to trying these techniques in my project.",
          authorName: "Bob Smith",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ],
      reactions: [
        {
          id: "r1",
          name: "like",
          count: 15,
        },
        {
          id: "r2",
          name: "love",
          count: 7,
        },
        {
          id: "r3",
          name: "wow",
          count: 3,
        },
      ],
      content: {
        value: {
          schema: "dast",
          document: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "span",
                    value: "This is a sample blog post content. In a real application, this would come from DatoCMS.",
                  },
                ],
              },
              {
                type: "paragraph",
                children: [
                  {
                    type: "span",
                    value:
                      "Below you'll find examples of different content blocks including images, videos, and galleries.",
                  },
                ],
              },
            ],
          },
        },
        blocks: [
          {
            __typename: "ImageBlockRecord",
            id: "img1",
            image: {
              url: "/placeholder.svg?height=600&width=800",
              alt: "Sample image",
              width: 800,
              height: 600,
            },
          },
          // Mock data can still include these blocks for development
          {
            __typename: "VideoBlockRecord",
            id: "vid1",
            title: "Introduction to Next.js",
            videoUrl: "https://www.youtube.com/watch?v=_8wkKL0Y-i0",
            coverImage: {
              url: "/placeholder.svg?height=600&width=800",
              alt: "Video thumbnail",
              width: 800,
              height: 600,
            },
          },
          {
            __typename: "GalleryBlockRecord",
            id: "gal1",
            title: "Project Screenshots",
            images: [
              {
                url: "/placeholder.svg?height=600&width=800&text=Image+1",
                alt: "Gallery image 1",
                width: 800,
                height: 600,
              },
              {
                url: "/placeholder.svg?height=600&width=800&text=Image+2",
                alt: "Gallery image 2",
                width: 800,
                height: 600,
              },
              {
                url: "/placeholder.svg?height=600&width=800&text=Image+3",
                alt: "Gallery image 3",
                width: 800,
                height: 600,
              },
            ],
          },
        ],
      },
    },
    {
      id: "2",
      title: "Understanding React Hooks",
      slug: "understanding-react-hooks",
      excerpt: "A comprehensive guide to React Hooks and how to use them effectively",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      coverImage: {
        url: "/placeholder.svg?height=600&width=800",
        alt: "React Hooks",
        width: 800,
        height: 600,
      },
      author: {
        name: "Jane Smith",
        biography:
          "Frontend developer specializing in React. Passionate about creating user-friendly interfaces and improving user experience.",
        picture: {
          url: "/placeholder.svg?height=100&width=100",
          alt: "Jane Smith",
        },
        email: "jane@example.com",
        website: "https://janesmith.dev",
        twitter: "https://twitter.com/janesmith",
        github: "https://github.com/janesmith",
        linkedin: "https://linkedin.com/in/janesmith",
      },
      categories: [
        {
          id: "2",
          name: "React",
          slug: "react",
        },
      ],
      comments: [
        {
          id: "c3",
          content: "This clarified a lot of my questions about hooks. Thanks!",
          authorName: "Charlie Brown",
          createdAt: new Date(Date.now() - 43200000).toISOString(),
        },
      ],
      reactions: [
        {
          id: "r4",
          name: "like",
          count: 8,
        },
        {
          id: "r5",
          name: "love",
          count: 4,
        },
      ],
      content: {
        value: {
          schema: "dast",
          document: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "span",
                    value: "This is a sample blog post content about React Hooks.",
                  },
                ],
              },
            ],
          },
        },
        blocks: [],
      },
    },
    {
      id: "3",
      title: "CSS Grid Layout Explained",
      slug: "css-grid-layout-explained",
      excerpt: "Master CSS Grid Layout with this comprehensive tutorial",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      coverImage: {
        url: "/placeholder.svg?height=600&width=800",
        alt: "CSS Grid",
        width: 800,
        height: 600,
      },
      author: {
        name: "Alex Johnson",
        biography:
          "Frontend developer with a strong focus on CSS and UI design. I enjoy creating visually appealing and responsive web layouts.",
        picture: {
          url: "/placeholder.svg?height=100&width=100",
          alt: "Alex Johnson",
        },
        email: "alex@example.com",
        website: "https://alexjohnson.dev",
        twitter: "https://twitter.com/alexjohnson",
        github: "https://github.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
      },
      categories: [
        {
          id: "3",
          name: "CSS",
          slug: "css",
        },
      ],
      comments: [],
      reactions: [
        {
          id: "r6",
          name: "like",
          count: 12,
        },
      ],
      content: {
        value: {
          schema: "dast",
          document: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "span",
                    value: "This is a sample blog post content about CSS Grid Layout.",
                  },
                ],
              },
            ],
          },
        },
        blocks: [],
      },
    },
  ]
}

function getMockCategories() {
  // Only return mock data in development
  if (!IS_DEVELOPMENT) {
    console.error("Attempted to use mock data in production environment")
    return []
  }

  return [
    {
      id: "1",
      name: "JavaScript",
      slug: "javascript",
      description: "Articles about JavaScript programming language",
    },
    {
      id: "2",
      name: "React",
      slug: "react",
      description: "Tutorials and guides for React development",
    },
    {
      id: "3",
      name: "CSS",
      slug: "css",
      description: "Tips and tricks for CSS styling",
    },
    {
      id: "4",
      name: "Next.js",
      slug: "nextjs",
      description: "Learn about Next.js framework",
    },
  ]
}

