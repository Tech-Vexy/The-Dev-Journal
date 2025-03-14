import { getAllPosts } from "./datocms"

export type SearchFilters = {
  query: string
  sortBy: "date" | "title"
  sortOrder: "asc" | "desc"
}

export async function searchPosts(filters: SearchFilters) {
  const { query, sortBy, sortOrder } = filters
  const posts = await getAllPosts()
  const searchTerm = query.toLowerCase()

  let filteredPosts = posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm)
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm)
    const contentMatch = post.content?.value?.document?.children?.some((block: any) =>
      block.children?.some((child: any) => child.value?.toLowerCase().includes(searchTerm)),
    )

    return titleMatch || excerptMatch || contentMatch
  })

  // Sort posts
  filteredPosts = filteredPosts.sort((a, b) => {
    let comparison = 0

    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title)
    } else {
      // Sort by date
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      comparison = dateA - dateB
    }

    return sortOrder === "asc" ? comparison : comparison * -1
  })

  return filteredPosts
}

