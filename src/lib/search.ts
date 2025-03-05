import { getAllPosts } from "./datocms"

export type SearchFilters = {
    query: string
    sortBy?: "date" | "title"
    sortOrder?: "asc" | "desc"
}

export async function searchPosts(filters: SearchFilters) {
    const { query, sortBy = "date", sortOrder = "desc" } = filters
    const posts = await getAllPosts()
    const searchTerm = query?.toLowerCase() || ""

    let filteredPosts = posts.filter((post) => {
        // Safely check if properties exist before calling toLowerCase()
        const titleMatch = post.title?.toLowerCase()?.includes(searchTerm) || false
        const excerptMatch = post.excerpt?.toLowerCase()?.includes(searchTerm) || false

        // Safely check nested properties
        const contentMatch =
            post.content?.value?.document?.children?.some((block: any) => {
                if (!block?.children) return false
                return block.children.some((child: any) => {
                    return child?.value?.toLowerCase()?.includes(searchTerm) || false
                })
            }) || false

        return titleMatch || excerptMatch || contentMatch
    })

    // Sort posts
    filteredPosts = filteredPosts.sort((a, b) => {
        let comparison = 0

        if (sortBy === "title") {
            comparison = (a.title || "").localeCompare(b.title || "")
        } else {
            // Sort by date
            const dateA = new Date(a.date || 0).getTime()
            const dateB = new Date(b.date || 0).getTime()
            comparison = dateA - dateB
        }

        return sortOrder === "asc" ? comparison : comparison * -1
    })

    return filteredPosts
}

