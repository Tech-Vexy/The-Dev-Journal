"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SearchIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/lib/hooks"
import { searchPosts, type SearchFilters } from "@/lib/search"

type SearchResult = {
    title: string
    slug: string
    excerpt: string
}

export default function Search() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const debouncedQuery = useDebounce(query, 300)

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([])
            return
        }

        async function search() {
            setIsLoading(true)
            try {
                const searchFilters: SearchFilters = {
                    query: debouncedQuery,
                    sortBy: "date",
                    sortOrder: "desc",
                }
                const searchResults = await searchPosts(searchFilters)
                setResults(searchResults)
            } catch (error) {
                console.error("Search error:", error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        search()
    }, [debouncedQuery])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-[300px] justify-start text-muted-foreground">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search posts...
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Search Posts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Type to search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full"
                        autoFocus
                    />
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!isLoading && results.length === 0 && query && (
                            <p className="text-center text-muted-foreground py-8">No results found for "{query}"</p>
                        )}
                        {results.map((result) => (
                            <Link
                                key={result.slug}
                                href={`/posts/${result.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="block p-4 hover:bg-muted rounded-lg"
                            >
                                <h3 className="font-medium mb-1">{result.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{result.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

