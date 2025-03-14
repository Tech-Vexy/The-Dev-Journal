import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock, Calendar, User } from "lucide-react"
import { calculateReadingTime } from "@/lib/reading-time"
import CategoryBadge from "@/components/category-badge"
import { cn } from "@/lib/utils"
import ResponsiveImage from "@/components/responsive-image"
import { Suspense } from "react"

interface PostCardProps {
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
      avatar?: string
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
  variant?: "default" | "compact" | "featured"
  priority?: boolean
}

export default function PostCard({ 
  post, 
  className, 
  variant = "default",
  priority = false 
}: PostCardProps) {
  const readingTime = post.content?.value ? calculateReadingTime(post.content.value) : null
  const postUrl = `/posts/${post.slug}`
  const formattedDate = format(new Date(post.date), "MMM d, yyyy")
  const isCompact = variant === "compact"
  const isFeatured = variant === "featured"

  return (
    <Card 
      className={cn(
        "group overflow-hidden border bg-card h-full transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary",
        isFeatured && "md:grid md:grid-cols-2",
        className
      )}
    >
      <div className={cn(
        "relative overflow-hidden",
        !isCompact && "aspect-video",
        isCompact && "aspect-square",
        isFeatured && "md:h-full"
      )}>
        <Link href={postUrl} aria-label={`View post: ${post.title}`}>
          <Suspense fallback={<div className="w-full h-full bg-muted animate-pulse" />}>
            <ResponsiveImage
              src={post.coverImage?.url || "/placeholder.svg?height=400&width=600"}
              alt={post.coverImage?.alt || post.title}
              width={post.coverImage?.width || 600}
              height={post.coverImage?.height || 400}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          </Suspense>
        </Link>
      </div>
      
      <div className={cn(
        "flex flex-col",
        isFeatured && "md:max-h-full md:overflow-hidden"
      )}>
        <CardHeader className={cn(
          "p-4 pb-0",
          isCompact && "p-3 pb-0"
        )}>
          <div className="flex flex-wrap gap-2 mb-2">
            {post.categories?.slice(0, isCompact ? 1 : 2).map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
            {post.categories && post.categories.length > (isCompact ? 1 : 2) && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                +{post.categories.length - (isCompact ? 1 : 2)} more
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className={cn(
          "flex flex-col flex-1 p-4 pt-2",
          isCompact && "p-3 pt-1"
        )}>
          <div className="flex-1 space-y-3">
            <h3 className={cn(
              "font-bold line-clamp-2 group-hover:text-primary transition-colors",
              isFeatured && "text-2xl md:text-3xl",
              isCompact ? "text-base" : "text-xl"
            )}>
              <Link href={postUrl} className="focus:outline-none">
                {post.title}
              </Link>
            </h3>

            {(!isCompact || isFeatured) && (
              <p className={cn(
                "text-muted-foreground line-clamp-3",
                isCompact ? "text-xs" : "text-sm",
                isFeatured && "md:line-clamp-4"
              )}>
                {post.excerpt}
              </p>
            )}
          </div>

          <div className={cn(
            "mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground",
            isCompact && "mt-2 pt-2"
          )}>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{readingTime} min read</span>
                </div>
              )}
            </div>
            
            {post.author && isFeatured && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{post.author.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}