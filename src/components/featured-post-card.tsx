import Link from "next/link"
import { format } from "date-fns"
import { Clock, ChevronRight, Calendar } from "lucide-react"
import { calculateReadingTime } from "@/lib/reading-time"
import { Button } from "@/components/ui/button"
import CategoryBadge from "@/components/category-badge"
import { cn } from "@/lib/utils"
import ResponsiveImage from "@/components/responsive-image"

interface FeaturedPostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    date: string
    coverImage: {
      url: string
      alt?: string
      width?: number
      height?: number
    }
    author: {
      name: string
      picture?: {
        url: string
      }
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
  className?: string
}

export default function FeaturedPostCard({ post, className }: FeaturedPostCardProps) {
  const readingTime = calculateReadingTime(post.content?.value || "")

  return (
    <div className={cn("group overflow-hidden rounded-3xl border bg-card shadow-sm", className)}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden">
          <ResponsiveImage
            src={post.coverImage?.url || "/placeholder.svg?height=600&width=800"}
            alt={post.coverImage?.alt || post.title}
            width={post.coverImage?.width || 800}
            height={post.coverImage?.height || 600}
            className="h-full transition-transform duration-500 group-hover:scale-105"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.categories?.map((category) => (
                <CategoryBadge key={category.id} category={category} />
              ))}
            </div>

            <h3 className="text-2xl font-bold leading-tight md:text-3xl">
              <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                {post.title}
              </Link>
            </h3>

            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild>
                <Link href={`/posts/${post.slug}`} className="group">
                  Read Article
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

