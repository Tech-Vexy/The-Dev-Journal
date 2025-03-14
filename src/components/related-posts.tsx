import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import ResponsiveImage from "@/components/responsive-image"

interface RelatedPost {
  title: string
  slug: string
  excerpt: string
  coverImage: {
    url: string
    alt?: string
    width?: number
    height?: number
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
        {posts.map((post) => {
          const postUrl = `/posts/${post.slug}`

          return (
            <Card key={post.slug}>
              <div className="relative aspect-video">
                <Link href={postUrl}>
                  <ResponsiveImage
                    src={post.coverImage?.url || "/placeholder.svg"}
                    alt={post.coverImage?.alt || post.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </Link>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  <Link href={postUrl}>{post.title}</Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

