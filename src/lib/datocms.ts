import { GraphQLClient } from "graphql-request"

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

export async function getAllPosts() {
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
}

export async function getPostBySlug(slug: string) {
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
}

export async function getAllCategories() {
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
}

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
        picture: {
          url: "/placeholder.svg?height=200&width=200",
          alt: "John Doe",
        },
        biography:
            "John is a passionate web developer with several years of experience in building modern web applications. He loves sharing his knowledge and insights about the latest trends in web development.",
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

