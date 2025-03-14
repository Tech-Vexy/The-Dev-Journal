"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SearchIcon, Loader2, XCircle } from "lucide-react"
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
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const debouncedQuery = useDebounce(query, 300)

    // Focus input when dialog opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Small delay to ensure the dialog is fully rendered
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen])

    // Reset state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setQuery("")
            setResults([])
            setError(null)
        }
    }, [isOpen])

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([])
            setError(null)
            return
        }

        const controller = new AbortController()
        const signal = controller.signal

        async function search() {
            setIsLoading(true)
            setError(null)
            
            try {
                const searchFilters: SearchFilters = {
                    query: debouncedQuery,
                    sortBy: "date",
                    sortOrder: "desc",
                }
                const searchResults = await searchPosts(searchFilters)
                setResults(searchResults)
            } catch (error) {
                // Don't set error state if the request was aborted
                if ((error as Error).name !== 'AbortError') {
                    console.error("Search error:", error)
                    setError("Failed to perform search. Please try again.")
                    setResults([])
                }
            } finally {
                setIsLoading(false)
            }
        }

        search()

        // Clean up function to abort fetch if component unmounts or query changes
        return () => controller.abort()
    }, [debouncedQuery])

    const handleClearSearch = () => {
        setQuery("")
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Close dialog on escape
        if (e.key === "Escape") {
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="w-full md:w-[300px] justify-start text-muted-foreground"
                    aria-label="Search posts"
                >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search posts...
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]" onKeyDown={handleKeyDown}>
                <DialogHeader>
                    <DialogTitle>Search Posts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            ref={inputRef}
                            placeholder="Type to search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pr-10"
                            aria-label="Search query"
                            aria-describedby={error ? "search-error" : undefined}
                        />
                        {query && (
                            <button 
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    
                    {error && (
                        <div id="search-error" className="text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    
                    <div 
                        className="max-h-[300px] overflow-y-auto space-y-2 rounded-md border"
                        role="region"
                        aria-label="Search results"
                    >
                        {isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                <span className="sr-only">Loading search results</span>
                            </div>
                        )}
                        
                        {!isLoading && results.length === 0 && query && (
                            <p className="text-center text-muted-foreground py-8">
                                No results found for "{query}"
                            </p>
                        )}
                        
                        {!isLoading && !query && (
                            <p className="text-center text-muted-foreground py-8">
                                Enter a search term to find posts
                            </p>
                        )}
                        
                        {!isLoading && results.length > 0 && (
                            <ul>
                                {results.map((result) => (
                                    <li key={result.slug}>
                                        <Link
                                            href={`/posts/${result.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block p-4 hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                                        >
                                            <h3 className="font-medium mb-1">{result.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{result.excerpt}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}