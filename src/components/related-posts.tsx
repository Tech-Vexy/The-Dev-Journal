import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface RelatedPost {
    title: string
    slug: string
    excerpt: string
    coverImage: {
        url: string
    }
}

interface RelatedPostsProps {
    posts: RelatedPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (posts.length === 0) return null

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card key={post.slug}>
                        <Link href={`/posts/${post.slug}`}>
                            <div className="relative aspect-video">
                                <Image
                                    src={post.coverImage?.url || "/placeholder.svg"}
                                    alt={post.title}
                                    fill
                                    className="object-cover rounded-t-lg"
                                />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </section>
    )
}

