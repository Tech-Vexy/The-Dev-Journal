import { getAllPosts } from "@/lib/datocms"
import DiscoverPosts from "./discover-posts"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
    title: "Discover Posts",
    description: "Explore all blog posts",
}

export default async function DiscoverPage() {
    const posts = await getAllPosts()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Discover Posts</h1>
                    <p className="text-muted-foreground">
                        Explore our collection of articles about web development, design, and technology.
                    </p>
                </div>

                <Suspense fallback={<PostsSkeleton />}>
                    <DiscoverPosts initialPosts={posts} />
                </Suspense>
            </div>
        </div>
    )
}

function PostsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}

