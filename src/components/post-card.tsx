import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { calculateReadingTime } from "@/lib/reading-time"
import CategoryBadge from "@/components/category-badge"

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    date: string
    coverImage: {
      url: string
    }
    author: {
      name: string
    }
    content?: {
      value: any
    }
    categories?: {
      id: string
      name: string
      slug: string
    }[]
  }
}

export default function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content?.value || "")

  return (
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
        <Link href={`/posts/${post.slug}`} className="block">
          <div className="relative aspect-video">
            <Image
                src={post.coverImage?.url || "/placeholder.svg?height=400&width=600"}
                alt={post.title}
                fill
                className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
        <CardContent className="flex-1 pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {readingTime} min read
              </div>
            </div>
            {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {post.categories.map((category) => (
                      <CategoryBadge key={category.id} category={category} />
                  ))}
                </div>
            )}
            <h3 className="font-bold text-xl line-clamp-2">
              <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                {post.title}
              </Link>
            </h3>
            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
            <div className="pt-2">
              <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Read article →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

