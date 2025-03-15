"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { StructuredText, renderNodeRule } from "react-datocms"
import { isHeading, isParagraph, isCode } from "datocms-structured-text-utils"
import CommentForm from "@/components/comment-form"
import CommentsList from "@/components/comments-list"
import PostReactions from "@/components/post-reactions"
import { Separator } from "@/components/ui/separator"
import RssLink from "@/components/rss-link"
import ShareButtons from "@/components/share-buttons"
import TableOfContents from "@/components/table-of-contents"
import NewsletterForm from "@/components/newsletter-form"
import RelatedPosts from "@/components/related-posts"
import ReadingProgress from "@/components/reading-progress"
import PostNavigation from "@/components/post-navigation"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import AuthorProfile from "@/components/author-profile"
import BecomeAuthorAd from "@/components/become-author-ad"
import { calculateReadingTime } from "@/lib/reading-time"
import { Clock } from "lucide-react"
import { getComments } from "@/lib/comments"
import type { Post, DatoCMSBlock, Comment } from "@/types/post"
import type { JSX } from "react"
import CodeBlock from "@/components/code-block"
import { generatePostStructuredData } from "@/lib/structured-data"
import ResponsiveImage from "@/components/responsive-image"
import VideoPlayer from "@/components/video-player"
import ImageGallery from "@/components/image-gallery"

interface PostContentProps {
  params: { slug: string }
  post: Post
  allPosts: Post[]
}

export default function PostContent({ params, post, allPosts }: PostContentProps) {
  // Properly type the comments state
  const [comments, setComments] = useState<Comment[]>([])
  const readingTime = calculateReadingTime(post.content?.value || "")

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(params.slug)
      setComments(fetchedComments)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  // Fetch comments when the component mounts or when the slug changes
  useEffect(() => {
    fetchComments()
  }, [params.slug])

  const currentPostIndex = allPosts.findIndex((p) => p.slug === params.slug)
  const prevPost = currentPostIndex < allPosts.length - 1 ? allPosts[currentPostIndex + 1] : undefined
  const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : undefined

  // Map the posts to the RelatedPost type
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage || { url: "/placeholder.svg" },
    }))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const url = `/posts/${post.slug}`
  const fullUrl = `${siteUrl}${url}`

  // Generate structured data for this post
  const structuredData = generatePostStructuredData(post, url)

  // Render DatoCMS blocks
  const renderBlock = ({ record }: { record: DatoCMSBlock }) => {
    if (!record) return null

    if (record.__typename === "ImageBlockRecord") {
      return (
        <div className="my-8">
          <ResponsiveImage
            src={record.image.url}
            alt={record.image.alt || ""}
            width={record.image.width}
            height={record.image.height}
            className="rounded-lg"
          />
        </div>
      )
    }

    // These blocks will only be used in development with mock data
    // In production, they won't be queried from DatoCMS
    if (process.env.NODE_ENV === "development") {
      if (record.__typename === "VideoBlockRecord") {
        return (
          <div className="my-8">
            {record.title && <h3 className="text-lg font-medium mb-2">{record.title}</h3>}
            <VideoPlayer
              src={record.videoUrl}
              poster={record.coverImage?.url}
              title={record.title}
              className="rounded-lg overflow-hidden"
            />
          </div>
        )
      }

      if (record.__typename === "GalleryBlockRecord") {
        return (
          <div className="my-8">
            {record.title && <h3 className="text-lg font-medium mb-2">{record.title}</h3>}
            <ImageGallery images={record.images} columns={3} gap={2} className="rounded-lg overflow-hidden" />
          </div>
        )
      }
    }

    return null
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Add structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

      <ReadingProgress />
      <KeyboardShortcuts />

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            {/* Pass the content as a prop */}
            {post.content && <TableOfContents content={post.content} />}
          </div>
        </aside>

        {/* Main Content */}
        <article className="max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <RssLink />
            </div>
            <div className="flex items-center text-muted-foreground mb-6">
              <time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
              <span className="mx-2">•</span>
              <span>{post.author.name}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {readingTime} min read
              </span>
            </div>

            {post.coverImage && (
              <div className="relative mb-8 overflow-hidden rounded-lg">
                <ResponsiveImage
                  src={post.coverImage.url}
                  alt={post.coverImage.alt || post.title}
                  width={post.coverImage.width}
                  height={post.coverImage.height}
                  priority
                />
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            {post.content && (
              <StructuredText
                data={post.content}
                renderBlock={renderBlock}
                customNodeRules={[
                  renderNodeRule(isHeading, ({ node, children, key }) => {
                    const Tag = `h${node.level}` as keyof JSX.IntrinsicElements
                    const id = children?.toString().toLowerCase().replace(/\s+/g, "-")
                    return (
                      <Tag key={key} id={id}>
                        {children}
                      </Tag>
                    )
                  }),
                  renderNodeRule(isParagraph, ({ children, key }) => {
                    return <p key={key}>{children}</p>
                  }),
                  renderNodeRule(isCode, ({ node, key }) => {
                    return (
                      <CodeBlock
                        key={key}
                        code={node.code}
                        language={node.language || ""}
                        filename={node.highlight?.length ? `highlighted: ${node.highlight.join(", ")}` : undefined}
                        highlightLines={node.highlight?.map(Number) || []}
                      />
                    )
                  }),
                ]}
              />
            )}
          </div>

          <div className="mt-8">
            <ShareButtons title={post.title} url={fullUrl} />
          </div>

          <Separator className="my-8" />

          {/* Post Reactions */}
          <PostReactions postId={post.id} postSlug={post.slug} reactions={post.reactions || []} />

          <Separator className="my-12" />

          <PostNavigation prevPost={prevPost} nextPost={nextPost} />

          <Separator className="my-12" />

          <RelatedPosts posts={relatedPosts} />

          <Separator className="my-12" />

          {/* Author Profile */}
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6">About the Author</h2>
            <AuthorProfile author={post.author} />
          </section>

          <Separator className="my-12" />

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <div className="space-y-8">
              <CommentsList comments={comments} />
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
                <CommentForm postId={post.id} postSlug={params.slug} onCommentAdded={fetchComments} />
              </div>
            </div>
          </section>
        </article>

        {/* Right Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-8">
            <NewsletterForm />
            <div className="mt-8">
              <BecomeAuthorAd />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

