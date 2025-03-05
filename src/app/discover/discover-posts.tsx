"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Post } from "@/types/posts"
import PostCard from "@/components/post-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchPosts, type SearchFilters } from "@/lib/search"
import { useDebounce } from "@/lib/hooks"
import { Loader2 } from "lucide-react"

interface DiscoverPostsProps {
    initialPosts: Post[]
}

export default function DiscoverPosts({ initialPosts }: DiscoverPostsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [posts, setPosts] = useState(initialPosts)
    const [isPending, startTransition] = useTransition()

    const initialFilters: SearchFilters = {
        query: searchParams.get("q") || "",
        sortBy: (searchParams.get("sort") || "date") as "date" | "title",
        sortOrder: (searchParams.get("order") || "desc") as "asc" | "desc",
    }

    const [filters, setFilters] = useState<SearchFilters>(initialFilters)
    const debouncedQuery = useDebounce(filters.query, 300)

    // Update URL with filters
    const updateUrl = (newFilters: SearchFilters) => {
        const params = new URLSearchParams()
        if (newFilters.query) params.set("q", newFilters.query)
        if (newFilters.sortBy) params.set("sort", newFilters.sortBy)
        if (newFilters.sortOrder) params.set("order", newFilters.sortOrder)
        router.push(`/discover?${params.toString()}`)
    }

    // Update filters and search
    const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)
        updateUrl(updatedFilters)

        startTransition(async () => {
            const results = await searchPosts(updatedFilters)
            setPosts(results)
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                    <Input
                        type="search"
                        placeholder="Search posts..."
                        value={filters.query}
                        onChange={(e) => handleFiltersChange({ query: e.target.value })}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <Select
                        value={filters.sortBy}
                        onValueChange={(value) => handleFiltersChange({ sortBy: value as "date" | "title" })}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.sortOrder}
                        onValueChange={(value) => handleFiltersChange({ sortOrder: value as "asc" | "desc" })}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Descending</SelectItem>
                            <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isPending ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No posts found.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    )
}

