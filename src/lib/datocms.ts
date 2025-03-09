import { GraphQLClient } from "graphql-request"
import { cache } from "react"

const API_TOKEN = process.env.DATOCMS_API_TOKEN
const API_URL = "https://graphql.datocms.com"

if (!API_TOKEN) {
  console.warn("Warning: DATOCMS_API_TOKEN environment variable is not set")
}

const client = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
})

// Cache and tag the getAllPosts function
export const getAllPosts = cache(async () => {
  if (!API_TOKEN) {
    console.warn("Using mock data because DATOCMS_API_TOKEN is not set")
    return getMockPosts()
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
    const data = await client.request(query)

    // Handle case where categories field doesn't exist in DatoCMS schema
    if (data.allPosts) {
      data.allPosts = data.allPosts.map((post) => {
        if (!post.categories) {
          post.categories = []
        }
        return post
      })
    }

    return data.allPosts
  } catch (error) {
    console.error("Error fetching posts:", error)
    console.error("Please check that your DATOCMS_API_TOKEN is correct and has the necessary permissions")
    return getMockPosts()
  }
})

// Cache and tag the getPostBySlug function
export const getPostBySlug = cache(async (slug: string) => {
  if (!API_TOKEN) {
    console.warn("Using mock data because DATOCMS_API_TOKEN is not set")
    const mockPosts = getMockPosts()
    return mockPosts.find((post) => post.slug === slug) || null
  }

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
    const data = await client.request(query, { slug })

    // Handle case where categories field doesn't exist in DatoCMS schema
    if (data.post && !data.post.categories) {
      data.post.categories = []
    }

    return data.post
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
    const mockPosts = getMockPosts()
    return mockPosts.find((post) => post.slug === slug) || null
  }
})

// Cache and tag the getAllCategories function
export const getAllCategories = cache(async () => {
  if (!API_TOKEN) {
    console.warn("Using mock data because DATOCMS_API_TOKEN is not set")
    return getMockCategories()
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
    const data = await client.request(query)
    return data.allCategories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    // If the error is because the categories model doesn't exist
    if (error.message && error.message.includes("allCategories")) {
      console.warn("The 'Category' model might not exist in your DatoCMS schema")
      return []
    }
    console.error("Please check that your DATOCMS_API_TOKEN is correct and has the necessary permissions")
    return getMockCategories()
  }
})

// Mock data functions remain unchanged
function getMockPosts() {
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
            ],
          },
        },
        blocks: [],
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
